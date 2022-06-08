import React, { useState, useEffect } from 'react';

import { Grid, Paper, Card, CardHeader, CardContent, Button, ButtonGroup, Typography, TextField, List, ListItem, Divider, Hidden } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import ClearIcon from '@material-ui/icons/Clear';

import IconButton from '@material-ui/core/IconButton';

interface FilterProps { 
    filterText: string;
    callback: any;
    callbackEnter: any; 
 };

export const FilterComponent = ({ filterText, callback, callbackEnter } : FilterProps ) => {

    const [item, setItem] = useState(filterText);

    useEffect(() => {
        setItem( filterText )
      }, [ filterText ]);

    const setFilter = (text: string ) => {
        setItem(text)
        callback(text)
    }

    const checkEnter = ( e: React.KeyboardEvent<HTMLDivElement>) => {
        if ( e.key === "Enter" ) {
            // alert("Enter")            
            callbackEnter()
        }
    }

    return (
        <TextField
            value={ item }
            label="Filter"
            fullWidth
            variant="outlined"
            InputProps={ {
                startAdornment: (
                    <InputAdornment position="end" >
                        <SearchIcon />
                    </InputAdornment>
                ),
                endAdornment: (
                    <InputAdornment position="end" >
                        <IconButton
                            disabled={ item.length === 0 }
                            onClick={ () => setFilter("") }

                        >
                            <ClearIcon />
                        </IconButton>
                    </InputAdornment>
                )
            } }
            onKeyPress={ e => checkEnter(e) }
            onChange={ e => setFilter(e.target.value) }
        />
    )
}
