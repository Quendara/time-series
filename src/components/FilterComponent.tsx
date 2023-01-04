import React, { useState, useEffect } from 'react';

import { TextField, InputAdornment, IconButton } from '@mui/material';

import SearchIcon from '@material-ui/icons/Search';
import ClearIcon from '@material-ui/icons/Clear';

interface FilterProps { 
    filterText: string;
    callback: ( text: string ) => void ;
    callbackEnter: () => void; 
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
            label="Filter 2"
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
