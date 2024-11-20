import React, { ReactNode, useEffect } from "react";
import { useState } from "react";

import { createFunctionTodo, removeItemById, updateFunctionTodo } from "../components/GraphQlFunctions";
import { CreateTodosInput, UpdateTodosInput } from "../API";
import { API, graphqlOperation } from "aws-amplify";
import { queryTodos } from "../graphql/queries";
import { updateTodos } from "../graphql/mutations";
import { onCreateTodos, onUpdateTodos, onDeleteTodos } from "../graphql/subscriptions";
import { fetchTodos, updateTodosFcn } from "./TodoProviderFcns";
import { TodoMainItem } from "../models/TodoItems";
import { fetchTodosMainFcn } from "./TodoMainProviderFcns";

export type TodoContent = {
    todos: TodoMainItem[]
    openAiKey: string
    joplinToken: string
    setOpenAiKey: ( key : string ) => void
    setJoplinToken: ( key : string ) => void    
    fetchTodosMain: ( owner : string ) => void
    findItem: ( id? : string ) => TodoMainItem | undefined
}

const defaultTodos: TodoContent = {
    todos: [],
    openAiKey: "",
    joplinToken: "",
    setOpenAiKey: () =>{},
    setJoplinToken: () => {},
    // feedTodos: () => {}
    fetchTodosMain: () => { },
    findItem: (  ) => { return undefined },
    // appendTodo: () => { },
    // updateTodo: () => { },
    // toggleTodo: () => { },
    // uncheckFunction: () => { },

    // deleteTodo: () => { }
}

const TodoMainContext = React.createContext<TodoContent>(defaultTodos);

type Props = {
    children: ReactNode
}

const TodoMainProvider = (props: Props) => {

    const [todosState, setTodos] = useState<TodoMainItem[]>([]);
    const [openAiKeyInt, setOpenAiKeyInt] = useState("");
    const [joplinTokenInt, setJoplinTokenInt] = useState<string>("");

    
    const heroContext = {
        todos: todosState,
        openAiKey: openAiKeyInt,
        joplinToken: joplinTokenInt,

        setOpenAiKey:  ( key : string ) => {
            setOpenAiKeyInt( key )
        },
        setJoplinToken:  ( key : string ) => {
            setJoplinTokenInt( key )
        },        
      
        fetchTodosMain: async ( owner : string ) => {

            const fetchedTodos = await fetchTodosMainFcn( owner )

            console.log( "TodoMainProvider.fetchTodosMain ", fetchedTodos )
            console.log( "TodoMainProvider.fetchTodosMain ", fetchedTodos.length )
            setTodos([... fetchedTodos]);
            // setTodos( fetchedTodos );
        },
        findItem: ( id? : string ) => {
            if( id === undefined ) return undefined;
            
            const items = todosState.filter(todo => todo.listid === id)
            return items.at(0)
            // if( items.length === 1 ){
                
            // }
        }
    };

    return (
        <TodoMainContext.Provider value={heroContext}>
            {props.children}
        </TodoMainContext.Provider>
    );
};

export { TodoMainContext, TodoMainProvider };