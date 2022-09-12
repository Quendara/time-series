/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type CreateTodosInput = {
  id: string,
  owner: string,
  name: string,
  description: string,
  link: string,
  listid: string,
  checked: boolean,
  group: string,
};

export type Todos = {
  __typename: "Todos",
  id: string,
  owner?: string | null,
  listid?: string | null,
  description?: string | null,
  name?: string | null,
  link?: string | null,
  checked?: boolean | null,
  group?: string | null,
};

export type UpdateTodosInput = {
  id: string,
  owner?: string | null,
  name?: string | null,
  link?: string | null,
  listid?: string | null,
  description?: string | null,
  checked?: boolean | null,
  group?: string | null,
};

export type DeleteTodosInput = {
  id: string,
};

export type CreateTodoMainInput = {
  id: string,
  owner: string,
  component: string,
  icon: string,
  listid: string,
  name: string,
  group: string,
  navbar: boolean,
  render: string,
};

export type TodoMain = {
  __typename: "TodoMain",
  id: string,
  owner: string,
  component?: string | null,
  icon?: string | null,
  listid?: string | null,
  name?: string | null,
  navbar?: boolean | null,
  render?: string | null,
  group?: string | null,
};

export type UpdateTodoMainInput = {
  id: string,
  owner?: string | null,
  component?: string | null,
  icon?: string | null,
  listid?: string | null,
  name?: string | null,
  navbar?: boolean | null,
  render?: string | null,
  group?: string | null,
};

export type DeleteTodoMainInput = {
  id: string,
};

export type TableTodosFilterInput = {
  id?: TableStringFilterInput | null,
  owner?: TableStringFilterInput | null,
  listid?: TableStringFilterInput | null,
  name?: TableStringFilterInput | null,
  link?: TableStringFilterInput | null,
  checked?: TableBooleanFilterInput | null,
  group?: TableStringFilterInput | null,
};

export type TableStringFilterInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
};

export type TableBooleanFilterInput = {
  ne?: boolean | null,
  eq?: boolean | null,
};

export type TodosConnection = {
  __typename: "TodosConnection",
  items?:  Array<Todos | null > | null,
  nextToken?: string | null,
};

export type TableTodoMainFilterInput = {
  id?: TableStringFilterInput | null,
  owner?: TableStringFilterInput | null,
  component?: TableStringFilterInput | null,
  icon?: TableStringFilterInput | null,
  listid?: TableIntFilterInput | null,
  name?: TableStringFilterInput | null,
  navbar?: TableBooleanFilterInput | null,
  render?: TableStringFilterInput | null,
};

export type TableIntFilterInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  contains?: number | null,
  notContains?: number | null,
  between?: Array< number | null > | null,
};

export type TodoMainConnection = {
  __typename: "TodoMainConnection",
  items?:  Array<TodoMain | null > | null,
  nextToken?: string | null,
};

export type CreateTodosMutationVariables = {
  input: CreateTodosInput,
};

export type CreateTodosMutation = {
  createTodos?:  {
    __typename: "Todos",
    id: string,
    owner?: string | null,
    listid?: string | null,
    description?: string | null,
    name?: string | null,
    link?: string | null,
    checked?: boolean | null,
    group?: string | null,
  } | null,
};

export type UpdateTodosMutationVariables = {
  input: UpdateTodosInput,
};

export type UpdateTodosMutation = {
  updateTodos?:  {
    __typename: "Todos",
    id: string,
    owner?: string | null,
    listid?: string | null,
    description?: string | null,
    name?: string | null,
    link?: string | null,
    checked?: boolean | null,
    group?: string | null,
  } | null,
};

export type DeleteTodosMutationVariables = {
  input: DeleteTodosInput,
};

export type DeleteTodosMutation = {
  deleteTodos?:  {
    __typename: "Todos",
    id: string,
    owner?: string | null,
    listid?: string | null,
    description?: string | null,
    name?: string | null,
    link?: string | null,
    checked?: boolean | null,
    group?: string | null,
  } | null,
};

export type CreateTodoMainMutationVariables = {
  input: CreateTodoMainInput,
};

export type CreateTodoMainMutation = {
  createTodoMain?:  {
    __typename: "TodoMain",
    id: string,
    owner: string,
    component?: string | null,
    icon?: string | null,
    listid?: string | null,
    name?: string | null,
    navbar?: boolean | null,
    render?: string | null,
    group?: string | null,
  } | null,
};

export type UpdateTodoMainMutationVariables = {
  input: UpdateTodoMainInput,
};

export type UpdateTodoMainMutation = {
  updateTodoMain?:  {
    __typename: "TodoMain",
    id: string,
    owner: string,
    component?: string | null,
    icon?: string | null,
    listid?: string | null,
    name?: string | null,
    navbar?: boolean | null,
    render?: string | null,
    group?: string | null,
  } | null,
};

