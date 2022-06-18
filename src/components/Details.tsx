import React, { useState, useEffect, useRef, SyntheticEvent, KeyboardEvent } from "react";

import { ListItem, List, CardContent, Snackbar } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';


import { Grid, Button, TextField, Divider, Typography, CardHeader, Avatar, IconButton } from '@material-ui/core';
import { MyCard, MyCardHeader, MyTextareaAutosize, MyTextareaRead } from "./StyledComponents"
import Autocomplete from '@material-ui/lab/Autocomplete';
import { MyIcon } from "./MyIcon";

import { DetailsMarkdown } from "./DetailsMarkdown"
import { TodoItem, TodoMainItem, createEmptyTodoItem, TodoUpdateItem } from "../models/TodoItems"

import { findUnique } from "../components/helpers";
import { useStyles } from "../Styles"

import { removeItemById } from "../components/GraphQlFunctions"

import { useGetTodos } from "../hooks/useGetTodos"
import { useGetTodo } from "../hooks/useGetTodo"
// import { group } from "console";

import { MarkdownTextareaAutosize } from "../components/MarkdownTextareaAutosize";
import { TextEdit } from "../components/TextEdit";
import { UpdateTodosInput } from "../API"
import { ListGraphInternal } from "../pages/listGraphQL";
import { TodoListType } from "../components/List"


interface Props {
    itemid: string;
    listtype: string;
    updateFunction: (input: UpdateTodosInput) => any;
    lists: TodoMainItem[];
    username: string;
}

export const DetailsById = ({ itemid, listtype, updateFunction, lists, username }: Props) => {

    const item = useGetTodo(itemid);
    const todos = useGetTodos(item?.listid);


    return (
        <Details selectedItem={item} todos={todos} updateFunction={updateFunction} lists={lists} listtype={listtype } username={username} />
    )

}

interface PropsDetails {
    selectedItem: TodoItem | undefined;
    updateFunction: (input: UpdateTodosInput) => any;
    listtype: string;
    todos: TodoItem[];
    lists: TodoMainItem[];
    username: string;
}


