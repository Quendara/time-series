import React, { ReactNode } from "react";
import { useState } from "react";
import { TodoItem } from "../models/TodoItems";
import { createFunctionTodo, removeItemById, updateFunctionTodo } from "../components/GraphQlFunctions";
import { CreateTodosInput, UpdateTodosInput } from "../API";
import { API, graphqlOperation } from "aws-amplify";
import { queryTodos } from "../graphql/queries";


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
      const items : TodoItem[] = response.data.listTodos.items
      console.log("useGetTodos  : ", items);
      return items

    }
    else {
      // response = await API.graphql(graphqlOperation(queryTodos, { filter: { listid: { eq: "" + listid } }, limit: 1000 }));
      let response : any = await API.graphql(graphqlOperation( queryTodos, { listid: listid } ) );
      
      const items : TodoItem[] = response.data.queryTodos.items
      console.log( `useGetTodos.fetchTodos  listid : ${listid} items: `, items);
      return items
  
    }
}

export type TodoContent = {
    todos: TodoItem[]
    fetchTodos: ( listid : string ) => void
    appendTodo: (c: TodoItem, username: string) => void
    updateTodo: (c: UpdateTodosInput) => void
    toggleTodo: (id: string) => void
    uncheckFunction: (id: string) => void
    deleteTodo: (id: string) => void

}

const defaultTodos: TodoContent = {
    todos: [],
    fetchTodos: () => { },
    appendTodo: () => { },
    updateTodo: () => { },
    toggleTodo: () => { },
    uncheckFunction: () => { },

    deleteTodo: () => { }
}

const TodoContext = React.createContext<TodoContent>(defaultTodos);

type Props = {
    children: ReactNode
}



const TodoProvider = (props: Props) => {

    const [todosState, setTodos] = useState<TodoItem[]>([]);

    const heroContext = {
        todos: todosState,
        // fetchTodos: (arrayFromAPI: TodoItem[]) => {
        //     setTodos([...arrayFromAPI]);
        // },
        fetchTodos: async ( listid : string ) => {

            const fetchedTodos = await fetchTodos( listid )
            setTodos([... fetchedTodos]);
        },

        toggleTodo: (id: string ) => {
            const newState = todosState.map((todo) => {
                if (todo.id === id) {
                    updateFunctionTodo({ id: id, checked: !todo.checked })
                    return { ...todo, checked: !todo.checked };
                } else {
                    return todo;
                }
            });
            setTodos(newState);
        },
        uncheckFunction: (id: string) => {
            const newState = todosState.map((todo) => {
                if (todo.id === id) {
                    
                    updateFunctionTodo({ id: id, checked: false})
                    return { ...todo, checked: false };
                } else {
                    return todo;
                }
            });
            setTodos(newState);
        },
        updateTodo: (payload: UpdateTodosInput) => {
            const newState = todosState.map((todo) => {
                if (todo.id === payload.id) {

                    updateFunctionTodo(
                        {
                            id: payload.id,
                            name: payload.name,
                            group: payload.group,
                            description: payload.description,
                            listid: payload.listid,
                        })
                    let newItem = { ...todo } // clone

                    // overwrite when exists
                    if (payload.name) newItem.name = payload.name;
                    if (payload.group) newItem.group = payload.group;
                    if (payload.description) newItem.description = payload.description;
                    if (payload.listid) newItem.listid = payload.listid;

                    return newItem


                } else {
                    return todo;
                }
            });
            setTodos(newState);
        },
        appendTodo: (val: TodoItem, username: string) => {

            const input: CreateTodosInput =
            {
                id: val.id,
                owner: username,
                group: val.group,
                link: val.link,
                listid: val.listid,
                description: val.description,
                name: val.name,
                checked: val.checked
                // datum: ""
            }

            createFunctionTodo(input)

            setTodos([...todosState, val])
        },

        // fetch todos here
        // remove useGetTodos
        
        deleteTodo: (id: string) => {
            removeItemById(id)
            setTodos([...todosState.filter(item => item.id !== id)])
        }
    };

    return (
        <TodoContext.Provider value={heroContext}>
            {props.children}
        </TodoContext.Provider>
    );
};

export { TodoContext, TodoProvider };