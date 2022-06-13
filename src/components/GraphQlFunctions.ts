// import Amplify, { API, graphqlOperation } from 'aws-amplify';
import API, {GraphQLResult, graphqlOperation}  from '@aws-amplify/api';
// import { GetTodoQuery } from './GraphQlFunctions';

import { getTodos, listTodos } from '../graphql/queries';
import { updateTodos, deleteTodos, createTodos } from '../graphql/mutations';
import { updateTodoMain, deleteTodoMain, createTodoMain } from '../graphql/mutations';
// import { TodoUpdateItem, TodoMainUpdateItem } from "../models/TodoItems"
import { Todos, TodoMain, GetTodosQuery, ListTodosQuery } from "../API"
import { UpdateTodoMainInput, UpdateTodosInput, CreateTodoMainInput } from "../API"



export async function removeItemByIdFcn( todoid : string ) {

    // todo: remove username from dynamo db key
    const username = "andre"
    await API.graphql(graphqlOperation(deleteTodos, { input: { id: todoid, owner: username } }));
};




export async function updateFunction( inputObject : UpdateTodosInput  ) {
    // let inputObject = { id: "" + id, name:name, listid, link, group, description, checked } // , link: link, group: group, owner: username, name: name, description: description } }
    console.log("updateFunction update", inputObject.id, "with", inputObject);

    await API.graphql(graphqlOperation(updateTodos, { input: inputObject }));
};

export async function updateFunctionTodoMain( inputObject: UpdateTodoMainInput  ) {

    // let inputObject = { id: "" + id, name:name, icon, render, navbar, group } // , link: link, group: group, owner: username, name: name, description: description } }
    console.log("updateFunctionTodoMain ", inputObject.id, " with ", inputObject);
    await API.graphql(graphqlOperation(updateTodoMain, { input: inputObject }));
};


export async function createFunctionTodoMain( inputObject: CreateTodoMainInput  ) {

    // let inputObject = { id: "" + id, name:name, icon, render, navbar, group } // , link: link, group: group, owner: username, name: name, description: description } }
    console.log("createFunctionTodoMain ", inputObject.id, " with ", inputObject);
    await API.graphql(graphqlOperation(createTodoMain, { input: inputObject }));
};



export const getTodosFcn = async ( itemid : string , owner : string ) => {
    
    const response : any = (await API.graphql(graphqlOperation(getTodos, { id: itemid, owner: owner } )))

    // const response : GraphQLResult<GetTodoQuery> = await API.graphql(graphqlOperation(getTodos, { id: itemid, owner: owner }));

    // GraphQLResult<API.GetTodoQuery> 
    // const any_response =  response; // as any;
    const item = response.data.getTodos;

    console.log("getTodosFcn : ", item);
    return item
}



export const getTodosByListIdFcn = async ( listid: string ) => {
    
    // const response : { data: ListTodosQuery } =
    const response : any =
        ( await API.graphql(graphqlOperation( listTodos, { filter: { listid: { eq: "" + listid } }, limit: 500 }))) 
    // const any_response =  response as any;
    const items = response.data.listTodos.items
    
    console.log("getTodosByListIdFcn : ", items);    
    return items
}


