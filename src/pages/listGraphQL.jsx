import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";

import Amplify, { API, graphqlOperation } from 'aws-amplify';
import { listTodos, getTodos } from '../graphql/queries';
import { onUpdateTodos, onCreateTodos, onDeleteTodos } from '../graphql/subscriptions';
import { updateTodos, deleteTodos, createTodos } from '../graphql/mutations';

import { DetailsById } from "../components/Details"
import { ListPage } from './ListPage';

import { useGetTodos } from "../hooks/useGetTodos"
import { useGetTodo } from "../hooks/useGetTodo"

export const ListGraphQL = ({ token, apikey, username, errorHandle, lists } ) => {

    // let { listid, listtype, itemid } = useParams<any>();
    let { listid, listtype, itemid } = useParams();

    // const [todos, setTodos] = useState([]);
    // const [initilaized, setInitilaized] = useState(false);

    const todos = useGetTodos( listid  );

    const isChecked = (checked) => {
        if (typeof checked === "boolean") { return checked }
        if (typeof checked === "string") { return checked === "true" }
        return false
    }


    async function toggleFunction(todoid) {

        // get Check Status
        let newStatus = false
        const items2 = todos.map((e, index) => {

            if (e.id === todoid) {
                let newObject = Object.assign({}, e)
                newObject['checked'] = !isChecked(e.checked)
                newStatus = newObject['checked']
                // newObject['link'] = link
                return newObject
            }
            return e
        })

        // setTodos(items2)

        /* update a todo */
        await API.graphql(graphqlOperation(updateTodos, { input: { id: "" + todoid, owner: username, checked: newStatus } }));
    }

    async function uncheckFunction(todoid) {

        // get Check Status
        let newStatus = false
        const items2 = todos.map((e, index) => {

            if (e.id === todoid) {
                let newObject = Object.assign({}, e)
                newObject['checked'] = false
                newStatus = newObject['checked']                
                return newObject
            }
            return e
        })

        // setTodos(items2)

        /* update a todo */
        await API.graphql(graphqlOperation(updateTodos, { input: { id: "" + todoid, owner: username, checked: newStatus } }));
    }    

    // async function updateFunction(todoid, name, link, group, description = undefined) {
    //     await API.graphql(graphqlOperation(updateTodos, { input: { id: "" + todoid, link: link, group: group, owner: username, name: name, description: description } }));
    // };

    async function updateFunction(todoid, { name, listid, link, group, description } ) {

        let inputObject = { id: "" + todoid, name:name, group:group, owner: username, listid: listid, description: description } // , link: link, group: group, owner: username, name: name, description: description } }
        console.log("updateFunction update", todoid, "with", inputObject);

        await API.graphql(graphqlOperation(updateTodos, { input: inputObject }));
    };

    // handles
    async function addItemHandle(name, link, group = "") {
        const id = new Date().getTime();
        await API.graphql(graphqlOperation(createTodos,
            {
                input:
                {
                    id: "" + id,
                    group: group,
                    link: link,
                    listid: listid,
                    owner: username,
                    name: name,
                    checked: false
                }
            }));
    }

    async function removeItemHandle(todoid) {
        await API.graphql(graphqlOperation(deleteTodos, { input: { id: "" + todoid, owner: username } }));
    };
 
 
        if( itemid === undefined  ){
            return ( 
            <ListPage 
                todos               = {todos}
                listtype            = {listtype}
                listid              = {listid}
                addItemHandle       = {addItemHandle}
                // getItem             = {getItem}
                removeItemHandle    = {removeItemHandle}
                updateFunction      = {updateFunction}            
                toggleFunction      = {toggleFunction}
                uncheckFunction     = {uncheckFunction}
                lists               = {lists}
        /> )

        }
        else{
            console.log( "itemid : ", itemid)
            return ( <DetailsById 
                        itemid              = {itemid} 
                        updateFunction      = {updateFunction}                         
                        listtype            = {listtype}
                        lists               = {lists}  /> )
        } 
    }


