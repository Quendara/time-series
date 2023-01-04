import React, { useState, useEffect } from "react";

import {
    // IndexRoute,
    // useRouteMatch,
    useLocation,
    useNavigate
} from "react-router-dom";



import { CardContent, Snackbar, Alert, Grid, Button, Avatar, IconButton } from '@mui/material';


import { MyCardHeader, MyDivider, MyCard2 } from "./StyledComponents"
import { MyIcon } from "./MyIcon";

import { DetailsMarkdown } from "./DetailsMarkdown"
import { TodoItem, TodoMainItem } from "../models/TodoItems"

import { findUnique } from "../components/helpers";

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
        <Details selectedItem={item} todos={todos} updateFunction={updateFunction} lists={lists} listtype={listtype} username={username} />
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

    // const classes = useStyles();

    const location = useLocation();
    // const history = useHistory();
    const navigate = useNavigate();

    const localitems = useGetTodos(selectedItem?.id);

    const [edit, setEdit] = useState(false);
    const [addTodos, setAddTodos] = useState(false);


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

        setAddTodos(false);
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
        if (id === undefined) return undefined
        if (lists !== undefined) {
            const fl = lists.filter(item => item.listid === id)
            // console.log("getGlobalList", id, fl, lists)

            if (fl.length > 0) {
                return fl[0]
            }
        }
        return undefined
    }

    const handleListChange = (selecedList: TodoMainItem) => {

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

    const removeItemHandle = () => {
        if (selectedItem) {
            setCurrentItem(undefined)
            removeItemById(selectedItem.id)
        }
    }

    const bull = <span style={{ "margin": "5px" }}>•</span>;
    const currentList = getGlobalList(lists, selectedItem?.listid)


    return (
        <>
            <Snackbar
                open={successSnackbarMessage.length > 0}
                autoHideDuration={2000}                
                message="Saved" >
                <Alert onClose={handleClose} severity="success">
                    {successSnackbarMessage}
                </Alert>
            </Snackbar>
            {currentItem === undefined ? (
                <h1> ... </h1>
            ) : (
                <>
                    <MyCard2 elevation={4}>
                        <MyCardHeader
                            avatar={
                                <Avatar aria-label="recipe">
                                    {currentItem.name[0]}
                                </Avatar>
                            }
                            action={
                                <IconButton onClick={() => { navigate(location.pathname + "/" + currentItem.id) }} aria-label="open">
                                    <MyIcon icon="launch" />
                                </IconButton>
                            }
                            title={<TextEdit
                                value={currentItem.name}
                                label="Name"
                                callback={(newName: string) => updateFunction({ id: currentItem.id, name: newName })} >
                            </TextEdit>
                            }
                            subheader={
                                <>
                                    <TextEdit
                                        value={currentItem.group}
                                        groups={findUnique(todos, "group", false)}
                                        label="Group"
                                        callback={(group) => updateFunction({ id: currentItem.id, group: group })} >
                                    </TextEdit>
                                    {bull}
                                    <TextEdit
                                        value={currentList ? currentList.name : "unknown"}
                                        groups={lists.map((x) => { return { value: x.name } })}
                                        label="Lists"
                                        callback={(list) => { }} >
                                    </TextEdit>
                                </>
                            }
                        />


                        <CardContent>
                            <Grid
                                container
                                direction="row"
                                justifyContent="flex-start"
                                alignItems="flex-start" >

                                <Grid item xs={12}>
                                    {
                                        edit ? (
                                            <Button startIcon={<MyIcon icon={"update"} />} variant="contained" color={"primary"} onClick={updateHandle}> Save </Button>
                                        ) : (
                                            <Button startIcon={<MyIcon icon={"edit"} /> } variant="contained" onClick={() => setEdit(true)}>Edit </Button>
                                        )
                                    }
                                    {(localitems.length === 0) &&

                                        <Button
                                            variant="contained"                                            
                                            style={{ "marginLeft": "20px" }}
                                            startIcon={<MyIcon icon={"rule"} />}
                                            onClick={() => setAddTodos(true)}> Add Checklist
                                        </Button>
                                    }

                                </Grid>





                                {edit ? (
                                    <>

                                        <Grid item xs={12}>
                                            <MyDivider />
                                            <MarkdownTextareaAutosize
                                                initValue={selectedItemValue}
                                                updateFunction={(val: string) => setSelectedValue(val)}
                                            />
                                        </Grid>
                                    </>
                                ) : (
                                    <>
                                        {selectedItemValue.length > 0 &&
                                            <Grid item xs={12}>
                                                <MyDivider />

                                                <div className="markdown" >
                                                    <DetailsMarkdown value={selectedItemValue} initValue="Add comments here ... " />
                                                </div>
                                            </Grid>
                                        }
                                    </>
                                )}
                            </Grid>


                            {(addTodos || localitems.length > 0) && <>

                                <Grid item xs={12}>
                                    <MyDivider />
                                </Grid>

                                <Grid item xs={12}>
                                    <ListGraphInternal
                                        items={localitems}
                                        lists={lists}
                                        username={username}
                                        horizontally={true}
                                        listid={currentItem.id}
                                        listtype={TodoListType.TODO_SIMPLE} />
                                </Grid>
                            </>}
                        </CardContent>

                    </MyCard2>

                </>
            )
            }
        </>

    )
}


{/* <ListItem button onClick={ () => setEdit(true) }>
<MyTextareaRead>
{ selectedItemValue ? selectedItemValue : "-" }
</MyTextareaRead>
</ListItem> */}
