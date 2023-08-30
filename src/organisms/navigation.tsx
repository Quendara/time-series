import React, { useState, useEffect, useReducer } from "react";
import { Grid, List, ListItem, ListItemIcon, ListItemText, MenuItem, CardContent, Icon, ListItemButton, CardHeader, Divider, Menu, Box, useMediaQuery, useTheme } from '@mui/material';
import { Avatar, ListItemAvatar, IconButton, ListItemSecondaryAction, Tooltip } from '@mui/material';

import {
    NavLink, useNavigate,
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

import { MyCard, MyCardBlur, MyCardHeader } from "../components/StyledComponents";
import { FilterComponent } from "../components/FilterComponent";
import { getTodosByGroupName, getTodosByName } from "../components/GraphQlFunctions";

import { cssClasses } from "../Styles"
import { SearchResponse } from "./SearchResponse";

import { bull } from "../components/helpers"
import { Calendar } from "../components/Calendar";

type RenderMode = "navlink" | "main";

interface NavItemProps {
    item: TodoMainItem;
    dispatch: any; // @todo
    render: RenderMode
    color: string;
    handleClose: () => void;
}

const NavItem = (props: NavItemProps) => {

    const navigate = useNavigate();

    const handleComplete = () => {
        // dispatch({ type: "COMPLETE", id: item.id });
        props.dispatch(ToggleItem(props.item.id))
    };

    const handleEditName = (name: string) => {
        // dispatch({ type: "COMPLETE", id: item.id });
        // dispatch(UpdateItem(item.id, name)) 
        let element: UpdateTodoMainInput
        element = {
            id: props.item.id,
            name: name
        }
        props.dispatch(UpdateItem(element))
    };

    const handleEditGroup = (group: string) => {
        // dispatch({ type: "COMPLETE", id: item.id });
        let element: UpdateTodoMainInput
        element = {
            id: props.item.id,
            group: group
        }

        props.dispatch(UpdateItem(element))
    };

    const handleEditIcon = (icon: string) => {
        // dispatch({ type: "COMPLETE", id: item.id });
        let element: UpdateTodoMainInput
        element = {
            id: props.item.id,
            icon: icon
        }
        props.dispatch(UpdateItem(element))
    };

    // if (render === "navlink") {
    //     return (
    //         <NavLink to={"/" + [item.component, item.listid, item.render].join('/')}   >
    //             <MenuItem>
    //                 <ListItemAvatar >
    //                     <Avatar onClick={handleComplete} style={item.navbar ? { backgroundColor: color } : {}} >
    //                         <Icon sx={cssClasses.menuButton} >{item.icon} </Icon>
    //                     </Avatar>
    //                 </ListItemAvatar>
    //                 <ListItemText
    //                     sx={{ color: color, textDecoration: "none" }}
    //                     primary={item.name}
    //                 ></ListItemText>
    //             </MenuItem>
    //         </NavLink>)
    // }
    // else {


    const handleClick = () => {
        const linkUrl = "/" + [props.item.component, props.item.listid, props.item.render].join('/')
        props.handleClose();
        navigate(linkUrl)

    }

    return (
        <ListItemButton sx={{ minWidth: "300px" }} >

            <ListItemAvatar onClick={handleClick}>
                <Avatar style={props.item.navbar ? { backgroundColor: props.color } : {}} >
                    <MyIcon icon={props.item.icon} />
                </Avatar>
            </ListItemAvatar>


            {props.render === "navlink" ? (
                <ListItemText
                    onClick={handleClick}
                    primary={props.item.name}
                    secondary={"Group : " + props.item.group ? props.item.group : "keine"}
                />
            ) : (
                <ListItemText
                    primary={<TextEdit value={props.item.name} label="Name" callback={handleEditName} />}
                    secondary={<>
                        <TextEdit value={props.item.group ? props.item.group : "keine"} label="Group" callback={handleEditGroup} />
                        {bull}
                        <TextEdit value={props.item.icon ? props.item.icon : "keine"} label="Icon" callback={handleEditIcon} />
                        {bull}
                        {props.item.render}
                    </>} />
            )}
            <ListItemSecondaryAction>
                <Tooltip title="Favorite" aria-label="add">

                    <IconButton onClick={handleComplete} edge="end" aria-label="delete">
                        <MyIcon icon={props.item.navbar ? "favorite" : "favorite_border"} />
                    </IconButton>

                </Tooltip>
            </ListItemSecondaryAction>
        </ListItemButton>
    )

}


interface NavItemListProps {
    items: TodoMainItem[];
    render: RenderMode;
    groupname: string;
    username: string;
    color: string;
}

const NavItemList = ({ items, render, groupname, username, color }: NavItemListProps) => {

    const [todos, dispatch] = useReducer(reducerTodoMain, items);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const theme = useTheme();
    const matchesUpXs = useMediaQuery(theme.breakpoints.up('sm'));



    const menuHandleClick = (event: any) => { // : 
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

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

    const groups: GenericGroup<TodoMainItem>[] = findUnique(todos, "navbar", false)

    const renderItems = (items: TodoMainItem[] | undefined) => {

        if (items === undefined) { return (<></>) }

        return (
            <>
                {sortArrayBy(items, "name").map((item: TodoMainItem, index: number) => (
                    <NavItem handleClose={handleClose} key={index} item={item} render={render} dispatch={dispatch} color={color} />
                ))}
            </>)
    }

    const getIconFromName = (name: string) => {
        switch (name) {
            case "Arbeit": return "work"
            case "Dev": return "developer_mode"
            case "Privat": return "security"
            case "Projekte - Closed": return "check"

            default: return "star"
        }
    }

    return (<>
        {todos !== undefined &&
            <>
                {render === "main" ? (
                    <>
                        <MyCardHeader title={groupname}
                            avatar={
                                <Avatar style={{ backgroundColor: color }} >
                                    <MyIcon icon={getIconFromName(groupname)} />
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
                            {renderItems(groups.at(1)?.listitems)}
                            <Divider />
                            {renderItems(groups.at(0)?.listitems)}
                        </List>
                    </>) : (
                    <>
                        <Box sx={cssClasses.menuButton}    >
                            <IconButton
                                sx={cssClasses.menuButton}
                                onClick={menuHandleClick} >
                                <MyIcon icon={getIconFromName(groupname)} />
                            </IconButton>
                            <Menu
                                id="simple-menu"
                                anchorEl={anchorEl}
                                keepMounted
                                open={Boolean(anchorEl)}
                                onClose={handleClose}

                            >
                                {renderItems(groups.at(1)?.listitems)}

                                {matchesUpXs &&
                                    <>
                                        <Divider />
                                        {renderItems(groups.at(0)?.listitems)}
                                    </>}
                            </Menu>
                        </Box>



                    </>
                )}

            </>

        }
    </>
    )

}

interface MainNavigationProps {
    handleSetConfig: (items: TodoMainItem[]) => void;
    render: RenderMode
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
            {props.render === "navlink" ? (
                <>
                    {groups.map((item: GenericGroup<TodoMainItem>, index: number) => (
                        <NavItemList
                            key={"MainNav" + index}
                            groupname={item.value}
                            items={item.listitems}
                            render={props.render}
                            username={props.username}
                            color={colorArr[index % (colorArr.length)]}
                        />
                    ))}
                </>
            ) : (
                <>
                    <MyCardBlur>
                        <Box p={1}>
                            <Grid container pl={2} alignItems="center" justifyContent="center" spacing={1} >
                                <Grid item xs={7} lg={6} >
                                    <FilterComponent filterText={filterText} callback={callbackFilter} callbackEnter={callbackEnter} />
                                </Grid>
                                <Grid item xs={5} lg={6} >
                                    <Calendar />
                                </Grid>
                            </Grid>
                        </Box>
                    </MyCardBlur>

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
                            {(groups.length === 0 && todos.length === 0) && (
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

        </>
    )
}
