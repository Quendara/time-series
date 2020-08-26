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

import './mstyle.css';

import {
  BrowserRouter as Router,
  Route,
  NavLink,
  IndexRoute,
  useLocation
} from "react-router-dom";

// import "antd/dist/antd.css";

// const { Header, Footer, Sider, Content } = Layout;

// A custom hook that builds on useLocation to parse
// the query string for you.
// import queryString from "query-string";
// function useQuery() {
//   return;
// }

const App = () => {
  const [username, setUsername] = useState("");
  const [jwtTocken, setJwtToken] = useState("");

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
          <Auth authSuccessCallback={ authSuccessCallback } />
        </nav>
        <br></br>
        <Grid container justify="center" spacing={ 2 } >
          <Grid item xs={ 12 } lg={ 10 }>
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
