import React, { useState, useEffect, useContext } from 'react';


import { Grid, CardContent, Typography, List, ListItem, Snackbar, Alert, IconButton, Hidden, Box, Stack, Card, ListItemText, Avatar, ListItemAvatar, useMediaQuery } from '@mui/material';

import { FilterComponent } from '../components/FilterComponent';

import { MyCard, MyCardBlur, MyPaperHeader } from "../components/StyledComponents"

import { ListHeader, ListQ } from '../components/List';
import { AddForm } from '../components/AddForm';
import { DetailsById } from '../components/Details';

import { findUnique, GenericGroup, getGlobalList, mapGenericToStringGroup, sortArrayBy } from "../components/helpers";

import { TodoItem, TodoMainItem } from '../models/TodoItems';
import { useWindowScrollPositions } from '../hooks/useWindowScrollPositions'
// import { UpdateFunc } from "../models/Definitions"
// import { GroupItem } from "../models/Definitions"

import { UpdateTodosInput } from "../API"
import { TodoListType } from "../components/List"
import { HorizontallyGrid, HorizontallyItem } from "../components/HorizontallyGrid"
import { MyIcon } from '../components/MyIcon';

import { useTheme } from '@mui/material/styles';
import { Calendar } from '../components/Calendar';
import { useNavigate } from 'react-router-dom';
import { TodoMainContext } from '../context/TodoMainProvider';
import { removeMainTodoItemById } from '../context/TodoMainProviderFcns';
import { ListProps, ListPage } from './ListPage';



