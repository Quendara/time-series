import React, { useState, useEffect } from 'react';

import SearchIcon from '@material-ui/icons/Search';

import { Grid, Paper, Card, CardHeader, CardContent, Button, ButtonGroup, Typography, TextField, List, ListItem, Divider, Hidden, Snackbar } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';

import Autocomplete from '@material-ui/lab/Autocomplete';
 

import { ThemeProvider, CssBaseline } from "@material-ui/core";
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import InputAdornment from '@material-ui/core/InputAdornment';

import VisibilityIcon from '@material-ui/icons/Visibility';
import ClearIcon from '@material-ui/icons/Clear';
import TextRotationNoneIcon from '@material-ui/icons/TextRotationNone';

import { FilterComponent } from '../components/FilterComponent';

import { MyCard, MyCardHeader } from "../components/StyledComponents"

import { ListQ } from '../components/List';
import { AddForm } from '../components/AddForm';
import { Details } from '../components/Details';

import { findUnique, restCallToBackendAsync, sortArrayBy } from "../components/helper";

import { TodoItem } from '../components/TodoItems';
import { useWindowScrollPositions } from '../hooks/useWindowScrollPositions'

export interface GroupItem {
    value: string;
    listid: number;
    listitems: any[];
}

interface  ListProps{
    todos: TodoItem[];
    listtype: string;
    listid: string;
    addItemHandle: any;
    getItem: (id:string) => any;
    removeItemHandle: (id:string) => number;
    updateFunction: any;
    updateFunction2: any;
    toggleFunction: (id:string) => number;
    uncheckFunction: (id:string) => number;
    lists: any;
    
}

