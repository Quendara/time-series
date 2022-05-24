import React, { useState, useEffect } from 'react';
import Amplify, { API, graphqlOperation } from 'aws-amplify';
import { listTodos, getTodos } from '../graphql/queries';
import { TodoItem } from "../components/TodoItems"

export const useGetTodo = ( itemid : string ) : TodoItem|undefined  => {

    const [todo, setTodo] = useState<TodoItem | undefined >( undefined );
    // const [initilaized, setInitilaized] = useState(false);


    useEffect( () => {             
            fetchTodos( itemid )        
    }, [ itemid ])

    async function fetchTodos( itemid : string ) {
    
        console.log("getTodosFcn (id) : ", itemid );
        if( itemid === undefined ) return {}

        // todo: remove owner from key
        const owner = "andre"
    
        const _todos = await API.graphql(graphqlOperation(getTodos, { id: itemid, owner: owner }));
        const item = _todos.data.getTodos
    
        console.log("useGetTodo HOOK 2 : ", item);
        setTodo( item )
        
    }    

    return todo;

}