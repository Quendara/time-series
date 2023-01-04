import React from 'react';
import {Button, ButtonGroup } from '@mui/material';

interface Props {
    valueArr: string[];
    iconsOnly: boolean; // @todo
    currentValue: string;
    callback: ( x:string ) => void;
}

export const SelectionView = ({ valueArr, iconsOnly, currentValue, callback } : Props) => {


    const getClass = ( item : string ) => {
        if (item === currentValue) {
            return "outlined"
        }
        else {
            return "contained"
        }
    } 

    const callbackLocal = (item : string ) => {
        if (callback !== undefined) {
            callback(item)
        }
        else {
            console.error("callback is not defined")
        }
    }

    const getItemName = (item : string ) => {
        if (iconsOnly) return ""
        return item;
    }

    return (
        <ButtonGroup size="small"  >
            { valueArr.map((item, index) => {
                return (
                    <Button key={ index } color="primary" variant={ getClass(item) } onClick={ () => callbackLocal(item) } >
                        
                        { getItemName(item) }
                        </Button>
                )
            }) }
        </ButtonGroup>
    )
}





