import React, { useState, useEffect } from "react";
import { Button, TextField, Grid, Autocomplete } from '@mui/material';

// import AddIcon from '@material-ui/icons/Add';
// import DeleteIcon from '@material-ui/icons/Delete';


// hideGroups: When this is in context of a group, the group can be hidden
import { useStyles } from "../Styles"
import { MyIcon } from "./MyIcon";
import { GenericGroup } from "./helpers";

interface Props {
    onClickFunction: ( linkname:string, linkUrl:string, groupName:string) => void;
    name: string;
    url?: string;
    type: string;
    group?: string;
    groups: string[];
    buttonName?: string;
    clearAfterClick?: boolean;
    showGroupsSelector?: boolean;
    handleDeleteClick? : () => void;
    renderModal: boolean 
}


export const AddForm = ({
    onClickFunction,
    name = "",
    url = "",
    type = "",
    group = "",
    groups ,
    buttonName = "Add", 
    clearAfterClick = true,
    showGroupsSelector = true,
    handleDeleteClick,
    renderModal = false } : Props ) => {

    // props replaced by
    const classes = useStyles();

    const [linkName, setLinkName] = useState(name);
    const [groupName, setGroupName] = useState(group);
    const [linkUrl, setLinkUrl] = useState(url);
    const [trySend, setTrySend] = useState(false);

    const handleGroupChange = ( event : any ) => {
        console.log(event)
        console.log("groups", groups)
        setGroupName(event.target.value);
    };

    useEffect(() => {
        setLinkName(name)
    }, [name]);


    useEffect(() => {
        setLinkUrl(url)
    }, [url]);    

    useEffect(() => {
        setGroupName(group)
    }, [group]);

    const isValid = () => {
        if (type !== "links") {
            if (linkName.length > 0) {
                return true
            }
        }
        else {
            if (linkName.length > 0 && linkUrl.length > 0) {
                return true
            }
        }
        return false
    }




    // const simpleGroups = groups.map((x) => { return x.value })

    const handleButtonClick = () => {
        if (type !== "links") {
            if (linkName.length > 0) {
                // send ONLY when it's filled out
                onClickFunction(linkName, "", groupName);

                setLinkName("");
                // setLinkUrl("");
                // setGroupName("");
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
    }

    const handleClick = ( event : any ) => {
        event.preventDefault();
        handleButtonClick()
    };

    const hasError = ( val : string ) => {
        if (val === undefined || val === null) return true;
        if (val.length > 0) {
            return false
        } else if (trySend) {
            // show issues when length is 0 and the user has tried to send
            return true
        }
    };

    const checkEnter = (e : React.KeyboardEvent ) => {
        if (e.key === "Enter") {
            // alert("Enter")
            handleClick(e)
        }
    }

    //////
    //////   LAYOUT //////////////

    const getName = () => {
        return (
            <TextField
                value={ linkName }
                error={ hasError(linkName) }
                label="Name"
                size="small"
                fullWidth
                variant="outlined"
                onKeyPress={ e => checkEnter(e) }
                onChange={ e => setLinkName(e.target.value) }
            />
        )
    }
    const getGroup = () => {
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
                            
                            value={ groupName}
                            // error={ groupName === undefined || groupName.length == 0 }
                            getOptionLabel={ (option) => option }
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
                                // } else if (newValue && newValue.value) {
                                //     // Create a new value from the user input
                                //     setGroupName(
                                //         newValue.value,
                                //     );
                                // } else {
                                //     setGroupName(newValue);
                                // }
                            } } }
                            renderInput={ (params) => <TextField {...params} label="Groups" fullWidth variant="outlined" /> }
                            
                        />

                    ) }
            </>

        )
    }
    const getLink = () => {
        return (
            <TextField
                error={ hasError(linkUrl) }
                value={ linkUrl }
                size="small"
                label="URL"
                fullWidth
                variant="outlined"
                onKeyPress={ e => checkEnter(e) }
                onChange={ e => setLinkUrl(e.target.value) }
            />
        )
    }

    const getWidthMd = () => {

        if (renderModal) return 12;

        let elementsToShow = 1
        if (showGroupsSelector) {
            elementsToShow += 1
        }
        if (type === "links") {
            elementsToShow += 1
        }

        let width = 1

        switch (elementsToShow) {
            case 1: width = 8; break;
            case 2: width = 4; break;
            case 3: width = 3; break;
            default:
                console.error("Unexpected elementsToShow", elementsToShow)
        }
        // console.log( "elementsToShow : ", elementsToShow )         
        return width

    }


    return (
        <>
            { renderModal ? (
                <Grid container alignItems="center" justifyContent="space-between" spacing={ 4 } >
                    <Grid item xs={ 12 } >
                        { getName() }
                    </Grid>
                    { showGroupsSelector &&
                        <Grid item xs={ 12 } >
                            { getGroup() }
                        </Grid>
                    }
                    { type === "links" &&
                        <Grid item xs={ 12 } >
                            { getLink() }
                        </Grid> }
                    
                    <Grid item  >
                        { handleDeleteClick !== undefined &&
                            <Button
                                onClick={ handleDeleteClick }
                                color="secondary"
                                startIcon={ <MyIcon icon="delete" />}
                                variant="contained" >
                                Delete
                            </Button>
                        }
                    </Grid>
                    <Grid item >
                        <Button
                            variant="contained"
                            color={ isValid() ? "primary" : undefined  }
                            onClick={ handleButtonClick }
                            startIcon={ <MyIcon icon="add" />} >
                            { buttonName }
                        </Button >
                    </Grid> 
                </Grid>
            ) : (
                <Grid container alignItems="center" justifyContent="space-between" spacing={ 2 } >
                    <Grid item xs={ renderModal ? 12 : 8 } md={ getWidthMd() } >
                        { getName() }
                    </Grid>
                    { showGroupsSelector &&
                        <Grid item xs={ renderModal ? 12 : 8 } md={ getWidthMd() } >
                            { getGroup() }
                        </Grid>
                    }
                    { type === "links" &&
                        <Grid item xs={ renderModal ? 12 : 8 } md={ getWidthMd() } >
                            { getLink() }
                        </Grid> }

                    { handleDeleteClick !== undefined &&
                        <Grid item  >
                            <Button
                                onClick={ handleDeleteClick }
                                color="secondary"
                                startIcon={ <MyIcon icon="delete" /> }
                                variant="contained" >
                                Delete
                            </Button>
                        </Grid>
                    }
                    <Grid item >
                        <Button
                            variant="contained"
                            color={ isValid() ? "primary" : undefined }
                            onClick={ handleButtonClick }
                            startIcon={ <MyIcon icon="add" />} >
                            { buttonName }
                        </Button >
                    </Grid>
                </Grid>
            )
            }
        </>

    );
};