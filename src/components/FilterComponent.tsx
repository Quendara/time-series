import React, { useState, useEffect, useMemo } from 'react';

import { TextField, InputAdornment, IconButton, Autocomplete } from '@mui/material';
import { MyIcon } from './MyIcon';
import { TodoItem, TodoMainItem } from '../models/TodoItems';

interface FilterProps {
    filterText: string;
    options: TodoItem[] | TodoMainItem[]; 
    callback: (text: string) => void;
    callbackSelect: (item: TodoItem | TodoMainItem) => void;
};

export const FilterComponent = ({ filterText, options, callback, callbackSelect }: FilterProps) => {

    const [item, setItem] = useState(filterText);

    useEffect(() => {
        setItem(filterText)
    }, [filterText]);

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
            onInputChange={(_, newValue, reason) => {
                if (reason === 'input') {
                    setItem(newValue)
                    callback(newValue)
                }
            }}
            onChange={(_, newValue) => {
                if (newValue && typeof newValue !== 'string') {
                    callbackSelect(newValue)
                    setItem('')
                }
            }}
            options={sortedOptions}
            groupBy={(option) => option.group || 'Uncategorized'}
            getOptionLabel={(option) => typeof option === 'string' ? option : option.name}
            fullWidth
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Search"
                    variant="outlined"
                    // onKeyDown={e => checkEnter(e)}
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
