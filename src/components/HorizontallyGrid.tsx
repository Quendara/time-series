import React, { useState, useEffect } from 'react';
import { Grid } from '@material-ui/core';

import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

interface Props<Type> {
    groups: Type[]
    horizontally: boolean;
    children: React.ReactNode;
}


export const HorizontallyGrid = <Type extends object>(props: Props<Type>) => {


    const theme = useTheme();
    const biggerThenXs = useMediaQuery( theme.breakpoints.up('sm') )


    return (
        <>
            { ( props.horizontally && biggerThenXs ) ? (
                // 
                <div style={{ "width": "100vw", }}>
                    {/* <div key={"xxyjhgjhg"} style={{ "width": props.groups.length * 320 + "px", "scrollSnapType": "x mandatory" }}> */}
                    <div key={"xxyjhgjhg"} style={{  "scrollSnapType": "x mandatory", "overflowX": "scroll", "display":"flex"  }}>                    
                        {props.children}
                    </div>
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
    const theme = useTheme();
    const biggerThenXs = useMediaQuery( theme.breakpoints.up('sm') )

    return (
        <>
            { ( props.horizontally && biggerThenXs )  ? (
                <div style={{ "width": "330px", "float": "left", "marginRight": "10px", "scrollSnapAlign":"start" }} >
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