import React, { useState, useEffect } from "react";


import { NavLink } from "react-router-dom";

import { ListItem, List, CardContent, IconButton, Snackbar } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import ReactMarkdown from "react-markdown";

import { Grid, Card, Button, TextField, Divider } from '@material-ui/core';
import { MyCard, MyCardHeader, MyTextareaAutosize, MyTextareaRead } from "./StyledComponents"
import Autocomplete from '@material-ui/lab/Autocomplete';
import { MyIcon } from "./MyIcon";

import { useStyles } from "../Styles"



export const Details = ({ selectedItem, updateFunction, updateFunction2, lists }) => {

    const classes = useStyles();

    // (updateFunction(todoid, name, link, group, description=undefined ) )
    // const uiUpdateTodo = (items, todo) => {
    const [edit, setEdit] = useState(false);
    const [listvalue, setListValue] = React.useState("");

    const [selectedItemValue, setSelectedValue] = useState(selectedItem.description);
    const [selectedItemId, setSelectedItemId] = useState(selectedItem.id);

    const [successSnackbarMessage, setSuccessSnackbarMessage] = React.useState("");
    
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }    
        setSuccessSnackbarMessage("");
      };    

    // const handleClick = () => {
    //     setOpen(true);
    // };

    useEffect(() => {

        if ( edit ) // ( selectedItem.id !== selectedItemId ) 
        {
            // alert( "save ... "+ selectedItemValue + "<< xxx")       
            
            updateFunction2(selectedItemId, { description: selectedItemValue })            
        }

        console.log("useEffect", selectedItem.description)
        setSelectedValue(selectedItem.description)
        setSelectedItemId(selectedItem.id)

        const listname = getGlobalList(lists, selectedItem.listid).name
        setListValue(listname)

        setEdit(false)

        return () => {

        };

    }, [selectedItem]);

    // useEffect(() => {
    //     document.addEventListener("keydown", handleKeyPress, false);

    //     return () => {
    //         document.removeEventListener("keydown", handleKeyPress, false);
    //     };
    // });

    // const isList


    const handleKeyPress = (event) => {

        if (edit) {
            switch (event.key) {
                case "Enter":
                    let value = selectedItemValue + " *"
                    selectedItemValue.split("\n")
                // setSelectedValue( value  )
            }
            // console.log("handleKeyPress events blocked, to avoid actions!", event )
            // return;
        }
    }


    const updateHandle = () => {
        // updateFunction(selectedItem.id, selectedItem.name, selectedItem.link, selectedItem.group, selectedItemValue)

        updateFunction2(selectedItem.id, { description: selectedItemValue })
        setSuccessSnackbarMessage( "Saved !!! " )
        setEdit(false)
    }

    const getGlobalList = (lists, id) => {
        const fl = lists.filter(item => +item.id === +id)
        console.log("getGlobalList", id, fl, lists)

        if (fl.length > 0) {
            return fl[0]
        }
        return {
            name: "Undefined"
        }
    }

    const handleListChange = (selecedList) => {

        if (selecedList !== null) {
            console.log("handleListIdChange : ", selecedList.id, selecedList.name)

            updateFunction2(selectedItem.id, { listid: selecedList.id, })

            setListValue(selecedList.name)
        }

    }

    return (
        <>
            <Snackbar 
                open={ successSnackbarMessage.length>0 } 
                autoHideDuration={ 2000 } 
                onClose={handleClose}
                message="Saved" >
                    <Alert onClose={handleClose} severity="success">
                        {successSnackbarMessage}
                    </Alert>                
              </Snackbar>
        <MyCard>


            <MyCardHeader>
                <List>
                    <ListItem>
                        { selectedItem.name }
                    </ListItem>
                </List>
            </MyCardHeader>
            <CardContent  >
                <List>
                    <ListItem>
                        <Grid
                            container
                            direction="row"
                            justify="space-between"
                            alignItems="center" >
                            <Grid item>
                                <Button variant="contained" disabled={ !edit } onClick={ updateHandle }><MyIcon icon="update" /> </Button>
                            </Grid>
                            {/* <Grid item>
                            
                            <NavLink to={ "/" + [ "list", selectedItem.listid, "todo", selectedItem.id ].join('/') } className={ classes.menuButton }   >
                                <Button variant="contained" ><MyIcon icon="update" /> </Button>
                                </NavLink>
                            </Grid>                             */}
                            <Grid item>

                                <Autocomplete
                                    id="combo-box-demo"
                                    inputValue={ "" }
                                    value={ listvalue }
                                    onChange={ (event, newValue) => {
                                        handleListChange(newValue);
                                    } }
                                    options={ lists }
                                    getOptionLabel={ (option) => "(" + option.id + ") " + option.name }
                                    style={ { width: 300 } }
                                    renderInput={ (params) => <TextField { ...params } label={ listvalue } variant="outlined" /> }
                                />
                            </Grid>

                        </Grid>
                    </ListItem>
                    <Divider></Divider>
                    <div >
                        {/* className={ classes.navigationInner } */ }


                        { edit ? (
                            <ListItem>
                                <MyTextareaAutosize
                                    value={ selectedItemValue ? selectedItemValue : "" }
                                    rowsMin={ 10 }
                                    // error={ hasError(linkName) }
                                    label="Name"
                                    size="small"
                                    fullWidth
                                    variant="outlined"
                                    // onKeyPress={ e => checkEnter(e) }
                                    onChange={ e => setSelectedValue(e.target.value) } />
                            </ListItem>
                        ) :
                            (


                                <div className="markdown" button onClick={ () => setEdit(true) }>
                                    <ReactMarkdown >
                                        { selectedItemValue ? selectedItemValue : "No Description" }
                                    </ReactMarkdown>

                                </div>

                            )
                        }


                    </div>
                </List>

            </CardContent>
        </MyCard>
        </>

    )
}


{/* <ListItem button onClick={ () => setEdit(true) }>
<MyTextareaRead>
{ selectedItemValue ? selectedItemValue : "-" }
</MyTextareaRead>
</ListItem> */}