export type DeleteTodoMainMutationVariables = {
  input: DeleteTodoMainInput,
};

export type DeleteTodoMainMutation = {
  deleteTodoMain?:  {
    __typename: "TodoMain",
    id: string,
    owner: string,
    component?: string | null,
    icon?: string | null,
    listid?: string | null,
    name?: string | null,
    navbar?: boolean | null,
    render?: string | null,
    group?: string | null,
  } | null,
};

export type GetTodosQueryVariables = {
  id: string,
};

export type GetTodosQuery = {
  getTodos?:  {
    __typename: "Todos",
    id: string,
    owner?: string | null,
    listid?: string | null,
    description?: string | null,
    name?: string | null,
    link?: string | null,
    checked?: boolean | null,
    group?: string | null,
  } | null,
};

export type ListTodosQueryVariables = {
  filter?: TableTodosFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListTodosQuery = {
  listTodos?:  {
    __typename: "TodosConnection",
    items?:  Array< {
      __typename: "Todos",
      id: string,
      owner?: string | null,
      listid?: string | null,
      description?: string | null,
      name?: string | null,
      link?: string | null,
      checked?: boolean | null,
      group?: string | null,
    } | null > | null,
    nextToken?: string | null,
  } | null,
};

export type QueryTodosQueryVariables = {
  listid?: string | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type QueryTodosQuery = {
  queryTodos?:  {
    __typename: "TodosConnection",
    items?:  Array< {
      __typename: "Todos",
      id: string,
      owner?: string | null,
      listid?: string | null,
      description?: string | null,
      name?: string | null,
      link?: string | null,
      checked?: boolean | null,
      group?: string | null,
    } | null > | null,
    nextToken?: string | null,
  } | null,
};

export type GetTodoMainQueryVariables = {
  id: string,
};

export type GetTodoMainQuery = {
  getTodoMain?:  {
    __typename: "TodoMain",
    id: string,
    owner: string,
    component?: string | null,
    icon?: string | null,
    listid?: string | null,
    name?: string | null,
    navbar?: boolean | null,
    render?: string | null,
    group?: string | null,
  } | null,
};

export type ListTodoMainsQueryVariables = {
  filter?: TableTodoMainFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListTodoMainsQuery = {
  listTodoMains?:  {
    __typename: "TodoMainConnection",
    items?:  Array< {
      __typename: "TodoMain",
      id: string,
      owner: string,
      component?: string | null,
      icon?: string | null,
      listid?: string | null,
      name?: string | null,
      navbar?: boolean | null,
      render?: string | null,
      group?: string | null,
    } | null > | null,
    nextToken?: string | null,
  } | null,
};

export type OnCreateTodosSubscription = {
  onCreateTodos?:  {
    __typename: "Todos",
    id: string,
    owner?: string | null,
    listid?: string | null,
    description?: string | null,
    name?: string | null,
    link?: string | null,
    checked?: boolean | null,
    group?: string | null,
  } | null,
};

export type OnUpdateTodosSubscription = {
  onUpdateTodos?:  {
    __typename: "Todos",
    id: string,
    owner?: string | null,
    listid?: string | null,
    description?: string | null,
    name?: string | null,
    link?: string | null,
    checked?: boolean | null,
    group?: string | null,
  } | null,
};

export type OnDeleteTodosSubscription = {
  onDeleteTodos?:  {
    __typename: "Todos",
    id: string,
    owner?: string | null,
    listid?: string | null,
    description?: string | null,
    name?: string | null,
    link?: string | null,
    checked?: boolean | null,
    group?: string | null,
  } | null,
};

export type OnCreateTodoMainSubscription = {
  onCreateTodoMain?:  {
    __typename: "TodoMain",
    id: string,
    owner: string,
    component?: string | null,
    icon?: string | null,
    listid?: string | null,
    name?: string | null,
    navbar?: boolean | null,
    render?: string | null,
    group?: string | null,
  } | null,
};

export type OnUpdateTodoMainSubscription = {
  onUpdateTodoMain?:  {
    __typename: "TodoMain",
    id: string,
    owner: string,
    component?: string | null,
    icon?: string | null,
    listid?: string | null,
    name?: string | null,
    navbar?: boolean | null,
    render?: string | null,
    group?: string | null,
  } | null,
};

export type OnDeleteTodoMainSubscription = {
  onDeleteTodoMain?:  {
    __typename: "TodoMain",
    id: string,
    owner: string,
    component?: string | null,
    icon?: string | null,
    listid?: string | null,
    name?: string | null,
    navbar?: boolean | null,
    render?: string | null,
    group?: string | null,
  } | null,
};