export const ListPage_Shopping = (props: ListProps) => {


    const navigate = useNavigate();
    const context = useContext(TodoMainContext)

    // const [selectedItem, setSelectedItem] = useState(undefined);
    const [selectedItemId, setSelectedItemId] = useState("");

    const [edit, setEdit] = useState(false);
    const [addNew, setAddNew] = useState(false);
    const [filterText, setFilterText] = useState("");
    const [hideCompleted, setHideCompleted] = useState(false);
    const [stateHorizontally, setHorizontally] = useState(props.horizontally);


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
            setSelectedItemId(props.selectedItemId ? props.selectedItemId : "");
        }, [props.listid, props.selectedItemId])

    const callbackFilter = (text: string) => {
        setFilterText(text)
    }

    async function selectHandle(id: string) {
        // const currentItem = await getItem(id)
        //     // console.log( "selectHandle : ", id  )
        // console.log( "selectHandle : ", currentItem)
        // setSelectedItemId(id)

        const todoMain = context.findItem(props.listid)


        navigate("/" + ["list", props.listid, todoMain?.render, id].join("/"))

    }


    const callbackSelect = (item: TodoItem | TodoMainItem) => {
        if ('id' in item) {
            setSuccessSnackbarMessage("Uncheck item " + item.name);
            props.uncheckFunction(item.id)
            setSelectedItemId(item.id)
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

            // setSelectedItemId("")
        }

        return filteredItems
    }


    // const filteredTodos = filterCompleted(props.todos, hideCompleted, filterText)
    const filteredTodos = filterCompleted(props.todos, hideCompleted, ""); // ignore filterText here, as we handle it in FilterComponent


    const createLists = (items: TodoItem[]) => {

        let groups: GenericGroup<TodoItem>[] = [];

        if (props.listid === "current") {
            const groups_uniq = findUnique(items, "listid", false)
            groups = groups_uniq.map((el: GenericGroup<TodoItem>) => {
                el.value = "(" + el.value + ") " + getItemGlobalList(props.lists, el.value)?.name
                return el
            }
            )
        }
        else {
            groups = findUnique(items, "group", false)
        }

        return (
            <>
                {groups && (
                    <HorizontallyGrid horizontally={stateHorizontally} >
                        {groups.map((item: GenericGroup<TodoItem>, index: number) => (
                            <HorizontallyItem key={"ListPage" + item.value} horizontally={stateHorizontally} >
                                <MyCard>
                                    <ListQ
                                        key={"ListQ" + item.value}
                                        editList={edit}
                                        header={item.value}
                                        group={item.value}
                                        items={sortArrayBy(item.listitems, "name")}
                                        groups={groups}
                                        addItemHandle={props.addItemHandle}
                                        type={TodoListType.TODO}
                                        selectFunction={selectHandle}
                                        selectedItemId={selectedItemId}
                                        removeItemHandle={props.removeItemHandle}
                                        updateFunction={props.updateFunction}
                                        toggleFunction={props.toggleFunction}
                                    />

                                </MyCard>
                            </HorizontallyItem>

                        ))}

                    </HorizontallyGrid>



                )

                }
            </>

        )
    }

    // onClose={handleClose}

    const currentList = getGlobalList(props.lists, props.listid)

    const removeCurrentMain = () => {
        console.log("removeCurrentMain : ", props.listid)
        removeMainTodoItemById(props.listid)
        navigate("/")
    }

    return (
        <>
            <Snackbar
                open={successSnackbarMessage.length > 0}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                autoHideDuration={2000}
                message="Saved" >
                <Alert onClose={handleClose} severity="success">
                    {successSnackbarMessage}
                </Alert>
            </Snackbar>

            <MyCardBlur>
                <Grid container alignItems="center" justifyContent="flex-start" p={1} >
                    <Grid item md={3} xs={2} >
                        <ListItem >
                            <ListItemAvatar >
                                <Avatar style={{ marginTop: "10px", marginBottom: "10px", backgroundColor: props.color }}><MyIcon icon={currentList?.icon} /></Avatar>
                            </ListItemAvatar>
                            <Hidden mdDown>
                                <ListItemText primary={currentList?.name + ""} secondary={currentList?.group} />
                            </Hidden>
                        </ListItem>
                    </Grid>
                    <Grid item md={8} xs={10} >
                        {props.todos.length === 0 &&
                            <Grid container justifyContent="flex-end">
                                <IconButton color={(props.todos.length === 0) ? "error" : "error"} onClick={removeCurrentMain} >
                                    <MyIcon icon="delete"></MyIcon>
                                </IconButton>
                            </Grid>
                        }

                        {props.todos.length > 5 &&
                            < >
                                <Grid container alignItems="center" justifyContent="flex-start" spacing={2} >
                                    <Grid item xs={8} >
                                        {edit ? (
                                            <AddForm
                                                name=""
                                                renderModal={false}
                                                onClickFunction={props.addItemHandle}
                                                handleDeleteClick={undefined}
                                                type={props.listtype}
                                                groups={mapGenericToStringGroup(findUnique(props.todos, "group", false))} ></AddForm>
                                        ) : (

                                            <FilterComponent
                                                filterText={filterText}
                                                callback={callbackFilter}
                                                callbackSelect={callbackSelect}
                                                callbackNotInOptions={(val) => {
                                                    setFilterText(val);
                                                    setAddNew(true);
                                                }}

                                                options={props.todos}
                                            />
                                        )}
                                    </Grid>
                                    <Grid item xs={4}  >
                                        <Grid container justifyContent="flex-end">

                                            <IconButton color={stateHorizontally ? "primary" : "default"} onClick={() => setHorizontally(!stateHorizontally)} >
                                                <MyIcon icon="text_rotation_none"></MyIcon>
                                            </IconButton>
                                            <IconButton color={hideCompleted ? "primary" : "default"} onClick={() => setHideCompleted(!hideCompleted)} >
                                                <MyIcon icon="visibility" />
                                            </IconButton>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </>
                        }

                    </Grid>
                </Grid>
                <Grid container alignItems="center" justifyContent="flex-start" spacing={2} pb={2} >
                    <Grid item xs={2} md={3} spacing={2}  ></Grid>

                    <Grid item xs={3} spacing={2}  >
                        <Card onClick={() => {
                            setHorizontally(false);
                            setHideCompleted(true);
                        }} sx={{ cursor: "pointer" }} >
                            <ListItem >
                                <ListItemAvatar >
                                    <Avatar style={{ marginTop: "10px", marginBottom: "10px", backgroundColor: props.color }}>
                                        <MyIcon icon="shopping_cart_outlined" />
                                    </Avatar>
                                </ListItemAvatar>
                                <Hidden mdDown>
                                    <ListItemText primary={"Einkaufen"} secondary={currentList?.group} />
                                </Hidden>
                            </ListItem>
                        </Card>
                    </Grid>
                    <Grid item xs={3}  >
                        <Card onClick={() => {
                            setHorizontally(true);
                            setHideCompleted(false);
                        }} sx={{ cursor: "pointer" }} >
                            <ListItem >
                                <ListItemAvatar >
                                    <Avatar style={{ marginTop: "10px", marginBottom: "10px" }}>
                                        <MyIcon icon="checklist" />
                                    </Avatar>
                                </ListItemAvatar>
                                <Hidden mdDown>
                                    <ListItemText primary={"In Liste stöbern"} secondary={currentList?.group} />
                                </Hidden>
                            </ListItem>
                        </Card>
                    </Grid>
                </Grid>
            </MyCardBlur>

            {addNew && (
                <>
                    <Grid container p={2} spacing={2} justifyContent="center">
                        <Grid item xs={11} md={6}  >
                            <MyCardBlur>
                                <CardContent>
                                    <Typography mb={2} variant='subtitle2' >Add new item</Typography>
                                    <AddForm
                                        renderModal={false}
                                        handleDeleteClick={undefined}
                                        name={filterText}
                                        onClickFunction={props.addItemHandle}
                                        type={props.listtype}
                                        groups={mapGenericToStringGroup(findUnique(props.todos, "group", false))} ></AddForm>
                                </CardContent>
                            </MyCardBlur>
                        </Grid>
                    </Grid>

                </>
            )}

            {filteredTodos.length === 0 && (
                <Grid container p={2} spacing={2} justifyContent="center">
                    <Grid item xs={11} md={6}  >
                        <MyCardBlur>
                            <CardContent>
                               <Typography variant='h4' align='center'>🛒 All done!</Typography>
                               <Typography variant='body1' align='center'>No more shopping items on your list.</Typography>
                            </CardContent>
                        </MyCardBlur>
                    </Grid>
                </Grid>

            )}


            <Box p={1} sx={{ display: { sm: 'block', xs: 'none', paddingTop: "1em" } }} >
                <Grid container spacing={2} >
                    <Grid item xs={12}  >
                        {props.todos.length > 0 && <> {createLists(filteredTodos)} </>}
                    </Grid>
                </Grid >
            </Box>

            <Box p={1} sx={{ display: { sm: 'none', xs: 'block' }, position: "relative" }}  >

                <HorizontallyGrid horizontally={true}  >
                    <HorizontallyItem key={"Listsa"} horizontally={true} >
                        <Grid item xs={12}>
                            <div className={"my-container-content"} >
                                {props.todos.length > 0 && <> {createLists(filteredTodos)} </>}
                            </div>
                        </Grid>
                    </HorizontallyItem>

                </HorizontallyGrid>

            </Box>
        </>



    )




}