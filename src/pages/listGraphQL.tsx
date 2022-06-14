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

interface ListProps {
    lists: TodoMainItem[];
    username: string;
}

interface ListUseParams {
    listid: string;
    listtype: string;
    itemid: string;
}

export const ListGraphQL = ({ lists, username }: ListProps) => {

    let { listid, listtype, itemid } = useParams<ListUseParams>();

    const items = useGetTodos(listid);

    return (
        <>

            <ListGraphInternal
                listid={listid}
                items={items}
                listtype={listtype}
                itemid={itemid}
                lists={lists}
                username={username} />

        </>
    )
}

interface ListPropsInternal {

    lists: TodoMainItem[];
    items: TodoItem[];
    username: string;
    listid: string;
    listtype: string;
    itemid?: string;
}


export const ListGraphInternal = ({ items, lists, username, listid, listtype, itemid }: ListPropsInternal) => {

    const [todos, dispatch] = useReducer(reducerTodo, items);

    useEffect(() => {

        dispatch(UpdateState(items))

    }, [items]);

    const isChecked = (checked: boolean) => {
        return checked
    }
    //     if (typeof checked === "boolean") { return checked }
    //     if (typeof checked === "string") { return checked === "true" }
    //     return false
    // }


    async function toggleFunction(todoid: string) {

        dispatch(ToggleItem(todoid))

        // // get Check Status
        // let newStatus = false
        // const items2 = todos.map((e, index) => {

        //     if (e.id === todoid) {
        //         let newObject = Object.assign({}, e)
        //         newObject['checked'] = !isChecked(e.checked)
        //         newStatus = newObject['checked']
        //         // newObject['link'] = link
        //         return newObject
        //     }
        //     return e
        // })

        // // setTodos(items2)

        // /* update a todo */
        // await API.graphql(graphqlOperation(updateTodos, { input: { id: "" + todoid, checked: newStatus } }));
    }

    async function uncheckFunction(todoid: string) {

        // TODO WRONG FUNCTION
        dispatch(UncheckItem(todoid))

        // // get Check Status
        // let newStatus = false
        // const items2 = todos.map((e, index) => {

        //     if (e.id === todoid) {
        //         let newObject = Object.assign({}, e)
        //         newObject['checked'] = false
        //         newStatus = newObject['checked']                
        //         return newObject
        //     }
        //     return e
        // })

        // // setTodos(items2)

        // /* update a todo */
        // await API.graphql(graphqlOperation(updateTodos, { input: { id: "" + todoid, checked: newStatus } }));
    }

    // async function updateFunction(todoid, name, link, group, description = undefined) {
    //     await API.graphql(graphqlOperation(updateTodos, { input: { id: "" + todoid, link: link, group: group, owner: username, name: name, description: description } }));
    // };

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

        // const id = new Date().getTime();
        // await API.graphql(graphqlOperation(createTodos,
        //     {
        //         
        //     }));
    }

    async function removeItemHandle(todoid: string) {
        dispatch(DeleteItem(todoid))

        // await API.graphql(graphqlOperation(deleteTodos, { input: { id: "" + todoid } }));
    };


    if (itemid === undefined) {
        return (
            <ListPage
                todos={todos}
                listtype={listtype}
                listid={listid}
                addItemHandle={addItemHandle}
                // getItem             = {getItem}
                removeItemHandle={removeItemHandle}
                updateFunction={updateFunction}
                toggleFunction={toggleFunction}
                uncheckFunction={uncheckFunction}
                lists={lists}
            />)

    }
    else {
        console.log("itemid : ", itemid)
        return (<DetailsById
            itemid={itemid}
            updateFunction={updateFunction}
            listtype={listtype}
            lists={lists} />)
    }
}


