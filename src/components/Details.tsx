import React, { useState, useEffect, useContext } from "react";

import {
    // IndexRoute,
    // useRouteMatch,
    useLocation,
    useNavigate
} from "react-router-dom";

import { CardContent, Snackbar, Alert, Grid, Button, Avatar, IconButton, Stack, Dialog, DialogContent, Card } from '@mui/material';

import { MyCardHeader, MyDivider, MyCard2, MyDialogContentBlur } from "./StyledComponents"
import { MyIcon } from "./MyIcon";

import { DetailsMarkdown } from "./DetailsMarkdown"
import { TodoItem, TodoMainItem } from "../models/TodoItems"

import { findUnique, getGlobalList } from "../components/helpers";

import { removeItemById, updateFunctionTodo } from "../components/GraphQlFunctions"

import { useGetTodos } from "../hooks/useGetTodos"
import { useGetTodo } from "../hooks/useGetTodo"
// import { group } from "console";

import { MarkdownTextareaAutosize } from "../components/MarkdownTextareaAutosize";
import { TextEdit } from "../components/TextEdit";
import { UpdateTodosInput } from "../API"
import { ListGraphInternal } from "../pages/listGraphQL";
import { TodoListType } from "../components/List"
import { Calendar } from "./Calendar";
import { TodoMainContext } from "../context/TodoMainProvider";
import { TodoProvider } from "../context/TodoProvider";


interface Props {
    itemid: string;
    listtype: string;
    updateFunction?: (input: UpdateTodosInput) => any;
    lists: TodoMainItem[];
    username: string;
    action: React.ReactNode;
}

export const DetailsById = (props: Props) => {

    const navigate = useNavigate();

    const context = useContext(TodoMainContext)

    const item = useGetTodo(props.itemid);
    const todos: TodoItem[] = useGetTodos(item?.listid);

    const mainItem = context.findItem(item?.listid)

    const myaction = (<IconButton onClick={() => { navigate("/" + ["list", item?.listid, mainItem?.render, item?.id].join("/")) }} >
        <MyIcon icon="open_in_full"></MyIcon>
    </IconButton>)

    return (
        <Details
            selectedItem={item}
            todos={todos}
            updateFunction={props.updateFunction}
            lists={props.lists}
            action={props.action ? props.action : myaction}
            listtype={props.listtype}
            username={props.username} />
    )
}

export const DetailsLinkById = (props: Props) => {

    const item = useGetTodo(props.itemid);
    const todos: TodoItem[] = useGetTodos(item?.listid);

    const [open, setOpen] = useState(false);

    const navigate = useNavigate();


    const myaction = (<IconButton onClick={() => { navigate("/" + ["list", item?.listid, "todo", item?.id].join("/")) }} >
        <MyIcon icon="open_in_full"></MyIcon>
    </IconButton>)

    return (
        <>
            <Dialog
                open={open}
                fullWidth={true}
                maxWidth={"md"}
                scroll={"paper"}
                onClose={() => setOpen(false)}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
            >
                <MyDialogContentBlur>
                    <DetailsHeadless
                        selectedItem={item}
                        todos={todos}
                        updateFunction={props.updateFunction}
                        lists={props.lists}
                        action={props.action ? props.action : myaction}
                        listtype={props.listtype}
                        username={props.username} />
                </MyDialogContentBlur>
            </Dialog>
            <Button onClick={() => setOpen(true)}>{item?.name}</Button>
        </>
    )
}





interface PropsDetails {
    selectedItem: TodoItem | undefined;
    updateFunction?: (input: UpdateTodosInput) => any;
    listtype: string;
    todos: TodoItem[];
    lists: TodoMainItem[];
    username: string;
    action: React.ReactNode;
}

export const Details = (props: PropsDetails) => {
    return (
        <MyCard2>
            <DetailsHeadless {...props} />
        </MyCard2>
    )
}


