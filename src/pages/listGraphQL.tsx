import React, { useEffect, useContext } from 'react';
import { useNavigate, useParams } from "react-router-dom";

// import { updateTodos, deleteTodos, createTodos } from '../graphql/mutations';

import { ListPage } from './ListPage';

// import { useGetTodo } from "../hooks/useGetTodo"

import { UpdateTodosInput } from "../API"

import { TodoItem, TodoMainItem } from "../models/TodoItems"
import { TodoListType } from "../components/List"
import { TodoContext, TodoProvider } from '../context/TodoProvider';
import { ListPage_Shopping } from './ListPage_Shopping';

interface ListProps {
    lists: TodoMainItem[];
    username: string;
    color: string;
    horizontally: boolean;
}

export const ListGraphQL = (props: ListProps) => {

    let { listid, listtype, itemid } = useParams<{ listid: string, listtype: TodoListType, itemid?: string }>();

    console.log("ListGraphQL : ", listid)

    // const items = useGetTodos(listid);

    return (
        <>
            <TodoProvider>
                <ListGraphInternal
                    listid={listid ? listid : ""}
                    // items={items}
                    listtype={listtype ? listtype : TodoListType.UNDEFINED}
                    horizontally={listtype === TodoListType.LINKS}
                    itemid={itemid}
                    color={props.color}
                    lists={props.lists}
                    username={props.username} />
            </TodoProvider>
        </>
    )
}

interface ListPropsInternal {

    lists: TodoMainItem[];
    // items: TodoItem[];
    username: string;
    listid: string;
    listtype: TodoListType;
    horizontally: boolean;
    itemid?: string;
    color: string
}


export const ListGraphInternal = ({ lists, username, horizontally, listid, listtype, itemid, color }: ListPropsInternal) => {

    // const [todos, dispatch] = useReducer(reducerTodo, items);

    const context = useContext(TodoContext)

    const navigate = useNavigate();

    useEffect(() => {


        // context.feedTodoes( items )
        context.fetchTodos(listid)
        console.log("useEffect.fetchTodos", listid)

        // dispatch(UpdateState(items))

    }, [listid]);

    const isChecked = (checked: boolean) => {
        return checked
    }

    async function toggleFunction(todoid: string) {
        context.toggleTodo(todoid)
        // dispatch(ToggleItem(todoid))
    }

    async function uncheckFunction(todoid: string) {
        context.uncheckFunction(todoid)

        // dispatch(UncheckItem(todoid))
    }

    async function updateFunction(inputObject: UpdateTodosInput) {
        context.updateTodo(inputObject)
        // dispatch(UpdateItem(inputObject))
    };

    // handles
    async function addItemHandle(name: string, link: string, group: string = "") {

        const id = new Date().getTime();

        const input: TodoItem =
        {
            id: "" + id,
            group: group,
            link: link,
            listid: listid,
            description: "",
            name: name,
            checked: false
            // datum: ""
        }

        context.appendTodo(input, username)

        // dispatch(AddItem(input))
    }

    async function removeItemHandle(todoid: string) {
        // dispatch(DeleteItem(todoid))
        context.deleteTodo(todoid)

        // await API.graphql(graphqlOperation(deleteTodos, { input: { id: "" + todoid } }));
    };

    if (listtype === TodoListType.SHOPPING) {
        return (
            <ListPage_Shopping
                todos={context.todos}
                listtype={listtype}
                listid={listid}
                addItemHandle={addItemHandle}
                horizontally={horizontally}
                selectedItemId={itemid}
                color={color}
                removeItemHandle={removeItemHandle}
                updateFunction={updateFunction}
                toggleFunction={toggleFunction}
                uncheckFunction={uncheckFunction}
                lists={lists}
                username={username}
            />
        )
    }

    return (

        <ListPage
            todos={context.todos}
            listtype={listtype}
            listid={listid}
            addItemHandle={addItemHandle}
            horizontally={horizontally}
            selectedItemId={itemid}
            color={color}
            removeItemHandle={removeItemHandle}
            updateFunction={updateFunction}
            toggleFunction={toggleFunction}
            uncheckFunction={uncheckFunction}
            lists={lists}
            username={username}
        />)
}


