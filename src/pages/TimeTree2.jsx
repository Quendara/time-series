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

    return daynames[date.getDay()] + ", " + date.getDate() + ". " + (date.getMonth() + 1) + ". " + date.getFullYear()
}

const dateToTime = (date) => {

    return "" + date.getHours() + ":" + date.getMinutes()
}

const Event = ({ item }) => {

    // { (item.allDay === true) ? (  

    const itemStartDate = new Date(item.startAt)
    const itemEndDate = new Date(item.endAt)

    if (item.allDay === true) {
        return <Chip label={ item.title }> </Chip>
    }
    else {
        return <Chip variant="outlined" label={ item.title + " - " + dateToTime(itemStartDate) }> </Chip>
    }

}

const OneDay = ({ today, offset, events }) => {

    const classes = useStyles();

    //const today = new Date();
    const day = new Date();
    day.setDate( today.getDate()+offset )

    const isToday = (today.getDate() === day.getDate())
    const isWeekend = (day.getDay() === 0 || day.getDay() === 6)

    const getClass = (today, weekend) => {
        if (today) return classes.today
        if (weekend) return classes.weekend
        return ""
    }

    const filteredEvents = events.filter( item => {
        const itemStartDate = new Date(item.startAt)
        if( itemStartDate.getDate() === day.getDate() ){ // works because timetree, returns only the events of the next 7 days
            return true
        }

        const itemEndDate = new Date(item.endAt)
        if (item.allDay === true) {
            itemEndDate.setDate( itemEndDate.getDate()+1 ) // set end of next day, because typically it's 0am
        }
        // console.log( "---" ) 
        // console.log( "Start : ", itemStartDate.getTime() ) 
        // console.log( "Day   : ", day.getTime()) 
        // console.log( "End   : ", itemEndDate.getTime()) 

        if( day.getTime() > itemStartDate.getTime() && day.getTime() < itemEndDate.getTime() ){
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
                <div className={classes.chiplist}>
                { filteredEvents.map((item, index) => (
                    <Event item={ item } />
                ))}
                </div>
            </Grid>
            <Grid item xs={ 12 } >
                <Divider></Divider>
            </Grid>

        </>
    )

}


export const TimeTree = ({ username, token, timetreeToken }) => {

    const [time, setItem] = useState("");
    // const [timetreeToken, setTimetreeToken] = useState("");
    const [events, setEvents] = useState([]);

    let client = new OAuthClient(timetreeToken);

    const caldays = [0, 1, 2, 3, 4, 5, 6];
    const today = new Date()
    const currentday = new Date()



    async function getUpcommingEvents() {
        const data = await client.getUpcomingEvents({ days: 7, calendarId: "GsOa8rj4s_Sh" });
        console.log("calendars", data);
        setEvents(data)
    }

    useEffect(() => {

        getUpcommingEvents()

    }, []
    )



    return (

        <Grid item container spacing={ 2 } >

            <Grid item md={ 6 } xs={ 12 } >


                <MyCard>
                    <MyCardHeader >
                        <Grid container justify="center" spacing={ 2 } >
                            <Grid item xs={ 12 } >
                                <Divider></Divider>
                            </Grid>

                            { caldays.map((item, index) => (

                                <OneDay key={index} today={today} offset={index} events={events}  />

                            )) }

                        </Grid>
                    </MyCardHeader>
                </MyCard>
            </Grid>



        </Grid>




    )

}