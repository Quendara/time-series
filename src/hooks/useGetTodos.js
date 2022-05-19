import React, { useState, useEffect } from 'react';
import Amplify, { API, graphqlOperation } from 'aws-amplify';
import { listTodos, getTodos } from '../graphql/queries';

export const useGetTodos = ( listid ) => {

    const [todos, setTodos] = useState([]);
    // const [initilaized, setInitilaized] = useState(false);


    useEffect( () => {             
            fetchTodos( listid )      

    }, [ listid ])

    async function fetchTodos( listid ) {

      console.log("useGetTodos (listid) : ", listid);

        const listCurrentTodos = /* GraphQL */ `
        query MyQuery {
            listTodos(filter: {group: {beginsWith: "Aktuell"}}, limit: 1000) {
              nextToken
              items {
                id
                name
                owner
                checked
                group
                listid
              }
            }
          }
        `

        let _todos = undefined
        if( listid === "current" ){
            _todos = await API.graphql(graphqlOperation( listCurrentTodos, { filter: { listid: { eq: "" + listid } }, limit: 500 }));
        }
        else
        {
            _todos = await API.graphql(graphqlOperation( listTodos, { filter: { listid: { eq: "" + listid } }, limit: 500 }));
        }
        
        const items = _todos.data.listTodos.items
        
        setTodos(items)
        console.log("useGetTodos  : ", items);
    }    

    return todos;

}