export const DetailsHeadless = (props: PropsDetails) => {

    // const classes = useStyles();

    const location = useLocation();
    // const history = useHistory();
    const navigate = useNavigate();

    const contextMainTodo = useContext(TodoMainContext)

    const localitems = useGetTodos(props.selectedItem?.id);
    // const localitems : TodoItem[] = useGetTodos(item?.listid);

    const [edit, setEdit] = useState(false);
    const [addTodos, setAddTodos] = useState(false);

    const [selectedItemValue, setSelectedValue] = useState("");


    // currentItem can be set to undefined, when deleted
    const [currentItem, setCurrentItem] = useState<TodoItem | undefined>(props.selectedItem);


    const [successSnackbarMessage, setSuccessSnackbarMessage] = React.useState("");

    const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setSuccessSnackbarMessage("");
    };

    useEffect(() => {

        if (edit && props.selectedItem) // ( selectedItem.id !== selectedItemId ) 
        {
            const value: UpdateTodosInput = {
                id: props.selectedItem.id,
                description: selectedItemValue
            }

            props.updateFunction && props.updateFunction(value)

        }

        if (props.selectedItem) {
            console.log("DetailsHeadless.useEffect", props.selectedItem.description)
            setCurrentItem(props.selectedItem)
            setSelectedValue(props.selectedItem.description)

            document.title = props.selectedItem.name
        }

        setAddTodos(false);
        setEdit(false);
        return () => { };

    }, [props.selectedItem]);

    const updateHandle = (newDescription: string) => {

        if (currentItem === undefined) return;

        const value: UpdateTodosInput = {
            id: currentItem.id,
            description: newDescription
        }

        setSelectedValue(newDescription)

        // props.updateFunction && props.updateFunction(value)
        updateFunctionTodo(value)
        setSuccessSnackbarMessage("Saved " + currentItem.name + "!!! ")
        setEdit(false)
    }

    const updateMarkdownHandle = (newItemValue: string) => {

        if (currentItem === undefined) return;

        setSelectedValue(newItemValue)

        const value: UpdateTodosInput = {
            id: currentItem.id,
            description: newItemValue
        }

        // props.updateFunction && props.updateFunction(value)
        updateFunctionTodo(value)
        setSuccessSnackbarMessage("Saved " + currentItem.name + "!!! ")
        setEdit(false)
    }

    // const updateNameLinkHandle = (linkName: string, linkUrl: string, groupname: string) => {

    //     if (currentItem === undefined) return;

    //     const value: UpdateTodosInput = {
    //         id: currentItem.id,
    //         link: linkUrl,
    //         name: linkName,
    //         group: groupname
    //     }

    //     props.updateFunction(value)
    //     setEdit(false)
    // }


    const updateMainList = (newListName: string) => {

        // found id of the list, the item should be added
        const foundList = props.lists.find(item => item.name === newListName);

        if (props.selectedItem && foundList) {

            const value: UpdateTodosInput = {
                id: props.selectedItem.id,
                listid: foundList.listid
            }
            // props.updateFunction && props.updateFunction(value)
            updateFunctionTodo(value)
        }

    }

    const handleListChange = (selecedList: TodoMainItem) => {

        if (selecedList !== null && props.selectedItem) {
            console.log("handleListIdChange : ", selecedList.id, selecedList.name)

            const value: UpdateTodosInput = {
                id: props.selectedItem.id,
                listid: selecedList.id
            }
            // props.updateFunction && props.updateFunction(value)
            updateFunctionTodo(value)
        }
    }

    const removeItemHandle = () => {
        if (props.selectedItem) {
            setCurrentItem(undefined)
            removeItemById(props.selectedItem.id)
        }
    }

    const bull = <span style={{ "margin": "5px" }}>•</span>;
    const currentList = contextMainTodo.findItem(props.selectedItem?.listid)


    return (
        <>
            <Snackbar
                open={successSnackbarMessage.length > 0}
                autoHideDuration={2000}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
                onClose={() => setSuccessSnackbarMessage("")}
                message={"Saved " + currentItem?.name} >
                <Alert onClose={handleClose} severity="success">
                    {successSnackbarMessage}
                </Alert>
            </Snackbar>

            {currentItem === undefined ? (
                <h1> ... </h1>
            ) : (
                <>
                    <MyCardHeader
                        avatar={
                            <Avatar aria-label="recipe">
                                {currentItem.name[0]}
                            </Avatar>
                        }
                        action={
                            props.action
                        }
                        title={<TextEdit
                            value={currentItem.name}
                            label="Name"
                            readonly={props.updateFunction === undefined}
                            callback={(newName: string) => props.updateFunction && props.updateFunction({ id: currentItem.id, name: newName })} >
                        </TextEdit>
                        }
                        subheader={
                            <>
                                <TextEdit
                                    value={currentItem.group}
                                    groups={findUnique(props.todos, "group", false)}
                                    label="Group"
                                    readonly={props.updateFunction === undefined}
                                    callback={(group) => props.updateFunction && props.updateFunction({ id: currentItem.id, group: group })} >
                                </TextEdit>
                                {bull}
                                <TextEdit
                                    value={currentList ? currentList.name : "unknown"}
                                    groups={contextMainTodo.todos.map((x) => { return { value: x.name } })}
                                    label="Lists"
                                    callback={(list) => updateMainList(list)} >
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

                            {edit ? (
                                <>
                                    <Grid item xs={12}>
                                        <MarkdownTextareaAutosize
                                            initValue={selectedItemValue}
                                            onSave={updateHandle}
                                        />
                                    </Grid>
                                </>
                            ) : (
                                <>
                                    {props.updateFunction &&

                                        <Grid item xs={12}>
                                            <Stack direction={"row"} spacing={2}>

                                                <Button startIcon={<MyIcon icon={"edit"} />} variant="contained" onClick={() => setEdit(true)}>Edit </Button>

                                                {(localitems.length === 0) &&
                                                    <Button
                                                        variant="contained"
                                                        startIcon={<MyIcon icon={"rule"} />}
                                                        onClick={() => setAddTodos(true)}> Add Checklist
                                                    </Button>
                                                }
                                            </Stack>
                                            <MyDivider />
                                        </Grid>
                                    }
                                    {selectedItemValue.length > 0 &&
                                        <Grid item xs={12}>


                                            <div className="markdown" >
                                                <DetailsMarkdown
                                                    value={selectedItemValue}
                                                    initValue="Add comments here ... "
                                                    updateFunction={(val: string) => updateMarkdownHandle(val)}
                                                />
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
                                <TodoProvider>
                                    <ListGraphInternal
                                        // items={localitems}
                                        lists={props.lists}
                                        color={"#AAA"}
                                        username={props.username}
                                        horizontally={true}
                                        listid={currentItem.id}
                                        listtype={TodoListType.TODO_SIMPLE} />
                                </TodoProvider>
                            </Grid>
                        </>}
                    </CardContent>


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
