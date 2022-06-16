import React, { Component, useState } from "react";
import { useHistory } from "react-router-dom";

import { Modal, ListItem, ListItemIcon, ListItemText, List, ListItemSecondaryAction, Button, Typography, TextField, Grid, Card, CardContent, Divider, MenuItem, CardHeader } from '@material-ui/core';

import useLongPress from "../hooks/useLongPress";


import DeleteIcon from '@material-ui/icons/Delete';
// import AddIcon from '@material-ui/icons/Add';
// import Autocomplete from '@material-ui/lab/Autocomplete';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import { ArrowDropDown, ArrowRight } from '@material-ui/icons';

import Icon from '@material-ui/core/Icon';

// import { QAutocomplete } from "./QAutocomplete"
import { CheckCircleOutline, RadioButtonUnchecked } from '@material-ui/icons';
import { TypographyDisabled, TypographyEnabled, MyListItemHeader, MyCardHeader } from "./StyledComponents"

import CloseIcon from '@material-ui/icons/Close';

import { TodoItem } from "../models/TodoItems"
import { GenericGroup } from "../components/helpers"

import { AddForm } from "./AddForm"
import { DetailsById } from "./Details"
// import { UpdateFunc } from "../models/Definitions" 
import { UpdateTodosInput } from "../API"

export enum TodoListType {
    TODO = 'todo',
    TODO_SIMPLE = 'todo_simple',
    MESSAGE = 'message',
    LINKS = 'links'
}

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
        display: 'absolute',
        top: "10px",
        alignItems: 'center',
        justifyContent: 'center',
        height: "50%",
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
    removeClickFunction: (id: string) => void;
    updateFunction: (item: UpdateTodosInput) => void;
    selectFunction: (id: string) => void;
    toggleFunction: (id: string) => void;
    type: TodoListType;
    groups: any;
    group: string;
    editList: boolean
}



const ListEl = (
    { name,
        link,
        checked,
        id,
        removeClickFunction,
        updateFunction,
        selectFunction,
        toggleFunction,
        type,
        groups,
        group,
        editList }: PropsEl) => {

    const history = useHistory();
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

    const onUpdateFunction = (linkName: string, linkUrl: string, groupname: string) => {
        updateFunction({ id, link: linkUrl, name: linkName, group: groupname })
        setEdit(false)
    }

    const onCheckToggle = (linkName: string, linkUrl: string) => {
        // updateFunction(id, linkName, linkUrl)
        // setChecked(!checked)
        toggleFunction(id)
    }

    const onMainClick = (type: TodoListType) => {
        if (type === TodoListType.TODO) {
            toggleFunction(id)
        }
        else {

            if (link.startsWith("/")) {
                history.push(link);
            } else {
                // Open in new window
                window.open(link, "_blank")
            }
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
                                    <IconButton onClick={() => setEdit(false)} >
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
                                    <Grid item xs={12} >
                                    <AddForm
                                        renderModal={true}
                                        name={name}
                                        url={link}
                                        group={group} groups={groups}
                                        onClickFunction={onUpdateFunction}
                                        type={type}
                                        buttonName="Update"
                                        handleDeleteClick={handleDeleteClick} />
                                        </Grid>

                                    {/* <Grid item xs={12} >
                                        <DetailsById
                                            itemid={id}
                                            updateFunction={updateFunction}
                                            listtype={type}
                                            lists={[]} />
                                    </Grid>
                                    <Grid item xs={12} >
                                        <Button
                                            onClick={handleDeleteClick}
                                            color="secondary"
                                            startIcon={<DeleteIcon />}
                                            variant="contained" >
                                            Delete
                                        </Button>
                                    </Grid>
                                    */}
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
                        onClickFunction={onUpdateFunction}
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
                        {(type === TodoListType.TODO || type === TodoListType.TODO_SIMPLE) &&
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

                        {type === TodoListType.MESSAGE &&
                            <ListItem button onClick={handleSelect} >

                                <ListItemIcon >
                                    <Icon>chevron_right</Icon>
                                </ListItemIcon>

                                <ListItemText

                                    primary={isChecked(checked) ?
                                        <TypographyDisabled {...longPressEvent}>{name}</TypographyDisabled>
                                        : <TypographyEnabled  {...longPressEvent}>{name}</TypographyEnabled>}

                                />
                            </ListItem>
                        }
                        {type === TodoListType.LINKS &&
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
    updateFunction: (item: UpdateTodosInput) => void;
    toggleFunction: (id: string) => void;
    selectFunction: any;
    type: TodoListType;
    group: string;
    groups: GenericGroup<TodoItem>[];
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
                            groups={groups}
                            onClickFunction={onClickFunction}
                            type={type} buttonName="Add"
                            showGroupsSelector={false}
                            handleDeleteClick={undefined} />
                        <Divider />
                    </ListItem>}


                {items.map((item, index) => (
                    <React.Fragment key={"hjk" + index} >
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

                        {index !== items.length - 1 && <Divider component="li" />}
                    </React.Fragment>
                ))}

                {/* { ((addItemHandle !== undefined) && editList) &&
                <AddForm onClickFunction={ addItemHandle } group={ group } label={ "Add" } type={ type } />
            } */}
            </List>

        </>

    );
}

