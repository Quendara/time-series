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
import {
  BrowserRouter as Router,
  Route,
  NavLink,
  IndexRoute,
  useLocation
} from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  //  faPlus,
  faAngleDoubleRight,
  faUserAstronaut,
  faCameraRetro

} from "@fortawesome/free-solid-svg-icons";

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';


import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';



import { ThemeProvider, Grid, CssBaseline } from "@material-ui/core";
import { createMuiTheme } from "@material-ui/core/styles";

import { ListMain } from './listMain';
import TimeSeries from "./TimeSeries";
import { StyleDemo } from "./StyleDemo";
import { Auth } from "./Auth";


import { purple, lightGreen, pink, lightBlue, red } from '@material-ui/core/colors/';
import './mstyle.css';



const theme = createMuiTheme({
  palette: {
    type: "dark",
    primary: lightBlue,
    secondary: pink,
    danger: red
  }
});

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



  return (
    <ThemeProvider theme={ theme }>
      <CssBaseline />

      <Router>

        <Auth authSuccessCallback={ authSuccessCallback } >
          <NavLink to="/" className={ classes.title }   >
            <Typography variant="h6" >
              <FontAwesomeIcon icon={ faCameraRetro } className="mr-2" />
                    Links
                </Typography>
          </NavLink>
          <NavLink to="/time" className={ classes.title }   >Time-Series</NavLink>
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
                    <Grid item xs={ 12 } lg={ 10 }>
                      <ListMain token={ jwtTocken } />
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
