import React, { useState, useEffect } from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useRouteMatch,
    useParams
} from "react-router-dom";

// import ViewEvent from './ViewEvent';

import Amplify, { API, input, Auth, graphqlOperation } from 'aws-amplify';
import AWSAppSyncClient, { AUTH_TYPE } from 'aws-appsync';
// import , {  } from 'aws-amplify';

import SearchIcon from '@material-ui/icons/Search';

import { Grid, Paper, Card, CardHeader, CardContent, Button, ButtonGroup, TextField, List, ListItem, Divider, Hidden } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';


import { ThemeProvider, CssBaseline } from "@material-ui/core";
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import InputAdornment from '@material-ui/core/InputAdornment';

import VisibilityIcon from '@material-ui/icons/Visibility';
import ClearIcon from '@material-ui/icons/Clear';
import TextRotationNoneIcon from '@material-ui/icons/TextRotationNone';

import { listTodos, getTodos } from '../graphql/queries';
import { onUpdateTodos, onCreateTodos, onDeleteTodos } from '../graphql/subscriptions';
import { updateTodos, deleteTodos, createTodos } from '../graphql/mutations';

// import * as subscriptions from './graphql/subscriptions';



import { useStyles, theme } from "../Styles"

// own
import { ListQ } from '../components/List';
import { AddForm } from '../components/AddForm';
// import { TypographyDisabled, TypographyEnabled, MyListItemHeader } from "./StyledComponents"
import { findUnique, restCallToBackendAsync, sortArrayBy } from "../components/helper";
import { MyCard, MyCardHeader } from "../components/StyledComponents"

import { Navigation } from "../organisms/navigation"

// import { error } from "../components/erros"

const FilterComponent = ({ callback }) => {

    const [item, setItem] = useState("");

    const setFilter = (text) => {
        setItem(text)
        callback(text)
    }

    const checkEnter = (e) => {
        if (e.key === "Enter") {
            // alert("Enter")
            // handleClick(e)
        }
    }

    return (

        <TextField
            value={ item }
            label="Filter"

            fullWidth
            variant="outlined"
            InputProps={ {
                startAdornment: (
                    <InputAdornment >
                        <SearchIcon />
                    </InputAdornment>
                ),
                endAdornment: (
                    <InputAdornment >
                        <IconButton
                            disabled={ item.length === 0 }
                            onClick={ () => setFilter("") }

                        >
                            <ClearIcon />
                        </IconButton>
                    </InputAdornment>
                )
            } }
            onKeyPress={ e => checkEnter(e) }
            onChange={ e => setFilter(e.target.value) }
        />

    )
}



