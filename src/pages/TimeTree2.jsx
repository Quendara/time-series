import React, { Component, useState, useEffect } from "react";
import {
    useParams,
    useLocation
} from "react-router-dom";

import { ThemeProvider, Grid, TextField, Card, CardContent, CssBaseline, Badge, Paper, Menu, MenuItem, ListItemIcon, IconButton, Chip, Divider, Avatar, Button, List, ListItem, ListItemText, Typography } from "@material-ui/core";

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

    return daynames[date.getDay()] + ", " + date.getDate() + ". " + (date.getMonth() + 1) // + ". " + date.getFullYear()
}

const dateToTime = (date) => {

    return "" + date.getHours() + ":" + date.getMinutes()
}

const Event = ({ event, lables }) => {

    // { (item.allDay === true) ? (  

    const itemStartDate = new Date(event.startAt)
    const itemEndDate = new Date(event.endAt)

    const getColor = (event, lables) => {

        const filteredLables = lables.filter(label => label.id === event.label.id)

        if (filteredLables.length > 0) {
            return filteredLables[0].color
        }
        return ""
    }

    const color = getColor(event, lables)

    if (event.allDay === true) {
        return <Chip size="small" style={ { backgroundColor: color } } label={ event.title } />
    }
    else {
        return <Chip size="small" style={ { color: color, borderColor: color } } variant="outlined" label={ event.title + " - " + dateToTime(itemStartDate) } />
    }

}

const OneDay = ({ today, offset, events, lables }) => {

    const classes = useStyles();

    //const today = new Date();
    const day = new Date();
    day.setDate(today.getDate() + offset)

    const isToday = (today.getDate() === day.getDate())
    const isWeekend = (day.getDay() === 0 || day.getDay() === 6)

    const getClass = (today, weekend) => {
        if (today) return classes.today
        if (weekend) return classes.weekend
        return ""
    }

    const filteredEvents = events.filter(item => {
        const itemStartDate = new Date(item.startAt)
        if (itemStartDate.getDate() === day.getDate()) { // works because timetree, returns only the events of the next 7 days
            return true
        }

        const itemEndDate = new Date(item.endAt)
        if (item.allDay === true) {
            itemEndDate.setDate(itemEndDate.getDate() + 1) // set end of next day, because typically it's 0am
        }

        if (day.getTime() > itemStartDate.getTime() && day.getTime() < itemEndDate.getTime()) {
            return true
        }

        return false;

    });

    return (
        <>
            <Grid item xs={ 3 } >
                {/* <ListItemText primary={ <Event item={item} /> } secondary={ dateToYear(itemStartDate) } /> */ }
                <Typography className={ getClass(isToday, isWeekend) } >{ dateToYear(day) } </Typography>
            </Grid>
            <Grid item xs={ 8 }  >
                <div className={ classes.chiplist }>
                    { filteredEvents.map((item, index) => (
                        <Event key={ "event_" + index } event={ item } lables={ lables } />
                    )) }
                </div>
            </Grid>
            <Grid item xs={ 12 } >
                <Divider></Divider>
            </Grid>

        </>
    )

}


export const TimeTree = ({ username, token, timetreeToken }) => {

    const classes = useStyles();

    const [time, setItem] = useState("");
    const [events, setEvents] = useState([]);
    const [lables, setLables] = useState([]);

    let client = new OAuthClient(timetreeToken);

    const caldays = [0, 1, 2, 3, 4, 5, 6];
    const today = new Date()
    const currentday = new Date()



    async function getUpcommingEvents() {
        const data = await client.getUpcomingEvents({ days: 7, calendarId: "GsOa8rj4s_Sh" });
        console.log("getUpcomingEvents : ", data);
        setEvents(data)
    }

    async function getLabels() {
        const data = await client.getLabels("GsOa8rj4s_Sh");

        const filtered = data.filter( item => item.name !== "Midnight black" )

        console.log("getLabels : ", data, filtered);
        setLables(filtered)
    }

    useEffect(() => {

        getUpcommingEvents();
        getLabels();

    }, []
    )

    return (
                <MyCard>
                    <MyCardHeader >
                        <Grid container justify="center" spacing={ 2 } >
                            <Grid item xs={ 12 } >
                                <Divider></Divider>
                            </Grid>

                            { caldays.map((item, index) => (

                                <OneDay key={ index } today={ today } offset={ index } events={ events } lables={ lables } />

                            )) }

                            <Grid item xs={ 10 } >
                            <div className={ classes.chiplist }>

                            { lables.map((item, index) => {

                                const event = {
                                    id:"",
                                    startAt:"",
                                    title: item.name,
                                    label:{id:item.id },
                                    allDay:true
                                }
                                
                                return ( <Event event={ event } lables={ lables } /> )

                            }) }
                            </div>
                            </Grid >




                        </Grid>
                    </MyCardHeader>
                </MyCard>
    )
}