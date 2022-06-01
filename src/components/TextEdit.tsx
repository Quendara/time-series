

import React, { useState, useEffect, KeyboardEvent } from "react";
import { TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';

interface Props {

    value: string;
    label: string;
    groups?: any;
    callback: (s: string) => void;
    children?: React.ReactNode
}

export const TextEdit = ({ value, label, callback, groups, children } : Props) => {

    const [internalName, setInternalName] = useState<string>(value);
    const [edit, setEdit] = useState<boolean>(false);


    useEffect(() => {
        setInternalName(value)
    }, [value]);


    const checkEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {

        if (event.key === "Enter") {
            // alert("Enter")
            callback(internalName)
            setEdit(false)
        }
    }

    return (
        <>{edit ? (
            <>
                {groups === undefined ? (
                    <TextField
                        value={internalName}
                        // error = { hasError(internalName) }
                        label={label}
                        size="small"
                        fullWidth
                        variant="outlined"
                        onKeyPress={e => checkEnter(e)}
                        onChange={e => setInternalName(e.target.value)}
                    />
                ) : (
                    <Autocomplete
                        id="combo-box-demo"
                        options={groups}
                        size="small"
                        freeSolo
                        fullWidth
                        value={{ value: internalName }}
                        // error={ groupName === undefined || groupName.length == 0 }
                        getOptionLabel={(option) => option.value}
                        onKeyPress={e => checkEnter(e)}
                        onInputChange={(event, newValue) => {
                            if (typeof newValue === 'string') {
                                setInternalName(
                                    newValue
                                );
                            }
                        }}
                        onChange={(event, newValue) => {
                            if (typeof newValue === 'string') {
                                setInternalName(
                                    newValue
                                );
                            } else if (newValue && newValue.value) {
                                // Create a new value from the user input
                                setInternalName(
                                    newValue.value,
                                );
                            } else {
                                setInternalName(newValue);
                            }
                        }}
                        renderInput={(params) => <TextField {...params} label="Groups" fullWidth variant="outlined" />}
                    />
                )}
            </>
        ) : (
            <a onClick={() => setEdit(true)}>{children ? children : internalName} </a>
        )
        }
        </>
    )
}

