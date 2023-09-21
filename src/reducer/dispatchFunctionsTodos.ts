import { group } from 'console';
import { TodoItem, TodoUpdateItem } from "../models/TodoItems"
import { UpdateTodosInput, CreateTodosInput } from "../API"

export enum TodoActionType {
    TOGGLE          = 'TOGGLE',
    UNCKECK         = 'UNCKECK',
    UPDATE          = 'UPDATE',
    UPDATE_STATE    = 'UPDATE_STATE',
    ADD             = 'ADD',
    DELETE          = 'DELETE'
}

// INTERFACES 
export interface TodoAction {
    type: TodoActionType;
    payload: any;
}

export interface TodoActionUPDATE_STATE extends TodoAction {
    type: TodoActionType;
    payload: { items: TodoItem[] };
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

export const UncheckItem = ( id: string ) : TodoActionTOGGLE => (
    {
        type: TodoActionType.UNCKECK,
        payload: { id: id }
    }
)

export const ToggleItem = ( id: string ) : TodoActionTOGGLE => (
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

export const UpdateState = ( items : TodoItem[] ) : TodoActionUPDATE_STATE => (
    {
        type: TodoActionType.UPDATE_STATE,
        payload: { items }
    }
)

export const DeleteItem = (id: string ): TodoActionTOGGLE => (
    {
        type: TodoActionType.DELETE,
        payload: { id: id }
    }
)