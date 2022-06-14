import React, { Component, useState, useEffect, useReducer } from "react";
// import { Row, Col, List, Button, DatePicker, Card, version } from "antd";
// import Settings from "../Settings";
// import SingleTimeSerie from "../SingleTimeSerie";

// import Amplify, { API, input, Auth, graphqlOperation } from 'aws-amplify';
// import { listTodos, getTodos } from '../graphql/queries';


import { Grid, List, ListItem, ListItemIcon, ListItemText, Paper, Box, Switch, MenuItem, Divider, Button } from '@material-ui/core';
import { Avatar, ListItemAvatar, IconButton, ListItemSecondaryAction, Tooltip } from '@material-ui/core';

import {
    NavLink,
} from "react-router-dom";

import { useGetMainTodos } from '../hooks/useGetMainTodo';

import { findUnique, GenericGroup } from "../components/helpers";

import { MyIcon } from "../components/MyIcon";
import { TextEdit } from "../components/TextEdit";
import StarIcon from '@material-ui/icons/Star';

import { reducerTodoMain } from "../reducer/reducerTodoMain"
import { ToggleItem, UpdateItem, AddItem } from "../reducer/dispatchFunctionsMainTodos"

import { TodoItem, TodoMainItem } from "../models/TodoItems"
import { UpdateTodoMainInput, CreateTodoMainInput } from "../API"
// import { GroupItem } from "../models/Definitions"

import { useStyles } from "../Styles"


interface NavItemProps {
    item: TodoMainItem;
    dispatch: any; // @todo
    render: string;
}

const NavItem = ({ item, dispatch, render }: NavItemProps) => {

    const classes = useStyles();

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
            // component: 
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

    const bull = <span style={{"margin":"5px"}}>•</span>;


    if (render === "simple") {
        return (
            <NavLink className={classes.title} to={"/" + [item.component, item.listid, item.render].join('/')}   >
                <MenuItem>
                    <ListItemIcon>
                        <MyIcon icon={item.icon} />
                    </ListItemIcon>
                    <ListItemText
                        primary={item.name}
                    ></ListItemText>
                </MenuItem>
            </NavLink>)
    }
    else {
        return (
            <ListItem>
                <ListItemAvatar >
                    <NavLink
                        className={classes.title}
                        to={"/" + [item.component, item.listid, item.render].join('/')}   >

                        <Avatar >
                            <MyIcon icon={item.icon} />
                        </Avatar>
                    </NavLink>
                </ListItemAvatar>
                <ListItemText primary={
                    <TextEdit value={item.name} callback={handleEditName} />
                }
                    secondary={<>

                        <TextEdit value={item.group ? item.group : "keine"} label="group" callback={handleEditGroup} />
                        {bull}
                        <TextEdit value={item.icon ? item.icon : "keine"} label="icon" callback={handleEditIcon} />
                        {bull}
                        { item.render }
                    </>} />
                <ListItemSecondaryAction>
                    <Tooltip title="Show in navbar" aria-label="add">
                        <IconButton onClick={handleComplete} edge="end" aria-label="delete">
                            <MyIcon icon={item.navbar ? "check" : "remove"} />
                        </IconButton>
                    </Tooltip>
                </ListItemSecondaryAction>
            </ListItem>

        )
    }
}


interface NavItemListProps {
    items: TodoMainItem[];
    render: string;
    groupname: string;
}

const NavItemList = ({ items, render, groupname }: NavItemListProps) => {
    
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
            owner: "andre",
            navbar: false
        }
        dispatch(AddItem(element))
    };


    return (<>
        {todos !== undefined &&
            <List>
                <ListItem>{groupname}
                    <Button onClick={handleEditIcon}  >+</Button>
                </ListItem>

                {todos.map((item: TodoMainItem, index: number) => (
                    <NavItem key={index} item={item} render={render} dispatch={dispatch} />
                ))}
            </List>}
    </>
    )

}

interface MainNavigationProps {
    handleSetConfig: any;
    render: string;
    username: string;
}



export const MainNavigation = ({ render, username, handleSetConfig }: MainNavigationProps) => {

    // const [items, setItems] = useState(userConfig);
    const items = useGetMainTodos(username)

    useEffect(
        () => {
            if (items !== undefined) {
                handleSetConfig(items)
            }

        }, [items])

    const groups: GenericGroup<TodoMainItem>[] = findUnique(items, "group", false)

    return (
        <>

            {items !== undefined &&
                <>


                    {groups.map((item: GenericGroup<TodoMainItem>, index: number) => (
                        <NavItemList key={"sfdfsd" + index} groupname={item.value} items={item.listitems} render={render} />

                    ))}
                </>}
        </>
    )
}

// interface NavigationProps {
//     list : TodoMainItem[];
//     anchor : string;
//     name : string;
// }

// export const Navigation = ({ list, anchor, name } : NavigationProps ) => {

//     const classes = useStyles();

//     const jumpTo = (anchor : string ) => {
//         window.location.href = "#" + anchor;
//         setAnchor(anchor)
//     }

//     const [curAnchor, setAnchor] = useState("");

//     return (
//         <List>
//             { list.map((item : TodoMainItem, index) => (
//                 <ListItem button onClick={ () => jumpTo(item[anchor]) } key={ item[anchor] } >
//                     <Box color={ item[anchor] === curAnchor ? "text.primary" : "text.secondary" } >
//                         { item[name] }
//                     </Box>
//                 </ListItem>
//             )) }
//         </List>
//     )
// }