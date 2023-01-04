import React, { Component, useState, useEffect } from "react";
import { useQuery, useMutation, useSubscription } from '@apollo/react-hooks'

import ggl from 'graphql-tag'

import { listTodos, getTodos } from '../graphql/queries';
import { updateTodos, deleteTodos, createTodos } from '../graphql/mutations';
import { onUpdateTodos, onCreateTodos } from '../graphql/subscriptions';

import { Grid, List, ListItem, Box, Card, CardContent, CircularProgress } from '@mui/material';

import { ListQ } from '../components/List';
import { AddForm } from '../components/AddForm';
import { findUnique, restCallToBackendAsync } from "../components/helper";
import { MyCard, MyCardHeader } from "../components/StyledComponents"

export const SandboxQlSub = ({ username, token, listid, listtype }) => {

    console.log( "SandboxQlSub" ) 


    
    // const {data} = useSubscription( ggl(onUpdateTodos) ) 

    const {loading,error,d} = useSubscription( ggl(onUpdateTodos), // ggl(onUpdateTodos),
    {
        // variables: 
        onSubscriptionData: ({ subscriptionData: { data } }) => {
            console.log( "onUpdateTodos : ", data )
        }
    } ) 

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

    if (loading) {
        return (
            <Grid item xs={ 12 } lg={ 4 }>
                <MyCard>
                    <MyCardHeader >
                        <List>
                            <Grid container justifyContent="center" alignItems="center" spacing={ 4 }>
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
                <h1>Sand-Sub</h1>
            </CardContent>
        </Card>
    )

}