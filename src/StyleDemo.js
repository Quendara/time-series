
import React from "react";
import { Button, CardContent, Typography, TextField, Grid, List, Card, CardItem, ListItem } from '@material-ui/core';


export const StyleDemo = () => {

    const colors = ["default", "inherit", "primary", "secondary", "error", "info", "success"]

    return (
        <Card>
        <Grid container>
                <Grid item xs={3}>
                { colors.map((value, index) => (
                    <List><ListItem><Typography color={ value } noWrap >{ value }</Typography></ListItem></List>
                )) }
                </Grid>

                <Grid item xs={3}>
                { colors.map((value, index) => (
                    <List><ListItem><Button variant="outlined" color={ value } noWrap >{ value }</Button></ListItem></List>
                )) }
                </Grid>

                <Grid item xs={3}>
                { colors.map((value, index) => (
                    <List><ListItem><Button variant="contained" color={ value } noWrap >{ value }</Button></ListItem></List>
                )) }
                </Grid>

        </Grid>
        </Card>
    )
}

