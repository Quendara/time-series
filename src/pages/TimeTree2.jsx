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


// A custom hook that builds on useLocation to parse
// the query string for you.
function useQuery() {
    return new URLSearchParams(useLocation().search);
}


export const TimeTree = ({ username, token, timetreeToken }) => {

    const [time, setItem] = useState("");
    // const [timetreeToken, setTimetreeToken] = useState("");
    const [events, setEvents] = useState([]);

    let client = new OAuthClient( timetreeToken );

    

    async function getUpcommingEvents () {
        const data = await client.getUpcomingEvents( {days:7, calendarId:"GsOa8rj4s_Sh"});
        console.log("calendars", data );
        setEvents( data )
    }



    


    return (

        <Grid item container
            spacing={ 2 } >

            <Grid item xs={ 3 } >

                <Card>
                <CardContent>


                    <Button variant="contained" onClick={ () => getUpcommingEvents() } >
                    GET Upcomming events (Token)
                </Button>

                 

                </CardContent>
                </Card>

            </Grid>
            <Grid item xs={ 6 } >

            </Grid>
            <Grid item xs={ 6 } >


                <MyCard>
                    <MyCardHeader >
                        <List>
                            { events.map((item, index) => (
                                <ListItem key={ index } button >

                                    { (item.allDay === true) ? (
                                        <ListItemText primary={ item.title } secondary={ item.startAt + " - Ganztägig" } />
                                    ) : (
                                        <ListItemText primary={ item.title } secondary={ item.startAt + " - " + item.endAt } />
                                    )
                                    }



                                </ListItem>
                            )) }

                        </List>
                    </MyCardHeader>
                </MyCard>
            </Grid>



        </Grid>




    )

}