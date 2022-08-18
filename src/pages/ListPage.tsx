import React, { useState, useEffect } from 'react';

import SearchIcon from '@material-ui/icons/Search';

import { Grid, Paper, Card, CardHeader, CardContent, Button, ButtonGroup, Typography, TextField, List, ListItem, Divider, Hidden, Snackbar } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';

import Autocomplete from '@material-ui/lab/Autocomplete';


import { ThemeProvider, CssBaseline } from "@material-ui/core";
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import InputAdornment from '@material-ui/core/InputAdornment';

import VisibilityIcon from '@material-ui/icons/Visibility';
import ClearIcon from '@material-ui/icons/Clear';
import TextRotationNoneIcon from '@material-ui/icons/TextRotationNone';

import { FilterComponent } from '../components/FilterComponent';

import { MyCard, MyPaperHeader } from "../components/StyledComponents"

import { ListHeader, ListQ } from '../components/List';
import { AddForm } from '../components/AddForm';
import { Details, DetailsById } from '../components/Details';

import { findUnique, GenericGroup, sortArrayBy } from "../components/helpers";

import { TodoItem, TodoUpdateItem, TodoMainItem } from '../models/TodoItems';
import { useWindowScrollPositions } from '../hooks/useWindowScrollPositions'
// import { UpdateFunc } from "../models/Definitions"
// import { GroupItem } from "../models/Definitions"

import { UpdateTodosInput } from "../API"
import { TodoListType } from "../components/List"



interface ListProps {
    todos: TodoItem[];
    listtype: TodoListType;
    listid: string;
    horizontally: boolean;
    addItemHandle: any;
    // getItem: (id:string) => any;
    removeItemHandle: (id: string) => void;
    updateFunction: (input: UpdateTodosInput) => void;
    toggleFunction: (id: string) => void;
    uncheckFunction: (id: string) => void;
    lists: TodoMainItem[];
    username: string;

}

