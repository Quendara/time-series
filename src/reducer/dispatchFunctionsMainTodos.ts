import { group } from 'console';
// import { TodoMainItem, TodoMainUpdateItem } from "../models/TodoItems"
import { UpdateTodoMainInput, TodoMain, CreateTodoMainInput } from "../API"
import { TodoMainItem } from '../models/TodoItems';

export enum TodoMainActionType {
    TOGGLE  = 'TOGGLE',
    REPLACE_STATE  = 'REPLACE_STATE',
    UPDATE  = 'UPDATE',
    ADD     = 'ADD',
    DELETE  = 'DELETE',
}

// INTERFACES
export interface TodoMainAction {
    type: TodoMainActionType;
    payload: any;
}

export interface TodoMainActionTOGGLE extends TodoMainAction {
    type: TodoMainActionType;
    payload: {
        id: string
    }
}

export interface TodoMainActionREPLACE_STATE extends TodoMainAction {
    type: TodoMainActionType;
    payload: {
        items: TodoMainItem[]
    }
}


export interface TodoMainActionDELETE extends TodoMainAction {
    type: TodoMainActionType;
    payload: {
        id: string
    }
}

export interface TodoMainActionUPDATE extends TodoMainAction {
    type: TodoMainActionType;
    payload: UpdateTodoMainInput
}

export interface TodoMainActionADD extends TodoMainAction {
    type: TodoMainActionType;
    payload: CreateTodoMainInput
}

export const AddItem = ( item: CreateTodoMainInput ) : TodoMainActionADD  => (
    {
        type: TodoMainActionType.ADD,
        payload: item
    }
)

export const ReplaceState = ( items: TodoMainItem[] ) : TodoMainActionREPLACE_STATE  => (
    {
        type: TodoMainActionType.REPLACE_STATE,
        payload: { items }
    }
)

export const ToggleItem = (id: string ) : TodoMainActionUPDATE => (
    {
        type: TodoMainActionType.TOGGLE,
        payload: { id: id }
    }
)

export const UpdateItem = ( item : UpdateTodoMainInput ) : TodoMainActionUPDATE => (
    {
        type: TodoMainActionType.UPDATE,
        payload: item
    }
)

export const DeleteItem = (id: string ): TodoMainActionTOGGLE => (
    {
        type: TodoMainActionType.DELETE,
        payload: { id: id }
    }
)