import React, { useState, useEffect } from 'react';
import Amplify, { API, graphqlOperation } from 'aws-amplify';
import { listTodoMains } from '../graphql/queries';
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

export const useGetMainTodos = ( owner : string ) : TodoMainItem[]  => {

    const [todos, setTodos] = useState<TodoMainItem[] >( [] );

    useEffect( () => {             
            fetchTodos( owner )        
    }, [ owner ])

    async function fetchTodos( owner : string ) {
    
        console.log("useGetMainTodos (id) : ", owner );
        if( owner === undefined ) return {}


        const response : any = await API.graphql(
            graphqlOperation(listTodoMains,{ filter: { owner: {eq:owner} }, limit: 200  } ) ) 
       

        const items = response.data?.listTodoMains?.items
        console.log("useGetMainTodos : ", items);
        setTodos( items )    
    
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