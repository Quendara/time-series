

import React, { useState, useEffect, KeyboardEvent } from "react";
import { Grid, Paper, Card, CardHeader, CardContent, Button, ButtonGroup, Typography, TextField, List, ListItem, Divider, Hidden } from '@material-ui/core';

interface Props {
    
    value: string;
    label: string;    
    callback: (s: string) => void;
    children: React.ReactNode
}
 
export const TextEdit = ({ value, label, callback, children } : Props ) => {

    const [internalName, setInternalName] = useState<string>(value);
    const [edit, setEdit] = useState<boolean>(false);
    

    useEffect(() => {
        setInternalName(value)
    }, [value] );


    const checkEnter = (event : React.KeyboardEvent<HTMLInputElement> ) => {
        
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
                label = {label}
                size = "small"
                fullWidth 
                variant = "outlined"
                onKeyPress = { e => checkEnter(e) }
                onChange = { e  => setInternalName(e.target.value) }
                />
        ) : (
            <a onClick={ () => setEdit( true ) }>{ children ? children : internalName  } </a>
        )
        }
        </>
    )
} 

