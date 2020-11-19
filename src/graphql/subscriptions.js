/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateTodos = /* GraphQL */ `
  subscription OnCreateTodos(
    $id: String
    $owner: String
    $listid: String
    $name: String
    $checked: Boolean
    $group: String
  ) {
    onCreateTodos(
      id: $id
      owner: $owner
      listid: $listid
      name: $name
      checked: $checked
      group: $group
    ) {
      id
      owner
      listid
      name
      checked
      group
    }
  }
`;
export const onUpdateTodos = /* GraphQL */ `
  subscription OnUpdateTodos(
    $id: String
    $owner: String
    $listid: Int
    $name: String
    $checked: Boolean
    $group: String
  ) {
    onUpdateTodos(
      id: $id
      owner: $owner
      listid: $listid
      name: $name
      checked: $checked
      group: $group
    ) {
      id
      owner
      listid
      name
      checked
      group
    }
  }
`;
export const onDeleteTodos = /* GraphQL */ `
  subscription OnDeleteTodos(
    $id: String
    $owner: String
    $listid: String
    $name: String
    $checked: Boolean
    $group: String
  ) {
    onDeleteTodos(
      id: $id
      owner: $owner
      listid: $listid
      name: $name
      checked: $checked
      group: $group
    ) {
      id
      owner
      listid
      name
      checked
      group
    }
  }
`;
