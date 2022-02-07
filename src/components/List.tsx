import React, { Component, useState } from "react";

import { Modal, ListItem, ListItemIcon, ListItemText, List, ListItemSecondaryAction, Button, Typography, TextField, Grid, Card, CardContent, Divider, MenuItem, CardHeader } from '@material-ui/core';

import useLongPress from "../hooks/useLongPress";


import DeleteIcon from '@material-ui/icons/Delete';
// import AddIcon from '@material-ui/icons/Add';
// import Autocomplete from '@material-ui/lab/Autocomplete';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import { ArrowDropDown, ArrowRight } from '@material-ui/icons';
import { QAutocomplete } from "./QAutocomplete"
import { CheckCircleOutline, RadioButtonUnchecked } from '@material-ui/icons';
import { TypographyDisabled, TypographyEnabled, MyListItemHeader, MyCardHeader } from "./StyledComponents"

import CloseIcon from '@material-ui/icons/Close';

import { TodoItem } from "./TodoItems"
import { AddForm } from "./AddForm"

const useStyles = makeStyles({
    card_main: {
        fontSize: 16,
        margin: 6,
    },
    card_sec: {
        fontSize: 12,
        textAlign: "right",
        margin: 6,
    },
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: "100%",
        padding: '20px'
    },
});


// { percentge(filterCompleted(items).length / items.length) }
const percentge = (float_value: number) => {
    return "" + (float_value * 100).toFixed(1) + "%"
}

const printRemaining = (filtered: number, total: number) => {
    if (filtered === total) return total;
    return percentge(filtered / total)
}

const filterCompleted = (items: TodoItem[]) => {
    return items.filter(item => {
        return item.checked === false
    })
}

interface PropsEl {
    name: string;
    link: string;
    checked: boolean;
    id: string;
    removeClickFunction: (id: string) => number;
    updateFunction: any;
    selectFunction: (id: string) => number;
    toggleFunction: (id: string) => number;
    type: string;       // @todo: later enum
    groups: any;
    group: string;
    editList: boolean
}



const ListEl = ({ name, link, checked, id, removeClickFunction, updateFunction, selectFunction, toggleFunction, type, groups, group, editList }: PropsEl) => {

    const classes = useStyles();

    const [edit, setEdit] = useState(false);
    // const [checked, setChecked] = useState(false);

    const handleDeleteClick = () => {
        removeClickFunction(id)
        setEdit(false)
    }

    const handleEditClick = () => {
        setEdit(!edit)
    }

    const handleToggleFunction = () => {
        toggleFunction(id)
    }

    const handleSelect = () => {
        console.log("handleSelect : ", id)
        selectFunction(id)
    }

    const onClickFunction = (linkName: string, linkUrl: string, groupname: string) => {
        updateFunction(id, linkName, linkUrl, groupname)
        setEdit(false)
    }

    const onCheckToggle = (linkName: string, linkUrl: string) => {
        // updateFunction(id, linkName, linkUrl)
        // setChecked(!checked)
        toggleFunction(id)
    }

    const onMainClick = (type: string) => {
        if (type === "todo") {
            toggleFunction(id)
        }
        else {
            window.open(link, "_blank")
        }
    }

    const isChecked = (checked: boolean) => {
        if (typeof checked === "boolean") { return checked }
        if (typeof checked === "string") { return checked === "true" }
        return false
    }

    const defaultOptions = {
        shouldPreventDefault: true,
        delay: 1000,
    };

    // const longPressEvent = useLongPress(handleEditClick, handleToggleFunction, defaultOptions);
    const longPressEvent = useLongPress(handleEditClick, () => { }, defaultOptions);
    const longPressEventLink = useLongPress(handleEditClick, onMainClick, defaultOptions);

    // onClick={ () => window.open(link, "_blank") }

    return (
        <>
            {edit &&

                <Modal
                    open={edit}
                    onClose={() => setEdit(false)}
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                >
                    <div className={classes.modal}>
                        <Card>
                            <CardHeader
                            title={"Update Item"} 
                            action={
                                <IconButton onClick={ () => setEdit(false) } >
                                  <CloseIcon />
                                </IconButton>
                              }                            
                            
                            >
                                
                            </CardHeader> 

                            <CardContent>
                            <Grid
                                    container
                                    direction="row"
                                    justify="flex-start"
                                    alignItems="flex-start"
                                    spacing={4}
                                >           
                                <Grid item xs={ 12 } >
                                <AddForm
                                    name={name}
                                    url={link}
                                    group={group}
                                    groups={groups}
                                    renderModal={true}
                                    onClickFunction={onClickFunction}
                                    handleDeleteClick={handleDeleteClick}
                                    type={type}
                                    buttonName="Update" />
                                    </Grid>                        
                                 
                                </Grid>
                                
                            </CardContent>
                        </Card>
                    </div>
                </Modal>
            }
            {(editList) ? (
                <ListItem  >
                    <ListItemIcon onClick={handleToggleFunction} >
                        {isChecked(checked) ? <CheckCircleOutline color="primary" /> : <RadioButtonUnchecked />}
                    </ListItemIcon>
                    <AddForm 
                    renderModal={false} 
                        name={name} 
                        url={link} 
                        group={group} groups={groups} 
                        onClickFunction={onClickFunction} 
                        type={type} 
                        buttonName="Update" 
                        handleDeleteClick={undefined} /> 
                    <ListItemSecondaryAction >
                        <IconButton edge="end" onClick={handleDeleteClick} color="secondary" aria-label="delete">
                            <DeleteIcon />
                        </IconButton>
                    </ListItemSecondaryAction>
                </ListItem>
            ) :
                (
                    <>
                        {type === "todo" &&
                            <ListItem button={!(editList)} onClick={handleSelect}  >

                                <ListItemIcon onClick={handleToggleFunction} >
                                    {isChecked(checked) ? <CheckCircleOutline color="primary" /> : <RadioButtonUnchecked />}
                                </ListItemIcon>
                                <ListItemText
                                    onClick={handleSelect}
                                    primary={isChecked(checked) ?
                                        <TypographyDisabled {...longPressEvent}>{name}</TypographyDisabled>
                                        : <TypographyEnabled  {...longPressEvent}>{name}</TypographyEnabled>}
                                />
                            </ListItem>}

                        {type === "message" &&
                            <ListItem button onClick={handleSelect} >

                                <ListItemIcon >
                                </ListItemIcon>

                                <ListItemText

                                    primary={isChecked(checked) ?
                                        <TypographyDisabled {...longPressEvent}>{name}</TypographyDisabled>
                                        : <TypographyEnabled  {...longPressEvent}>{name}</TypographyEnabled>}
                                    secondary={<Divider component="li" />}
                                />

                                {/* 
                                                                    <Grid
                                    container
                                    direction="row"
                                    justify="flex-end"
                                    alignItems="center"
                                >
                                    <Grid item xs={ 9 } md={ 6 } >
                                        <Card { ...longPressEvent }>
                                            <Typography className={ classes.card_main } component="p">
                                                { name }
                                            </Typography>
                                            <Typography color="textSecondary" className={ classes.card_sec } component="p">
                                                { "11.24" }
                                            </Typography>
                                        </Card>
                                    </Grid>
                                </Grid> */}
                            </ListItem>
                        }
                        {type === "links" &&
                            <ListItem button>
                                <ListItemText
                                    {...longPressEventLink}
                                    primary={<Typography variant="h6" color="primary" >{name}</Typography>}
                                    secondary={<Typography variant="body2" color="textSecondary" noWrap >{link}</Typography>}
                                />
                            </ListItem>
                        }
                    </>
                )}
        </>
    );
};

