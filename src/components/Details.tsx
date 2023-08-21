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

import { findUnique, getGlobalList } from "../components/helpers";

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
    action: React.ReactNode;
}

export const DetailsById = ({ itemid, listtype, updateFunction, lists, username, action }: Props) => {

    const item = useGetTodo(itemid);
    const todos = useGetTodos(item?.listid);

    const location = useLocation();
    const navigate = useNavigate();


    return (
        <Details
            selectedItem={item}
            todos={todos}
            updateFunction={updateFunction}
            lists={lists}
            action={ action }
            listtype={listtype}
            username={username} />
    )

}

interface PropsDetails {
    selectedItem: TodoItem | undefined;
    updateFunction: (input: UpdateTodosInput) => any;
    listtype: string;
    todos: TodoItem[];
    lists: TodoMainItem[];
    username: string;
    action: React.ReactNode;
}


export const Details = (props: PropsDetails) => {

    // const classes = useStyles();

    const location = useLocation();
    // const history = useHistory();
    const navigate = useNavigate();

    const localitems = useGetTodos(props.selectedItem?.id);

    const [edit, setEdit] = useState(false);
    const [addTodos, setAddTodos] = useState(false);


    // currentItem can be set to undefined, when deleted
    const [currentItem, setCurrentItem] = useState<TodoItem | undefined>(props.selectedItem);

    const [selectedItemValue, setSelectedValue] = useState("");
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

            props.updateFunction(value)

        }

        if (props.selectedItem) {
            console.log("useEffect", props.selectedItem.description)
            setCurrentItem(props.selectedItem)
            setSelectedValue(props.selectedItem.description)
        }

        setAddTodos(false);
        setEdit(false);
        return () => { };

    }, [props.selectedItem]);

    const updateHandle = () => {

        if (currentItem === undefined) return;

        const value: UpdateTodosInput = {
            id: currentItem.id,
            description: selectedItemValue
        }

        props.updateFunction(value)
        setSuccessSnackbarMessage("Saved !!! ")
        setEdit(false)
    }

    const updateMarkdownHandle = ( newItemValue : string ) => {

        if (currentItem === undefined) return;

        setSelectedValue( newItemValue )

        const value: UpdateTodosInput = {
            id: currentItem.id,
            description: newItemValue
        }

        props.updateFunction(value)
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

        props.updateFunction(value)
        setEdit(false)
    }



    const handleListChange = (selecedList: TodoMainItem) => {

        if (selecedList !== null && props.selectedItem) {
            console.log("handleListIdChange : ", selecedList.id, selecedList.name)

            const value: UpdateTodosInput = {
                id: props.selectedItem.id,
                listid: selecedList.id
            }
            props.updateFunction(value)

            // updateFunction(selectedItem.id, { listid: selecedList.id })

            // setListValue(selecedList.name)
        }
    }

    const removeItemHandle = () => {
        if (props.selectedItem) {
            setCurrentItem(undefined)
            removeItemById(props.selectedItem.id)
        }
    }

    const bull = <span style={{ "margin": "5px" }}>•</span>;
    const currentList = getGlobalList(props.lists, props.selectedItem?.listid)


    return (
        <>
            <Snackbar
                open={successSnackbarMessage.length > 0}
                autoHideDuration={2000}
                anchorOrigin={{ vertical:"top", horizontal:"center" }}
                onClose={ ()=>setSuccessSnackbarMessage("") }
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
                                props.action
                            }
                            title={<TextEdit
                                value={currentItem.name}
                                label="Name"
                                callback={(newName: string) => props.updateFunction({ id: currentItem.id, name: newName })} >
                            </TextEdit>
                            }
                            subheader={
                                <>
                                    <TextEdit
                                        value={currentItem.group}
                                        groups={findUnique(props.todos, "group", false)}
                                        label="Group"
                                        callback={(group) => props.updateFunction({ id: currentItem.id, group: group })} >
                                    </TextEdit>
                                    {bull}
                                    <TextEdit
                                        value={currentList ? currentList.name : "unknown"}
                                        groups={props.lists.map((x) => { return { value: x.name } })}
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
                                            <Button startIcon={<MyIcon icon={"edit"} />} variant="contained" onClick={() => setEdit(true)}>Edit </Button>
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
                                    <ListGraphInternal
                                        items={localitems}
                                        lists={props.lists}
                                        username={props.username}
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
