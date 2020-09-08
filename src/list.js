import React, { Component, useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinusCircle } from "@fortawesome/free-solid-svg-icons";
import { ListItem, ListItemIcon, ListItemText, List, ListItemSecondaryAction, Button, Typography, TextField, Grid, Card, Divider } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import { CheckCircleOutline, RadioButtonUnchecked } from '@material-ui/icons';

import { findUnique } from './helper';



const AddForm = ({ onClickFunction, name = "", url = "", type = "", group=""  }) => {
    // props replaced by

    const [linkName, setLinkName] = useState(name);
    const [linkUrl, setLinkUrl] = useState(url);
    const [trySend, setTrySend] = useState(false);

    const handleClick = event => {
        event.preventDefault();

        if (type === "todo") {
            if (linkName.length > 0 ) {
                // send ONLY when it's filled out
                onClickFunction(linkName, "",  group);

                setLinkName("");
                setLinkUrl("");
                setTrySend(false);
            } else {
                // indicate that user has tried to send, now how potenial issues on UI
                setTrySend(true);
            }            

        }
        else {

            if (linkName.length > 0 && linkUrl.length > 0) {
                // send ONLY when it's filled out
                onClickFunction(linkName, linkUrl, group);

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

        if (val.length > 0) {
            return false
        } else if (trySend) {
            // show issues when length is 0 and the user has tried to send
            return true
        }
    };

    const checkEnter = ( e ) => {
        if( e.key === "Enter" ){
            // alert("Enter")
            handleClick( e )
        }
    }

    return (
        <ListItem>
            <Grid container spacing={ 2 } >
                <Grid item xs={ 4 } >
                    <TextField
                        value={ linkName }
                        error={ hasError(linkName) }
                        label="Name"
                        fullWidth
                        variant="outlined"
                        onKeyPress= {e => checkEnter(e) }
                        onChange={ e => setLinkName(e.target.value) }
                    />
                </Grid>
                { type !== "todo" &&
                    <Grid item xs={ 4 }>
                        <TextField
                            error={ hasError(linkUrl) }
                            value={ linkUrl }
                            label="URL"
                            fullWidth
                            variant="outlined"                            
                            onChange={ e => setLinkUrl(e.target.value) }
                        />
                    </Grid> }
            </Grid>

            <ListItemSecondaryAction onClick={ handleClick } >
                <IconButton edge="end" color="primary" aria-label="delete">
                    <AddIcon />
                </IconButton>
            </ListItemSecondaryAction>
        </ListItem>
    );
};

const ListEl = ({ name, link, checked, id, removeClickFunction, updateFunction, toggleFunction, type, group }) => {

    const [edit, setEdit] = useState(false);
    // const [checked, setChecked] = useState(false);

    const handleDeleteClick = () => {
        removeClickFunction(id)
    }

    const handleEditClick = () => {
        setEdit(true)
    }

    const onClickFunction = (linkName, linkUrl) => {
        updateFunction(id, linkName, linkUrl)
        setEdit(false)
    }

    const onCheckToggle = (linkName, linkUrl) => {
        // updateFunction(id, linkName, linkUrl)
        // setChecked(!checked)
        toggleFunction(id)
    }

    const onMainClick = (type) => {
        if (type === "todo") {
            toggleFunction(id)
        }
        else {
            window.open(link, "_blank")
        }

    }

    return (
        <>
            { edit ? (<AddForm name={ name } url={ link } group={group} onClickFunction={ onClickFunction } type={type} />) : (
                <>
                    { type === "todo" ? (
                        <ListItem button >
                            <ListItemIcon onClick={ onCheckToggle }>
                                { checked ? <CheckCircleOutline color="primary" /> : <RadioButtonUnchecked color="secondary" /> }
                            </ListItemIcon>
                            <ListItemText
                                onClick={ () => toggleFunction(id) }
                                primary={ <Typography variant="h5" color="primary" >{ name }</Typography> } />
                            <ListItemSecondaryAction >
                                <IconButton edge="end" onClick={ handleEditClick } aria-label="delete">
                                    <EditIcon />
                                </IconButton>
                                <IconButton edge="end" onClick={ handleDeleteClick } color="secondary" aria-label="delete">
                                    <DeleteIcon />
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                    ) : (
                            <ListItem>
                                <ListItemText
                                    onClick={ () => window.open(link, "_blank") }
                                    primary={ <Typography variant="h5" color="primary" >{ name }</Typography> }
                                    secondary={ <Typography variant="inherit" color="textSecondary" noWrap >{ link }</Typography> }
                                />

                                <ListItemSecondaryAction >
                                    <IconButton edge="end" onClick={ handleEditClick } aria-label="delete">
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton edge="end" onClick={ handleDeleteClick } color="secondary" aria-label="delete">
                                        <DeleteIcon />
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                        ) }
                </>

            ) }
        </>
    );
};

export const ListQ = ({ items, removeItemHandle, header, addItemHandle, updateFunction, toggleFunction, type, group }) => {

    return (
        <List>
            <ListItem>
                { header }
            </ListItem>

            { items.map((item, index) => (
                <ListEl
                    key={ index }
                    id={ item.id }
                    name={ item.name }
                    checked={ item.checked }
                    link={ item.link }
                    updateFunction={ updateFunction }
                    removeClickFunction={ removeItemHandle }
                    toggleFunction={ toggleFunction }
                    type={ type }
                />
            )) }

            { addItemHandle != undefined &&
                <AddForm onClickFunction={ addItemHandle } group={group} label={ "Add" } type={ type } />
            }
        </List>

    );
}

