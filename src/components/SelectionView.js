import React from 'react';
import {Button, ButtonGroup } from '@mui/material';

export const SelectionView = ({ valueArr, iconsOnly, currentValue, callback }) => {


    const getClass = (item) => {
        if (item === currentValue) {
            return "default"
        }
        else {
            return "primary"
        }
    } 

    const callbackLocal = (item) => {
        if (callback !== undefined) {
            callback(item)
        }
        else {
            console.error("callback is not defined")
        }
    }

    const getItemName = (item) => {
        if (iconsOnly) return ""
        return item;
    }

    return (
        <ButtonGroup size="small" variant="contained"  >
            { valueArr.map((item, index) => {
                return (
                    <Button key={ index } color={ getClass(item) } onClick={ () => callbackLocal(item) } >
                        
                        { getItemName(item) }
                        </Button>
                )
            }) }
        </ButtonGroup>
    )
}





