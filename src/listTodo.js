import React, { Component, useState, useEffect } from "react";
import { render } from "react-dom";
import { ListQ } from "./list"
import { findUnique, restCallToBackendAsync } from "./helper";

import { MyCard } from "./StyledComponents"
import { CardHeader, CardContent, Button, ButtonGroup, Divider } from '@material-ui/core';
import { useStyles, theme } from "./Styles"

import { todoListMockData } from "./data/todo"
import Settings from "./Settings";

import EditIcon from '@material-ui/icons/Edit';
import VisibilityIcon from '@material-ui/icons/Visibility';


export const ListTodo = ({ token, listid }) => {

    const classes = useStyles();
    const baseRestApi = "https://f7oa7pm5ig.execute-api.eu-central-1.amazonaws.com/Prod"

    // const [tabValue, setTabValue] = useState("Start");
    // const [tabIndex, setTabIndex] = useState(0);

    // const listid = 1 // TODO: Fixed id of this todo list

    const [items, setItems] = useState([]);

    const [edit, setEdit] = useState(false);
    const [hideCompleted, setHideCompleted] = useState(false);


    const loadWhenTokenSet = (token) => {

        // console.log("username", username);
        console.log("loadWhenTokenSet");

        if (token.length > 0 && items.length === 0) {

            console.log("authSuccess", token);

            const url = [baseRestApi, "list", listid, "items"].join("/")
            const options = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token
                }
            };

            fetch(url, options)
                .then(res => res.json())
                .then(
                    result => {
                        console.log("result.body", result.body);
                        setItems(cleanUpItems(JSON.parse(result.body)));
                    },
                    (error) => {
                        console.error("Could not load links : ", error.message);
                    }
                )
                .catch(err => { console.log("XX", err) })
        }
    };

    const cleanUpItems = (items) => {

        return items.map((i) => {

            let retItem = Object.assign({}, i)

            retItem['checked'] = isChecked(retItem['checked'])

            return retItem
        })

    }


    // POST     /links {name, link, group, id}
    // DELETE   /links/:id
    // UPDATE   /links/:id/update/:type/:value 


    // handles
    const addItemHandle = (name, link, group = "") => {
        const id = new Date().getTime();
        const checked = false
        // const group = tabValue
        setItems([...items, { id, name, link, group, checked }]); // push to the end

        console.log("Submitting... ");

        // this.setState({ dataValid: false, submitted: true }); // disable button while submitting

        // const url = [baseRestApi, "todos"].join("/")
        const url = [baseRestApi, "list", listid, "items"].join("/")


        const itemToSend = {
            name, // :name
            group,
            link
        }

        console.log(itemToSend);

        fetch(url, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: token
            },
            body: JSON.stringify(itemToSend)
        }).then(
            result => {
                // setSubmitted(true)
                console.log(result);
            },
            error => {
                // setError(true)
                console.error(error);
            }
        );


    };

    const removeItemHandle = id => {
        const items2 = items.filter(item => item.id !== id);
        setItems(items2); // push to the end

        const url = [baseRestApi, "todos", id].join("/")

        fetch(url, {
            method: "DELETE",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: token
            },
            // body: JSON.stringify(itemToSend)
        }).then(
            result => { console.log(result); },
            error => { console.error(error); }
        );
    };

    const updateFunction = (id, name, link) => {
        // const items2 = items.filter(item => item.id !== id);

        const items2 = items.map((e, index) => {

            if (e.id === id) {
                let newObject = Object.assign({}, e)
                newObject['name'] = name
                newObject['link'] = link
                newObject['checked'] = false
                return newObject
            }
            return e
        })

        setItems(items2);
    };

    const isChecked = (checked) => {
        if (typeof checked === "boolean") { return checked }
        if (typeof checked === "string") { return checked === "true" }
        return false
    }


    const toggleFunction = (id) => {
        // const items2 = items.filter(item => item.id !== id);

        console.log("toggleFunction " + id)
        let newStatus = false

        const items2 = items.map((e, index) => {

            if (e.id === id) {
                let newObject = Object.assign({}, e)
                newObject['checked'] = !isChecked(e.checked)
                newStatus = newObject['checked']
                // newObject['link'] = link
                return newObject
            }
            return e
        })

        const url = [baseRestApi, 'todos', id, "checked", newStatus].join("/")

        const loggingMessage = "toggle todo "
        restCallToBackendAsync(url, token.access, loggingMessage).then(data => {

            //const res = JSON.parse(data)
            console.log("restCallToBackendAsync : ", data)

        })

        setItems(items2);
    };

    const groupedItems = (items, hideCompleted) => {
        return findUnique(items, "group")
    }


    const createLists = (items) => {

        const groups = findUnique(items, "group", false)

        return groups.map((item, index) => (
            <ListQ
                key={ index }
                editList={ edit }
                header={ item.value }
                group={ item.value }
                groups={ groups }
                items={ item.photos }
                addItemHandle={ addItemHandle }
                type={ listid === 1 ? 'todo' : '' }
                removeItemHandle={ removeItemHandle }
                updateFunction={ updateFunction }
                toggleFunction={ toggleFunction }
            />
        ))
    }

    const filterCompleted = (items, hideCompleted) => {
        if (hideCompleted) {
            return items.filter(item => {
                return item.checked === false
            })
        }
        else {
            return items
        }
    }



    return (
        <>
            { loadWhenTokenSet(token) }

            <ButtonGroup variant="contained" >
                <Button color={ edit ? "primary" : "default" } onClick={ () => setEdit(!edit) } startIcon={ <EditIcon /> }> Edit Lists</Button>
                <Button color={ hideCompleted ? "primary" : "default" } onClick={ () => setHideCompleted(!hideCompleted) } startIcon={ <VisibilityIcon /> } >Hide Completed</Button>
            </ButtonGroup>
            <Divider variant="middle" />

            <br />

            <MyCard>
                { createLists(filterCompleted(items, hideCompleted)) }
            </MyCard >
        </>
    );
};


