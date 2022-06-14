import { group } from 'console';
// import { TodoItem, TodoUpdateItem } from "../models/TodoItems"
import { UpdateTodosInput, CreateTodosInput } from "../API"

export enum TodoActionType {
    TOGGLE  = 'TOGGLE',
    UPDATE  = 'UPDATE',
    ADD     = 'ADD',
    DELETE  = 'DELETE'
}

// INTERFACES 
export interface TodoAction {
    type: TodoActionType;
    payload: any;
}

export interface TodoActionTOGGLE extends TodoAction {
    type: TodoActionType;
    payload: {
        id: string
    }
}

export interface TodoActionDELETE extends TodoAction {
    type: TodoActionType;
    payload: {
        id: string
    }
}

export interface TodoActionUPDATE extends TodoAction {
    type: TodoActionType;
    payload: UpdateTodosInput
}

export interface TodoActionADD extends TodoAction {
    type: TodoActionType;
    payload: CreateTodosInput
}

export const AddItem = ( item: CreateTodosInput ) : TodoActionADD  => (
    {
        type: TodoActionType.ADD,
        payload: item
    }
)

export const ToggleItem = ( id: string ) : TodoActionUPDATE => (
    {
        type: TodoActionType.TOGGLE,
        payload: { id: id }
    }
)

export const UpdateItem = ( item : UpdateTodosInput ) : TodoActionUPDATE => (
    {
        type: TodoActionType.UPDATE,
        payload: item
    }
)

export const DeleteItem = (id: string ): TodoActionTOGGLE => (
    {
        type: TodoActionType.DELETE,
        payload: { id: id }
    }
)