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
    setOpenAiKey: ( key : string ) => void
    // feedTodos: ( items : TodoMainItem[] ) => void
    fetchTodosMain: ( owner : string ) => void
    findItem: ( id? : string ) => TodoMainItem | undefined
    // appendTodo: (c: TodoMainItem, username: string) => void
    // updateTodo: (c: UpdateTodosInput) => void
    // toggleTodo: (id: string) => void
    // uncheckFunction: (id: string) => void
    // deleteTodo: (id: string) => void

}

const defaultTodos: TodoContent = {
    todos: [],
    openAiKey: "",
    setOpenAiKey: () =>{},
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

    
    const heroContext = {
        todos: todosState,
        openAiKey: openAiKeyInt,

        setOpenAiKey:  ( key : string ) => {
            setOpenAiKeyInt( key )
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