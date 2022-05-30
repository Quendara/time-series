/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getTodos = /* GraphQL */ `
  query GetTodos($id: String!, $owner: String!) {
    getTodos(id: $id, owner: $owner) {
      id
      owner
      listid
      description
      name
      link
      checked
      group
      datum
    }
  }
`;
export const listTodos = /* GraphQL */ `
  query ListTodos(
    $filter: TableTodosFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTodos(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        owner
        listid
        description
        name
        link
        checked
        group
        datum
      }
      nextToken
    }
  }
`;
export const queryTodos = /* GraphQL */ `
  query QueryTodos($listid: String, $limit: Int, $nextToken: String) {
    queryTodos(listid: $listid, limit: $limit, nextToken: $nextToken) {
      items {
        id
        owner
        listid
        description
        name
        link
        checked
        group
        datum
      }
      nextToken
    }
  }
`;
export const getTodoMain = /* GraphQL */ `
  query GetTodoMain($id: String!) {
    getTodoMain(id: $id) {
      id
      owner
      component
      icon
      listid
      name
      navbar
      render
    }
  }
`;
export const listTodoMains = /* GraphQL */ `
  query ListTodoMains(
    $filter: TableTodoMainFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTodoMains(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        owner
        component
        icon
        listid
        name
        navbar
        render
      }
      nextToken
    }
  }
`;
