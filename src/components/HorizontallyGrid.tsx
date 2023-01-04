import React, { useState, useEffect } from 'react';
import { Grid, Box } from '@mui/material';

import { cssClasses } from "../Styles"


interface Props<Type> {
    
    horizontally: boolean;
    children: React.ReactNode;
}


export const HorizontallyGrid = <Type extends object>(props: Props<Type>) => {

    const classes = useStyles();
    const theme = useTheme();
    const biggerThenXs = true // useMediaQuery(theme.breakpoints.up('sm'))

    return (
        <>
            {(props.horizontally && biggerThenXs) ? (

                <Box key={"xxyjhgjhg"} sx={cssClasses.horizontalSnapContainer} >
                    {props.children}
                </Box>
            ) : (
                <Grid container spacing={2} >
                    {props.children}
                </Grid>
            )
            }
        </>
    )
}

interface ItemProps {
    horizontally: boolean;
    children: React.ReactNode;
}


export const HorizontallyItem = (props: ItemProps) => {

    //const theme = useTheme();
    const biggerThenXs = true // useMediaQuery(theme.breakpoints.up('sm'))

    return (
        <>
            {(props.horizontally && biggerThenXs) ? (
                <Box sx={cssClasses.horizontalSnapItem}  >
                    {props.children}
                </Box>
            ) : (
                <Grid item xs={12}>
                    {props.children}
                </Grid>

            )
            }

        </>
    )
}