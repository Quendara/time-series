import React, { useState, useEffect, useRef, SyntheticEvent, KeyboardEvent } from "react";

import { ListItem, List, CardContent, Snackbar } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';


import { Grid, Button, TextField, Divider, Typography } from '@material-ui/core';
import { MyCard, MyCardHeader, MyTextareaAutosize, MyTextareaRead } from "./StyledComponents"
import Autocomplete from '@material-ui/lab/Autocomplete';
import { MyIcon } from "./MyIcon";

import { DetailsMarkdown } from "./DetailsMarkdown"
import { TodoItem, TodoMainItem, createEmptyTodoItem, TodoUpdateItem } from "../models/TodoItems"

import { findUnique } from "../components/helpers";
import { useStyles } from "../Styles"



import { AddForm } from "./AddForm";

import { removeItemById } from "../components/GraphQlFunctions"

import { useGetTodos } from "../hooks/useGetTodos"
import { useGetTodo } from "../hooks/useGetTodo"
// import { group } from "console";
import { TextEdit } from "../components/TextEdit";
import { UpdateTodosInput } from "../API"

interface PropMTA {
    initValue: String;
    updateFunction: (s: string) => void;
}

const MarkdownTextareaAutosize = ({ initValue, updateFunction }: PropMTA) => {
    const textFieldRef = useRef<any>(); // textFieldRef.current.

    const [caret, setCaret] = useState({
        start: 0,
        end: 0
    });

    useEffect(() => {

        textFieldRef.current.value = initValue;

        return () => {

        };

    }, [initValue]);

    const insertText = (value: String, caret_start: number, caret_end: number, text: String) => {

        const pre = value.substring(0, caret_start)
        const post = value.substring(caret_end, value.length)

        const insertItem = text
        const newPos = caret_start + insertItem.length

        console.log("insertText : ", caret_start)


        return pre
            + insertItem
            + post
    }

    const lastLineBeforeCursor = (value: String, caret_start: number) => {
        const pre = value.substring(0, caret_start)
        const index = pre.lastIndexOf("\n")
        const line = pre.substring(index + 1, pre.length)
        return line
    }

    const handleSelect = (e: any) => {

        console.log("handleSelect : ", e.target.selectionStart)

        setCaret({ start: e.target.selectionStart, end: e.target.selectionEnd });
    }


    const handleKeyPress = (event: any) => {

        const initialCursor = event.target.selectionStart
        let cursorPos = event.target.selectionStart
        let selectionEnd = event.target.selectionEnd

        const previous_value = textFieldRef.current.value

        switch (event.key) {
            case "Enter":

                let insertion_str = "\n";



                const lineBeforeCursor = lastLineBeforeCursor(previous_value, cursorPos)

                console.log("lineBeforeCursor : ", lineBeforeCursor)

                if (lineBeforeCursor.startsWith('*')) {
                    insertion_str = "\n* ";
                } else if (lineBeforeCursor.startsWith('  *')) {
                    insertion_str = "\n  * ";
                } else if (lineBeforeCursor.startsWith('    *')) {
                    insertion_str = "\n    * ";
                } else {
                    insertion_str = "\n";
                }


                const insertedText = insertText(previous_value, cursorPos, selectionEnd, insertion_str)
                event.preventDefault()
                setCaret({ start: cursorPos, end: selectionEnd })

                //     let value = selectedItemValue + " *"

                //     const splittetLines = selectedItemValue.split("\n")
                //     let charCount = 0

                //     splittetLines.forEach((line: String, index: Number ) => {

                //         charCount += line.length + 1

                //         if (cursorPos < charCount) {
                //             // Add to index, 0 means delete = 0
                //             splittetLines.splice(index, 0, "* ");
                //             cursorPos = 9999999999999999999999999
                //         }

                //     });

                //     setSelectedValue( splittetLines.join("\n")  )
                //     event.preventDefault()

                if (textFieldRef && textFieldRef.current) {
                    textFieldRef.current.value = insertedText;
                    textFieldRef.current.selectionStart = initialCursor + insertion_str.length
                    textFieldRef.current.selectionEnd = initialCursor + insertion_str.length

                    updateFunction(insertedText)
                }
        }
    }

    return (
        <MyTextareaAutosize
            // value={ selectedItemValue ? selectedItemValue : "" }
            rowsMin={10}
            rowsMax={30}
            // error={ hasError(linkName) }
            // label="Name"
            // size="small"
            autoFocus={true}
            // fullWidth
            // variant="outlined"
            ref={textFieldRef}
            onSelect={(e) => handleSelect(e)}
            onKeyPress={e => handleKeyPress(e)}
            onChange={e => updateFunction(e.target.value)} />
    )

    // <Grid item xs={12} >{caret.start} - {caret.end}</Grid>
}


