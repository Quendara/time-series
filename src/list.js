import React, { Component, useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinusCircle } from "@fortawesome/free-solid-svg-icons";
import { ListItem, ListItemText, List, ListItemSecondaryAction, Button, Typography, TextField, Grid, Card, Divider } from '@material-ui/core';



const AddForm = ({ onClickFunction, name }) => {
    // props replaced by

    const [linkName, setLinkName] = useState("");
    const [linkUrl, setLinkUrl] = useState("");
    const [trySend, setTrySend] = useState(false);

    const handleClick = event => {
        event.preventDefault();

        if (linkName.length > 0 && linkUrl.length > 0) {
            // send ONLY when it's filled out
            onClickFunction(linkName, linkUrl);

            setLinkName("");
            setLinkUrl("");
            setTrySend(false);
        } else {
            // indicate that user has tried to send, now how potenial issues on UI
            setTrySend(true);
        }
    };

    const hasError = val => {

        if (val.length > 0) {
            return false
        } else if (trySend) {
            // show issues when length is 0 and the user has tried to send
            return true
        }

    };

    return (
        <ListItem>
            <Grid container spacing={ 2 } >
                <Grid item>
                    <TextField
                        value={ linkName }
                        error={ hasError(linkName) }
                        label="Name"
                        fullWidth
                        variant="outlined"
                        onChange={ e => setLinkName(e.target.value) }
                    />
                </Grid>
                <Grid item>
                    <TextField
                        error={ hasError(linkUrl) }
                        value={ linkUrl }
                        label="URL"
                        fullWidth
                        variant="outlined"
                        onChange={ e => setLinkUrl(e.target.value) }
                    />
                </Grid>
            </Grid>
            <ListItemSecondaryAction>
                <Button color="primary" variant="contained" onClick={ handleClick }  >
                    <FontAwesomeIcon icon={ faPlus } />
                </Button>
            </ListItemSecondaryAction>
        </ListItem>
    );
};

const ListEl = ({ name, link, id, removeClickFunction }) => {

    const handleDeleteClick = () => {
        removeClickFunction(id)
    }

    return (
        <ListItem>
            <ListItemText
                onClick={ () => window.open(link, "_blank") }
                primary={ <Typography variant="h5" color="primary" >{ name }</Typography> }
                secondary={ <Typography variant="inherit" color="textSecondary"  noWrap >{ link }</Typography> }
            />
            <ListItemSecondaryAction onClick={ handleDeleteClick } >
                <Button variant="contained" color="secondary">
                    <FontAwesomeIcon icon={ faMinusCircle } />
                </Button>
            </ListItemSecondaryAction>
        </ListItem>
    );
};



export const ListQ = ({ items, removeItemHandle, addItemHandle }) => {

    return (
            <List>
                { items.map((item, index) => (
                    <ListEl
                        key={index}
                        id={ item.id }
                        name={ item.name }
                        link={ item.link }
                        removeClickFunction={ removeItemHandle }
                    />
                )) }

                { addItemHandle != undefined &&
                    <AddForm onClickFunction={ addItemHandle } name={ "Add" } />
                }
            </List>
        
    );
}

