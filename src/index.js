"use strict";

import React, { Component, useState } from "react";


import { render } from "react-dom";
import {
  BrowserRouter as Router,
  Route,
  NavLink,
  IndexRoute,
  useLocation
} from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


import TimelineIcon from '@material-ui/icons/Timeline';
import ShareIcon from '@material-ui/icons/Share';
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';

// import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import {useStyles, theme} from "./Styles"


import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';



import { ThemeProvider, Grid, CssBaseline, Badge } from "@material-ui/core";

import { ListTodo } from './listTodo';
import { ListGraphQL } from './listGraphQL';


import TimeSeries from "./TimeSeries";
import { StyleDemo } from "./StyleDemo"; 
import { Auth } from "./Auth";


import './mstyle.css';




const App = () => {
  const [username, setUsername] = useState("");
  const [jwtTocken, setJwtToken] = useState("");
  const [apikey, setApi] = useState("");

  const classes = useStyles();

  const authSuccessCallback = (username, token, apikey) => {
    setUsername(username);
    setJwtToken(token);
    setApi( apikey );

    console.log("username : ", username);
    console.log("authSuccess : ", token);
    console.log("apikey : ", apikey);
  };



  return (
    <ThemeProvider theme={ theme }>
      <CssBaseline />

      <Router>

        <Auth authSuccessCallback={ authSuccessCallback } >
          <NavLink to="/" className={ classes.title }   >
            <ShareIcon />
          </NavLink>
          <NavLink to="/time" className={ classes.title }   ><TimelineIcon /></NavLink>
          <NavLink to="/todoQL" className={ classes.title }   ><Badge badgeContent={"n"} color="secondary"><AssignmentTurnedInIcon /></Badge></NavLink>
          <NavLink to="/todo" className={ classes.title }   ><AssignmentTurnedInIcon /></NavLink>
        </Auth>


        <br></br>
        <Grid container justify="center" >
          <Grid item xs={ 11 } lg={ 10 }>
            { username.length > 0 &&
              <>
                <Route exact path="/time" >
                  <TimeSeries username={ username } token={ jwtTocken } />
                </Route>
                <Route exact path="/" >
                  <Grid container justify="center" >
                    <Grid item xs={ 12 } lg={ 8 }>
                    <ListTodo token={ jwtTocken } listid={0} />
                    </Grid>
                  </Grid>
                </Route>
                <Route exact path="/todo" >
                  <Grid container justify="center" >
                    <Grid item xs={ 12 } lg={ 8 }>
                      <ListTodo token={ jwtTocken } listid={1} />
                    </Grid>
                  </Grid>
                </Route>          
                <Route exact path="/todoQL" >
                  <Grid container justify="center" >
                    <Grid item xs={ 12 } lg={ 8 }>
                      <ListGraphQL token={ jwtTocken } apikey={ apikey } listid={9} />
                    </Grid>
                  </Grid>
                </Route>                             
                <Route exact path="/demo" component={ StyleDemo }></Route>
              </>
            }
          </Grid>
        </Grid>
      </Router>


    </ThemeProvider>

  );
};

render(<App />, document.getElementById("root"));
