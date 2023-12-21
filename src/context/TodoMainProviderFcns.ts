import { API, graphqlOperation } from "aws-amplify";
import { listTodoMains } from "../graphql/queries";
import { TodoMainItem } from "../models/TodoItems";
import { deleteTodoMain } from "../graphql/mutations";

export async function fetchTodosMainFcn(owner: string) {

    console.log("useGetMainTodos (id) : ", owner);
    if (owner === undefined){
        const ret: TodoMainItem[] = []
        return ret;
    } 


    const response: any = await API.graphql(
        graphqlOperation(listTodoMains, { filter: { owner: { eq: owner } }, limit: 200 })
    );

    const items : TodoMainItem[] = response.data.listTodoMains.items
    // console.log("useGetMainTodos : ", items);
    return items
}

export async function removeMainTodoItemById( todoid : string ) {
    const idWithoutLeading_ = todoid.substring(1); 
    await API.graphql(graphqlOperation(deleteTodoMain, { input: { id: idWithoutLeading_ } }));
};


