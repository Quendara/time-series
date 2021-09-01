import React, { useState, useEffect, useRef,SyntheticEvent, KeyboardEvent  } from "react";

import { ListItem, List, CardContent, Snackbar } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm'

import { Grid, Button, TextField, Divider, Typography } from '@material-ui/core';
import { MyCard, MyCardHeader, MyTextareaAutosize, MyTextareaRead } from "./StyledComponents"
import Autocomplete from '@material-ui/lab/Autocomplete';
import { MyIcon } from "./MyIcon";

import { TodoItem } from "./TodoItems"

import { useStyles } from "../Styles"



  interface Props {
    selectedItem: any;
    updateFunction: any;
    lists: TodoItem[];
  }  



export const Details = ({ selectedItem, updateFunction, lists } : Props) => {

    const classes = useStyles();
    const textFieldRef = useRef(null);

    // (updateFunction(todoid, name, link, group, description=undefined ) )
    // const uiUpdateTodo = (items, todo) => {

    const [selectionStart, setSelectionStart] = useState("");

    const [edit, setEdit] = useState(false);
    const [listvalue, setListValue] = useState("");

    const [selectedItemValue, setSelectedValue] = useState(selectedItem.description);
    const [selectedItemId, setSelectedItemId] = useState(selectedItem.id);

    const [successSnackbarMessage, setSuccessSnackbarMessage] = React.useState("");

    const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setSuccessSnackbarMessage("");
    };

    // const handleClick = () => {
    //     setOpen(true);
    // };

    useEffect(() => {

        if (edit) // ( selectedItem.id !== selectedItemId ) 
        {
            // alert( "save ... "+ selectedItemValue + "<< xxx")       

            updateFunction(selectedItemId, { description: selectedItemValue })
        }

        console.log("useEffect", selectedItem.description)
        setSelectedValue(selectedItem.description)
        setSelectedItemId(selectedItem.id)

        const listname = getGlobalList(lists, selectedItem.listid).name
        setListValue(listname)

        setEdit(false)

        return () => {

        };

    }, [selectedItem]);

    // useEffect(() => {
    //     document.addEventListener("keydown", handleKeyPress, false);

    //     return () => {
    //         document.removeEventListener("keydown", handleKeyPress, false);
    //     };
    // });

    // const isList


    const handleKeyPress = (event : KeyboardEvent ) => {

        // if (edit) {

        //     const initialCursor = event.target.selectionStart
        //     let cursorPos = event.target.selectionStart
        //     const content = event.target.textContent

        //     console.log(textFieldRef)

        //     switch (event.key) {
        //         case "Enter--INVALID":
        //             let value = selectedItemValue + " *"

        //             const splittetLines = selectedItemValue.split("\n")
        //             let charCount = 0

        //             splittetLines.forEach((line, index) => {

        //                 charCount += line.length

        //                 if (cursorPos < charCount) {
        //                     // Add to index, 0 means delete = 0
        //                     splittetLines.splice(index, 0, "* ");
        //                     cursorPos = 9999999999999999999999999
        //                 }

        //             });
        //             // setSelectedValue( splittetLines.join("\n")  )
        //             event.preventDefault()
        //             textFieldRef.current.value = splittetLines.join("\n")
        //             textFieldRef.current.selectionStart = initialCursor + 2
        //             textFieldRef.current.selectionEnd = initialCursor + 2


        //         // event.target.textContent = splittetLines.join("\n")
        //         // setSelectionStart( event.target.selectionStart )
        //     }
        //     // console.log("handleKeyPress events blocked, to avoid actions!", event )
        //     // return;
        // }
    }


    const updateHandle = () => {
        // updateFunction(selectedItem.id, selectedItem.name, selectedItem.link, selectedItem.group, selectedItemValue)

        updateFunction(selectedItem.id, { description: selectedItemValue })
        setSuccessSnackbarMessage("Saved !!! ")
        setEdit(false)
    }

    const getGlobalList = (lists : TodoItem[] , id: number ) => {
        if (lists !== undefined) {
            const fl = lists.filter(item => +item.id === +id)
            console.log("getGlobalList", id, fl, lists)

            if (fl.length > 0) {
                return fl[0]
            }
        }
        return {
            id: "666",
            name: "Undefined"
        }
    }

    const handleListChange = (selecedList : TodoItem ) => {

        if (selecedList !== null) {
            console.log("handleListIdChange : ", selecedList.id, selecedList.name)

            updateFunction(selectedItem.id, { listid: selecedList.id, })

            setListValue(selecedList.name)
        }

    }

    return (
        <>
            <Snackbar
                open={ successSnackbarMessage.length > 0 }
                autoHideDuration={ 2000 }
                onClose={ handleClose }
                message="Saved" >
                <Alert onClose={ handleClose } severity="success">
                    { successSnackbarMessage }
                </Alert>
            </Snackbar>
            <MyCard>


                <MyCardHeader>
                    <List>
                        <ListItem>
                            { selectedItem.name }
                        </ListItem>
                    </List>
                </MyCardHeader>
                <CardContent>
                    <Grid
                        container
                        direction="row"
                        justify="space-between"
                        alignItems="center" >
                            
                        <Grid item xs={ 4 }>
                            <Button variant="contained" disabled={ !edit } onClick={ updateHandle }><MyIcon icon="update" /> </Button>
                        </Grid>

                        <Grid item xs={ 8 } >
                            <Autocomplete
                                id="combo-box-demo"
                                inputValue={ "" }
                                //value={ listvalue }
                                onChange={ (event, newValue) => {
                                    if( newValue !== null ){
                                        handleListChange(newValue);
                                    }
                                    
                                } }
                                options={ lists }
                                getOptionLabel={ (option) => "(" + option.id + ") " + option.name }                                
                                renderInput={ (params) => <TextField { ...params } label={ listvalue } variant="outlined" /> }
                            />
                        </Grid>

                    </Grid>

                    <List>
                        <Divider></Divider>
                        <div >
                            {/* className={ classes.navigationInner } */ }
                            { edit ? (
                                <ListItem>
                                    <MyTextareaAutosize
                                        value={ selectedItemValue ? selectedItemValue : "" }
                                        rowsMin={ 10 }
                                        // error={ hasError(linkName) }
                                        // label="Name"
                                        // size="small"
                                        autoFocus={ true }
                                        // fullWidth
                                        // variant="outlined"
                                        ref={ textFieldRef }
                                        onKeyPress={ e => handleKeyPress(e) }
                                        onChange={ e => setSelectedValue(e.target.value) } />
                                </ListItem>
                            ) :
                                (
                                    // remarkPlugins={[remarkGfm]}
                                    // <ReactMarkdown children={ selectedItemValue ? selectedItemValue : "No Description" } remarkPlugins={ [remarkGfm] }></ReactMarkdown>
                                    <div className="markdown" onClick={ () => setEdit(true) }>
                                        
                                        <ReactMarkdown>
                                        { selectedItemValue ? selectedItemValue : "No Description" }
                                            
                                        </ReactMarkdown>
                                    </div>

                                )
                            }


                        </div>
                    </List>
                    <Divider></Divider>
                    <Typography variant="h4" color="initial"> { selectionStart } </Typography>


                </CardContent>
            </MyCard>
        </>

    )
}


{/* <ListItem button onClick={ () => setEdit(true) }>
<MyTextareaRead>
{ selectedItemValue ? selectedItemValue : "-" }
</MyTextareaRead>
</ListItem> */}