export const ListGraphQL = ({ token, apikey, username, errorHandle }) => {

    // let match = useRouteMatch();
    let { listid, listtype } = useParams();

    // // const token = 'big long jwt here';
    // const domainOrProviderName = 'cognito-idp.us-east-1.amazonaws.com/us-east-1_XXXXXXXXX';
    // const expiresIn = 2700;

    // // // tslint:disable-next-line: max-line-length

    const classes = useStyles();

    // const listid = 1;
    const [todos, setTodos] = useState([]);

    const [edit, setEdit] = useState(false);
    const [filterText, setFilterText] = useState("");
    const [hideCompleted, setHideCompleted] = useState(false);
    const [horizontally, setHorizontally] = useState(false);

    const callbackFilter = (text) => {
        setFilterText(text)
    }

    useEffect(
        () => {
            setTodos([]);

            if (apikey) {
                // works
                const awsmobile = {
                    "aws_project_region": "eu-central-1",
                    "aws_appsync_graphqlEndpoint": "https://dfmsa6fzibhrrm3byqhancekju.appsync-api.eu-central-1.amazonaws.com/graphql",
                    "aws_appsync_region": "eu-central-1",
                    "aws_appsync_authenticationType": "API_KEY",
                    "aws_appsync_apiKey": apikey
                };
                Amplify.configure(awsmobile);
                fetchTodos()
            }
        }, [apikey, listid])

    useEffect(
        () => {

            if (apikey) {

                // console.log("useEffect - todos : ", todos);
                // const subscription = props.source.subscribe();

                const subscriptionCreateTodos = API.graphql(
                    graphqlOperation(onCreateTodos)
                ).subscribe({
                    next: (x) => {
                        // Do something with the data
                        // console.log( x )          
                        const item = x.value.data.onCreateTodos
                        console.log("create Items : ", item);
                        // console.log("items : ", items);
                        // setItems([...items, { id, name, link, group, checked }]); // push to the end
                        setTodos([...todos, item]); // push to the end
                        console.log("Submitting... ");



                    },
                    error: error => {
                        console.log("error : ", error);
                    }
                })

                const subscriptionUpdateTodos = API.graphql(
                    graphqlOperation(onUpdateTodos)
                ).subscribe({
                    next: (x) => {
                        // Do something with the data
                        // console.log( x )          
                        const item = x.value.data.onUpdateTodos
                        console.log("updated Item : ", item);

                        // const fullitem = getTodosFcn( item.id, item.owner )                       
                        const updatedList = uiUpdateTodo(todos, item)
                        setTodos(updatedList)
                    },
                    error: error => {
                        console.log("error : ", error);
                    }
                })

                const subscriptionDeleteTodos = API.graphql(
                    graphqlOperation(onDeleteTodos)
                ).subscribe({
                    next: (x) => {
                        // Do something with the data          
                        const item = x.value.data.onDeleteTodos
                        // console.log("deleted Item x    : ", x);
                        console.log("deleted Item item : ", item);
                        const updatedList = uiDeleteTodo(todos, item.id)
                        setTodos(updatedList)
                    },
                    error: error => {
                        console.log("error : ", error);
                    }
                })

                return () => {
                    subscriptionUpdateTodos.unsubscribe();
                    subscriptionDeleteTodos.unsubscribe();
                    subscriptionCreateTodos.unsubscribe();
                };
            }
        }
    );


    const uiDeleteTodo = (items, id) => {

        const newitems = items.filter(item => item.id !== id);
        return newitems;
    }


    const uiUpdateTodo = (items, todo) => {

        const newitems = items.map((e, index) => {

            if (e.id === todo.id) {
                let newObject = Object.assign({}, e)
                newObject['name'] = todo.name
                newObject['group'] = todo.group
                newObject['link'] = todo.link
                newObject['checked'] = todo.checked
                return newObject
            }
            return e
        })

        return newitems;
    }

    async function fetchTodos() {
        const _todos = await API.graphql(graphqlOperation(listTodos, { filter: { listid: { eq: "" + listid } }, limit: 500 }));

        const items = _todos.data.listTodos.items
        console.log("fetchTodos : ", items);
        setTodos(items)
        return items
    }

    async function getTodosFcn(id, owner) {
        const _todos = await API.graphql(graphqlOperation(getTodos, { id: "160361190804", owner: username }));
        const item = _todos.data.getTodos

        console.log("getTodos : ", item);
        return item
    }

    const isChecked = (checked) => {
        if (typeof checked === "boolean") { return checked }
        if (typeof checked === "string") { return checked === "true" }
        return false
    }


    async function toggleFunction(todoid) {

        // get Check Status
        let newStatus = false
        const items2 = todos.map((e, index) => {

            if (e.id === todoid) {
                let newObject = Object.assign({}, e)
                newObject['checked'] = !isChecked(e.checked)
                newStatus = newObject['checked']
                // newObject['link'] = link
                return newObject
            }
            return e
        })

        setTodos(items2)

        /* update a todo */
        await API.graphql(graphqlOperation(updateTodos, { input: { id: "" + todoid, owner: username, checked: newStatus } }));
    }

    async function updateFunction(todoid, name, link, group) {
        // const items2 = items.filter(item => item.id !== id);

        await API.graphql(graphqlOperation(updateTodos, { input: { id: "" + todoid, link: link, group: group, owner: username, name: name } }));
    };

    // handles
    async function addItemHandle(name, link, group = "") {
        const id = new Date().getTime();
        await API.graphql(graphqlOperation(createTodos,
            {
                input:
                {
                    id: "" + id,
                    group: group,
                    link: link,
                    listid: listid,
                    owner: username,
                    name: name,
                    checked: false
                }
            }));

    }


    async function removeItemHandle(todoid) {

        // const items2 = uiDeleteTodo( todos, todoid )
        // setTodos(items2); // push to the end
        await API.graphql(graphqlOperation(deleteTodos, { input: { id: "" + todoid, owner: username } }));
    };

    const createLists = (items) => {

        const groups = findUnique(items, "group", false)

        return (
            <>
                { horizontally ? (
                    <div style={ { "width": groups.length * 310 + "px" } }>
                        { groups.map((item, index) => (
                            <div key={index} style={ { "width": "300px", "float": "left", "marginRight": "10px" } } >

                                <MyCard>
                                    <ListQ
                                        key={ index }
                                        editList={ edit }
                                        header={ item.value }
                                        group={ item.value }
                                        items={ sortArrayBy( item.listitems, "name" ) }
                                        groups={ groups }
                                        addItemHandle={ addItemHandle }
                                        type={ listtype }
                                        removeItemHandle={ removeItemHandle }
                                        updateFunction={ updateFunction }
                                        toggleFunction={ toggleFunction }
                                    />
                                </MyCard>
                            </div>
                        )) }
                    </div>

                ) : (
                    <Grid container spacing={ 4 } >
                        { groups.map((item, index) => (
                            <Grid key={index} item xs={ 12 }>

                                <MyCard>
                                    <ListQ
                                        key={ index }
                                        editList={ edit }
                                        header={ item.value }
                                        group={ item.value }
                                        items={ sortArrayBy( item.listitems, "name",  ) }
                                        groups={ groups }
                                        addItemHandle={ addItemHandle }
                                        type={ listtype }
                                        removeItemHandle={ removeItemHandle }
                                        updateFunction={ updateFunction }
                                        toggleFunction={ toggleFunction }
                                    />
                                </MyCard>
                            </Grid>
                        )) }
                    </Grid>
                )

                }
            </>

        )
    }

    const filterCompleted = (items, hideCompleted, filterText) => {

        let filteredItems = items
        if (hideCompleted) {
            filteredItems = items.filter(item => {
                return item.checked === false
            })
        }

        const FILTER = filterText.toUpperCase()

        if (filterText.length !== 0) {
            filteredItems = filteredItems.filter(item => {
                const currentItem = item.name.toUpperCase()
                return (currentItem.indexOf(FILTER) != -1)
            })
        }

        return filteredItems
    }

    const filteredTodos = filterCompleted(todos, hideCompleted, filterText)


    return (

        <Grid container spacing={ 4 } >
            {/* <Hidden mdDown>
                <Grid item lg={ 2 }  >
                    <Grid item className={ classes.navigation } >
                        <Navigation list={ findUnique(todos, "group", false) } name="value" anchor="value" />
                    </Grid>
                </Grid>
            </Hidden> */}
            <Grid item lg={ 12 } xs={ 12 } >
                <MyCard>
                    <MyCardHeader >
                        <List>
                            <ListItem>
                                <Grid container alignItems="center" justify="flex-start" spacing={ 2 } >

                                    <Grid item xs={ 10 } lg={ 8 } >
                                        { edit ? (
                                            <AddForm onClickFunction={ addItemHandle } type={ listtype } groups={ findUnique(todos, "group", false) } ></AddForm>
                                        ) : (
                                            <FilterComponent callback={ callbackFilter } />
                                        ) }
                                    </Grid>
                                    <Grid item xs={ 2 } lg={ 4 } >
                                        <Grid container justify="flex-end">
                                            <Hidden mdDown>
                                                <IconButton color={ edit ? "primary" : "default" } onClick={ () => setEdit(!edit) } >
                                                    <EditIcon />
                                                </IconButton>
                                            </Hidden>
                                            <IconButton color={ horizontally ? "primary" : "default" } onClick={ () => setHorizontally(!horizontally) } >
                                                <TextRotationNoneIcon />
                                            </IconButton>
                                            <IconButton color={ hideCompleted ? "primary" : "default" } onClick={ () => setHideCompleted(!hideCompleted) } >
                                                <VisibilityIcon />
                                            </IconButton>
                                        </Grid>

                                        {/* <ButtonGroup variant="outlined" >
                                        <Button size="large" color={ edit ? "primary" : "default" } onClick={ () => setEdit(!edit) } ><EditIcon /> </Button>
                                        <Button size="large" color={ hideCompleted ? "primary" : "default" } onClick={ () => setHideCompleted(!hideCompleted) } > <VisibilityIcon /></Button>
                                    </ButtonGroup> */}
                                    </Grid>
                                </Grid>
                            </ListItem>
                        </List>
                    </MyCardHeader>


                    { filteredTodos.length === 0 && (
                        <CardContent>
                            <Grid container alignItems="center" justify="flex-start" spacing={ 2 } >
                                <Grid xs={ 12 } >
                                    { todos.length === 0 &&
                                        <h1>Diese Liste ist leer !</h1>
                                    }
                                    <Divider />
                                    <ListItem>
                                        <AddForm name={ filterText } onClickFunction={ addItemHandle } type={ listtype } groups={ findUnique(todos, "group", false) } ></AddForm>
                                    </ListItem>
                                </Grid>

                            </Grid>
                        </CardContent>) }
                </MyCard>

                { todos.length > 0 && <><br /> { createLists(filteredTodos) } </> }
            </Grid>
        </Grid>


    );
}

// export default App;
// export default withAuthenticator(App);
