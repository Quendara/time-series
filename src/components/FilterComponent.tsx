import React, { useState, useEffect, useMemo } from 'react';

import { TextField, InputAdornment, IconButton, Autocomplete } from '@mui/material';
import { MyIcon } from './MyIcon';
import { TodoItem } from '../models/TodoItems';

interface FilterProps {
    filterText: string;
    options: TodoItem[]; 
    callback: (text: string) => void;
    callbackEnter: () => void;
};

export const FilterComponent = ({ filterText, options, callback, callbackEnter }: FilterProps) => {

    const [item, setItem] = useState(filterText);

    useEffect(() => {
        setItem(filterText)
    }, [filterText]);

    const setFilter = (text: string) => {
        setItem(text)
        callback(text)
    }

    const checkEnter = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "Enter") {
            // alert("Enter")            
            callbackEnter()
        }
    }

    const sortedOptions = useMemo(() => {
        return [...options].sort((a, b) => {
            const groupCompare = (a.group || '').localeCompare(b.group || '');
            if (groupCompare !== 0) return groupCompare;
            return a.name.localeCompare(b.name);
        });
    }, [options]);

    return (
        <Autocomplete
            freeSolo
            inputValue={item}
            onInputChange={(_, newValue) => setFilter(newValue)}
            options={sortedOptions}
            groupBy={(option) => option.group || 'Uncategorized'}
            getOptionLabel={(option) => typeof option === 'string' ? option : option.name}
            fullWidth
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Search"
                    variant="outlined"
                    onKeyDown={e => checkEnter(e)}
                    InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                            <>
                                <InputAdornment position="start">
                                    <MyIcon icon="search" />
                                </InputAdornment>
                                {params.InputProps.startAdornment}
                            </>
                        ),
                        endAdornment: (
                            <>
                                {item.length > 0 && (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setFilter("")}
                                            size="small"
                                        >
                                            <MyIcon icon="clear" />
                                        </IconButton>
                                    </InputAdornment>
                                )}
                                {params.InputProps.endAdornment}
                            </>
                        )
                    }}
                />
            )}
        />
    )
}
