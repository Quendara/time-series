import { updateFunctionTodoMain, createFunctionTodoMain } from "../components/GraphQlFunctions"
import { TodoMainItem } from "../models/TodoItems"

// import { TodoMainAction } from "./reducerMainTodos"
import { TodoMainAction, TodoMainActionType, TodoMainActionTOGGLE, TodoMainActionUPDATE, TodoMainActionADD } from "./dispatchFunctionsMainTodos"
import { UpdateTodoMainInput } from "../API"

const AddItem = ( state: TodoMainItem[], action: TodoMainActionADD  ) => {

    const payload = action.payload;

    const newEl : TodoMainItem = {
        component : payload.component,
        render : payload.render,
        icon : payload.icon,
        listid : payload.listid,
        id:  payload.id,
        name: payload.name, 
        group: payload.group,        
        owner: payload.owner,
        navbar: payload.navbar        
    }

    createFunctionTodoMain( newEl )    
    return [ ...state,  newEl]
}


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
            if( action.payload.icon ) newItem.icon = action.payload.icon;
            
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
        case TodoMainActionType.ADD:
            return AddItem( state, action );
        default:
            console.log("UNKNOWN action : ", action)
            return state;
    }
};


