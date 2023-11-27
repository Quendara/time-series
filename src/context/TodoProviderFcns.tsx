import { API, graphqlOperation } from "aws-amplify";
import { queryTodos } from "../graphql/queries";
import { TodoItem } from "../models/TodoItems"

export async function fetchTodos( listid : string )  {

    console.log("fetchTodos (listid) : ", listid);

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
      console.log("fetched itemns  : ", items);
      return items

    }
    else {
      // response = await API.graphql(graphqlOperation(queryTodos, { filter: { listid: { eq: "" + listid } }, limit: 1000 }));
      let response : any = await API.graphql(graphqlOperation( queryTodos, { listid: listid } ) );
      
      const items : TodoItem[] = response.data.queryTodos.items
      console.log( `fetchTodos  listid : ${listid} items: `, items);
      return items
  
    }
}


export const updateTodosFcn = (items : TodoItem[], todo : TodoItem ) => {

    const newitems = items.map((e, index) => {
  
      if (e.id === todo.id) {
        let newObject = Object.assign({}, e)
        newObject['name'] = todo.name
        newObject['group'] = todo.group
        newObject['link'] = todo.link
        newObject['checked'] = todo.checked
        newObject['description'] = todo.description
        return newObject
      }
      return e
    })
  
    return newitems;
  }