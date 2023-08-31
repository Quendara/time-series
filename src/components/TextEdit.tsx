import React, { useState, useEffect, KeyboardEvent } from "react";
import { TextField, Grid, IconButton, Autocomplete } from '@mui/material';
import { GenericGroup } from "../components/helpers"

import { MyIcon } from "./MyIcon";
interface Props {

    value: string;
    callback: (s: string) => void;
    label?: string;
    readonly?: boolean
    groups?: any;
    children?: React.ReactNode
}

export const TextEdit = ({ value, label, callback, groups, readonly = false, children }: Props) => {

    const [internalName, setInternalName] = useState<string>(value);
    const [edit, setEdit] = useState<boolean>(false);

    const [hover, setHover] = useState(false);

    const handleMouseIn = () => {
        setHover(true);
    };

    const handleMouseOut = () => {
        setHover(false);
    };


    useEffect(() => {
        setInternalName(value)
    }, [value]);


    const checkEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {

        // event.preventDefault()

        console.log("Key xx : ", event.key)

        if (event.key === "Enter") {
            // alert("Enter")
            callCallback()
        }
        if (event.key === "Escape") {
            // alert("Enter")
            // callback(internalName)
            setEdit(false)
        }
    }

    const callCallback = () => {
        callback(internalName ? internalName : "unknown")
        setEdit(false)

    }



    // interface IfOptionLabel {
    //     key: undefined | string;
    //     value: string;
    // }    

    const myGetOptionLabel = (option: any) => {


        if (option.key) return option.key
        switch (option.value) {
            case undefined:
                return "undefined"
            case "\t":
                return "TAB"
            case "":
                return "EMPTY"
            default:
                return option.value

        }

    }

    const getInternalName = (internalName: string) => {
        return internalName.length > 0 ? internalName : "UNSPEC"
    }

    return(
        <>
            
            {edit ? (
                <>
                    {groups === undefined ? (
                        <Grid
                            container justifyContent="flex-start" spacing={2}
                        >
                            <Grid item xs={9} >
                                <TextField
                                    value={internalName}
                                    // error = { hasError(internalName) }
                                    label={label}
                                    size="small"
                                    fullWidth={true}
                                    variant="outlined"
                                    onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => checkEnter(e)}
                                    onChange={(e: any) => setInternalName(e.target.value)}
                                />

                            </Grid>
                            <Grid item xs={1}   >
                                <IconButton size="medium" color="primary" onClick={callCallback}>
                                    <MyIcon icon="check" />
                                </IconButton>
                            </Grid>
                        </Grid>
                    ) : (
                        <Autocomplete
                            id="combo-box-demo"
                            options={groups}
                            size="small"
                            freeSolo
                            fullWidth
                            value={{ value: internalName, key: undefined }}
                            // error={ groupName === undefined || groupName.length == 0 }
                            getOptionLabel={(option) => myGetOptionLabel(option)}
                            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => checkEnter(e)}
                            onInputChange={(event, newValue) => {
                                if (typeof newValue === 'string') {
                                    if (newValue.length > 0) {
                                        setInternalName(
                                            newValue
                                        );
                                    }

                                }
                                console.error("onInputChange", newValue)
                            }}
                            onChange={(event, newValue) => {
                                if (newValue === null) {
                                    setEdit(false)
                                }
                                else if (typeof newValue === 'string') {
                                    setInternalName(
                                        newValue
                                    );
                                    callback(newValue)
                                } else if (newValue && newValue.value) {
                                    // Create a new value from the user input
                                    setInternalName(
                                        newValue.value,
                                    );
                                    callback(newValue.value)

                                } else if (newValue && newValue.key) {
                                    // Create a new value from the user input
                                    setInternalName(
                                        "newValue.value",
                                    );
                                    callback("")
                                }
                                else {
                                    console.error("UNEXPECTED TYPE", newValue)
                                    // setInternalName( newValue as string );
                                }
                            }}
                            renderInput={(params) => <TextField {...params} label={label} fullWidth variant="outlined" />}
                        />
                    )}
                </>
            ) : (
                <>
                    {readonly ? (
                        <>{children ? children : getInternalName(internalName)}</>
                    ) : (
                        <a style={{ "cursor": "pointer", "position": "relative" }}
                            onMouseOver={handleMouseIn} onMouseOut={handleMouseOut}
                            onClick={() => setEdit(true)}>
                            {children ? children : getInternalName(internalName)}
                            {hover && <div style={{ "position": "absolute", "right": "-28px", "top": "0px" }} ><MyIcon icon="edit"></MyIcon></div>
                            }
                        </a>)
                    }

                </>
            )
            }
            </>
        )
}

