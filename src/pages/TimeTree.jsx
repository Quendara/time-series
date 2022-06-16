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
import { MyCard, MyPaperHeader } from "../components/StyledComponents"
import { MyIcon } from "../components/MyIcon";


import { useStyles } from "../Styles"

const baseRestApi = "https://timetreeapp.com"

// A custom hook that builds on useLocation to parse
// the query string for you.
function useQuery() {
    return new URLSearchParams(useLocation().search);
}





const getAccessToken = (code) => {

    const url = [baseRestApi, "oauth", "token"].join("/")

    const itemToSend = {
        client_id: "H0EfvvLbY7ybac8tksh_GWHP97EiWigrsu-Mj64Qlh0",
        client_secret: client_secret, // change later
        redirect_uri: "https://master.d1skuzk79uqu7w.amplifyapp.com",
        code: code,
        grant_type: "authorization_code"
    }

    const options = {
        method: "POST",
        headers: {
            "Access-Control-Allow-Origin":"*"
        //     "Content-Type": "application/json",
        //     Authorization: token
        },
        body: JSON.stringify(itemToSend)
    };

    fetch(url, options)
        .then(res => res.json())
        .then(
            result => {
                console.log("result.body", result.body);
                // setItems(cleanUpItems(JSON.parse(result.body)));
            },
            (error) => {
                console.error("Error : ", error.message);
            }
        )
        .catch(err => { console.log("XX", err) })
}






export const TimeTree = ({ username, token }) => {

    const [time, setItem] = useState("");
    const [timetreeToken, setTimetreeToken] = useState("");
    const [events, setEvents] = useState([]);

    let query = useQuery();
    const code = query.get("code")


    const getUpcommingEvents = () => {

        const url = "https://timetreeapis.com/calendars/GsOa8rj4s_Sh/upcoming_events?days=7"

        const options = {
            method: "GET",
            headers: {
                // "Content-Type": "application/json",
                Accept: "application/vnd.timetree.v1+json",
                Authorization: "Bearer " + timetreeToken
            }
        };

        fetch(url, options)
            .then(res => res.json())
            .then(
                result => {
                    console.log("result", result.data);
                    setEvents(result.data);
                },
                (error) => {
                    console.error("Error : ", error.message);
                }
            )
            .catch(err => { console.log("XX", err) })
    }

    const accessTimeTree = () => {

        const url = "https://timetreeapp.com/oauth/authorize?client_id=H0EfvvLbY7ybac8tksh_GWHP97EiWigrsu-Mj64Qlh0&redirect_uri=https://master.d1skuzk79uqu7w.amplifyapp.com/timetree&response_type=code&state=CSRF"


        const options = {
            method: "GET",
            headers: {
                // "Origin":"https://master.d1skuzk79uqu7w.amplifyapp.com/TimeTree"
                // "Content-Type": "application/json",
                // Accept: "application/vnd.timetree.v1+json",
                // Authorization: "Bearer " + timeTreeToken
            }
        };

        fetch(url, options)
            .then(res => res.json())
            .then(
                result => {
                    console.log("result", result.data);
                    setEvents(result.data);
                },
                (error) => {
                    console.error("Error : ", error.message);
                }
            )
            .catch(err => { console.log("XX", err) })
    }





    return (

        <Grid item container
            spacing={ 2 } >

            <Grid item xs={ 3 } >

                <Card>
                <CardContent>


                    <Button variant="contained" onClick={ () => accessTimeTree() } >
                        1. accessTimeTree
                </Button>

                    <h1>Time Tree</h1>
                    <h2>-CODE { code }-</h2>

                    <Button variant="contained" onClick={ () => getAccessToken(code) } >
                        POST Call to get JWT TOKEN (Code)
                </Button>

                    

                    <TextField
                        value={ timetreeToken }
                        label="Timetree Token"
                        size="small"
                        fullWidth
                        variant="outlined"
                        // onKeyPress={ e => checkEnter(e) }
                        onChange={ e => setTimetreeToken(e.target.value) }
                    />

                    <Button variant="contained" onClick={ getUpcommingEvents } >
                        GET Upcomming events (Token)
                </Button>
                </CardContent>
                </Card>

            </Grid>
            <Grid item xs={ 6 } >

            </Grid>
            <Grid item md={6} xs={ 12 } >


                <MyCard>
                    <MyPaperHeader >
                        <List>
                            { events.map((item, index) => (
                                <ListItem key={ index } button >

                                    { (item.attributes.all_day === true) ? (
                                        <ListItemText primary={ item.attributes.title } secondary={ item.attributes.start_at + " - Ganztägig" } />
                                    ) : (
                                        <ListItemText primary={ item.attributes.title } secondary={ item.attributes.start_at + " - " + item.attributes.end_at } />
                                    )
                                    }



                                </ListItem>
                            )) }

                        </List>
                    </MyPaperHeader>
                </MyCard>
            </Grid>



        </Grid>




    )

}