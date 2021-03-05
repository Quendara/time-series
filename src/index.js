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
import ChatIcon from '@material-ui/icons/Chat';

// import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import { useStyles, theme } from "./Styles"


import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';



import { ThemeProvider, Grid, CssBaseline, Badge, Paper } from "@material-ui/core";

// import { ListTodo } from './listTodo';
import { ListGraphQL } from './pages/listGraphQL';

import TimeSeries from "./pages/TimeSeries";
import { StyleDemo } from "./StyleDemo";
import { Auth } from "./Auth";
 

import './mstyle.css';

const App = () => {
  const [username, setUsername] = useState("");
  const [jwtTocken, setJwtToken] = useState("");
  const [apikey, setApi] = useState( undefined );

  const classes = useStyles();

  const authSuccessCallback = (username, token, apikey) => {
    setUsername(username);
    setJwtToken(token);
    setApi(apikey);

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
          <NavLink to="/einkaufen" className={ classes.title }   ><AssignmentTurnedInIcon /></NavLink>
          <NavLink to="/message" className={ classes.title }   ><ChatIcon /></NavLink>
          
          <NavLink to="/todoQL" className={ classes.title }   ><Badge badgeContent={ "n" } color="secondary"><AssignmentTurnedInIcon /></Badge></NavLink>
          {/* <NavLink to="/todo" className={ classes.title }   ><AssignmentTurnedInIcon /></NavLink> */ }
        </Auth>


        <Grid container justify="center" spacing={ 1 } >
          <Grid item xs={ 11 } ><br /></Grid>

          <Grid item xs={ 11 } lg={ 10 }>
            { username.length > 0 &&
              <>
                <Route exact path="/time" >
                  <TimeSeries username={ username } token={ jwtTocken } />
                </Route>
                <Route exact path="/" >
                  <Grid container justify="center" >
                      <ListGraphQL token={ jwtTocken } apikey={ apikey } listid={ 0 } listtype="links" />
                  </Grid>
                </Route>
                <Route exact path="/einkaufen" >
                  <Grid container justify="center" >
                      <ListGraphQL token={ jwtTocken } apikey={ apikey } listid={ 1 } listtype="todo" />
                  </Grid>
                </Route>
                <Route exact path="/todoQL" >
                  <Grid container justify="center" >
                      <ListGraphQL token={ jwtTocken } apikey={ apikey } listid={ 2 } listtype="todo" />
                  </Grid>
                </Route>
                <Route exact path="/message" >
                  <Grid container justify="center" >
                      <ListGraphQL token={ jwtTocken } apikey={ apikey } listid={ 3 } listtype="message" />
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