export const Details = ({ selectedItem, updateFunction, lists, todos, listtype, username }: PropsDetails) => {

    const classes = useStyles();

    const localitems = useGetTodos(selectedItem?.id);

    // (updateFunction(todoid, name, link, group, description=undefined ) )
    // const uiUpdateTodo = (items, todo) => {

    // const [selectionStart, setSelectionStart] = useState("");

    const [edit, setEdit] = useState(false);
    // const [listvalue, setListValue] = useState <TodoUpdateItem | undefined > ( undefined);

    // currentItem can be set to undefined, when deleted
    const [currentItem, setCurrentItem] = useState<TodoItem | undefined>(selectedItem);

    const [selectedItemValue, setSelectedValue] = useState("");
    const [successSnackbarMessage, setSuccessSnackbarMessage] = React.useState("");

    const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setSuccessSnackbarMessage("");
    };

    // const handleClick = () => {
    //     setOpen(true);
    // };

    useEffect(() => {

        if (edit && selectedItem) // ( selectedItem.id !== selectedItemId ) 
        {
            const value: UpdateTodosInput = {
                id: selectedItem.id,
                description: selectedItemValue
            }

            updateFunction(value)

        }

        if (selectedItem) {
            console.log("useEffect", selectedItem.description)
            setCurrentItem(selectedItem)
            setSelectedValue(selectedItem.description)
        }

        setEdit(false);
        return () => { };

    }, [selectedItem]);

    const updateHandle = () => {
        // updateFunction(selectedItem.id, selectedItem.name, selectedItem.link, selectedItem.group, selectedItemValue)

        if (currentItem === undefined) return;

        const value: UpdateTodosInput = {
            id: currentItem.id,
            description: selectedItemValue
        }

        updateFunction(value)
        setSuccessSnackbarMessage("Saved !!! ")
        setEdit(false)
    }

    const updateNameLinkHandle = (linkName: string, linkUrl: string, groupname: string) => {

        if (currentItem === undefined) return;

        const value: UpdateTodosInput = {
            id: currentItem.id,
            link: linkUrl,
            name: linkName,
            group: groupname
        }

        updateFunction(value)
        setEdit(false)
    }

    const getGlobalList = (lists: TodoMainItem[], id?: string): TodoMainItem | undefined => {
        if( id === undefined ) return undefined
        if (lists !== undefined) {
            const fl = lists.filter(item => item.listid === id)
            // console.log("getGlobalList", id, fl, lists)

            if (fl.length > 0) {
                return fl[0]
            }
        }
        return undefined
    }

    const handleListChange = ( selecedList: TodoMainItem ) => {

        if (selecedList !== null && selectedItem) {
            console.log("handleListIdChange : ", selecedList.id, selecedList.name)

            const value: UpdateTodosInput = {
                id: selectedItem.id,
                listid: selecedList.id
            }
            updateFunction(value)

            // updateFunction(selectedItem.id, { listid: selecedList.id })

            // setListValue(selecedList.name)
        }
    }

    const markdownData = `Just a link: https://reactjs.com.`;
    /// const remarkGfmLL = <any>remarkGfm

    const removeItemHandle = () => {
        if (selectedItem) {
            setCurrentItem(undefined)
            removeItemById(selectedItem.id)
        }
    }

    const bull = <span style={{"margin":"5px"}}>•</span>;
    const currentList = getGlobalList(  lists, selectedItem?.listid )


    return (
        <>
            <Snackbar
                open={successSnackbarMessage.length > 0}
                autoHideDuration={2000}
                onClose={handleClose}
                message="Saved" >
                <Alert onClose={handleClose} severity="success">
                    {successSnackbarMessage}
                </Alert>
            </Snackbar>
            {currentItem === undefined ? (
                <h1> ... </h1>
            ) : (
                <>
                    <MyCard>
                        <MyCardHeader
                            avatar={
                                <Avatar aria-label="recipe">
                                    { currentItem.name[0]} 
                                </Avatar>
                            }
                            action={
                                <IconButton aria-label="settings">
                                    <MyIcon icon="more_vert" />
                                </IconButton>
                            }
                            title={ <TextEdit
                                value={currentItem.name}
                                label="Name"
                                callback={(newName: string) => updateFunction({ id: currentItem.id, name: newName })} >                                
                            </TextEdit> 
                            }
                            subheader={ 
                                <>
                            <TextEdit
                                value={currentItem.group}
                                groups={ findUnique(todos, "group", false) }
                                label="Group"
                                callback={(group) => updateFunction({ id: currentItem.id, group: group })} >
                                
                            </TextEdit>
                            {bull}
                            <TextEdit
                                value={ currentList?currentList.name:"unknown" }
                                groups={ lists.map( (x) => { return { value: x.name }} )  }
                                label="Lists"
                                callback={ (list) => { } } >                                
                            </TextEdit>                            
                            
                            </>

                            }

                        />


                        {/* <List>
                            <ListItem>
                                
                                <hr />

                                <TextEdit
                                    value={currentItem.group}
                                    groups={findUnique(todos, "group", false)}
                                    label="Group"
                                    callback={(group) => updateFunction({ id: currentItem.id, group: group })} >
                                    {currentItem.group}
                                </TextEdit>

                       
                            </ListItem>
                        </List> */}

                        <CardContent>
                            <Grid
                                container
                                direction="row"
                                justify="space-between"
                                alignItems="center" >

                                <Grid item xs={4}>
                                    <Button variant="contained" disabled={!edit} onClick={updateHandle}><MyIcon icon="update" /> </Button>
                                </Grid>

                                <Grid item xs={8} >

                                    {/* <Autocomplete
                                        id="combo-box-demo"
                                        inputValue={""}
                                        // label="Lists"
                                        // value={ { name: listvalue } }
                                        onChange={(event, newValue) => {
                                            if (newValue !== null) {
                                                handleListChange(newValue);
                                            }
                                        }}
                                        options={lists}
                                        getOptionLabel={(option) => "(" + option.id + ") " + option.name}
                                        renderInput={(params) => <TextField {...params} label={"Lists"} variant="outlined" />}
                                    /> */}
                                </Grid>

                            </Grid>

                            <List>
                                <Divider></Divider>
                                <div >
                                    {/* className={ classes.navigationInner } */}
                                    {edit ? (
                                        <ListItem>
                                            <MarkdownTextareaAutosize
                                                initValue={selectedItemValue}
                                                updateFunction={(val: string) => setSelectedValue(val)}
                                            />
                                        </ListItem>
                                    ) : (


                                        <div className="markdown" onClick={() => setEdit(true)}>
                                            <DetailsMarkdown value={selectedItemValue} />
                                        </div>



                                    )}
                                </div>
                            </List>
                        </CardContent>

                    </MyCard>
                    <br />
                    <ListGraphInternal
                        items={localitems}
                        lists={lists}
                        username={ username }
                        listid={currentItem.id}
                        listtype={TodoListType.TODO_SIMPLE} />
                </>
            )}
        </>

    )
}


{/* <ListItem button onClick={ () => setEdit(true) }>
<MyTextareaRead>
{ selectedItemValue ? selectedItemValue : "-" }
</MyTextareaRead>
</ListItem> */}
