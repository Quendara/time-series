/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateTodos = /* GraphQL */ `
  subscription OnCreateTodos {
    onCreateTodos {
      id
      owner
      listid
      description
      name
      link
      checked
      group
    }
  }
`;
export const onUpdateTodos = /* GraphQL */ `
  subscription OnUpdateTodos {
    onUpdateTodos {
      id
      owner
      listid
      description
      name
      link
      checked
      group
    }
  }
`;
export const onDeleteTodos = /* GraphQL */ `
  subscription OnDeleteTodos {
    onDeleteTodos {
      id
      owner
      listid
      description
      name
      link
      checked
      group
    }
  }
`;
export const onCreateTodoMain = /* GraphQL */ `
  subscription OnCreateTodoMain(
    $id: String
    $owner: String
    $component: String
    $icon: String
    $listid: String
  ) {
    onCreateTodoMain(
      id: $id
      owner: $owner
      component: $component
      icon: $icon
      listid: $listid
    ) {
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
export const onUpdateTodoMain = /* GraphQL */ `
  subscription OnUpdateTodoMain(
    $id: String
    $owner: String
    $component: String
    $icon: String
    $listid: String
  ) {
    onUpdateTodoMain(
      id: $id
      owner: $owner
      component: $component
      icon: $icon
      listid: $listid
    ) {
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
export const onDeleteTodoMain = /* GraphQL */ `
  subscription OnDeleteTodoMain(
    $id: String
    $owner: String
    $component: String
    $icon: String
    $listid: String
  ) {
    onDeleteTodoMain(
      id: $id
      owner: $owner
      component: $component
      icon: $icon
      listid: $listid
    ) {
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
