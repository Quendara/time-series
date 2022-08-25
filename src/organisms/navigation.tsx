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

import { findUnique, GenericGroup, sortArrayBy } from "../components/helpers";

import { MyIcon } from "../components/MyIcon";
import { TextEdit } from "../components/TextEdit";
import { HorizontallyGrid, HorizontallyItem } from "../components/HorizontallyGrid"


import { reducerTodoMain } from "../reducer/reducerTodoMain"
import { ToggleItem, UpdateItem, AddItem } from "../reducer/dispatchFunctionsMainTodos"

import { TodoItem, TodoMainItem } from "../models/TodoItems"
import { UpdateTodoMainInput, CreateTodoMainInput } from "../API"
// import { GroupItem } from "../models/Definitions"

import { useStyles } from "../Styles"
import { MyCard, MyCardHeader, MySubCardHeader } from "../components/StyledComponents";


interface NavItemProps {
    item: TodoMainItem;
    dispatch: any; // @todo
    render: string;
    color: string;
}

const NavItem = ({ item, dispatch, render, color }: NavItemProps) => {

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

    const bull = <span style={{ "margin": "5px" }}>•</span>;


    if (render === "simple") {
        return (
            <NavLink className={classes.title} to={"/" + [item.component, item.listid, item.render].join('/')}   >
                <MenuItem>
                    <ListItemIcon style={{ color: color }} >
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
                            className={classes.title}
                            to={"/" + [item.component, item.listid, item.render].join('/')}   >

                            <IconButton edge="end" aria-label="delete">
                                <MyIcon icon="launch" />
                            </IconButton>
                        </NavLink>
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
                    {sortArrayBy(todos, "name").map((item: TodoMainItem, index: number) => (
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

    useEffect(
        () => {
            if (items !== undefined) {
                props.handleSetConfig(items)
            }

        }, [items])

    const groups: GenericGroup<TodoMainItem>[] = findUnique(items, "group", false)

    const colorArr = [
        "rgb(144, 202, 249)",
        "rgb(206, 147, 216)",
        "rgb(255, 167, 38)"
    ]

    return (
        <>

            {items !== undefined &&

                <HorizontallyGrid horizontally={props.horizontally} groups={groups} >

                    {groups.map((item: GenericGroup<TodoMainItem>, index: number) => (
                        <HorizontallyItem horizontally={ props.horizontally } >
                            { props.horizontally ?
                            ( <MyCard>
                                <NavItemList 
                                    key={"sfdfsd" + index}
                                    groupname={item.value}
                                    items={item.listitems}
                                    render={props.render}
                                    username={props.username}
                                    color={colorArr[index % (colorArr.length)]}
                                    />
                                    </MyCard>
                            ) : (
                                <NavItemList 
                                    key={"sfdfsd" + index}
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