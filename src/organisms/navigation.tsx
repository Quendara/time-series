import React, { useState, useEffect, useReducer } from "react";
// import { Row, Col, List, Button, DatePicker, Card, version } from "antd";
// import Settings from "../Settings";
// import SingleTimeSerie from "../SingleTimeSerie";

// import Amplify, { API, input, Auth, graphqlOperation } from 'aws-amplify';
// import { listTodos, getTodos } from '../graphql/queries';


import { Grid, List, ListItem, ListItemIcon, ListItemText, MenuItem, CardContent, Icon, ListItemButton, CardHeader } from '@mui/material';
import { Avatar, ListItemAvatar, IconButton, ListItemSecondaryAction, Tooltip } from '@mui/material';

import {
    NavLink,
} from "react-router-dom";

import { useGetMainTodos } from '../hooks/useGetMainTodo';

import { findUnique, GenericGroup, sortArrayBy } from "../components/helpers";

import { MyIcon } from "../components/MyIcon";
import { TextEdit } from "../components/TextEdit";
import { HorizontallyGrid, HorizontallyItem } from "../components/HorizontallyGrid"


import { reducerTodoMain } from "../reducer/reducerTodoMain"
import { ToggleItem, UpdateItem, AddItem } from "../reducer/dispatchFunctionsMainTodos"

import { createEmptyTodoMainItem, TodoItem, TodoMainItem } from "../models/TodoItems"
import { UpdateTodoMainInput, CreateTodoMainInput } from "../API"
// import { GroupItem } from "../models/Definitions"

import { MyCard, MyCardHeader } from "../components/StyledComponents";
import { FilterComponent } from "../components/FilterComponent";
import { getTodosByGroupName, getTodosByName } from "../components/GraphQlFunctions";

import { cssClasses } from "../Styles"
import { SearchResponse } from "./SearchResponse";

import { bull } from "../components/helpers"

interface NavItemProps {
    item: TodoMainItem;
    dispatch: any; // @todo
    render: string;
    color: string;
}



const NavItem = ({ item, dispatch, render, color }: NavItemProps) => {

    const handleComplete = () => {
        // dispatch({ type: "COMPLETE", id: item.id });
        dispatch(ToggleItem(item.id))
    };

    const handleEditName = (name: string) => {
        // dispatch({ type: "COMPLETE", id: item.id });
        // dispatch(UpdateItem(item.id, name)) 
        let element: UpdateTodoMainInput
        element = {
            id: item.id,
            name: name
        }

        dispatch(UpdateItem(element))

    };

    const handleEditGroup = (group: string) => {
        // dispatch({ type: "COMPLETE", id: item.id });
        let element: UpdateTodoMainInput
        element = {
            id: item.id,
            group: group
        }

        dispatch(UpdateItem(element))
    };

    const handleEditIcon = (icon: string) => {
        // dispatch({ type: "COMPLETE", id: item.id });
        let element: UpdateTodoMainInput
        element = {
            id: item.id,
            icon: icon
        }
        dispatch(UpdateItem(element))
    };




    if (render === "simple") {
        return (
            <NavLink to={"/" + [item.component, item.listid, item.render].join('/')}   >
                <MenuItem>
                    <ListItemAvatar >
                        <Avatar onClick={handleComplete} style={item.navbar ? { backgroundColor: color } : {}} >
                            <Icon sx={cssClasses.menuButton} >{item.icon} </Icon>
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                        sx={{ color: color, textDecoration: "none" }}
                        primary={item.name}
                    ></ListItemText>
                </MenuItem>
            </NavLink>)
    }
    else {
        return (
            <ListItemButton>

                <ListItemAvatar >
                    <Avatar onClick={handleComplete} style={item.navbar ? { backgroundColor: color } : {}} >
                        <MyIcon icon={item.icon} />
                    </Avatar>
                </ListItemAvatar>
                <ListItemText primary={
                    <TextEdit value={item.name} label="Name" callback={handleEditName} />
                }
                    secondary={<>

                        <TextEdit value={item.group ? item.group : "keine"} label="Group" callback={handleEditGroup} />
                        {bull}
                        <TextEdit value={item.icon ? item.icon : "keine"} label="Icon" callback={handleEditIcon} />
                        {bull}
                        {item.render}
                    </>} />
                <ListItemSecondaryAction>
                    <Tooltip title="Open" aria-label="add">
                        <NavLink
                            to={"/" + [item.component, item.listid, item.render].join('/')}   >
                            <IconButton edge="end" aria-label="delete">
                                <MyIcon icon="launch" />
                            </IconButton>
                        </NavLink>
                    </Tooltip>
                </ListItemSecondaryAction>
            </ListItemButton>

        )
    }
}


interface NavItemListProps {
    items: TodoMainItem[];
    render: string;
    groupname: string;
    username: string;
    color: string;
}