export const ListPage = (
//     {
//     todos,
//     listtype,
//     listid,
//     addItemHandle,
//     removeItemHandle,
//     horizontally,
//     // getItem,
//     updateFunction,
//     toggleFunction,
//     uncheckFunction,
//     lists,
//     username
// } 
props: ListProps) => {

    // const [selectedItem, setSelectedItem] = useState(undefined);
    const [selectedItemId, setSelectedItemId] = useState("");

    const [edit, setEdit] = useState(false);
    const [filterText, setFilterText] = useState("");
    const [hideCompleted, setHideCompleted] = useState(false);
    const [ stateHorizontally, setHorizontally] = useState( props.horizontally );

    const { scrollX, scrollY } = useWindowScrollPositions()

    const [successSnackbarMessage, setSuccessSnackbarMessage] = React.useState("");

    const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setSuccessSnackbarMessage("");
    };

    useEffect(
        () => {
            setSelectedItemId("");
        }, [props.listid])

    const callbackFilter = (text: string) => {
        setFilterText(text)
    }

    async function selectHandle(id: string) {
        // const currentItem = await getItem(id)
        //     // console.log( "selectHandle : ", id  )
        // console.log( "selectHandle : ", currentItem)
        setSelectedItemId(id)
    }


    const callbackEnter = () => {

        if (filteredTodos.length === 1) {

            setSuccessSnackbarMessage("Uncheck item " + filteredTodos[0].name);

            props.uncheckFunction(filteredTodos[0].id)
            setFilterText("")
        }
    }

    const getItemGlobalList = (lists: TodoMainItem[], id: string): TodoMainItem | undefined => {
        if (lists !== undefined) {
            const fl = lists.filter(item => +item.listid === +id)
            // console.log("getGlobalList ", id, fl, lists)

            if (fl.length > 0) {
                return fl[0]
            }
        }
        return undefined;
    }


    const filterCompleted = (items: TodoItem[], hideCompleted: boolean, filterText: string) => {

        let filteredItems = items
        if (hideCompleted) {
            filteredItems = items.filter((item: TodoItem) => {
                return item.checked === false
            })
        }

        const FILTER = filterText.toUpperCase()

        if (filterText.length !== 0) {
            filteredItems = filteredItems.filter(item => {
                const currentItem = item.name.toUpperCase()
                return (currentItem.indexOf(FILTER) !== -1)
            })
        }

        return filteredItems
    }


    const filteredTodos = filterCompleted( props.todos, hideCompleted, filterText)


    const createLists = (items: TodoItem[]) => {

        let groups: GenericGroup<TodoItem>[] = [];

        if ( props.listid === "current") {
            const groups_uniq = findUnique(items, "listid", false)
            groups = groups_uniq.map((el: GenericGroup<TodoItem>) => {
                el.value = "(" + el.value + ") " + getItemGlobalList( props.lists, el.value)?.name
                return el
            }
            )
        }
        else {
            groups = findUnique(items, "group", false)
        }



        return (
            <>
                {(stateHorizontally && groups) ? (
                    // 
                    <div style={{ "width": "100%", "overflowX": "scroll" }}>
                        {groups.map((item: GenericGroup<TodoItem>, index: number) => (
                            <div key={"xxy" + index} style={{ "width": groups.length * 310 + "px" }}>
                                <div key={index} style={{ "width": "300px", "float": "left", "marginRight": "10px" }} >
                                    <MyCard>
                                        <ListQ
                                            key={index}
                                            editList={edit}
                                            header={item.value}
                                            group={item.value}
                                            items={sortArrayBy(item.listitems, "name")}
                                            groups={groups}
                                            addItemHandle={ props.addItemHandle}
                                            type={ props.listtype}
                                            selectFunction={selectHandle}
                                            removeItemHandle={ props.removeItemHandle }
                                            updateFunction={ props.updateFunction }
                                            toggleFunction={ props.toggleFunction }
                                        />
                                    </MyCard>
                                </div>
                            </div>
                        ))}
                    </div>

                ) : (
                    <Grid container spacing={2} >
                        {groups && groups.map((item: GenericGroup<TodoItem>, index: number) => (
                            <Grid key={"xxxyy" + index} item xs={12}>
                                <MyCard key={"agjhl" + index}>
                                    <ListQ
                                        key={"agjhxg" + index}
                                        editList={edit}
                                        header={item.value}
                                        group={item.value}
                                        items={sortArrayBy(item.listitems, "name",)}
                                        groups={groups}
                                        addItemHandle={ props.addItemHandle}
                                        type={ props.listtype }
                                        selectFunction={selectHandle}
                                        removeItemHandle={ props.removeItemHandle }
                                        updateFunction={ props.updateFunction }
                                        toggleFunction={ props.toggleFunction }
                                    />
                                </MyCard>
                            </Grid>
                        ))}
                    </Grid>
                )

                }
            </>

        )
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

            <Grid container spacing={4} >
                <Grid item lg={12} xs={12} >
                    <MyCard>
                        { props.todos.length > 5 &&
                            <MyPaperHeader >
                                <List>
                                    <ListItem>
                                        <Grid container alignItems="center" justify="flex-start" spacing={2} >

                                            <Grid item xs={10} lg={8} >
                                                {edit ? (
                                                    <AddForm
                                                        renderModal={false}
                                                        onClickFunction={ props.addItemHandle}
                                                        handleDeleteClick={undefined}
                                                        type={ props.listtype}
                                                        groups={findUnique( props.todos, "group", false)} ></AddForm>
                                                ) : (

                                                    <FilterComponent filterText={filterText} callback={callbackFilter} callbackEnter={callbackEnter} />
                                                )}
                                            </Grid>
                                            <Grid item xs={2} lg={4} >
                                                <Grid container justify="flex-end">
                                                    
                                                        {/* <IconButton color={edit ? "primary" : "default"} onClick={() => setEdit(!edit)} >
                                                            <EditIcon />
                                                        </IconButton> */}
                                                    <IconButton color={ stateHorizontally ? "primary" : "default"} onClick={() => setHorizontally(!stateHorizontally)} >
                                                        <TextRotationNoneIcon />
                                                    </IconButton>
                                                    <IconButton color={hideCompleted ? "primary" : "default"} onClick={() => setHideCompleted(!hideCompleted)} >
                                                        <VisibilityIcon />
                                                    </IconButton>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </ListItem>
                                </List>
                            </MyPaperHeader>
                        }


                        {(filteredTodos.length === 1 && filterText.length > 0) && (
                            <CardContent>
                                <Typography variant="h6" component="h6">
                                    {filteredTodos[0].name}
                                </Typography>
                                <Typography variant="inherit" component="b" >
                                    Press Enter to check item
                                </Typography>
                            </CardContent>
                        )}
                        {filteredTodos.length === 0 && (
                         
                                         <MyCard>


                                        <ListHeader
                                            header={"Checklist"}
                                            edit={false}
                                            setEditCallback={(e: boolean) => { }} />
                                        <ListItem>
                                            <AddForm
                                                renderModal={false}
                                                handleDeleteClick={undefined} 
                                                name={filterText} 
                                                onClickFunction={ props.addItemHandle } 
                                                type={ props.listtype } 
                                                groups={ findUnique( props.todos, "group", false)} ></AddForm>
                                        </ListItem>
                            </MyCard> )}
                    </MyCard>
                </Grid>

                { props.listtype === TodoListType.TODO_SIMPLE ? (
                    <Grid item xs={12}  >
                        { props.todos.length > 0 && <> {createLists(filteredTodos)} </>}
                    </Grid>
                ) : (
                    <Grid item md={stateHorizontally ? 12 : 4} sm={stateHorizontally ? 12 : 6} xs={12}  >
                        <div className={"my-container-content"} >
                            { props.todos.length > 0 && <> {createLists(filteredTodos)} </>}
                        </div>
                    </Grid>
                )

                }


                {/* 
                <div style={{ position: "relative" }}>
                <div className={(scrollY > 190) ? "details down" : "details"} ></div> */}

                {(selectedItemId) &&
                    <>
                        <Grid item md={stateHorizontally ? 12 : 8} sm={stateHorizontally ? 12 : 6} xs={12} >

                            <div className={"my-container-content"} >
                                <DetailsById
                                    itemid={selectedItemId}
                                    updateFunction={ props.updateFunction }
                                    lists={ props.lists }
                                    listtype={ props.listtype }
                                    username={ props.username }

                                />
                                <div>Scroll position is ({scrollX}, {scrollY})</div>
                            </div>
                        </Grid>
                    </>
                }
            </Grid >
        </>
    )

} 