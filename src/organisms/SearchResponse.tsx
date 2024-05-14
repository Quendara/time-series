import { List, ListItemButton, ListItemAvatar, Avatar, Icon, ListItemText, ListItemSecondaryAction, IconButton, useTheme } from "@mui/material"
import React from "react"
import { NavLink } from "react-router-dom"
import { MyIcon } from "../components/MyIcon"
import { MyCard } from "../components/StyledComponents"
import { createEmptyTodoMainItem, TodoItem, TodoMainItem } from "../models/TodoItems"

import { bull } from "../components/helpers"
import { getTodosFcn } from "../components/GraphQlFunctions"
import { useGetTodo } from "../hooks/useGetTodo"


interface Props {
    mainTodos: TodoMainItem[];
    searchResponse: TodoItem[];
}

interface SingleProps extends Props {

    currentTodo: TodoItem;
}



export const SingleSearchResponse = (props: SingleProps) => {

    const theme = useTheme()

    const getMainListItem = (listid: string): TodoMainItem | undefined => {

        const i = props.mainTodos.filter(item => {
            if (item.listid === listid) return item
        })
        if (i.length === 1) {
            return i[0]
        }
        return undefined
    }

    const getMainListItemReturnAlways = ( listid?: string ) => {

        if( listid === undefined ){
            return createEmptyTodoMainItem();
        }
        const item = getMainListItem( listid )
        if( item ){ return item }

        return createEmptyTodoMainItem();
        
    }

    const parentMainTodo = getMainListItem(props.currentTodo.listid);
    const parentTodo = useGetTodo( props.currentTodo.listid  ) 

    
    console.log( "parentTodo : " + parentTodo )
    if( parentTodo ){
        console.log( "parentTodo : " + parentTodo )
        parentTodo.listid
    }


    return (
        <>
            {parentMainTodo ? (
                <ListItemButton>
                    <ListItemAvatar >
                        <Avatar sx={{ backgroundColor: theme.palette.info.main  }} >
                            <Icon>{parentMainTodo.icon}</Icon>
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                        primary={props.currentTodo.name}
                        secondary={<> {props.currentTodo.group}  {bull}  {parentMainTodo.name} </>}
                    />
                    <ListItemSecondaryAction>
                        {/* to={"/" + [item.component, todo.listid, todo.render].join('/')}   > */}
                        <NavLink to={"/" + ["list", props.currentTodo.listid, parentMainTodo.render, props.currentTodo.id ].join('/')}   >
                            <IconButton>
                                <MyIcon icon="launch" />
                            </IconButton>
                        </NavLink>
                    </ListItemSecondaryAction>
                </ListItemButton>
            ) : (
                <ListItemButton>
                    <ListItemAvatar >
                        <Avatar sx={{ backgroundColor: theme.palette.success.dark  }} >
                            <Icon>{ getMainListItemReturnAlways(parentTodo?.listid).icon }</Icon>
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                        primary={ <>{parentTodo?.name} {bull} {props.currentTodo.name}</> }
                        secondary={<> {props.currentTodo.group}  {bull} {getMainListItemReturnAlways(parentTodo?.listid).name } </>}
                    />
                    <ListItemSecondaryAction>
                        {/* to={"/" + [item.component, todo.listid, todo.render].join('/')}   > */}
                        <NavLink to={"/" + ["list", parentTodo?.listid, "todo", parentTodo?.id].join('/')}   >
                            <IconButton>
                                <MyIcon icon="launch" />
                            </IconButton>
                        </NavLink>
                    </ListItemSecondaryAction>
                </ListItemButton>

            )
            }
        </>




    )



}

export const SearchResponse = (props: Props) => {



    return (
        <>
            {props.searchResponse.length > 0 &&
                <MyCard>
                    <List>
                        {props.searchResponse.map((todo: TodoItem, index: number) => (
                            <SingleSearchResponse {...props} currentTodo={todo} />


                        ))
                        }
                    </List>

                </MyCard>
            }
        </>
    )
}
