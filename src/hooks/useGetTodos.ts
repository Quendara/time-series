import React, { useState, useEffect } from 'react';
import Amplify, { API, graphqlOperation } from 'aws-amplify';
import { listTodos, getTodos } from '../graphql/queries';
import { onUpdateTodos, onCreateTodos, onDeleteTodos } from '../graphql/subscriptions';
import { TodoItem } from "../models/TodoItems"

// import { updateTodos, deleteTodos, createTodos } from '../graphql/mutations';
const uiUpdateTodo = (items : TodoItem[], todo : TodoItem ) => {

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

    setTodos( [] );  

    if( listid !== undefined ){
      fetchTodos(listid)
    }
    

  }, [listid])    

  useEffect(() => {

    // TODO CURRENTLY ubscription ARE  REMOVED
    
    // const subscriptionCreateTodos : any = API.graphql(
    //   graphqlOperation(onCreateTodos)
    // )

    // subscriptionCreateTodos.subscribe({
    //   next: (x : any ) => {
    //     // Do something with the data
    //     // console.log( x )          
    //     const item = x.value.data.onCreateTodos
    //     console.log("create Items : ", item);
    //     // console.log("items : ", items);
    //     // setItems([...items, { id, name, link, group, checked }]); // push to the end

    //     console.log("onCreateTodos         : #", todos.length );

    //     if ( String(item.listid) !== String(listid) ) {
    //       console.log("subscriptionUpdateTodos (item.listid is not from this list) ", item.listid, listid)
    //       return;
    //     }

    //     console.log("onCreateTodos... : ", todos.length );
    //     setTodos([...todos, item]); // push to the end
    //     console.log("onCreateTodos... length : ", todos.length );
    //   },
    //   error: ( error : string )  => {
    //     console.log("error : ", error);
    //   }
    // })

    // const subscriptionUpdateTodos : any = API.graphql(
    //   graphqlOperation(onUpdateTodos)
    // ); 
    
    // subscriptionUpdateTodos.subscribe({
    //   next: (x : any ) => {
    //     // Do something with the data
    //     // console.log( x )          
    //     const item = x.value.data.onUpdateTodos
    //     console.log("updated Item : ", item);
    //     const updatedList = uiUpdateTodo(todos, item)
    //     setTodos(updatedList)
    //   },
    //   error: ( error : string ) => {
    //     console.log("error : ", error);
    //   }
    // })

    // const subscriptionDeleteTodos : any = API.graphql(
    //   graphqlOperation(onDeleteTodos)
    // )
    
    // subscriptionDeleteTodos.subscribe({
    //   next: (x : any ) => {
    //     // Do something with the data          
    //     const item = x.value.data.onDeleteTodos
    //     // console.log("deleted Item x    : ", x);
    //     console.log("deleted Item item : ", item);
    //     const updatedList = uiDeleteTodo(todos, item.id)
    //     setTodos(updatedList)
    //   },
    //   error: ( error : string ) => {
    //     console.log("error : ", error);
    //   }
    // })

    // return () => {
    //   // subscriptionUpdateTodos.unsubscribe();
    //   // subscriptionDeleteTodos.unsubscribe();
    //   // subscriptionCreateTodos.unsubscribe();
    // };

  })

  async function fetchTodos( listid : string ) {

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

    let response : any = undefined
    if (listid === "current") {
      response = await API.graphql(graphqlOperation(listCurrentTodos, { filter: { listid: { eq: "" + listid } }, limit: 500 }));
    }
    else {
      response = await API.graphql(graphqlOperation(listTodos, { filter: { listid: { eq: "" + listid } }, limit: 500 }));
    }

    const items = response.data.listTodos.items
    console.log("useGetTodos  : ", items);
    setTodos( items )
    return items

    
  }

  return todos; // ? todos : [];

}