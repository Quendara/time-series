import React, { useState } from "react";

import {
    // IndexRoute,
    // useRouteMatch,
    useLocation
} from "react-router-dom";

// import { useHistory } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

import { Icon, IconButton, Modal, ListItem, ListItemIcon, ListItemText, List, ListItemSecondaryAction, Typography, Grid, Card, CardContent, Divider, CardHeader, Dialog, ListItemButton } from '@mui/material';

import useLongPress from "../hooks/useLongPress";

// import { ArrowDropDown, ArrowRight } from '@material-ui/icons';
// import { CheckCircleOutline, RadioButtonUnchecked } from '@material-ui/icons';

// import { QAutocomplete } from "./QAutocomplete"
import { TypographyDisabled, TypographyEnabled, MyPaperHeader } from "./StyledComponents"

// import CloseIcon from '@material-ui/icons/Close';
import { MyIcon } from "./MyIcon"

import { TodoItem } from "../models/TodoItems"
import { GenericGroup, mapGenericToStringGroup } from "../components/helpers"

import { AddForm } from "./AddForm"
// import { UpdateFunc } from "../models/Definitions" 
import { UpdateTodosInput } from "../API"

export enum TodoListType {
    TODO = 'todo',
    TODO_SIMPLE = 'todo_simple',
    MESSAGE = 'message',
    LINKS = 'links',
    UNDEFINED = 'undefined',
}


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
    selectedItemId?: string;
    removeClickFunction: (id: string) => void;
    updateFunction?: (item: UpdateTodosInput) => void;
    selectFunction: (id: string) => void;
    toggleFunction: (id: string) => void;
    type: TodoListType;
    groups: GenericGroup<TodoItem>[];
    group: string | undefined;
    editList: boolean
}



