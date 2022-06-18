import React, { useState, useEffect } from 'react';
import Amplify, { API, graphqlOperation } from 'aws-amplify';
import { listTodos, getTodos } from '../graphql/queries';
import { TodoItem } from "../models/TodoItems"

export const useGetTodo = ( itemid : string ) : TodoItem|undefined  => {

    const [todo, setTodo] = useState<TodoItem | undefined >( undefined );
    // const [initilaized, setInitilaized] = useState(false);


    useEffect( () => {             
            fetchTodos( itemid )        
    }, [ itemid ])

    async function fetchTodos( itemid : string ) {
            
        if( itemid === undefined ) return {}

        const response : any = await API.graphql(graphqlOperation(getTodos, { id: itemid } ));
        const any_resonse = response;
        const item = any_resonse.data.getTodos
    
        setTodo( item );        
    }    

    return todo;

}