import React, { Component, useState, useEffect } from "react";
import { ListItem, ListItemIcon, ListItemText, List, ListItemSecondaryAction, Button, Typography, TextField, Grid, Card, Divider, MenuItem } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';



export const QAutocomplete = ({ group = "", groups, callback = undefined, hasError, checkEnter }) => {

    const [groupName, setGroupNameLocal] = useState(group);

    const setGroupName = ( value ) => {
        setGroupNameLocal( value )
        if( callback !== undefined ){
            callback( value )
        }
        
    }


    return (
        <>
            { groups === undefined ?
                (
                    <TextField
                        value={ groupName }
                        error={ hasError(groupName) }
                        label="Group"
                        size="small"
                        fullWidth
                        variant="outlined"
                        onKeyPress={ e => checkEnter(e) }
                        onChange={ e => setGroupName(e.target.value) }
                    />
                ) : (

                    <Autocomplete
                        id="combo-box-demo"
                        options={ groups }
                        size="small"
                        freeSolo
                        fullWidth
                        value={ { value: groupName } }
                        // error={ groupName === undefined || groupName.length == 0 }
                        getOptionLabel={ (option) => option.value }
                        onKeyPress={ e => checkEnter(e) }
                        onInputChange={ (event, newValue) => {
                            if (typeof newValue === 'string') {
                                setGroupName(
                                    newValue
                                );
                            }
                        } }
                        onChange={ (event, newValue) => {
                            if (typeof newValue === 'string') {
                                setGroupName(
                                    newValue
                                );
                            } else if (newValue && newValue.value) {
                                // Create a new value from the user input
                                setGroupName(
                                    newValue.value,
                                );
                            } else {
                                setGroupName(newValue);
                            }
                        } }
                        renderInput={ (params) => <TextField { ...params } label="Groups" fullWidth variant="outlined" /> }
                    />

                ) }
        </>
    )
}