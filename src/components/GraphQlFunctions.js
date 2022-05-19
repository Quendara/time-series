import Amplify, { API, graphqlOperation } from 'aws-amplify';
import { getTodos, listTodos } from '../graphql/queries';
import { updateTodos, deleteTodos, createTodos } from '../graphql/mutations';

export async function getTodosFcn( itemid : string , owner : string ) {
    
    console.log("getTodosFcn (id) : ", itemid );0
    if( itemid === undefined ) return {}

    const _todos = await API.graphql(graphqlOperation(getTodos, { id: itemid, owner: owner }));
    const item = _todos.data.getTodos

    console.log("getTodosFcn : ", item);
    return item
}    


export async function getTodosByListIdFcn( listid ) {

    if( listid === undefined ) return []

    let _todos = await API.graphql(graphqlOperation( listTodos, { filter: { listid: { eq: "" + listid } }, limit: 500 }));
    const items = _todos.data.listTodos.items
    console.log("getTodosByListIdFcn : ", items);    
    return items
}

export async function removeItemByIdFcn(todoid) {

    // todo: remove username from dynamo db key
    const username = "andre"
    await API.graphql(graphqlOperation(deleteTodos, { input: { id: "" + todoid, owner: username } }));
};