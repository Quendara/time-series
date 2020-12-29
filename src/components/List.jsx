import React, { Component, useState } from "react";

import { ListItem, ListItemIcon, ListItemText, List, ListItemSecondaryAction, Button, Typography, TextField, Grid, Card, Divider, MenuItem } from '@material-ui/core';

import useLongPress from "../hooks/useLongPress";


import DeleteIcon from '@material-ui/icons/Delete';
// import AddIcon from '@material-ui/icons/Add';
// import Autocomplete from '@material-ui/lab/Autocomplete';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import { CheckCircleOutline, RadioButtonUnchecked } from '@material-ui/icons';

import { TypographyDisabled, TypographyEnabled, MyListItemHeader } from "./StyledComponents"

import {AddForm} from "./AddForm"


const ListEl = ({ name, link, checked, id, removeClickFunction, updateFunction, toggleFunction, type, groups, group, editList }) => {

    const [edit, setEdit] = useState(false);
    // const [checked, setChecked] = useState(false);

    const handleDeleteClick = () => {
        removeClickFunction(id)
    }

    const handleEditClick = () => {
        setEdit(!edit)
    }

    const handleToggleFunction = () =>{
        toggleFunction(id)
    }

    const onClickFunction = (linkName, linkUrl, groupname) => {
        updateFunction(id, linkName, linkUrl, groupname)
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

    const defaultOptions = {
        shouldPreventDefault: true,
        delay: 500,
    };    

    const longPressEvent = useLongPress(handleEditClick, handleToggleFunction, defaultOptions);

    return (
        <>
            { edit ? (<AddForm name={ name } url={ link } group={ group } groups={ groups } onClickFunction={ onClickFunction } type={ type } />) : (
                <>
                    { type === "todo" ? (
                        <ListItem button {...longPressEvent}  >
                            
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

//
// primary={ <Typography variant="inherit" color="primary" >{ name }</Typography> }
// secondary={ <Typography variant="inherit" color="textSecondary" noWrap >{ link }</Typography> }

                            <ListItem button>
                                <ListItemText
                                    onClick={ () => window.open(link, "_blank") }
                                    primary={ <Typography variant="h6" color="primary" >{ name }</Typography> }
                                    secondary={ <Typography variant="body2" color="textSecondary" noWrap >{ link }</Typography> }
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

export const ListQ = ({ items, removeItemHandle, header, addItemHandle, updateFunction, toggleFunction, type, group, groups, editList }) => {

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
                    group={ group }
                    groups={ groups }
                    checked={ item.checked }
                    link={ item.link }
                    updateFunction={ updateFunction }
                    removeClickFunction={ removeItemHandle }
                    toggleFunction={ toggleFunction }
                    type={ type }
                />
            )) }

            {/* { ((addItemHandle !== undefined) && editList) &&
                <AddForm onClickFunction={ addItemHandle } group={ group } label={ "Add" } type={ type } />
            } */}
        </List>

    );
}

