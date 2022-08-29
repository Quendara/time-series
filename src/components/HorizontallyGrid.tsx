import React, { useState, useEffect } from 'react';
import { Grid } from '@material-ui/core';

import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import { useStyles } from "../Styles"

interface Props<Type> {
    groups: Type[]
    horizontally: boolean;
    children: React.ReactNode;
}


export const HorizontallyGrid = <Type extends object>(props: Props<Type>) => {

    const classes = useStyles();
    const theme = useTheme();
    const biggerThenXs = useMediaQuery(theme.breakpoints.up('sm'))


    return (
        <>
            {(props.horizontally && biggerThenXs) ? (

                <div key={"xxyjhgjhg"} className={classes.horizontalSnapContainer} >
                    {props.children}
                </div>
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

    const classes = useStyles();

    const theme = useTheme();
    const biggerThenXs = useMediaQuery(theme.breakpoints.up('sm'))

    return (
        <>
            {(props.horizontally && biggerThenXs) ? (
                <div className={classes.horizontalSnapItem}  >
                    {props.children}
                </div>
            ) : (
                <Grid item xs={12}>
                    {props.children}
                </Grid>

            )
            }

        </>
    )
}