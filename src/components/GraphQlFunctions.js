import Amplify, { API, graphqlOperation } from 'aws-amplify';
import { getTodos } from '../graphql/queries';

export async function getTodosFcn(id : string , owner : string ) {
    const _todos = await API.graphql(graphqlOperation(getTodos, { id: id, owner: owner }));
    const item = _todos.data.getTodos

    console.log("getTodos : ", item);
    return item
}    