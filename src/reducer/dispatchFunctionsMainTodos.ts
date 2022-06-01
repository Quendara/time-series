import { group } from 'console';
import { TodoMainItem, TodoMainItemUpdate } from "../components/TodoItems"

export enum TodoMainActionType {
    TOGGLE  = 'TOGGLE',
    UPDATE  = 'UPDATE',
    ADD     = 'ADD',
    DELETE  = 'DELETE',
}

// INTERFACES

interface TodoMainAction {
    type: TodoMainActionType;
    payload: any;
}

export interface TodoMainActionTOGGLE extends TodoMainAction {
    type: TodoMainActionType;
    payload: {
        id: number
    }
}

export interface TodoMainActionDELETE extends TodoMainAction {
    type: TodoMainActionType;
    payload: {
        id: number
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

export const ToggleItem = (id: number) : TodoMainActionUPDATE => (
    {
        type: TodoMainActionType.TOGGLE,
        payload: { id: id }
    }
)

export const UpdateItem = ( { id, name, icon, group } : TodoMainItem ): TodoMainActionUPDATE => (
    {
        type: TodoMainActionType.UPDATE,
        payload: { id: id, name: name, icon: icon, group }
    }
)

export const DeleteItem = (id: number): TodoMainActionTOGGLE => (
    {
        type: TodoMainActionType.DELETE,
        payload: { id: id }
    }
)