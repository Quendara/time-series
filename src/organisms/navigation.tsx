import React, { Component, useState, useEffect, useReducer } from "react";
// import { Row, Col, List, Button, DatePicker, Card, version } from "antd";
// import Settings from "../Settings";
// import SingleTimeSerie from "../SingleTimeSerie";

// import Amplify, { API, input, Auth, graphqlOperation } from 'aws-amplify';
// import { listTodos, getTodos } from '../graphql/queries';

import { useGetMainTodos } from '../hooks/useGetMainTodo';

import { findUnique, restCallToBackendAsync } from "../components/helper";

import { Grid, List, ListItem, ListItemIcon, ListItemText, Paper, Box, Switch, MenuItem, Divider } from '@material-ui/core';
import { Avatar, ListItemAvatar, IconButton, ListItemSecondaryAction, Tooltip } from '@material-ui/core';

import {
    NavLink,
} from "react-router-dom";


import { MyIcon } from "../components/MyIcon";
import { GroupItem } from "../components/Definitions"

import { TextEdit } from "../components/TextEdit";
import StarIcon from '@material-ui/icons/Star';

import { reducerTodoMain } from "../reducer/reducerTodoMain"
import { ToggleItem, UpdateItem } from "../reducer/dispatchFunctionsMainTodos"

import { TodoMainItem, TodoMainItemUpdate } from "../components/TodoItems"

import { useStyles } from "../Styles"

interface NavItemProps {
    item : TodoMainItem;
    dispatch : string;
    render : string;
}

const NavItem = ({ item, dispatch, render } : NavItemProps) => {

    const classes = useStyles();

    const handleComplete = () => { 
        // dispatch({ type: "COMPLETE", id: item.id });
        dispatch(ToggleItem(item.id))
    }; 

    const handleEditName = (name: string) => {
        // dispatch({ type: "COMPLETE", id: item.id });
        // dispatch(UpdateItem(item.id, name)) 
        let element : TodoMainItem
        element = {
            id: item.id,
            name: name
        }        

        dispatch(UpdateItem( element )) 
        
    };

    const handleEditGroup = (group: string) => {
        // dispatch({ type: "COMPLETE", id: item.id });
        let element : TodoMainItem
        element = {
            id: item.id,
            group: group
        }        

        dispatch(UpdateItem( element )) 
    };    

    if (render === "simple") {
        return (
            <NavLink className={ classes.title } to={ "/" + [item.component, item.listid, item.render].join('/') }   >
                <MenuItem>
                    <ListItemIcon>
                        <MyIcon icon={ item.icon } />
                    </ListItemIcon>
                    <ListItemText
                        primary={ item.name }
                    ></ListItemText>
                </MenuItem>
            </NavLink>)
    }
    else {
        return (
            <ListItem>
                <ListItemAvatar color="primary">
                    <NavLink
                        className={ classes.title }
                        to={ "/" + [item.component, item.listid, item.render].join('/') }   >

                        <Avatar >
                            <MyIcon icon={ item.icon } />
                        </Avatar>
                    </NavLink>
                </ListItemAvatar>
                <ListItemText primary={                    
                    <TextEdit value={ item.name } callback={ handleEditName } /> 
                }
                    secondary={ <>
                    <TextEdit value={ item.group ? item.group : "keine" } callback={ handleEditGroup } />
                    { [item.listid, item.render].join(" - ") }
                    </> } />
                <ListItemSecondaryAction>
                    <Tooltip title="Show in navbar" aria-label="add">
                        <IconButton onClick={ handleComplete } edge="end" aria-label="delete">
                            <MyIcon icon={ item.navbar ? "check" : "remove" } />
                        </IconButton>
                    </Tooltip>
                </ListItemSecondaryAction>
            </ListItem>

        )
    }
}


interface NavItemListProps {
    items : TodoMainItem[];
    render : string;
    groupname : string;
}

const NavItemList = ({ items, render, groupname } : NavItemListProps) => {
    const [todos, dispatch] = useReducer(reducerTodoMain, items);

    return (<>
        { todos !== undefined &&
            <List>
                <ListItem>{ groupname } </ListItem>
                
                { todos.map((item, index) => (
                    <NavItem key={ index } item={ item } render={ render } dispatch={ dispatch } />
                )) }
            </List> }
    </>
    )

}

interface MainNavigationProps {
    handleSetConfig : any;
    render : string;
    username : string;
}



export const MainNavigation = ({ render, username, handleSetConfig } : MainNavigationProps ) => {

    // const [items, setItems] = useState(userConfig);
    const items = useGetMainTodos(username)

    useEffect(
        () => {
            if (items !== undefined) {
                handleSetConfig(items)
            }

        }, [items])

    const groups = findUnique(items, "group", false)


    // { groups.map((item: GroupItem, index: number) => (
    return (
        <>

            { items !== undefined &&
                <>
                    
                    { groups.map((item, index ) => (
                        <NavItemList key={ "sfdfsd"+index } groupname = {item.value} items={ item.listitems } render={ render } />

                    ) )}
                </> }
        </>
    )
}


export const Navigation = ({ list, anchor, name }) => {

    const classes = useStyles();

    const jumpTo = (anchor) => {
        window.location.href = "#" + anchor;
        setAnchor(anchor)
    }

    const [curAnchor, setAnchor] = useState("");

    return (
        <List>
            { list.map((item, index) => (
                <ListItem button onClick={ () => jumpTo(item[anchor]) } key={ item[anchor] } >
                    <Box color={ item[anchor] === curAnchor ? "text.primary" : "text.secondary" } >
                        { item[name] }
                    </Box>
                </ListItem>
            )) }
        </List>
    )
}