const NavItemList = ({ items, render, groupname, username, color }: NavItemListProps) => {

    const [todos, dispatch] = useReducer(reducerTodoMain, items);

    const handleEditIcon = () => {
        // dispatch({ type: "COMPLETE", id: item.id });
        const id = "" + new Date().getTime();

        let element: CreateTodoMainInput = {
            id: id,
            component: "list",
            render: "todo",
            icon: "chat",
            listid: "_" + id,
            name: "New List",
            group: groupname,
            owner: username,
            navbar: false
        }
        dispatch(AddItem(element))
    };


    return (<>
        {todos !== undefined &&
            <>
                <MyCardHeader title={groupname}
                    avatar={
                        <Avatar style={{ backgroundColor: color }} >
                            <MyIcon icon="star" />
                        </Avatar>
                    }

                    action={
                        <IconButton onClick={handleEditIcon} >
                            <MyIcon icon="add" />
                        </IconButton>
                    }
                >

                </MyCardHeader>
                <List>
                    {sortArrayBy(items, "name").map((item: TodoMainItem, index: number) => (
                        <NavItem key={index} item={item} render={render} dispatch={dispatch} color={color} />
                    ))}
                </List>
            </>
        }
    </>
    )

}

interface MainNavigationProps {
    handleSetConfig: (items: TodoMainItem[]) => void;
    render: string;
    username: string;
    horizontally: boolean;
}



export const MainNavigation = (props: MainNavigationProps) => {

    // const [items, setItems] = useState(userConfig);
    const items = useGetMainTodos(props.username)

    const [filterText, setFilterText] = useState("");

    const [todos, setTodos] = useState<TodoItem[]>([]);

    const callbackFilter = (text: string) => {
        setFilterText(text)
    }

    const callbackEnter = () => {

        // getTodosByGroupName 

        if (filterText.length > 2) {
            getTodosByName(filterText).then(
                (todos) => {
                    console.log(todos)
                    setTodos(todos)
                } // 
            )
        }

        console.log("callbackEnter : ", todos)
    }





    const filterCompleted = (items: TodoMainItem[], filterText: string) => {

        let filteredItems = items

        const FILTER = filterText.toUpperCase()

        if (filterText.length !== 0) {
            filteredItems = filteredItems.filter(item => {
                const currentItem = item.name.toUpperCase()
                return (currentItem.indexOf(FILTER) !== -1)
            })
        }

        return filteredItems
    }


    useEffect(
        () => {
            if (items !== undefined) {
                props.handleSetConfig(items)
            }

            console.log("MainNavigation (items updated) ", items.length)

        }, [items])


    const filteredItems = filterCompleted(items, filterText)
    const groups: GenericGroup<TodoMainItem>[] = findUnique(filteredItems, "group", false)

    const colorArr = [
        "rgb(144, 202, 249)",
        "rgb(206, 147, 216)",
        "rgb(255, 167, 38)"
    ]

    return (
        <>

            <Grid container alignItems="center" justifyContent="center" spacing={2} >
                <Grid item xs={10} lg={8} >
                    <MyCard>
                        <CardContent>
                            <FilterComponent filterText={filterText} callback={callbackFilter} callbackEnter={callbackEnter} />
                        </CardContent>
                    </MyCard>
                    <br />

                </Grid>
            </Grid>

            {(items !== undefined && groups.length > 0) &&

                <HorizontallyGrid horizontally={props.horizontally} >
                    {groups.map((item: GenericGroup<TodoMainItem>, index: number) => (
                        <HorizontallyItem key={"MainNavTop" + index} horizontally={props.horizontally} >
                            {props.horizontally ?
                                (<MyCard>
                                    <NavItemList
                                        key={"MainNav" + index}
                                        groupname={item.value}
                                        items={item.listitems}
                                        render={props.render}
                                        username={props.username}
                                        color={colorArr[index % (colorArr.length)]}
                                    />
                                </MyCard>
                                ) : (
                                    <NavItemList
                                        key={"MainNav" + index}
                                        groupname={item.value}
                                        items={item.listitems}
                                        render={props.render}
                                        username={props.username}
                                        color={colorArr[index % (colorArr.length)]}
                                    />
                                )}
                        </HorizontallyItem>
                    ))}
                </HorizontallyGrid>
            }

            <Grid container alignItems="center" justifyContent="center" spacing={2} >
                <Grid item xs={10} lg={8} >
                    {( groups.length === 0 && todos.length === 0 ) && (
                        <MyCard>
                            <CardHeader subheader="Press Enter to start search ... " />
                        </MyCard>
                    )}
                </Grid>
                <Grid item xs={10} lg={8} >
                    <SearchResponse mainTodos={items} searchResponse={todos} />
                </Grid>
            </Grid>

        </>
    )
}
