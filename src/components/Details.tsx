import React, { useState, useEffect, useRef, SyntheticEvent, KeyboardEvent } from "react";

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


interface PropMTA {
    initValue: String;
    updateFunction: any;
}

const MarkdownTextareaAutosize = ({ initValue, updateFunction } : PropMTA) => {
    const textFieldRef = useRef<any>(); // textFieldRef.current.

    const [caret, setCaret] = useState({
        start: 0,
        end: 0
    });

    useEffect(() => {

        textFieldRef.current.value = initValue;

        return () => {

        };

    }, [initValue]);    

    const insertText = (value: String, caret_start: number, caret_end: number, text: String) => {

        const pre = value.substring(0, caret_start)
        const post = value.substring(caret_end, value.length)

        const insertItem = text
        const newPos = caret_start + insertItem.length

        console.log("insertText : ", caret_start)


        return pre
            + insertItem
            + post

    }

    const handleSelect = (e: any) => {

        console.log("handleSelect : ", e.target.selectionStart)

        setCaret({ start: e.target.selectionStart, end: e.target.selectionEnd });
    }


    const handleKeyPress = (event: any) => {

            const initialCursor = event.target.selectionStart
            let cursorPos = event.target.selectionStart
            let selectionEnd = event.target.selectionEnd

            const previous_value = textFieldRef.current.value

            const insertion_str = "\n* ";

            switch (event.key) {
                case "Enter":

                    const insertedText = insertText(previous_value, cursorPos, selectionEnd, insertion_str)
                    event.preventDefault()
                    setCaret({ start: cursorPos, end: selectionEnd })

                    //     let value = selectedItemValue + " *"

                    //     const splittetLines = selectedItemValue.split("\n")
                    //     let charCount = 0

                    //     splittetLines.forEach((line: String, index: Number ) => {

                    //         charCount += line.length + 1

                    //         if (cursorPos < charCount) {
                    //             // Add to index, 0 means delete = 0
                    //             splittetLines.splice(index, 0, "* ");
                    //             cursorPos = 9999999999999999999999999
                    //         }

                    //     });

                    //     setSelectedValue( splittetLines.join("\n")  )
                    //     event.preventDefault()
                    
                    if (textFieldRef && textFieldRef.current) {
                        textFieldRef.current.value = insertedText;
                        textFieldRef.current.selectionStart = initialCursor + 3
                        textFieldRef.current.selectionEnd = initialCursor + 3

                        updateFunction( insertedText )
                    }
            }        
    }

    return (
        <MyTextareaAutosize
            // value={ selectedItemValue ? selectedItemValue : "" }
            rowsMin={10}
            // error={ hasError(linkName) }
            // label="Name"
            // size="small"
            autoFocus={true}
            // fullWidth
            // variant="outlined"
            ref={textFieldRef}
            onSelect={(e) => handleSelect(e)}
            onKeyPress={e => handleKeyPress(e)}
            onChange={e => updateFunction(e.target.value)} />
    )

    // <Grid item xs={12} >{caret.start} - {caret.end}</Grid>

}



interface Props {
    selectedItem: any;
    updateFunction: any;
    lists: TodoItem[];
}


export const Details = ({ selectedItem, updateFunction, lists }: Props) => {

    const classes = useStyles();

    // (updateFunction(todoid, name, link, group, description=undefined ) )
    // const uiUpdateTodo = (items, todo) => {

    // const [selectionStart, setSelectionStart] = useState("");


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




    const updateHandle = () => {
        // updateFunction(selectedItem.id, selectedItem.name, selectedItem.link, selectedItem.group, selectedItemValue)

        updateFunction(selectedItem.id, { description: selectedItemValue })
        setSuccessSnackbarMessage("Saved !!! ")
        setEdit(false)
    }

    const getGlobalList = (lists: TodoItem[], id: number) => {
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

    const handleListChange = (selecedList: TodoItem) => {

        if (selecedList !== null) {
            console.log("handleListIdChange : ", selecedList.id, selecedList.name)

            updateFunction(selectedItem.id, { listid: selecedList.id, })

            setListValue(selecedList.name)
        }

    }

    return (
        <>
            <Snackbar
                open={successSnackbarMessage.length > 0}
                autoHideDuration={2000}
                onClose={handleClose}
                message="Saved" >
                <Alert onClose={handleClose} severity="success">
                    {successSnackbarMessage}
                </Alert>
            </Snackbar>
            <MyCard>


                <MyCardHeader>
                    <List>
                        <ListItem>
                            {selectedItem.name}
                        </ListItem>
                    </List>
                </MyCardHeader>
                <CardContent>
                    <Grid
                        container
                        direction="row"
                        justify="space-between"
                        alignItems="center" >

                        <Grid item xs={4}>
                            <Button variant="contained" disabled={!edit} onClick={updateHandle}><MyIcon icon="update" /> </Button>
                        </Grid>

                        <Grid item xs={8} >


                            <Autocomplete
                                id="combo-box-demo"
                                inputValue={""}
                                //value={ listvalue }
                                onChange={(event, newValue) => {
                                    if (newValue !== null) {
                                        handleListChange(newValue);
                                    }
                                }}
                                options={lists}
                                getOptionLabel={(option) => "(" + option.id + ") " + option.name}
                                renderInput={(params) => <TextField {...params} label={listvalue} variant="outlined" />}
                            />
                        </Grid>

                    </Grid>

                    <List>
                        <Divider></Divider>
                        <div >
                            {/* className={ classes.navigationInner } */}
                            {edit ? (
                                <ListItem>
                                    <MarkdownTextareaAutosize
                                        initValue={selectedItemValue}
                                        updateFunction={(val: String) => setSelectedValue(val)}
                                    />


                                    
                                </ListItem>
                            ) :
                                (
                                    // remarkPlugins={[remarkGfm]}
                                    // <ReactMarkdown children={ selectedItemValue ? selectedItemValue : "No Description" } remarkPlugins={ [remarkGfm] }></ReactMarkdown>
                                    <div className="markdown" onClick={() => setEdit(true)}>

                                        <ReactMarkdown>
                                            {selectedItemValue ? selectedItemValue : "No Description"}

                                        </ReactMarkdown>
                                    </div>

                                )
                            }


                        </div>
                    </List>
                    <Divider></Divider>

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