interface Props {
    itemid: string;
    listtype: string;
    updateFunction: ( input : UpdateTodosInput ) => any;    
    lists: TodoMainItem[];
}

export const DetailsById = ({ itemid, listtype, updateFunction, lists }: Props) => {

    const item = useGetTodo(itemid);
    const todos = useGetTodos( item?.listid );


    return (
        <Details selectedItem={item} todos={todos} updateFunction={updateFunction} lists={lists} listtype={listtype} />
    )

}

interface PropsDetails {
    selectedItem: TodoItem | undefined;
    updateFunction: ( input : UpdateTodosInput ) => any;  
    listtype: string;
    todos: TodoItem[];
    lists: TodoMainItem[];
}


export const Details = ({ selectedItem, updateFunction, lists, todos, listtype }: PropsDetails) => {

    const classes = useStyles();

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
            const value : UpdateTodosInput = {
                id: selectedItem.id,
                description: selectedItemValue 
            }
    
            updateFunction( value )

        }

        if (selectedItem) {
            console.log("useEffect", selectedItem.description)
            setCurrentItem(selectedItem)
            setSelectedValue(selectedItem.description)
            // setSelectedItemId(selectedItem.id)
            // setSelectedName(selectedItem.name)
            // const listname = getGlobalList(lists, selectedItem.listid).name
            // setListValue(listname)    
        }

        setEdit(false);
        return () => { };

    }, [selectedItem]);

    const updateHandle = () => {
        // updateFunction(selectedItem.id, selectedItem.name, selectedItem.link, selectedItem.group, selectedItemValue)

        if (currentItem === undefined) return;

        const value : UpdateTodosInput = {
            id: currentItem.id,
            description: selectedItemValue 
        }

        updateFunction( value )
        setSuccessSnackbarMessage("Saved !!! ")
        setEdit(false)
    }

    const updateNameLinkHandle = (linkName: string, linkUrl: string, groupname: string) => {

        if (currentItem === undefined) return;

        const value : UpdateTodosInput = {
            id: currentItem.id,
            link: linkUrl,
            name: linkName,
            group: groupname 
        }        

        updateFunction( value )
        setEdit(false)
    }

    const getGlobalList = (lists: TodoItem[], id: string): TodoItem => {
        if (lists !== undefined) {
            const fl = lists.filter( item => item.listid === id )
            // console.log("getGlobalList", id, fl, lists)

            if (fl.length > 0) {
                return fl[0]
            }
        }
        return createEmptyTodoItem()
    }

    const handleListChange = (selecedList: TodoMainItem ) => {

        if (selecedList !== null && selectedItem) {
            console.log("handleListIdChange : ", selecedList.id, selecedList.name)

            const value : UpdateTodosInput = {
                id: selectedItem.id,
                listid: selecedList.id 
            }  
            updateFunction( value )          

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
                <MyCard>


                    <MyCardHeader>

                        <List>
                            <ListItem>
                                <TextEdit
                                    value={currentItem.name}
                                    label="Name"
                                    callback={(newName: string) => updateFunction({ id: currentItem.id, name: newName })} >
                                    <h1>{currentItem.name} </h1>
                                </TextEdit>
                                <hr />

                                <TextEdit
                                    value={currentItem.group}
                                    groups={findUnique(todos, "group", false)}
                                    label="Group"
                                    callback={(group) => updateFunction( {id: currentItem.id, group: group })} >
                                    {currentItem.group}
                                </TextEdit>


                                {/* <AddForm renderModal={true} 
                                handleDeleteClick={removeItemHandle} 
                                name={ currentItem.name }
                                url={ currentItem.link }
                                buttonName="Update"                                
                                type={ listtype }
                                onClickFunction={updateNameLinkHandle}
                                group={ currentItem.group }
                                groups={ findUnique(todos, "group", false) } >
                            </AddForm>  */}

                            </ListItem>
                        </List>
                    </MyCardHeader>
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

                                {/* <TextEdit 
                                value={ listvalue} 
                                groups={ lists } 
                                label="Lists"
                                callback={ ( group ) => updateFunction( currentItem.id, { group: group }) } >
                                    { listvalue } 
                            </TextEdit> */}


                                <Autocomplete
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
                                />
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
                                ) :
                                    (

                                        <div className="markdown" onClick={() => setEdit(true)}>
                                            <DetailsMarkdown value={selectedItemValue} />
                                        </div>

                                    )
                                }


                            </div>
                        </List>
                        <Divider></Divider>

                    </CardContent>
                </MyCard>
            )}
        </>

    )
}


{/* <ListItem button onClick={ () => setEdit(true) }>
<MyTextareaRead>
{ selectedItemValue ? selectedItemValue : "-" }
</MyTextareaRead>
</ListItem> */}
