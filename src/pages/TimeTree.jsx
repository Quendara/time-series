import React, { Component, useState, useEffect } from "react";
import { ThemeProvider, Grid, CssBaseline, Badge, Paper, Menu, MenuItem, ListItemIcon, IconButton, Divider, Avatar, Button } from "@material-ui/core";

import { useQuery } from '@apollo/react-hooks'

// import {ApolloClient, HttpLink, InMemoryCache } from 'apollo-boost'

// import { Row, Col, List, Button, DatePicker, Card, version } from "antd";
import Settings from "../Settings";
import SingleTimeSerie from "../SingleTimeSerie";


import CircularProgress from '@material-ui/core/CircularProgress';


import { useStyles } from "../Styles"

const baseRestApi = "https://timetreeapp.com"



const getAccessToken = () => {


    const url = [baseRestApi, "oauth", "token"].join("/")

    const itemToSend = {
        client_id:"H0EfvvLbY7ybac8tksh_GWHP97EiWigrsu-Mj64Qlh0",
        client_secret:"DzlijpyQRFUzIYh0u1SJhDY45_N01KwqAcVethRY934",
        redirect_uri:"https://master.d1skuzk79uqu7w.amplifyapp.com/",
        code:"cCCGZqCAcEvGZY_wNHdPi7Zu6BFcGwmCB7WfmYxzxus",
        grant_type:"authorization_code"    
    }
    
    const options = {
        method: "POST",
        // headers: {
        //     "Content-Type": "application/json",
        //     Authorization: token
        // },
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




export const TimeTree = ({ username, token}) => {

    const [time, setItem] = useState("");

    https://timetreeapp.com/oauth/token




  return (

    <Grid item container
    spacing={ 2 } >    

    <h1>Time Tree</h1>

    <Button variant="contained" onClick={ getAccessToken  } >
    GET TOKEN
  </Button>

    </Grid>



  )

}