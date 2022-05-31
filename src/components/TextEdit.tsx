

import React, { useState, useEffect, KeyboardEvent } from "react";
import { Grid, Paper, Card, CardHeader, CardContent, Button, ButtonGroup, Typography, TextField, List, ListItem, Divider, Hidden } from '@material-ui/core';

interface Props {
    key: string;
    value: string;
    callback: (s: string) => void;
}
 
export const TextEdit = ({ value, callback } : Props ) => {

    const [internalName, setInternalName] = useState<string>(value);
    const [edit, setEdit] = useState<boolean>(false);
    

    useEffect(() => {
        setInternalName(value)
    }, [value] );


    const checkEnter = (event : React.KeyboardEvent<HTMLInputElement> ) => {
        event.preventDefault();
        if ( event.key === "Enter") {
            // alert("Enter")
            callback( internalName )
            setEdit(false)
        } 
    }    

    return (
        <>{ edit ? (
            <TextField
            value= { internalName }
            // error = { hasError(internalName) }
            label = "" 
            size = "small"
            fullWidth 
            variant = "outlined"
            onKeyPress = { e => checkEnter(e) }
            onChange = { e  => setInternalName(e.target.value) }
            />
        ) : (
            <span onClick={ () => setEdit( true ) }>{ value } </span>
        )
        }
        </>
    )
} 