const ListEl = (
    { name,
        link,
        checked,
        id,
        selectedItemId,
        removeClickFunction,
        updateFunction,
        selectFunction,
        toggleFunction,
        type,
        groups,
        group,
        editList }: PropsEl) => {

    let location = useLocation();
    // const history = useHistory();
    const navigate = useNavigate();

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

        if (updateFunction) {
            updateFunction({ id, link: linkUrl, name: linkName, group: groupname })
            setEdit(false)
        }
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
                // history.push(link);
                navigate(link);
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

                <Dialog
                    open={edit}
                    onClose={() => setEdit(false)}
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                >
                    <div >
                        <Card>
                            <CardHeader
                                title={"Update Item "}
                                action={<>
                                    <IconButton onClick={() => { navigate(location.pathname + "/" + id) }} >
                                        <MyIcon icon="open_in_full"></MyIcon>
                                    </IconButton>
                                    <IconButton onClick={() => setEdit(false)} >
                                        <MyIcon icon="close"></MyIcon>
                                    </IconButton>

                                </>

                                }
                            >

                            </CardHeader>

                            <CardContent>
                                <Grid
                                    container
                                    direction="row"
                                    justifyContent="flex-start"
                                    alignItems="flex-start"
                                    spacing={4}
                                >
                                    <Grid item xs={12} >
                                        <AddForm
                                            renderModal={true}
                                            name={name}
                                            url={link}
                                            group={group}
                                            groups={groups.map((x) => { return x.value })}
                                            onClickFunction={onUpdateFunction}
                                            type={type}
                                            buttonName="Update"
                                            handleDeleteClick={handleDeleteClick} />
                                    </Grid>


                                </Grid>
                            </CardContent>
                        </Card>
                    </div>
                </Dialog>
            }
            {(editList) ? (
                <ListItem  >
                    <ListItemIcon onClick={handleToggleFunction} >
                        {isChecked(checked) ? <Icon color="primary" >check_circle_outline</Icon> : <Icon color="primary" >radio_button_unchecked</Icon> }
                    </ListItemIcon>
                    <AddForm
                        renderModal={false}
                        name={name}
                        url={link}
                        group={group}
                        groups={mapGenericToStringGroup(groups)}
                        onClickFunction={onUpdateFunction}
                        type={type}
                        buttonName="Update"
                        handleDeleteClick={undefined} />
                    <ListItemSecondaryAction >
                        <IconButton edge="end" onClick={handleDeleteClick} color="error" aria-label="delete">
                            <MyIcon icon="delete" />
                        </IconButton>
                    </ListItemSecondaryAction>
                </ListItem>
            ) :
                (
                    <>
                        {(type === TodoListType.TODO || type === TodoListType.TODO_SIMPLE) &&
                            <ListItemButton                                
                                onClick={handleSelect}
                                selected={ (selectedItemId===id) } >

                                <ListItemIcon onClick={handleToggleFunction} >
                                    {isChecked(checked) ? <Icon color="primary" >check_circle_outline</Icon> : <Icon color="primary" >radio_button_unchecked</Icon> }
                                </ListItemIcon>
                                <ListItemText
                                    onClick={handleSelect}
                                    primary={
                                        <span>
                                            {
                                                isChecked(checked) ?
                                                    <TypographyDisabled onClick={handleSelect} {...longPressEvent}>{name}</TypographyDisabled>
                                                    : <TypographyEnabled onClick={handleSelect}  {...longPressEvent}>{name}</TypographyEnabled>
                                            }

                                        </span>
                                    }
                                />
                                <ListItemSecondaryAction>
                                    <IconButton style={isChecked(checked) ? { color: "#AAA" } : {}} onClick={handleSelect} edge="end" aria-label="open">
                                        <Icon>launch</Icon>
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItemButton>}

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


interface PropsHeader {
    items?: TodoItem[];
    header: string;
    edit: boolean;
    setEditCallback: (v: boolean) => void
};
// : React.FC<> 
export const ListHeader = (props: PropsHeader) => {

    return (
        <MyPaperHeader onClick={() => props.setEditCallback(!props.edit)}>
            <List>
                <ListItem>
                    <ListItemIcon>
                        {props.edit ? <MyIcon icon="arrow_drop_down" />  : <MyIcon icon="arrow_right" /> }
                    </ListItemIcon>

                    {props.header}

                    {/* {type === TodoListType.TODO &&
                        <ListItemSecondaryAction>
                            {printRemaining(filterCompleted(items).length, items.length)}
                        </ListItemSecondaryAction>
                    } */}
                </ListItem>
            </List>
        </MyPaperHeader>
    )
}


interface PropsQ {
    items: TodoItem[];
    selectedItemId?: string;
    removeItemHandle: (id: string) => void;
    header: string;
    addItemHandle?: (name: string, link: string, groupname: string) => void;
    updateFunction?: (item: UpdateTodosInput) => void;
    toggleFunction: (id: string) => void;
    selectFunction: (id: string) => void;
    type: TodoListType;
    group: string;
    groups?: GenericGroup<TodoItem>[];
    editList: boolean
};


export const ListQ = ( props: PropsQ) => {

    const [edit, setEdit] = useState(false);
    const [name, setName] = useState("");

    const onClickFunction = (name: string, link: string, groupname: string) => {

        if (props.addItemHandle) {
            props.addItemHandle(name, link, groupname)
            setName("")
        }
    }

    return (

        <>
            <ListHeader
                header={props.header}
                edit={edit}
                setEditCallback={ (e: boolean) => {
                    return setEdit(e);
                }}
            />

            <List
                dense={false}
                id={props.header}
            >
                {edit &&
                    <ListItem>
                        <AddForm renderModal={false}
                            name={name}
                            group={props.group}
                            groups={mapGenericToStringGroup(props.groups)}
                            onClickFunction={ onClickFunction }
                            type={ props.type }
                            buttonName="Add"
                            showGroupsSelector={false}
                            handleDeleteClick={undefined} />
                        <Divider />
                    </ListItem>}


                {props.items.map((item, index) => (
                    <React.Fragment key={"hjk" + item.id } >
                        
                        <ListEl
                            editList={props.editList}
                            key={index}
                            id={item.id}
                            name={item.name}
                            group={props.group}
                            groups={props.groups ? props.groups : []}
                            checked={item.checked}
                            link={item.link}
                            selectedItemId={props.selectedItemId}
                            selectFunction={props.selectFunction}
                            updateFunction={props.updateFunction}
                            removeClickFunction={props.removeItemHandle}
                            toggleFunction={props.toggleFunction}
                            type={props.type}
                        />

                        {index !== props.items.length - 1 && <Divider component="li" />}
                    </React.Fragment>
                ))}

                {/* { ((addItemHandle !== undefined) && editList) &&
                <AddForm onClickFunction={ addItemHandle } group={ group } label={ "Add" } type={ type } />
            } */}
            </List>

        </>

    );
}

