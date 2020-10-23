import React, { Component, useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinusCircle } from "@fortawesome/free-solid-svg-icons";
import { ListItem, ListItemIcon, ListItemText, List, ListItemSecondaryAction, Button, Typography, TextField, Grid, Card, Divider } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import { CheckCircleOutline, RadioButtonUnchecked } from '@material-ui/icons';

import { TypographyDisabled, TypographyEnabled, MyListItemHeader } from "./StyledComponents"

import { findUnique } from './helper';



const AddForm = ({ onClickFunction, name = "", url = "", type = "", group = "" }) => {
    // props replaced by

    const [linkName, setLinkName] = useState(name);
    const [groupName, setGroupName] = useState(group);
    const [linkUrl, setLinkUrl] = useState(url);
    const [trySend, setTrySend] = useState(false);

    const handleClick = event => {
        event.preventDefault();

        if (type === "todo") {
            if (linkName.length > 0) {
                // send ONLY when it's filled out
                onClickFunction(linkName, "", group);

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

    const checkEnter = (e) => {
        if (e.key === "Enter") {
            // alert("Enter")
            handleClick(e)
        }
    }

    return (
        <ListItem>
            <Grid container alignItems="flex-end" spacing={ 2 } >
                <Grid item xs={ 10 } md={ 6 } >
                    <TextField
                        value={ linkName }
                        error={ hasError(linkName) }
                        label="Name"
                        fullWidth
                        variant="standard"
                        onKeyPress={ e => checkEnter(e) }
                        onChange={ e => setLinkName(e.target.value) }
                    />
                </Grid>
                <Grid item xs={ 10 } md={ 6 } >
                    <TextField
                        value={ groupName }
                        error={ hasError(groupName) }
                        label="Group"
                        fullWidth
                        variant="standard"
                        onKeyPress={ e => checkEnter(e) }
                        onChange={ e => setGroupName(e.target.value) }
                    />
                </Grid>                
                { type !== "todo" &&
                    <Grid item xs={ 10 } md={ 6 } >
                        <TextField
                            error={ hasError(linkUrl) }
                            value={ linkUrl }
                            label="URL"
                            fullWidth
                            variant="standard"
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

const ListEl = ({ name, link, checked, id, removeClickFunction, updateFunction, toggleFunction, type, group, editList }) => {

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

    const isChecked = (checked) => {
        if (typeof checked === "boolean") { return checked }
        if (typeof checked === "string") { return checked === "true" }
        return false
    }

    return (
        <>
            { edit ? (<AddForm name={ name } url={ link } group={ group } onClickFunction={ onClickFunction } type={ type } />) : (
                <>
                    { type === "todo" ? (
                        <ListItem button onClick={ () => toggleFunction(id) }  >
                            <ListItemIcon>
                                { isChecked(checked) ? <CheckCircleOutline color="primary" /> : <RadioButtonUnchecked /> }
                            </ListItemIcon>
                            <ListItemText

                                primary={ isChecked(checked) ? <TypographyDisabled>{ name }</TypographyDisabled> : <TypographyEnabled >{ name }</TypographyEnabled> } />
                            { editList &&
                                <ListItemSecondaryAction >
                                    <IconButton edge="end" onClick={ handleEditClick } aria-label="delete">
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton edge="end" onClick={ handleDeleteClick } color="secondary" aria-label="delete">
                                        <DeleteIcon />
                                    </IconButton>
                                </ListItemSecondaryAction> }
                        </ListItem>
                    ) : (
                            <ListItem button>
                                <ListItemText
                                    onClick={ () => window.open(link, "_blank") }
                                    primary={ <Typography variant="h5" color="primary" >{ name }</Typography> }
                                    secondary={ <Typography variant="inherit" color="textSecondary" noWrap >{ link }</Typography> }
                                />

                                { editList &&
                                    <ListItemSecondaryAction >
                                        <IconButton edge="end" onClick={ handleEditClick } aria-label="delete">
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton edge="end" onClick={ handleDeleteClick } color="secondary" aria-label="delete">
                                            <DeleteIcon />
                                        </IconButton>
                                    </ListItemSecondaryAction> }

                            </ListItem>
                        ) }
                </>

            ) }
        </>
    );
};

const filterCompleted = (items) => {
    return items.filter(item => {
        return item.checked === false
    })
}

// { percentge(filterCompleted(items).length / items.length) }
const percentge = (float_value) => {
    return "" + (float_value * 100).toFixed(1) + "%"
}

const printRemaining = (filtered, total) => {
    if (filtered === total) return total;
    return percentge(filtered / total)
}

export const ListQ = ({ items, removeItemHandle, header, addItemHandle, updateFunction, toggleFunction, type, group, editList }) => {

    return (
        <List
            dense={ false }>
            <MyListItemHeader>
                { header }
                { type === "todo" &&
                    <ListItemSecondaryAction>
                        { printRemaining(filterCompleted(items).length, items.length) }
                    </ListItemSecondaryAction>
                }
            </MyListItemHeader>

            { items.map((item, index) => (
                <ListEl
                    editList={ editList }
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

            { ( ( addItemHandle !== undefined) && editList ) &&
                <AddForm onClickFunction={ addItemHandle } group={ group } label={ "Add" } type={ type } />
            } 
        </List>

    );
}

