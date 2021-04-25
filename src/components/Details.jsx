import React, { useState, useEffect } from "react";

import { ListItem, List, CardContent, IconButton } from '@material-ui/core';

import { Grid, Card, Button, TextField, Divider } from '@material-ui/core';
import { MyCard, MyCardHeader, MyTextareaAutosize, MyTextareaRead } from "./StyledComponents"
import { MyIcon } from "./MyIcon"; 



export const Details = ({ selectedItem, updateFunction }) => {

    // (updateFunction(todoid, name, link, group, description=undefined ) )
    // const uiUpdateTodo = (items, todo) => {

    useEffect(() => {
        console.log("useEffect", selectedItem.description)
        setSelectedValue(selectedItem.description)
    }, [selectedItem]);

    const [edit, setEdit] = useState(false);
    const [selectedItemValue, setSelectedValue] = useState(selectedItem.description);

    const updateHandle = () => {
        updateFunction(selectedItem.id, selectedItem.name, selectedItem.link, selectedItem.group, selectedItemValue)
        setEdit(false)

    }

    return (
        <MyCard>
            <MyCardHeader>
                <List>
                    <ListItem>
                        { selectedItem.name }
                    </ListItem>
                </List>
            </MyCardHeader>
            <CardContent>
                <List>

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

                            <ListItem button onClick={ () => setEdit(true) }>
                                <MyTextareaRead>
                                { selectedItemValue ? selectedItemValue : "-" }
                                </MyTextareaRead>
                            </ListItem>
                        )
                    }


                    <ListItem>
                        <Button variant="contained" disabled={ !edit } onClick={ updateHandle }><MyIcon icon="update" /> </Button>
                    </ListItem>

                </List>

            </CardContent>
        </MyCard>

    )
}
