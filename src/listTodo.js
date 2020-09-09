import React, { Component, useState, useEffect } from "react";
import { render } from "react-dom";
import { ListQ } from "./list";
import { findUnique } from "./helper";

import { MyCard } from "./StyledComponents"
import { CardHeader, CardContent, Button, ButtonGroup, Divider } from '@material-ui/core';
import { useStyles, theme } from "./Styles"

import {todoListMockData} from "./data/todo"

import Settings from "./Settings";

export const ListTodo = ({ token }) => {

    const classes = useStyles();

    // const [tabValue, setTabValue] = useState("Start");
    // const [tabIndex, setTabIndex] = useState(0);

    const [items, setItems] = useState([]);

    const [edit, setEdit] = useState(false);
    const [hideCompleted, setHideCompleted] = useState(false);


    const loadWhenTokenSet = (token) => {



        // console.log("username", username);
        console.log("authSuccess", token);

        if (token.length > 0 && items.length == 0) {

            setItems(todoListMockData);


            //       // fetch URL with valid token
            //       const url = Settings.baseAwsUrl + "links";

            //       console.log("useEffect");

            //       const fakeToken = "bnbvbnvbnvnb";

            //       const options = {
            //         headers: {
            //           "Content-Type": "application/json",
            //           Authorization: token
            //         }
            //       };

            //       fetch(url, options)
            //         .then(res => res.json())
            //         .then(
            //           result => {
            //             console.log("result", result);
            //             setItems(result);
            //           },
            //           (error) => {
            //             console.error("Could not load links : ", error.message);
            //           }
            //         )
            //         .catch(err => { console.log("XX", err) })
        }
    };


    // POST     /links {name, link, group, id}
    // DELETE   /links/:id
    // UPDATE   /links/:id/update/:type/:value 


    // handles
    const addItemHandle = (name, link, group = "") => {
        const id = new Date().getTime();
        // const group = tabValue
        setItems([...items, { name, link, group, id }]); // push to the end
    };

    const removeItemHandle = id => {
        const items2 = items.filter(item => item.id !== id);
        setItems(items2); // push to the end
    };

    const updateFunction = (id, name, link) => {
        // const items2 = items.filter(item => item.id !== id);

        const items2 = items.map((e, index) => {

            if (e.id === id) {
                let newObject = Object.assign({}, e)
                newObject['name'] = name
                newObject['link'] = link
                return newObject
            }
            return e
        })

        setItems(items2);
    };
    const toggleFunction = (id) => {
        // const items2 = items.filter(item => item.id !== id);

        console.log("toggleFunction " + id)

        const items2 = items.map((e, index) => {

            if (e.id === id) {
                let newObject = Object.assign({}, e)
                newObject['checked'] = !e.checked
                // newObject['link'] = link
                return newObject
            }
            return e
        })

        setItems(items2);
    };

    const createLists = (items) => {
        return findUnique(items, "group").map((item, index) => (
            <>
                <ListQ
                    editList={ edit }
                    header={ item.value }
                    group={ item.value }
                    items={ item.photos }
                    addItemHandle={ addItemHandle }
                    type="todo"
                    removeItemHandle={ removeItemHandle }
                    updateFunction={ updateFunction }
                    toggleFunction={ toggleFunction }
                />
            </>
        ))
    }

    const filterCompleted = ( items, hideCompleted ) => {
        if( hideCompleted ){
            return items.filter( item => {
                return  item.checked === false
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
            <Button  color={ edit ? "primary" : "default" } onClick={ () => setEdit(!edit) } >Edit Lists</Button>
            <Button  color={ hideCompleted ? "primary" : "default" } onClick={ () => setHideCompleted(!hideCompleted) } >Hide Completed</Button>
            </ButtonGroup>
            <Divider variant="middle" />
            <br />

            <MyCard>
                { createLists(filterCompleted( items, hideCompleted )) }
            </MyCard >
        </>
    );
};


