import React, { useState, useEffect } from 'react';
import Amplify, { API, graphqlOperation } from 'aws-amplify';

import { listTodoMains } from '../graphql/queries';
import { onUpdateTodoMain, onUpdateTodos } from '../graphql/subscriptions';

import { TodoItem, TodoMainItem } from "../models/TodoItems"


// export type ListTodosQuery = {
//     listTodoMains:  {
//       __typename: "ModelTodoConnection",
//       items:  Array< {
//         TodoItem        
//       } | null > | null,
//       nextToken: string | null,
//     } | null,
//   };

const updateTodos = (items: TodoMainItem[], todo: TodoMainItem) => {

    const newitems = items.map((e, index) => {

        if (e.id === todo.id) {
            let newObject = Object.assign({}, e)
            newObject['name'] = todo.name
            newObject['group'] = todo.group

            newObject['listid'] = todo.listid
            newObject['component'] = todo.component
            newObject['icon'] = todo.icon
            newObject['owner'] = todo.owner
            newObject['navbar'] = todo.navbar
            newObject['render'] = todo.render

            return newObject
        }
        return e
    })

    return newitems;
}

export const useGetMainTodos = (owner: string): TodoMainItem[] => {

    const [todos, setTodos] = useState<TodoMainItem[]>([]);

    useEffect(() => {
        fetchTodos(owner)



    }, [owner])

    useEffect(() => { 

        const apiUpdateTodos: any = API.graphql(
            graphqlOperation(onUpdateTodoMain)
        );

        const subscriptionUpdateTodos: any = apiUpdateTodos.subscribe({
            next: (x: any) => {
                // Do something with the data
                // console.log( x )          

                console.log("onUpdateTodoMain: (data) : ", x);

                const item = x.value.data.onUpdateTodoMain
                // console.log("onUpdateTodoMain: ", item);
                const updatedList = updateTodos(todos, item)
                setTodos(updatedList)
            },
            error: (error: string) => {
                console.log("error : ", error);
            }
        })

        return () => {
            subscriptionUpdateTodos.unsubscribe();
            // subscriptionDeleteTodos.unsubscribe();
            // subscriptionCreateTodos.unsubscribe();
        };        

    })    

    async function fetchTodos(owner: string) {

        console.log("useGetMainTodos (id) : ", owner);
        if (owner === undefined) return {}


        const response: any = await API.graphql(
            graphqlOperation(listTodoMains, { filter: { owner: { eq: owner } }, limit: 200 })
        );

        const items = response.data?.listTodoMains?.items
        console.log("useGetMainTodos : ", items);
        setTodos(items)

        // const response = (await API.graphql(
        //         graphqlOperation(listTodoMains,{ filter: { owner: {eq:owner} } } ) ) 
        //     ) as { data: ListTodosQuery };

        // if( response !== null ){
        //     const items = response.data?.listTodoMains?.items
        //     console.log("useGetMainTodos : ", items);
        //     if( items ){
        //         setTodos( items )    
        //     }

        // }
    }

    return todos;
}