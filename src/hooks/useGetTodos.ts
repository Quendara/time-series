import React, { useState, useEffect } from 'react';
// import Amplify, { API, graphqlOperation, GraphQLResult } from 'aws-amplify';
import API, {GraphQLResult, graphqlOperation }  from '@aws-amplify/api';
import Observable from 'zen-observable-ts';

import { listTodos, queryTodos, getTodos } from '../graphql/queries';
import { onUpdateTodos, onCreateTodos, onDeleteTodos } from '../graphql/subscriptions';
import { TodoItem } from "../models/TodoItems"

// import { updateTodos, deleteTodos, createTodos } from '../graphql/mutations';
const updateTodos = (items : TodoItem[], todo : TodoItem ) => {

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

const uiDeleteTodo = (items : TodoItem[], id : string ) => {
  const newitems = items.filter(item => item.id !== id);
  return newitems;
} 

export const useGetTodos = ( listid : string  | undefined ) => {

   const [todos, setTodos] = useState<TodoItem[] >( [] );
  
  // const [initilaized, setInitilaized] = useState(false);

  useEffect(() => {

    // setTodos( [] );  
    console.log(`useGetTodos.useEffect : ${listid}`, todos.length );

    if( listid !== undefined ){
      fetchTodos(listid)
    }  

  }, [listid])    

  useEffect(() => {

    // TODO CURRENTLY subscription ARE  REMOVED
    // const test : Observable<object> = subscriptionCreateTodos
    
    const apiCreateTodos : any = API.graphql(
      graphqlOperation(onCreateTodos)
    )    

    const subscriptionCreateTodos : any = apiCreateTodos.subscribe({
      next: (x : any ) => {
        // Do something with the data
        // console.log( x )          
        const item = x.value.data.onCreateTodos
        // console.log("create Items : ", item);
        // console.log("items : ", items);
        // setItems([...items, { id, name, link, group, checked }]); // push to the end

        // console.log("onCreateTodos         : #", todos.length );

        if ( String(item.listid) !== String(listid) ) {
          console.log("subscriptionUpdateTodos (item.listid is not from this list) ", item.listid, listid)
          return;
        }

        // console.log("onCreateTodos... : ", todos.length );
        setTodos([...todos, item]); // push to the end
        console.log("onCreateTodos... length : ", todos.length );
      },
      error: ( error : string )  => {
        console.log("error onCreateTodos : ", error);
      }
    })

    const apiUpdateTodos : any = API.graphql(
      graphqlOperation(onUpdateTodos)
    ); 
    
    const subscriptionUpdateTodos : any = apiUpdateTodos.subscribe({
      next: (x : any ) => {
        // Do something with the data
        // console.log( x )          
        const item = x.value.data.onUpdateTodos
        console.log("updated Item : ", item, todos.length); 
        const updatedList = updateTodos(todos, item)

        // TODO: ERROR todos is EMPTY
        // setTodos(updatedList)
      },
      error: ( error : string ) => {
        console.log("error onUpdateTodos : ", error);
      }
    })

    const apiDeleteTodos : any = API.graphql(
      graphqlOperation(onDeleteTodos)
    )
    
    const subscriptionDeleteTodos : any = apiDeleteTodos.subscribe({
      next: (x : any ) => {
        // Do something with the data          
        const item = x.value.data.onDeleteTodos
        // console.log("deleted Item x    : ", x);
        console.log("deleted Item item : ", item);
        const updatedList = uiDeleteTodo(todos, item.id)
        setTodos(updatedList)
      },
      error: ( error : string ) => {
        console.log("error onDeleteTodos : ", error);
      }
    })

    return () => {
      subscriptionUpdateTodos.unsubscribe();
      subscriptionDeleteTodos.unsubscribe();
      subscriptionCreateTodos.unsubscribe();
    };

  },[])

  async function fetchTodos( listid : string )  {

    console.log("useGetTodos.fetchTodos (listid) : ", listid);

    if (listid === "current") {

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
      let response : any = await API.graphql(graphqlOperation( listCurrentTodos, { filter: { listid: { eq: "" + listid } }, limit: 1000 }));
      const items = response.data.listTodos.items
      console.log("useGetTodos  : ", items);
      setTodos( items )

    }
    else {
      // response = await API.graphql(graphqlOperation(queryTodos, { filter: { listid: { eq: "" + listid } }, limit: 1000 }));
      let response : any = await API.graphql(graphqlOperation( queryTodos, { listid: listid } ) );
      
      const items = response.data.queryTodos.items
      console.log( `useGetTodos.fetchTodos  listid : ${listid} items: `, items);
      setTodos( items )
  
    }
 
  }

  return todos; // ? todos : [];

}