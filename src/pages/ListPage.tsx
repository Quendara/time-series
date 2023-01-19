import React, { useState, useEffect } from 'react';


import { Grid, CardContent, Typography, List, ListItem, Snackbar, Alert, IconButton } from '@mui/material';

import { FilterComponent } from '../components/FilterComponent';

import { MyCard, MyPaperHeader } from "../components/StyledComponents"

import { ListHeader, ListQ } from '../components/List';
import { AddForm } from '../components/AddForm';
import { DetailsById } from '../components/Details';

import { findUnique, GenericGroup, mapGenericToStringGroup, sortArrayBy } from "../components/helpers";

import { TodoItem, TodoMainItem } from '../models/TodoItems';
import { useWindowScrollPositions } from '../hooks/useWindowScrollPositions'
// import { UpdateFunc } from "../models/Definitions"
// import { GroupItem } from "../models/Definitions"

import { UpdateTodosInput } from "../API"
import { TodoListType } from "../components/List"
import { HorizontallyGrid, HorizontallyItem } from "../components/HorizontallyGrid"
import { MyIcon } from '../components/MyIcon';



interface ListProps {
    todos: TodoItem[];
    listtype: TodoListType;
    listid: string;
    selectedItemId?: string;
    horizontally: boolean;
    addItemHandle: ( linkname:string, linkUrl:string, groupName:string) => void;
    // getItem: (id:string) => any;
    removeItemHandle: (id: string) => void;
    updateFunction: (input: UpdateTodosInput) => void;
    toggleFunction: (id: string) => void;
    uncheckFunction: (id: string) => void;
    lists: TodoMainItem[];
    username: string;

}

export const ListPage = ( props: ListProps ) => {

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
            setSelectedItemId( props.selectedItemId?props.selectedItemId:"" );
        }, [props.listid, props.selectedItemId ])

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
                { groups && (

                    <HorizontallyGrid horizontally={stateHorizontally} >
                        {groups.map((item: GenericGroup<TodoItem>, index: number) => (                            
                            <HorizontallyItem key={"ListPage"+item.value} horizontally={stateHorizontally} >
                                <MyCard>
                                    <ListQ
                                        key={"ListQ"+item.value}
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

            <Grid container spacing={4} >
                <Grid item lg={12} xs={12} >
                    <MyCard>
                        {props.todos.length > 5 &&
                            <MyPaperHeader >
                                <List>
                                    <ListItem>
                                        <Grid container alignItems="center" justifyContent="flex-start" spacing={2} >

                                            <Grid item xs={10} lg={8} >
                                                {edit ? (
                                                    <AddForm
                                                        name=""
                                                        renderModal={false}
                                                        onClickFunction={props.addItemHandle}
                                                        handleDeleteClick={undefined}
                                                        type={props.listtype}
                                                        groups={ mapGenericToStringGroup( findUnique(props.todos, "group", false)) } ></AddForm>
                                                ) : (

                                                    <FilterComponent filterText={filterText} callback={callbackFilter} callbackEnter={callbackEnter} />
                                                )}
                                            </Grid>
                                            <Grid item xs={2} lg={4} >
                                                <Grid container justifyContent="flex-end">

                                                    {/* <IconButton color={edit ? "primary" : "default"} onClick={() => setEdit(!edit)} >
                                                            <EditIcon />
                                                        </IconButton> */}
                                                    <IconButton color={stateHorizontally ? "primary" : "default"} onClick={() => setHorizontally(!stateHorizontally)} >
                                                        
                                                        <MyIcon icon="text_rotation_none"></MyIcon>
                                                    </IconButton>
                                                    <IconButton color={hideCompleted ? "primary" : "default"} onClick={() => setHideCompleted(!hideCompleted)} >
                                                        <MyIcon icon="visibility" />
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
                                        onClickFunction={props.addItemHandle}
                                        type={props.listtype}
                                        groups={ mapGenericToStringGroup(findUnique(props.todos, "group", false) ) } ></AddForm>
                                </ListItem>
                            </MyCard>)}
                    </MyCard>
                </Grid>

                {props.listtype === TodoListType.TODO_SIMPLE ? (
                    <Grid item xs={12}  >
                        {props.todos.length > 0 && <> {createLists(filteredTodos)} </>}
                    </Grid>
                ) : (
                    <Grid item md={stateHorizontally ? 12 : 4} sm={stateHorizontally ? 12 : 6} xs={12}  >
                        <div className={"my-container-content"} >
                            {props.todos.length > 0 && <> {createLists(filteredTodos)} </>}
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
                                    updateFunction={props.updateFunction}
                                    lists={props.lists}
                                    listtype={props.listtype}
                                    username={props.username}
                                    />
                                
                            </div>
                            <div>Scroll position is ({scrollX}, {scrollY})</div>
                        </Grid>
                    </>
                }
            </Grid >
        </>
    )

} 