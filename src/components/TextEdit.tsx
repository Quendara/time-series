import React, { useState, useEffect, KeyboardEvent } from "react";
import { TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';

import { GenericGroup } from "../components/helpers"

import { MyIcon } from "./MyIcon";
interface Props {

    value: string;
    callback: (s: string) => void;
    label?: string;
    groups?: any;
    children?: React.ReactNode
}

export const TextEdit = ({ value, label, callback, groups, children } : Props) => {

    const [internalName, setInternalName] = useState<string>(value);
    const [edit, setEdit] = useState<boolean>(false);

    const [hover, setHover] = useState( false );

    const handleMouseIn = () => {
        setHover(true);
      };
    
      const handleMouseOut = () => {
        setHover(false);
      };    


    useEffect(() => {
        setInternalName(value)
    }, [value]);


    const checkEnter = (event: React.KeyboardEvent<HTMLInputElement> ) => {

        console.log( "KEy : ", event.key ) 

        if (event.key === "Enter") {
            // alert("Enter")
            callback( internalName?internalName:"unknown")
            setEdit(false)
        }
        if (event.key === "Escape") {
            // alert("Enter")
            // callback(internalName)
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
                        
                        variant="outlined"
                        onKeyPress={ (e:React.KeyboardEvent<HTMLInputElement> ) => checkEnter(e)}
                        onChange={ (e:any) => setInternalName(e.target.value)}
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
                        getOptionLabel={ (option) => option?.value }
                        onKeyPress={ ( e:React.KeyboardEvent<HTMLInputElement> ) => checkEnter(e)}
                        onInputChange={(event, newValue) => {
                            if (typeof newValue === 'string') {
                                if( newValue.length > 0 ){
                                    setInternalName(
                                        newValue
                                    );    
                                }
                                
                            }
                            console.error( "onInputChange", newValue )
                        }}
                        onChange={(event, newValue) => {
                            if ( newValue === null ) {
                                setEdit(false)
                            }
                            else if (typeof newValue === 'string') {
                                setInternalName(
                                    newValue
                                );
                                callback( newValue )
                            } else if (newValue && newValue.value) {
                                // Create a new value from the user input
                                setInternalName(
                                    newValue.value,
                                );
                                callback( newValue.value )
                            } else {
                                console.error( "UNEXPECTED TYPE", newValue )
                                // setInternalName( newValue as string );
                            }
                        }}
                        renderInput={(params) => <TextField {...params} label="Groups" fullWidth variant="outlined" />}
                    />
                )}
            </>
        ) : (
            <a onMouseOver={handleMouseIn} onMouseOut={handleMouseOut} style={{"cursor": "pointer" }} onClick={() => setEdit(true)}>
                {children ? children : internalName} 
                { hover && <MyIcon icon="edit"></MyIcon>  }
                </a> 
        )
        }
        </>
    )
}

