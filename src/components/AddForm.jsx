import React, { Component, useState } from "react";
import { ListItem, ListItemIcon, ListItemText, List, ListItemSecondaryAction, Button, Typography, TextField, Grid, Card, Divider, MenuItem } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';


export const AddForm = ({ onClickFunction, name = "", url = "", type = "", group = "", groups }) => {
    // props replaced by

    const [linkName, setLinkName] = useState(name);
    const [groupName, setGroupName] = useState(group);
    const [linkUrl, setLinkUrl] = useState(url);
    const [trySend, setTrySend] = useState(false);

    const handleGroupChange = (event) => {
        console.log(event)
        console.log("groups", groups)
        setGroupName(event.target.value);
    };

    const simpleGroups = groups.map((x) => { return x.value })

    const handleClick = event => {
        event.preventDefault();

        if (type === "todo") {
            if (linkName.length > 0) {
                // send ONLY when it's filled out
                onClickFunction(linkName, "", groupName);

                setLinkName("");
                setLinkUrl("");
                setGroupName("");
                setTrySend(false);
            } else {
                // indicate that user has tried to send, now how potenial issues on UI
                setTrySend(true);
            }

        }
        else {

            if (linkName.length > 0 && linkUrl.length > 0) {
                // send ONLY when it's filled out
                onClickFunction(linkName, linkUrl, groupName);

                setLinkName("");
                setLinkUrl("");
                setTrySend(false);
            } else {
                // indicate that user has tried to send, now how potenial issues on UI
                setTrySend(true);
            }
        }
    };

    const hasError = val => {
        if( val === undefined || val === null ) return true;
        if ( val.length > 0) {
            return false
        } else if (trySend) {
            // show issues when length is 0 and the user has tried to send
            return true
        }
    };

    const checkEnter = (e) => {
        if (e.key === "Enter") {
            // alert("Enter")
            handleClick(e)
        }
    }

    return (
        <ListItem>
            <Grid container alignItems="center" justify="flex-start" spacing={ 2 } >
                <Grid item xs={ 10 } md={ 3 } >
                    <TextField
                        value={ linkName }
                        error={ hasError(linkName) }
                        label="Name"
                        fullWidth
                        variant="outlined"
                        onKeyPress={ e => checkEnter(e) }
                        onChange={ e => setLinkName(e.target.value) }
                    />
                </Grid>
                <Grid item xs={ 10 } md={ 3 } >
                    { groups == undefined ?
                        (
                            <TextField
                                value={ groupName }
                                error={ hasError(groupName) }
                                label="Group"
                                fullWidth
                                variant="outlined"
                                onKeyPress={ e => checkEnter(e) }
                                onChange={ e => setGroupName(e.target.value) }
                            />
                        ) : (

                            // <TextField
                            //     value={ groupName }
                            //     error={ hasError(groupName) }
                            //     label="Group"
                            //     fullWidth
                            //     variant="outlined"
                            //     onKeyPress={ e => checkEnter(e) }
                            //     onChange={ e => setGroupName(e.target.value) }
                            // />

                            <Autocomplete
                                id="combo-box-demo"
                                options={ groups }
                                freeSolo
                                fullWidth
                                value={ { value: groupName } }
                                // error={ groupName === undefined || groupName.length == 0 }
                                getOptionLabel={ (option) => option.value }                                
                                onKeyPress={ e => checkEnter(e) }
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
                            // <TextField
                            //     variant="outlined"
                            //     select="true"
                            //     error={ groupName === undefined || groupName.length == 0 }
                            //     // helperText={ unit }
                            //     value={ groupName }
                            //     onChange={ handleGroupChange }
                            //     label="Group"
                            //     fullWidth
                            // >
                            //     {groups.map((item) => (
                            //         <MenuItem key={ item.value } value={ item.value }>
                            //             {item.value }
                            //         </MenuItem>
                            //     )) }
                            // </TextField>
                        ) }
                </Grid>
                { type !== "todo" &&
                    <Grid item xs={ 10 } md={ 3 } >
                        <TextField
                            error={ hasError(linkUrl) }
                            value={ linkUrl }
                            label="URL"
                            fullWidth
                            variant="outlined"
                            onKeyPress={ e => checkEnter(e) }
                            onChange={ e => setLinkUrl(e.target.value) }
                        />
                    </Grid> }


                <Grid item xs={ 10 } md={ 3 } >
                    <IconButton onClick={ handleClick } edge="end" color="primary" aria-label="delete">
                        <AddIcon />
                    </IconButton>
                </Grid>

            </Grid>
        </ListItem>
    );
};