import { updateFunctionTodo, createFunctionTodo, removeItemById } from "../components/GraphQlFunctions"
import { TodoItem } from "../models/TodoItems"

// import { TodoAction } from "./reducerMainTodos"
import { TodoAction, TodoActionType, TodoActionTOGGLE, TodoActionUPDATE, TodoActionADD, TodoActionDELETE } from "./dispatchFunctionsTodos"
import { CreateTodosInput, UpdateTodosInput } from "../API"

const AddItem = (state: TodoItem[], action: TodoActionADD) => {

    const payload = action.payload;

    const newEl: TodoItem = {
        id: payload.id,
        listid: payload.listid,
        name: payload.name,
        checked: payload.checked,
        group: payload.group,
        description: payload.description,
        link: payload.link
    }

    createFunctionTodo(payload)
    return [...state, newEl]
}

// functions
const ReducerDeleteItem = (state: TodoItem[], action: TodoActionDELETE): TodoItem[] => {
    removeItemById(action.payload.id)
    return [...state.filter(item => item.id !== action.payload.id)]
}



// functions
const ReducerToggleItem = (state: TodoItem[], action: TodoActionTOGGLE): TodoItem[] => {
    console.log("TOGGLE action : ", action)
    return state.map((todo) => {
        if (todo.id === action.payload.id) {

            updateFunctionTodo({ id: action.payload.id, checked: !todo.checked })
            return { ...todo, checked: !todo.checked };
        } else {
            return todo;
        }
    });
}

const ReducerUncheckItem = (state: TodoItem[], action: TodoActionTOGGLE): TodoItem[] => {
    console.log("TOGGLE action : ", action)
    return state.map((todo) => {
        if (todo.id === action.payload.id) {
            updateFunctionTodo({ id: action.payload.id, checked: false })
            return { ...todo, checked: false };
        } else {
            return todo;
        }
    });
}

const ReducerUpdateItem = (state: TodoItem[], action: TodoActionUPDATE) => {
    console.log("TOGGLE action : ", action)
    return state.map((todo) => {
        if (todo.id === action.payload.id) {

            updateFunctionTodo(
                {
                    id: action.payload.id,
                    name: action.payload.name,
                    group: action.payload.group,
                    description: action.payload.description,
                })


            let newItem = { ...todo } // clone

            // overwrite when exists
            if (action.payload.name) newItem.name = action.payload.name;
            if (action.payload.group) newItem.group = action.payload.group;
            if (action.payload.description) newItem.description = action.payload.description;

            return newItem
        } else {
            return todo;
        }
    });
}

// reducer Mapping
export const reducerTodo = (state: TodoItem[], action: TodoAction): TodoItem[] => {

    const { type, payload } = action;

    switch (action.type) {
        case TodoActionType.TOGGLE:
            return ReducerToggleItem(state, action);
        case TodoActionType.UNCKECK:
            return ReducerUncheckItem(state, action);   

        case TodoActionType.DELETE:
            return ReducerDeleteItem(state, action);
        case TodoActionType.UPDATE_STATE:
            return [...action.payload]

        case TodoActionType.UPDATE:
            return ReducerUpdateItem(state, action);
        case TodoActionType.ADD:
            return AddItem(state, action);
        default:
            console.log("UNKNOWN action : ", action)
            return state;
    }
};


