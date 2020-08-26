"use strict";

import React, { Component, useState } from "react";
// import {
//   BrowserRouter as Router,
//   Route,
//   Redirect,
//   Link,
//   useLocation
// } from "react-router-dom";

// /search?user=andre

import { render } from "react-dom";
import TimeSeries from "./TimeSeries";
import { Auth } from "./Auth";

import { ThemeProvider, Grid, CssBaseline } from "@material-ui/core";
import { createMuiTheme } from "@material-ui/core/styles";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  //  faPlus,
  faAngleDoubleRight,  
  faUserAstronaut,
  faCameraRetro

} from "@fortawesome/free-solid-svg-icons";

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';


import './mstyle.css';

import {
  BrowserRouter as Router,
  Route,
  NavLink,
  IndexRoute,
  useLocation
} from "react-router-dom";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(6),
      color: "#FFFFFF",
      textDecoration: "none"
    },
    title: {
      flexGrow: 1,
      color: "#FFFFFF",
      textDecoration: "none"
    },
    selected: {
      color: "#FFFF00",
    }
  }),
);


const App = () => {
  const [username, setUsername] = useState("");
  const [jwtTocken, setJwtToken] = useState("");

  const classes = useStyles();

  const authSuccessCallback = (username, token) => {
    setUsername(username);
    setJwtToken(token);

    console.log("username", username);
    console.log("authSuccess", token);
  };

  const theme = createMuiTheme({
    palette: {
      type: "dark"
    },
  });

  return (
    <ThemeProvider theme={ theme }>
      <CssBaseline />

      <Router>
        <nav>
          <Auth authSuccessCallback={ authSuccessCallback } >
            <AppBar position="static">
              <Toolbar>
                <NavLink to="/grid" className={ classes.title }   >
                  <Typography variant="h6" >
                    <FontAwesomeIcon icon={ faCameraRetro } className="mr-2" />
                    Time Series
                </Typography>
                </NavLink>
                <FontAwesomeIcon icon={ faUserAstronaut } className="mr-2" /><Button color="inherit">{ username } </Button>
              </Toolbar>
            </AppBar>
          </Auth>
        </nav>

        <br></br>
        <Grid container justify="center" >
          <Grid item xs={ 11 } lg={ 10 }>
            { username.length > 0 &&
              <Route exact path="/" >
                <TimeSeries username={ username } token={ jwtTocken } />
              </Route> }
          </Grid>
        </Grid>
      </Router>

    </ThemeProvider>

  );
};

render(<App />, document.getElementById("root"));
