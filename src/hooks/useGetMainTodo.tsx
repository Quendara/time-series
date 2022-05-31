import React, { useState, useEffect } from 'react';
import Amplify, { API, graphqlOperation } from 'aws-amplify';
import { listTodoMains } from '../graphql/queries';
import { TodoItem } from "../components/TodoItems"

export const useGetMainTodos = ( owner : string ) : [TodoItem]|undefined  => {

    const [todos, setTodos] = useState<[TodoItem] | undefined >( undefined );
    // const [initilaized, setInitilaized] = useState(false);


    useEffect( () => {             
            fetchTodos( owner )        
    }, [ owner ])

    async function fetchTodos( owner : string ) {
    
        console.log("useGetMainTodos (id) : ", owner );
        if( owner === undefined ) return {}
    
        const _todos = await API.graphql(graphqlOperation(listTodoMains, { owner: owner }));
        const items = _todos.data.listTodoMains.items
    
        console.log("useGetMainTodos : ", items);
        setTodos( items )
         
    }    

    return todos;

}