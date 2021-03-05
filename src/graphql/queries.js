/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getTodos = /* GraphQL */ `
  query GetTodos($id: String!, $owner: String!) {
    getTodos(id: $id, owner: $owner) {
      id
      owner
      listid
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
