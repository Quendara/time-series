import React, { Component, useState, useEffect } from "react";
import {
    useParams,
    useLocation
} from "react-router-dom";

import { ThemeProvider, Grid, TextField, Card, CardContent, CssBaseline, Badge, Paper, Menu, MenuItem, ListItemIcon, IconButton, Divider, Avatar, Button, List, ListItem, ListItemText } from "@material-ui/core";

// import { Row, Col, List, Button, DatePicker, Card, version } from "antd";
import Settings from "../Settings";
import SingleTimeSerie from "../SingleTimeSerie";


import CircularProgress from '@material-ui/core/CircularProgress';
import { MyCard, MyCardHeader } from "../components/StyledComponents"
import { MyIcon } from "../components/MyIcon";


import { useStyles } from "../Styles"
import { OAuthClient } from "@timetreeapp/web-api";



const baseRestApi = "https://timetreeapp.com"


const dateToYear = (date) => {
    const daynames = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"]
    // Sunday - Saturday : 0 - 6

    return daynames[date.getDay()] + ", " + date.getDate() + ". " + (date.getMonth() + 1) + ". " + date.getFullYear()
}

const dateToTime = (date) => {

    return "" + date.getHours() + ":" + date.getMinutes()
}

const OneDay = ({ item }) => {

    const classes = useStyles();

    const today = new Date();
    const itemStartDate = new Date(item.startAt)
    const itemEndDate = new Date(item.endAt)

    const isToday = ( today.getDate() === itemStartDate.getDate() )

    return (
        <ListItem className={ isToday?classes.today:"" }>

            { (item.allDay === true) ? (
                <ListItemText primary={ item.title } secondary={ dateToYear(itemStartDate) + ", Ganztägig" } />
            ) : (
                <ListItemText primary={ item.title } secondary={ dateToYear(itemStartDate) + ", " + dateToTime(itemStartDate) } />
            )
            }
        </ListItem>
    )

}


export const TimeTree = ({ username, token, timetreeToken }) => {

    const [time, setItem] = useState("");
    // const [timetreeToken, setTimetreeToken] = useState("");
    const [events, setEvents] = useState([]);

    let client = new OAuthClient(timetreeToken);

    const today = new Date();



    async function getUpcommingEvents() {
        const data = await client.getUpcomingEvents({ days: 7, calendarId: "GsOa8rj4s_Sh" });
        console.log("calendars", data);
        setEvents(data)
    }

    useEffect(() => {

        getUpcommingEvents() 

    },[] 
    )

    return (

        <Grid item container
            spacing={ 2 } >

            {/* <Grid item xs={ 3 } >
                <Card>
                    <CardContent>
                        <Button variant="contained" onClick={ () => getUpcommingEvents() } >
                            GET Upcomming events (Token)
                </Button>



                    </CardContent>
                </Card>

            </Grid> */}

            <Grid item md={ 6 } xs={ 12 } >


                <MyCard>
                    <MyCardHeader >
                        <List>
                            <ListItem>
                                { dateToYear(today) }                                
                            </ListItem>
                            <Divider />

                            { events.map((item, index) => (

                                <OneDay item={ item } ></OneDay>



                            )) }

                        </List>
                    </MyCardHeader>
                </MyCard>
            </Grid>



        </Grid>




    )

}