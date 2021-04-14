import React, { Component, useState, useEffect } from "react";
import { useQuery, useMutation, useSubscription } from '@apollo/react-hooks'

import ggl from 'graphql-tag'

import { listTodos, getTodos } from '../graphql/queries';
import { updateTodos, deleteTodos, createTodos } from '../graphql/mutations';
import { onUpdateTodos, onCreateTodos } from '../graphql/subscriptions';

import { Grid, List, ListItem, Box, Card, CardContent } from '@material-ui/core';

import { ListQ } from '../components/List';
import { AddForm } from '../components/AddForm';
import { findUnique, restCallToBackendAsync } from "../components/helper";
import { MyCard, MyCardHeader } from "../components/StyledComponents"
import CircularProgress from '@material-ui/core/CircularProgress';

export const SandboxQl = ({ username, token, listid, listtype }) => {

    console.log( "sandboxQl-List" ) 



    const [edit, setEdit] = useState(false);
    const [filterText, setFilterText] = useState("");
    const [hideCompleted, setHideCompleted] = useState(false);
 
    // graph ql hooks
    const { loading, error, data } = useQuery(ggl(listTodos), { variables: { filter: { listid: { eq: "" + listid } } } })
    const todos = data ? data.listTodos.items : []

    // addTodo is a function
    const [addTodo] = useMutation( ggl(createTodos) )
    const [updateTodo] = useMutation( ggl(updateTodos) )

    
    // const {data} = useSubscription( ggl(onUpdateTodos) ) 

    // const {l,e,d} = useSubscription( ggl(onUpdateTodos), // ggl(onUpdateTodos),
    // {
    //     // variables: 
    //     onSubscriptionData: ({ subscriptionData: { data } }) => {
    //         console.log( "onUpdateTodos : ", data )
    //     }
    // } ) 

    // const {l,e,d} = useSubscription( ggl(onCreateTodos), // ggl(onUpdateTodos),
    // {
    //     onSubscriptionData: ({ subscriptionData: { data } }) => {
    //         console.log( "onCreateTodos : ", data )
    //     }
    // } )     



    // const qTodo = ggl`
    // query MyQuery {
    //     listTodos {
    //          items {
    //         datum
    //         group
    //         id
    //         name
    //       }
    //     }
    //   } `

    const addItemHandle = (name, link, group = "")  => { 
        // await API.graphql(graphqlOperation(createTodos, { input: { id: "" + id, group: group, link: link, listid: listid, owner: "andre", name: name, checked: false } }));
        const id = new Date().getTime();
        addTodo({ variables: { input: { id: "" + id, group: group, link: link, listid: listid, owner: "andre", name: name, checked: false } }     })
    }
    const removeItemHandle = () => { }
    const updateFunction = () => { }
    const toggleFunction = ( todoid ) => {
        
        let newStatus = false
        // API.graphql(graphqlOperation(updateTodos, { input: { id: "" + todoid, owner: "andre", checked: newStatus } }));
        updateTodo({ variables:  { input: { id: "" + todoid, owner: "andre", checked: newStatus } }     })
     }



    // console.log(todos)

    const createLists = (items, filterText) => {

        if (items.length == 0) {
            return (
                <AddForm name={ filterText } onClickFunction={ addItemHandle } type={ listtype } groups={ findUnique(todos, "group", false) } ></AddForm>
            )
        }

        const groups = findUnique(items, "group", false)


        return (
            <>

                { groups.map((item, index) => (
                    <ListQ
                        key={ index }
                        editList={ edit }
                        header={ item.value }
                        group={ item.value }
                        items={ item.photos }
                        groups={ groups }
                        addItemHandle={ addItemHandle }
                        type={ listtype }
                        removeItemHandle={ removeItemHandle }
                        updateFunction={ updateFunction }
                        toggleFunction={ toggleFunction }
                    />
                )) }
            </>
        )
    }

    if (loading) {
        return (
            <Grid item xs={ 12 } lg={ 4 }>
                <MyCard>
                    <MyCardHeader >
                        <List>
                            <Grid container justify="center" alignItems="center" spacing={ 4 }>
                                <Grid item><CircularProgress /></Grid>
                                <Grid item><Box component="span" m={ 1 }> Loading ... </Box></Grid>
                            </Grid>
                        </List>
                    </MyCardHeader>
                </MyCard>
            </Grid>

        )
    }

    if (error) return (
        <Card>
            <CardContent>

                { `Error! ${error.message}` }
            </CardContent>
        </Card>
    )



    return (
        <Card>
            <CardContent>
                { createLists(todos, filterText) }
            </CardContent>
        </Card>

    )

}