interface PropsQ {
    items: TodoItem[];
    removeItemHandle: any;
    header: string;
    addItemHandle: any;
    updateFunction: any;
    selectFunction: any;
    toggleFunction: (id: string) => number;
    type: string;
    group: string;
    groups: string;
    editList: boolean
};


export const ListQ = ({ items, removeItemHandle, header, addItemHandle, updateFunction, selectFunction, toggleFunction, type, group, groups, editList }: PropsQ) => {

    const [edit, setEdit] = useState(false);
    const [name, setName] = useState("");

    const onClickFunction = (name: string, link: string, groupname: string) => {
        addItemHandle(name, link, groupname)
        setName("")

    }

    // , ArrowRight

    return (

        <>

            <MyCardHeader onClick={() => setEdit(!edit)}>
                <List>
                    <ListItem>
                        <ListItemIcon>
                            {edit ? <ArrowDropDown /> : <ArrowRight />}
                        </ListItemIcon>


                        {header}
                        {type === "todo" &&
                            <ListItemSecondaryAction>
                                {printRemaining(filterCompleted(items).length, items.length)}
                            </ListItemSecondaryAction>
                        }
                    </ListItem>
                </List>
            </MyCardHeader >

            <List
                dense={false}
                id={header}
            >

                {edit &&
                    <ListItem>                        
                        <AddForm renderModal={false} 
                        name={name}
                        group={group}
                        onClickFunction={onClickFunction} 
                        type={type} buttonName="Add"
                        showGroupsSelector={false} 
                        handleDeleteClick={undefined} />
                        <Divider />
                    </ListItem>}


                {items.map((item, index) => (
                    <ListEl
                        editList={editList}
                        key={index}
                        id={item.id}
                        name={item.name}
                        group={group}
                        groups={groups}                        
                        checked={item.checked}
                        link={item.link}
                        selectFunction={selectFunction}
                        updateFunction={updateFunction}
                        removeClickFunction={removeItemHandle}
                        toggleFunction={toggleFunction}
                        type={type}
                    />
                ))}

                {/* { ((addItemHandle !== undefined) && editList) &&
                <AddForm onClickFunction={ addItemHandle } group={ group } label={ "Add" } type={ type } />
            } */}
            </List>

        </>

    );
}

