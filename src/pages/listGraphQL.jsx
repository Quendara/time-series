import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";

import Amplify, { API, graphqlOperation } from 'aws-amplify';
import { listTodos, getTodos } from '../graphql/queries';
import { onUpdateTodos, onCreateTodos, onDeleteTodos } from '../graphql/subscriptions';
import { updateTodos, deleteTodos, createTodos } from '../graphql/mutations';

import { ListPage } from './ListPage';


// interface ListGraphProps {
//     token: string;
//     apikey: string;
//     username: string;
//     errorHandle: any;
//     lists: any;
// }

export const ListGraphQL = ({ token, apikey, username, errorHandle, lists } ) => {

    // let { listid, listtype, itemid } = useParams<any>();
    let { listid, listtype, itemid } = useParams();

    const [todos, setTodos] = useState([]);

    useEffect(
        () => {
            setTodos([]);

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
                fetchTodos()
                // setSelectedItem(undefined)
            }
        }, [apikey, listid])

    useEffect(
        () => {

            if (apikey) {

                // console.log("useEffect - todos : ", todos);
                // const subscription = props.source.subscribe();

                const subscriptionCreateTodos = API.graphql(
                    graphqlOperation(onCreateTodos)
                ).subscribe({
                    next: (x) => {
                        // Do something with the data
                        // console.log( x )          
                        const item = x.value.data.onCreateTodos
                        console.log("create Items : ", item);
                        // console.log("items : ", items);
                        // setItems([...items, { id, name, link, group, checked }]); // push to the end

                        if (item.listid !== listid) {
                            console.log("subscriptionUpdateTodos (item.listid is not from this list) ", item.listid, listid)
                            return;
                        }

                        setTodos([...todos, item]); // push to the end
                        console.log("Submitting... ");
                    },
                    error: error => {
                        console.log("error : ", error);
                    }
                })

                const subscriptionUpdateTodos = API.graphql(
                    graphqlOperation(onUpdateTodos)
                ).subscribe({
                    next: (x) => {
                        // Do something with the data
                        // console.log( x )          
                        const item = x.value.data.onUpdateTodos
                        console.log("updated Item : ", item);
                        const updatedList = uiUpdateTodo(todos, item)
                        setTodos(updatedList)
                    },
                    error: error => {
                        console.log("error : ", error);
                    }
                })

                const subscriptionDeleteTodos = API.graphql(
                    graphqlOperation(onDeleteTodos)
                ).subscribe({
                    next: (x) => {
                        // Do something with the data          
                        const item = x.value.data.onDeleteTodos
                        // console.log("deleted Item x    : ", x);
                        console.log("deleted Item item : ", item);
                        const updatedList = uiDeleteTodo(todos, item.id)
                        setTodos(updatedList)
                    },
                    error: error => {
                        console.log("error : ", error);
                    }
                })

                return () => {
                    subscriptionUpdateTodos.unsubscribe();
                    subscriptionDeleteTodos.unsubscribe();
                    subscriptionCreateTodos.unsubscribe();
                };
            }
        }
    );


    const uiDeleteTodo = (items, id) => {

        const newitems = items.filter(item => item.id !== id);
        return newitems;
    }


    const uiUpdateTodo = (items, todo) => {

        const newitems = items.map((e, index) => {

            if (e.id === todo.id) {
                let newObject = Object.assign({}, e)
                newObject['name'] = todo.name
                newObject['group'] = todo.group
                newObject['link'] = todo.link
                newObject['checked'] = todo.checked
                newObject['description'] = todo.description
                return newObject
            }
            return e
        })

        return newitems;
    }

    async function fetchTodos() {
        const _todos = await API.graphql(graphqlOperation(listTodos, { filter: { listid: { eq: "" + listid } }, limit: 500 }));

        const items = _todos.data.listTodos.items
        console.log("fetchTodos : ", items);
        setTodos(items)
        return items
    }

    async function getTodosFcn(id, owner) {
        const _todos = await API.graphql(graphqlOperation(getTodos, { id: id, owner: owner }));
        const item = _todos.data.getTodos

        console.log("getTodos : ", item);
        return item
    }

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

        setTodos(items2)

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

        setTodos(items2)
        /* update a todo */
        await API.graphql(graphqlOperation(updateTodos, { input: { id: "" + todoid, owner: username, checked: newStatus } }));
    }    

    // async function updateFunction(todoid, name, link, group, description = undefined) {
    //     await API.graphql(graphqlOperation(updateTodos, { input: { id: "" + todoid, link: link, group: group, owner: username, name: name, description: description } }));
    // };

    async function updateFunction2(todoid, { name, listid, link, group, description } ) {

        let inputObject = { id: "" + todoid, name:name, group:group, owner: username, listid: listid, description: description } // , link: link, group: group, owner: username, name: name, description: description } }
        console.log("updateFunction2 update", todoid, "with", inputObject);

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

    async function getItem(id) {
        const currentItem = await getTodosFcn(id, username)
        return currentItem
    //     // console.log( "selectHandle : ", id  )
    //     // console.log( currentItem)
         setSelectedItem(currentItem)
    }

    async function removeItemHandle(todoid) {

        // const items2 = uiDeleteTodo( todos, todoid )
        // setTodos(items2); // push to the end
        await API.graphql(graphqlOperation(deleteTodos, { input: { id: "" + todoid, owner: username } }));
    };
 
    return (
        <ListPage 
            todos               = {todos}
            listtype            = {listtype}
            listid              = {listid}
            addItemHandle       = {addItemHandle}
            getItem             = {getItem}
            removeItemHandle    = {removeItemHandle}
            updateFunction      = {updateFunction2}            
            toggleFunction      = {toggleFunction}
            uncheckFunction     = {uncheckFunction}
            lists               = {lists}
        />
    );
}

