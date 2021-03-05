/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateTodos = /* GraphQL */ `
  subscription OnCreateTodos(
    $id: String!
    $owner: String!
    $listid: String
    $group: String
  ) {
    onCreateTodos(id: $id, owner: $owner, listid: $listid, group: $group) {
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
export const onUpdateTodos = /* GraphQL */ `
  subscription OnUpdateTodos(
    $id: String!
    $owner: String!
    $listid: String
    $checked: Boolean
    $group: String
  ) {
    onUpdateTodos(
      id: $id
      owner: $owner
      listid: $listid
      checked: $checked
      group: $group
    ) {
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
export const onDeleteTodos = /* GraphQL */ `
  subscription OnDeleteTodos($id: String, $owner: String) {
    onDeleteTodos(id: $id, owner: $owner) {
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
