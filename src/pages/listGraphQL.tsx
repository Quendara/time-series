import React, { useState, useEffect, useReducer } from 'react';
import { useParams } from "react-router-dom";

import Amplify, { API, graphqlOperation } from 'aws-amplify';
import { listTodos, getTodos } from '../graphql/queries';
import { onUpdateTodos, onCreateTodos, onDeleteTodos } from '../graphql/subscriptions';
// import { updateTodos, deleteTodos, createTodos } from '../graphql/mutations';

import { DetailsById } from "../components/Details"
import { ListPage } from './ListPage';

import { useGetTodos } from "../hooks/useGetTodos"
// import { useGetTodo } from "../hooks/useGetTodo"

import { reducerTodo } from "../reducer/reducerTodo"
import { AddItem, ToggleItem, UncheckItem, UpdateItem, DeleteItem, UpdateState } from "../reducer/dispatchFunctionsTodos"
import { UpdateTodosInput, CreateTodosInput } from "../API"

import { TodoItem, TodoMainItem } from "../models/TodoItems"
import { TodoListType } from "../components/List"
import { BooleanModel } from 'aws-sdk/clients/gamelift';

interface ListProps {
    lists: TodoMainItem[];
    username: string;
    color: string;
    horizontally: boolean;
}

export const ListGraphQL = (props: ListProps) => {

    let { listid, listtype, itemid } = useParams<{ listid: string, listtype: TodoListType, itemid?: string }>();

    console.log( "ListGraphQL : ", listid )

    const items = useGetTodos(listid);

    return (
        <>
            <ListGraphInternal
                listid={listid ? listid : ""}
                items={items}
                listtype={listtype ? listtype : TodoListType.UNDEFINED}
                horizontally={ listtype === TodoListType.LINKS }
                itemid={itemid}
                color={props.color}
                lists={props.lists}
                username={props.username} />
        </>
    )
}

interface ListPropsInternal {

    lists: TodoMainItem[];
    items: TodoItem[];
    username: string;
    listid: string;
    listtype: TodoListType;
    horizontally: boolean;
    itemid?: string;
    color: string
}


export const ListGraphInternal = ({ items, lists, username, horizontally, listid, listtype, itemid, color }: ListPropsInternal) => {

    const [todos, dispatch] = useReducer(reducerTodo, items);

    useEffect(() => {

        console.log( "useEffect ListGraphInternal", items )

        dispatch(UpdateState(items)) 

    }, [items]);

    const isChecked = (checked: boolean) => {
        return checked
    }

    async function toggleFunction(todoid: string) {
        dispatch(ToggleItem(todoid))
    }

    async function uncheckFunction(todoid: string) {

        // TODO WRONG FUNCTION
        dispatch(UncheckItem(todoid))
    }

    async function updateFunction(inputObject: UpdateTodosInput) {
        dispatch(UpdateItem(inputObject))
    };

    // handles
    async function addItemHandle(name: string, link: string, group: string = "") {

        const id = new Date().getTime();

        const input: CreateTodosInput =
        {
            id: "" + id,
            owner: username,
            group: group,
            link: link,
            listid: listid,
            description: "",
            name: name,
            checked: false
            // datum: ""
        }

        dispatch(AddItem(input))
    }

    async function removeItemHandle(todoid: string) {
        dispatch(DeleteItem(todoid))
        // await API.graphql(graphqlOperation(deleteTodos, { input: { id: "" + todoid } }));
    };


    return (
        <ListPage
            todos={todos}
            listtype={listtype}
            listid={listid}
            addItemHandle={addItemHandle}
            horizontally={horizontally}
            selectedItemId={itemid}
            color={color}
            removeItemHandle={removeItemHandle}
            updateFunction={updateFunction}
            toggleFunction={toggleFunction}
            uncheckFunction={uncheckFunction}
            lists={lists}
            username={username}
        />)
}


