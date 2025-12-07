import React, { useState, useEffect, useMemo } from 'react';

import { TextField, InputAdornment, IconButton, Autocomplete, List, ListItem, ListItemText } from '@mui/material';
import { MyIcon } from './MyIcon';
import { TodoItem, TodoMainItem } from '../models/TodoItems';

interface FilterProps {
    filterText: string;
    options: TodoItem[] | TodoMainItem[]; 
    callback: (text: string) => void;
    callbackSelect?: (item: TodoItem | TodoMainItem) => void;
    callbackEnter?: () => void;
};

export const FilterComponent = ({ filterText, options, callback, callbackSelect, callbackEnter }: FilterProps) => {

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

    // Filter options based on current input
    const filteredOptions = useMemo(() => {
        if (!item) return sortedOptions;
        const filterUpper = item.toUpperCase();
        return sortedOptions.filter(option => 
            option.name.toUpperCase().includes(filterUpper)
        );
    }, [sortedOptions, item]);

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter' && filteredOptions.length === 1) {
            event.preventDefault();
            if (callbackSelect) {
                callbackSelect(filteredOptions[0]);
            }
            if (callbackEnter) {
                callbackEnter();
            }
            setItem('');
            callback('');
        }
    };

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
                    if (callbackSelect) {
                        callbackSelect(newValue)
                    }
                    setItem('')
                }
            }}
            options={sortedOptions}
            groupBy={(option) => option.group || 'Uncategorized'}
            getOptionLabel={(option) => typeof option === 'string' ? option : option.name}
            renderOption={(props, option) => {
                const uniqueKey = 'id' in option ? option.id : (option as TodoMainItem).listid;
                const isSingleMatch = filteredOptions.length === 1 && filteredOptions[0] === option;
                return (
                    <li 
                        key={uniqueKey} 
                        {...props}
                        style={{
                            ...(props as React.HTMLAttributes<HTMLLIElement>).style,
                            backgroundColor: isSingleMatch ? '#4caf50' : undefined,
                            color: isSingleMatch ? 'white' : undefined,
                        }}
                    >
                        {option.name}
                    </li>
                );
            }}
            fullWidth
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Search"
                    variant="outlined"
                    onKeyDown={handleKeyDown}
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
                                            onClick={() => {
                                                setItem("");
                                                callback("");
                                            }}
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
