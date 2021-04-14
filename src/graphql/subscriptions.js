/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateTodos = /* GraphQL */ `
  subscription OnCreateTodos {
    onCreateTodos {
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
  subscription OnUpdateTodos {
    onUpdateTodos {
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
