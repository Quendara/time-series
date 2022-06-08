import { updateFunctionTodoMain } from "../components/GraphQlFunctions"
import { TodoMainItem } from "../models/TodoItems"

// import { TodoMainAction } from "./reducerMainTodos"
import { TodoMainAction, TodoMainActionType, TodoMainActionTOGGLE, TodoMainActionUPDATE } from "./dispatchFunctionsMainTodos"
import { UpdateTodoMainInput } from "../API"

// functions
const ReducerToggleItem = ( state: TodoMainItem[], action: TodoMainActionTOGGLE  ) => {
    console.log("TOGGLE action : ", action)
    return state.map((todo) => {
        if ( todo.id === action.payload.id ) {
            
            updateFunctionTodoMain({ id: action.payload.id, navbar: !todo.navbar } )
            return { ...todo, navbar: !todo.navbar };
        } else {
            return todo;
        }
    });
}

const ReducerUpdateItem = ( state: TodoMainItem[], action: TodoMainActionUPDATE  ) => {
    console.log("TOGGLE action : ", action)
    return state.map((todo) => {
        if ( todo.id === action.payload.id ) {
            updateFunctionTodoMain(
                {   id: action.payload.id,
                    name: action.payload.name,
                    icon: action.payload.icon,                    
                    group: action.payload.group
                   }) 
            let newItem = { ...todo } // clone

            if( action.payload.name) newItem.name = action.payload.name;
            if( action.payload.group) newItem.group = action.payload.group;
            
            return newItem
        } else {
            return todo;
        }
    });
} 

// reducer Mapping
export const reducerTodoMain = (state: TodoMainItem[], action: TodoMainAction ) => {

    const { type, payload } = action;

    switch (action.type) {
        case TodoMainActionType.TOGGLE:
            return ReducerToggleItem( state, action );
        case TodoMainActionType.UPDATE:
            return ReducerUpdateItem( state, action );
    
            
        default:
            console.log("UNKNOWN action : ", action)
            return state;
    }
};