export const ListPage = ({
    todos,
    listtype,
    listid,
    addItemHandle,    
    removeItemHandle,
    getItem,
    updateFunction,
    updateFunction2,
    toggleFunction,
    uncheckFunction,
    lists
 } : ListProps ) => {

    const [selectedItem, setSelectedItem] = useState(undefined);

    const [edit, setEdit] = useState(false);
    const [filterText, setFilterText] = useState("");
    const [hideCompleted, setHideCompleted] = useState(false);
    const [horizontally, setHorizontally] = useState(false);    

    const { scrollX, scrollY } = useWindowScrollPositions()

    const [successSnackbarMessage, setSuccessSnackbarMessage] = React.useState("");

    const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setSuccessSnackbarMessage("");
    };    

    useEffect(
        () => {
            setSelectedItem(undefined);
        }, [listid])    

    const callbackFilter = (text : string ) => {
        setFilterText(text)
    }

    async function selectHandle( id: string ) {
         const currentItem = await getItem(id)
    //     // console.log( "selectHandle : ", id  )
        console.log( "selectHandle : ", currentItem)
        setSelectedItem(currentItem)
    }


    const callbackEnter = () => {
        
        if( filteredTodos.length === 1 )  {

            setSuccessSnackbarMessage("Uncheck item " + filteredTodos[0].name );

            uncheckFunction( filteredTodos[0].id )
            setFilterText("")
        }
    }        
    

    const filterCompleted = ( items: TodoItem[], hideCompleted: boolean, filterText: string) => {

        let filteredItems = items
        if (hideCompleted) {
            filteredItems = items.filter( ( item: TodoItem ) => {
                return item.checked === false
            })
        }

        const FILTER = filterText.toUpperCase()

        if (filterText.length !== 0) {
            filteredItems = filteredItems.filter(item => {
                const currentItem = item.name.toUpperCase()
                return (currentItem.indexOf(FILTER) !== -1)
            })
        }

        return filteredItems
    }    


    const filteredTodos = filterCompleted( todos , hideCompleted, filterText)


    const createLists = (items : TodoItem[]) => {

        const groups = findUnique(items, "group", false)

        return (
            <>
                { horizontally ? (
                    // 
                    <div style={ { "width": "100%", "overflowX": "scroll" } }>
                        { groups.map((item: GroupItem, index: number ) => (
                            <div style={ { "width": groups.length * 310 + "px" } }>
                            <div key={ index } style={ { "width": "300px", "float": "left", "marginRight": "10px" } } >
                                <MyCard>
                                    <ListQ
                                        key={ index }
                                        editList={ edit }
                                        header={ item.value }
                                        group={ item.value }
                                        items={ sortArrayBy(item.listitems, "name") }
                                        groups={ groups }
                                        addItemHandle={ addItemHandle }
                                        type={ listtype }
                                        selectFunction={ selectHandle }
                                        removeItemHandle={ removeItemHandle }
                                        updateFunction={ updateFunction }
                                        toggleFunction={ toggleFunction }
                                    />
                                </MyCard>
                            </div>
                            </div>
                        )) }
                    </div>

                ) : (
                    <Grid container spacing={ 2 } >
                        { groups.map((item: GroupItem, index: number ) => (
                            <Grid key={ index } item xs={ 12 }>
                                <MyCard>
                                    <ListQ
                                        key={ index }
                                        editList={ edit }
                                        header={ item.value }
                                        group={ item.value }
                                        items={ sortArrayBy(item.listitems, "name",) }
                                        groups={ groups }
                                        addItemHandle={ addItemHandle }
                                        type={ listtype }
                                        selectFunction={ selectHandle }
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


    return (
        <>
            <Snackbar
                open={successSnackbarMessage.length > 0}
                autoHideDuration={2000}
                onClose={handleClose}
                message="Saved" >
                <Alert onClose={handleClose} severity="success">
                    {successSnackbarMessage}
                </Alert>
            </Snackbar>        
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
                                            <AddForm 
                                            renderModal={false} 
                                            onClickFunction={ addItemHandle } 
                                            handleDeleteClick={undefined}
                                            type={ listtype } 
                                            groups={ findUnique(todos, "group", false) } ></AddForm>
                                        ) : (
                                            <FilterComponent filterText={filterText} callback={ callbackFilter } callbackEnter={ callbackEnter } />
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
                                    </Grid>
                                </Grid>
                            </ListItem>
                        </List>
                    </MyCardHeader>

                    { filteredTodos.length === 1 && (
                        <CardContent>
                            <Typography variant="h6" component="h6">
                            {filteredTodos[0].name}
                            </Typography>
                            <Typography variant="inherit" component="b" >
                            Press Enter to check item 
                            </Typography>
                        </CardContent>
                    ) }
                    { filteredTodos.length === 0 && (
                        <CardContent>
                            <Grid container alignItems="center" justify="flex-start" spacing={ 2 } >
                                <Grid item xs={ 12 } >
                                    { todos.length === 0 && // also the unfiltered list is empty
                                        <h1>Diese Liste ist leer !</h1>
                                    }
                                    <Divider />
                                    <ListItem>
                                        <AddForm renderModal={false} handleDeleteClick={undefined}  name={ filterText } onClickFunction={ addItemHandle } type={ listtype } groups={ findUnique(todos, "group", false) } ></AddForm>
                                    </ListItem>
                                </Grid>
                            </Grid>
                        </CardContent>) }
                </MyCard>
            </Grid>

            <Grid item md={ horizontally?12:4 }  sm={ horizontally?12:6 } xs={ 12 }  >
                { todos.length > 0 && <> { createLists(filteredTodos) } </> }
            </Grid>

            { (selectedItem !== undefined) &&
                <>
                        <Grid item  md={ horizontally?12:8 }  sm={ horizontally?12:6 } xs={ 12 } >
                            <div style={{ position:"relative"}}>
                            <div className={ ( scrollY>190) ? "details down":"details" } >
                                
                            
                            <Details
                                selectedItem={ selectedItem }
                                updateFunction={ updateFunction2 }
                                lists={ lists }
                            />
                            <div>Scroll position is ({scrollX}, {scrollY})</div>
                            </div>
                            </div>
                        </Grid>
                </>
            }
        </Grid >   
        </>     
    )

} 