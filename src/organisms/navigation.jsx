import React, { Component, useState, useEffect } from "react";
// import { Row, Col, List, Button, DatePicker, Card, version } from "antd";
import Settings from "../Settings";
import SingleTimeSerie from "../SingleTimeSerie";

import { Grid, List, ListItem, ListItemIcon,ListItemText,Paper, Box  } from '@material-ui/core';

import { MyCard, MyCardHeader } from "../components/StyledComponents"
import StarIcon from '@material-ui/icons/Star';

import {useStyles } from "../Styles"


export const Navigation = ({ list, anchor, name }) => {

    const classes = useStyles();

    const jumpTo = (anchor) => {
        window.location.href = "#" + anchor;
        setAnchor(anchor)
    }

    const [curAnchor, setAnchor] = useState("");

    return (
        <Paper elevation={3} >
        <MyCard>
            <MyCardHeader >
                <List>
                    { list.map((item, index) => (
                        <ListItem button onClick={ () => jumpTo(item[anchor]) } key={ item[anchor] } >

                            <Box color={ item[anchor] === curAnchor ? "text.primary" : "text.secondary" } >
                            { item[name] } 
                            </Box>                           
                           

                        </ListItem>
                    )) }

                </List>
            </MyCardHeader>
        </MyCard>
        </Paper>
    )

}

