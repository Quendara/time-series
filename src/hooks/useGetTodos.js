import React, { useState, useEffect } from 'react';
import Amplify, { API, graphqlOperation } from 'aws-amplify';
import { listTodos, getTodos } from '../graphql/queries';
import { onUpdateTodos, onCreateTodos, onDeleteTodos } from '../graphql/subscriptions';

// import { updateTodos, deleteTodos, createTodos } from '../graphql/mutations';
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

const uiDeleteTodo = (items, id) => {
  const newitems = items.filter(item => item.id !== id);
  return newitems;
}

export const useGetTodos = (listid) => {

  // const [todos, setTodos] = useState<TodoItem[] >( [] );
  const [todos, setTodos] = useState([]);
  // const [initilaized, setInitilaized] = useState(false);

  useEffect(() => {
    fetchTodos(listid);

  }, [listid])    

  useEffect(() => {

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

        console.log("onCreateTodos         : #", todos.length );

        if ( String(item.listid) !== String(listid) ) {
          console.log("subscriptionUpdateTodos (item.listid is not from this list) ", item.listid, listid)
          return;
        }

        console.log("onCreateTodos... : ", todos.length );
        setTodos([...todos, item]); // push to the end
        console.log("onCreateTodos... length : ", todos.length );
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

  })

  async function fetchTodos(listid) {

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
    if (listid === "current") {
      _todos = await API.graphql(graphqlOperation(listCurrentTodos, { filter: { listid: { eq: "" + listid } }, limit: 500 }));
    }
    else {
      _todos = await API.graphql(graphqlOperation(listTodos, { filter: { listid: { eq: "" + listid } }, limit: 500 }));
    }

    const items = _todos.data.listTodos.items

    setTodos(items)
    console.log("useGetTodos  : ", items);
  }

  return todos; // ? todos : [];

}