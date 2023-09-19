import React, { useState, useEffect } from 'react';


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


interface ListProps {
    todos: TodoItem[];
    listtype: TodoListType;
    listid: string;
    selectedItemId?: string;
    horizontally: boolean;
    color: string;
    addItemHandle: (linkname: string, linkUrl: string, groupName: string) => void;
    // getItem: (id:string) => any;
    removeItemHandle: (id: string) => void;
    updateFunction: (input: UpdateTodosInput) => void;
    toggleFunction: (id: string) => void;
    uncheckFunction: (id: string) => void;
    lists: TodoMainItem[];
    username: string;
}

export const ListPage = (props: ListProps) => {

    const navigate = useNavigate();

    // const [selectedItem, setSelectedItem] = useState(undefined);
    const [selectedItemId, setSelectedItemId] = useState("");

    const [edit, setEdit] = useState(false);
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

        navigate( "/" + [ "list", props.listid, "todo", id ].join("/") )

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


    const filteredTodos = filterCompleted(props.todos, hideCompleted, filterText)


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
                                        type={props.listtype}
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

            <MyCardBlur>
            <Grid container alignItems="center" justifyContent="flex-start" >
                  <Grid item md={6} xs={4} >
                                <ListItem>
                                    <ListItemAvatar>
                                        <Avatar style={{ backgroundColor: props.color }}><MyIcon icon={currentList?.icon} /></Avatar>
                                    </ListItemAvatar>
                                    <ListItemText primary={currentList?.name+ ""} secondary={currentList?.group} />
                                </ListItem>
                            </Grid>
                <Grid item md={6} xs={8} >
                        {props.todos.length > 5 &&
                            < >
                                <Grid container alignItems="center" justifyContent="flex-start" spacing={2} >
                                    <Grid item xs={8} lg={9} >
                                        {edit ? (
                                            <AddForm
                                                name=""
                                                renderModal={false}
                                                onClickFunction={props.addItemHandle}
                                                handleDeleteClick={undefined}
                                                type={props.listtype}
                                                groups={mapGenericToStringGroup(findUnique(props.todos, "group", false))} ></AddForm>
                                        ) : (

                                            <FilterComponent filterText={filterText} callback={callbackFilter} callbackEnter={callbackEnter} />
                                        )}
                                    </Grid>
                                    <Grid item xs={4} lg={3} >
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


                        {(filteredTodos.length === 1 && filterText.length > 0) && (
                            <>
                                <Typography variant="h6" component="h6">
                                    {filteredTodos[0].name}
                                </Typography>
                                <Typography variant="inherit" component="b" >
                                    Press Enter to check item
                                </Typography>
                            </>
                        )}
                        {filteredTodos.length === 0 && (
                            <>
                                <ListHeader
                                    header={"Checklist"}
                                    edit={false}
                                    setEditCallback={(e: boolean) => { }} />
                                <ListItem>
                                    <AddForm
                                        renderModal={false}
                                        handleDeleteClick={undefined}
                                        name={filterText}
                                        onClickFunction={props.addItemHandle}
                                        type={props.listtype}
                                        groups={mapGenericToStringGroup(findUnique(props.todos, "group", false))} ></AddForm>
                                </ListItem>
                            </>
                            )}
                    
                </Grid>
            </Grid>
            </MyCardBlur>

            <Box p={1} sx={{ display: { sm: 'block', xs: 'none', paddingTop: "1em" } }} >
                <Grid container spacing={2} alignItems="stretch" >

                    {props.listtype === TodoListType.TODO_SIMPLE ? (
                        <Grid item xs={12}  >
                            {props.todos.length > 0 && <> {createLists(filteredTodos)} </>}
                        </Grid>
                    ) : (
                        <Grid item md={ selectedItemId ? (stateHorizontally ? 8 : 4) : 12}
                            sm={ selectedItemId ? (stateHorizontally ? 6 : 6) : 12}
                            xs={11}  >
                            <div className={"my-container-content"} >
                                {props.todos.length > 0 && <> {createLists(filteredTodos)} </>}
                            </div>
                        </Grid>
                    )
                    }

                    {(selectedItemId) &&
                        <>
                            <Grid item md={stateHorizontally ? 4 : 8} sm={stateHorizontally ? 6 : 6} xs={12} >

                                <div className={"my-container-content"} >
                                    <DetailsById
                                        itemid={selectedItemId}
                                        updateFunction={props.updateFunction}
                                        lists={props.lists}
                                        listtype={props.listtype}
                                        action={
                                            <IconButton onClick={() => { setSelectedItemId("") }} aria-label="open">
                                                <MyIcon icon="close" />
                                            </IconButton>
                                        }
                                        username={props.username}
                                    />

                                </div>
                                <div>Scroll position is ({scrollX}, {scrollY})</div>
                            </Grid>
                        </>
                    }
                </Grid >
            </Box>
            
            <Box p={1} sx={{ display: { sm: 'none', xs: 'block' }, position: "relative" }}  >

                <HorizontallyGrid horizontally={true}  >
                    <HorizontallyItem key={"Lists"} horizontally={true} >
                        <Grid item xs={12}>
                            <div className={"my-container-content"} >
                                {props.todos.length > 0 && <> {createLists(filteredTodos)} </>}
                            </div>
                        </Grid>
                    </HorizontallyItem>
                    <HorizontallyItem key={"Lists"} horizontally={true} >
                        {(selectedItemId) &&
                            <>
                                <Grid item xs={12} >

                                    <div className={"my-container-content details-xs"} style={{ position: "relative" }} >
                                        <DetailsById
                                            itemid={selectedItemId}
                                            updateFunction={props.updateFunction}
                                            lists={props.lists}
                                            listtype={props.listtype}
                                            action={<></>}
                                            username={props.username}
                                        />

                                    </div>
                                    <div>Scroll position is ({scrollX}, {scrollY})</div>
                                </Grid>
                            </>
                        }
                    </HorizontallyItem>
                </HorizontallyGrid>

            </Box>

        </>
    )

} 