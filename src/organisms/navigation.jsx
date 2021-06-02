import React, { Component, useState, useEffect } from "react";
// import { Row, Col, List, Button, DatePicker, Card, version } from "antd";
import Settings from "../Settings";
import SingleTimeSerie from "../SingleTimeSerie";

import Amplify, { API, input, Auth, graphqlOperation } from 'aws-amplify';
import { listTodos, getTodos } from '../graphql/queries';

import { Grid, List, ListItem, ListItemIcon, ListItemText, Paper, Box, Switch, MenuItem, Divider } from '@material-ui/core';
import {
    NavLink,
} from "react-router-dom";


import { MyIcon } from "../components/MyIcon";
import StarIcon from '@material-ui/icons/Star';

import { useStyles } from "../Styles"

// { component: "list", id: 0, icon: "share", render: "links" },

const NavHeader = ({ item, render }) => {
    if (render === "simple") {
            return( <></> )
    }
    else {
        return (

            <Grid container
                direction="row"
                justify="flex-start"
                alignItems="center"
                spacing={ 5 } >

                <Grid item xs={ 12 } > <Divider /> </Grid>
                <Grid item xs={ 1 } ></Grid>
                <Grid item xs={ 2 } >
                    Show in NavBar
                </Grid>
                <Grid item xs={ 1 } > Icon </Grid>
                <Grid item xs={ 3 } > Name</Grid>
                <Grid item xs={ 2 } > Component</Grid>
                <Grid item xs={ 1 } > Render</Grid>
                <Grid item xs={ 1 } > Id </Grid>
                <Grid item xs={ 12 } > <Divider /> </Grid>
                
            </Grid>
            )
    }    
}

const NavItem = ({ item, render }) => {

    const classes = useStyles();

    if (render === "simple") {
        return(
        <NavLink className={ classes.title } to={ "/" + [item.component, item.id, item.render].join('/') }   >
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

            <Grid container
                direction="row"
                justify="flex-start"
                alignItems="center"
                spacing={ 5 } >
                <Grid item xs={ 1 } ></Grid>
                <Grid item xs={ 2 } >
                    <Switch
                        checked={ item.navbar }
                        name="checkedA"
                    />
                </Grid>
                <Grid item xs={ 1 } >
                    <NavLink
                        className={ classes.title }
                        to={ "/" + [item.component, item.id, item.render].join('/') }   >
                        <ListItemIcon >
                            <MyIcon icon={ item.icon } />
                        </ListItemIcon>
                    </NavLink>
                </Grid>
                <Grid item xs={ 3 } >{ item.name }</Grid>
                <Grid item xs={ 2 } >{ item.component }</Grid>
                <Grid item xs={ 1 } >{ item.render }</Grid>
                <Grid item xs={ 1 } >{ item.id }</Grid>
            </Grid>)
    }

}

export const MainNavigation = ({ render, userConfig, apikey, navId, username, handleSetConfig }) => {

    const [items, setItems] = useState(userConfig);


    useEffect(
        () => {
            setItems([]);

            if (apikey) {
                // works
                const awsmobile = {
                    "aws_project_region": "eu-central-1",
                    "aws_appsync_graphqlEndpoint": "https://dfmsa6fzibhrrm3byqhancekju.appsync-api.eu-central-1.amazonaws.com/graphql",
                    "aws_appsync_region": "eu-central-1",
                    "aws_appsync_authenticationType": "API_KEY",
                    "aws_appsync_apiKey": apikey
                };
                Amplify.configure(awsmobile);

                const navTodo = fetchNav(navId, "andre")
            }
        }, [apikey, navId]
    )

      //   const config = [
      //     { "component": "list", "id": 0, "icon": "share", "name": "Links", "render": "links", "navbar": true },
      //     { "component": "time", "id": "x", "icon": "timeline", "name": "Timeline", "render": "x", "navbar": true },
      //     { "component": "timetree", "id": "x", "icon": "calendar", "name": "Calendar", "render": "x", "navbar": true },
      //     { "component": "list", "id": 6, "icon": "work", "name": "DHL", "render": "todo", "navbar": false },
      //   ]
      //   setUserConfiguration(config)

    async function fetchNav(id, owner) {
        const _todos = await API.graphql(graphqlOperation(getTodos, { id: id, owner: owner }));
        const item = _todos.data.getTodos

        // console.log("getTodos : ", item);
        // console.log("getNav : ", item.description);
        
        const itemArr = JSON.parse(item.description)
        //console.log("getNav (JSON) : ", itemArr);
        setItems(itemArr);
        handleSetConfig(itemArr)

        return item
    }


    return (
        <>
            <NavHeader render={ render } />
            { items.map((item, index) => (
                <NavItem key={ index } item={ item } render={ render } />
            )) }
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