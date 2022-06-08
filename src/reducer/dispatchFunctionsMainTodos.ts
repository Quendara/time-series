import { group } from 'console';
import { TodoMainItem, TodoMainUpdateItem } from "../models/TodoItems"

export enum TodoMainActionType {
    TOGGLE  = 'TOGGLE',
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

export interface TodoMainActionDELETE extends TodoMainAction {
    type: TodoMainActionType;
    payload: {
        id: string
    }
}

export interface TodoMainActionUPDATE extends TodoMainAction {
    type: TodoMainActionType;
    payload: {
        id: string,
        name?: string,
        icon?: string,
        group?: string
    }
}

// Dispatcher Functions
// const handleComplete = () => {
//     // Example / Replace
//     // dispatch({ type: "COMPLETE", id: item.id });
//     dispatch( ToggleItem( item.id ));
// };

export const ToggleItem = (id: string ) : TodoMainActionUPDATE => (
    {
        type: TodoMainActionType.TOGGLE,
        payload: { id: id }
    }
)

export const UpdateItem = ( item : TodoMainUpdateItem ) => (
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