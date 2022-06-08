/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createTodos = /* GraphQL */ `
  mutation CreateTodos($input: CreateTodosInput!) {
    createTodos(input: $input) {
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
export const updateTodos = /* GraphQL */ `
  mutation UpdateTodos($input: UpdateTodosInput!) {
    updateTodos(input: $input) {
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
export const deleteTodos = /* GraphQL */ `
  mutation DeleteTodos($input: DeleteTodosInput!) {
    deleteTodos(input: $input) {
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
export const createTodoMain = /* GraphQL */ `
  mutation CreateTodoMain($input: CreateTodoMainInput!) {
    createTodoMain(input: $input) {
      id
      owner
      component
      icon
      listid
      name
      navbar
      render
      group
    }
  }
`;
export const updateTodoMain = /* GraphQL */ `
  mutation UpdateTodoMain($input: UpdateTodoMainInput!) {
    updateTodoMain(input: $input) {
      id
      owner
      component
      icon
      listid
      name
      navbar
      render
      group
    }
  }
`;
export const deleteTodoMain = /* GraphQL */ `
  mutation DeleteTodoMain($input: DeleteTodoMainInput!) {
    deleteTodoMain(input: $input) {
      id
      owner
      component
      icon
      listid
      name
      navbar
      render
      group
    }
  }
`;
