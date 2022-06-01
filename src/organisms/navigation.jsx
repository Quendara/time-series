import React, { Component, useState, useEffect, useReducer } from "react";
// import { Row, Col, List, Button, DatePicker, Card, version } from "antd";
import Settings from "../Settings";
import SingleTimeSerie from "../SingleTimeSerie";

import Amplify, { API, input, Auth, graphqlOperation } from 'aws-amplify';
import { listTodos, getTodos } from '../graphql/queries';

import { useGetMainTodos } from '../hooks/useGetMainTodo';

import { Grid, List, ListItem, ListItemIcon, ListItemText, Paper, Box, Switch, MenuItem, Divider } from '@material-ui/core';
import { Avatar, ListItemAvatar, IconButton, ListItemSecondaryAction } from '@material-ui/core';

import {
    NavLink,
} from "react-router-dom";


import { MyIcon } from "../components/MyIcon";

import { TextEdit } from "../components/TextEdit";
import StarIcon from '@material-ui/icons/Star';

import { reducerTodoMain } from  "../reducer/reducerTodoMain"
import { ToggleItem, UpdateItem } from  "../reducer/dispatchFunctionsMainTodos"


import { useStyles } from "../Styles"

// { component: "list", id: 0, icon: "share", render: "links" },

const NavHeader = ({ item, render }) => {
    if (render === "simple") {
        return (<></>)
    }
    else {
        return (

            <Grid container
                direction="row"
                justify="space-between"
                alignItems="center"
                spacing={ 5 }
                style={ { "padding": "15px" } } >

                <Grid item xs={ 2 } > Element </Grid>
                <Grid item xs={ 2 } > Show in Navbar </Grid>
                <Grid item xs={ 12 } > <Divider /> </Grid>

            </Grid>
        )
    }
}

const NavItem = ({ item, dispatch, render }) => {

    const classes = useStyles();

    const handleComplete = () => {
        // dispatch({ type: "COMPLETE", id: item.id });
        dispatch( ToggleItem( item.id ) )
    };

    const handleEditName = ( name : string ) => {
        // dispatch({ type: "COMPLETE", id: item.id });
        dispatch( UpdateItem( item.id, name ) )
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
            </NavLink> )
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
                    secondary={ [item.listid, item.render].join(" - ") } />
                <ListItemSecondaryAction>
                    <IconButton onClick={ handleComplete } edge="end" aria-label="delete">
                        <MyIcon icon={ item.navbar ? "check" : "remove" } />
                    </IconButton>
                </ListItemSecondaryAction>
            </ListItem>

        )
    }
}




const NavItems = ({ items, render }) => {
    const [todos, dispatch] = useReducer(reducerTodoMain, items);

    return (<>
        <NavHeader render={ render } />
        { todos !== undefined &&
            <List>
                { todos.map((item, index) => (
                    <NavItem key={ index } item={ item } render={ render } dispatch={ dispatch } />
                )) }
            </List> }
    </>
    )

}



export const MainNavigation = ({ render, username, handleSetConfig }) => {

    // const [items, setItems] = useState(userConfig);
    const items = useGetMainTodos(username)

    useEffect(
        () => {
            if (items !== undefined) {
                handleSetConfig(items)
            }

        }, [items])


    return (
        <>
            { items !== undefined && <NavItems items={ items } render={ render } /> }
        </>
    )
}


// (
//     <Paper elevation={ 3 } >
//         <MyCard>
//             <MyCardHeader >


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