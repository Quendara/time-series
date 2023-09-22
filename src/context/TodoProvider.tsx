import React, { ReactNode, useEffect } from "react";
import { useState } from "react";
import { TodoItem } from "../models/TodoItems";
import { createFunctionTodo, removeItemById, updateFunctionTodo } from "../components/GraphQlFunctions";
import { CreateTodosInput, UpdateTodosInput } from "../API";
import { API, graphqlOperation } from "aws-amplify";
import { queryTodos } from "../graphql/queries";
import { updateTodos } from "../graphql/mutations";
import { onCreateTodos, onUpdateTodos, onDeleteTodos } from "../graphql/subscriptions";
import { fetchTodos, updateTodosFcn } from "./TodoProviderFcns";



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

    useEffect(() => {

        console.log( "useEffect.subscribe" ) 

        // TODO CURRENTLY subscription ARE  REMOVED
        // const test : Observable<object> = subscriptionCreateTodos
        
        const apiCreateTodos : any = API.graphql(
          graphqlOperation(onCreateTodos)
        )    
    
        const subscriptionCreateTodos : any = apiCreateTodos.subscribe({
          next: (x : any ) => {
            // Do something with the data
            // console.log( x )          
            const item = x.value.data.onCreateTodos
    
            // if ( String(item.listid) !== String(listid) ) {
            //   console.log("subscriptionUpdateTodos (item.listid is not from this list) ", item.listid, listid)
            //   return;
            // }
    
            setTodos([...todosState, item]); // push to the end
            console.log("onCreateTodos... length : ", todosState.length );
          },
          error: ( error : string )  => {
            console.log("error onCreateTodos : ", error);
          }
        })
    
        const apiUpdateTodos : any = API.graphql(
          graphqlOperation(onUpdateTodos)
        ); 
        
        const subscriptionUpdateTodos : any = apiUpdateTodos.subscribe({
          next: (x : any ) => {
            // Do something with the data
            // console.log( x )          
            const item = x.value.data.onUpdateTodos
            console.log("updated Item : ", item, todosState.length); 
            const updatedList = updateTodosFcn(todosState, item)
    
            // TODO: ERROR todos is EMPTY
            setTodos(updatedList)
          },
          error: ( error : string ) => {
            console.log("error onUpdateTodos : ", error);
          }
        })
    
        const apiDeleteTodos : any = API.graphql(
          graphqlOperation(onDeleteTodos)
        )
        
        const subscriptionDeleteTodos : any = apiDeleteTodos.subscribe({
          next: (x : any ) => {
            // Do something with the data          
            const item = x.value.data.onDeleteTodos
            // console.log("deleted Item x    : ", x);
            console.log("deleted Item item : ", item);
            // const updatedList = uiDeleteTodo(todosState, item.id)
            // setTodos(updatedList)
            // remove item with current id
            setTodos([...todosState.filter(todo => todo.id !== item.id)])

          },
          error: ( error : string ) => {
            console.log("error onDeleteTodos : ", error);
          }
        })
    
        return () => {
            console.log( "useEffect.unsubscribe" ) 
            // subscriptionCreateTodos.unsubscribe();
            subscriptionUpdateTodos.unsubscribe();
            subscriptionDeleteTodos.unsubscribe();
        };
    
      },[todosState])    

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
            // remove item with current id
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