"use strict";

import React, { Component, useState, useEffect } from "react";
import Amplify, { API, graphqlOperation } from 'aws-amplify';

import { render } from "react-dom";
import {
  BrowserRouter as Router,
  Route,
  NavLink,
  Switch,
  IndexRoute,
  useLocation
} from "react-router-dom";


import { useStyles, theme } from "./Styles"

import { ThemeProvider, Grid, CssBaseline, Badge, Paper, Menu, MenuItem, ListItemIcon, IconButton, Divider, Avatar, ListItemText } from "@material-ui/core";

// import { ListTodo } from './listTodo';
import { Error } from "./components/Error"
import { MyIcon } from "./components/MyIcon";

import { MyCard, MyCardHeader } from "./components/StyledComponents"

import { MainNavigation } from './organisms/navigation';

import { ListGraphQL } from './pages/listGraphQL';
import TimeSeries from "./pages/TimeSeries";
import { DetailsPage } from "./pages/DetailsPage";
import { Sandbox } from "./pages/sandbox";
import { SandboxQl } from "./pages/SandboxQl";
import { TimeTree } from "./pages/TimeTree2";
import { CompareLists } from "./pages/CompareLists";
import { ReplaceLists } from "./pages/ReplaceLists";


import { Clock } from "./components/Clock";
import { StyleDemo } from "./StyleDemo";
import { Auth } from "./Auth";

import './mstyle.css';

// import { Clock } from "./components/Clock";
// import { error } from "./components/erros"



const App = () => {
  const [username, setUsername] = useState("");
  const [jwtTocken, setJwtToken] = useState("");
  const [errors, setErrors] = useState([]);

  // const [hackyNavId, sethackyNavId] = useState("");

  const [userConfiguration, setUserConfiguration] = useState([]);

  const [apikey, setApi] = useState(undefined);
  const [amplifyInitilaized, setAmplifyInitilaized] = useState(false);
  const [apikeyTimetree, setApikeyTimetree] = useState(undefined);

  const classes = useStyles();

  const handleSetConfig = (config) => {
    setUserConfiguration(config)
  }

  const authSuccessCallback = (username, token, apikey, apikeyTimetree) => {
    setUsername(username);

    // if (username === "andre") {
    //   sethackyNavId("1622632885409")
    // }
    // if (username === "jonna") {
    //   sethackyNavId("1622635443893")
    // }
    // if (username === "irena") {
    //   sethackyNavId("1622638959598")
    // }


    setJwtToken(token);
    setApi(apikey);
    setApikeyTimetree(apikeyTimetree)

    console.log("username        : ", username);
    console.log("authSuccess     : ", token);
    console.log("apikey          : ", apikey);
    console.log("apikey timetree : ", apikeyTimetree);
  };

  const [anchorEl, setAnchorEl] = useState(null); // <null | HTMLElement>
  const menuHandleClick = (event) => { // : React.MouseEvent<HTMLButtonElement>
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const errorHandle = (message) => {

    let newArray = [...errors, message];
    setErrors(newArray)
  }

  useEffect(
    () => {
      if (apikey) {
        // works
        const awsmobile = {
          "aws_project_region": "eu-central-1",
          "aws_appsync_graphqlEndpoint": "https://dfmsa6fzibhrrm3byqhancekju.appsync-api.eu-central-1.amazonaws.com/graphql",
          "aws_appsync_region": "eu-central-1",
          "aws_appsync_authenticationType": "API_KEY",
          "aws_appsync_apiKey": apikey
        };
        Amplify.configure(awsmobile);
        setAmplifyInitilaized(true);

        // fetchTodos( listid )
        // setSelectedItem(undefined)
      }
    }, [apikey])

  return (
    <ThemeProvider theme={ theme }>
      <CssBaseline />

      <Router>

        <Auth authSuccessCallback={ authSuccessCallback } >

        <NavLink key={ "nl_" + 1332 } to={ "/" } className={ classes.menuButton }   ><MyIcon icon={ "home" } /> </NavLink>

          { userConfiguration.map((item, index) => {
            if (item.navbar) return (
              <NavLink key={ "nl_" + index } to={ "/" + [item.component, item.id, item.render].join('/') } className={ classes.menuButton }   ><MyIcon icon={ item.icon } /> </NavLink>
            )
          }
          ) }

          <IconButton variant="inherit" className={ classes.menuButton } onClick={ menuHandleClick } ><MyIcon icon="more_horiz" /> </IconButton>


          <Menu
            id="simple-menu"
            anchorEl={ anchorEl }
            keepMounted
            open={ Boolean(anchorEl) }
            onClose={ handleClose }
          >
            <MenuItem>
              <ListItemIcon><Avatar>{ username[0] }</Avatar></ListItemIcon>{ username }
            </MenuItem>
            <Divider />

            <MainNavigation
              render="simple"
              apikey={ apikey }
              userConfig={ userConfiguration }              
              username={ username }
              handleSetConfig={ handleSetConfig } />
          </Menu>
        </Auth>


        <Grid container justify="center" spacing={ 1 } >
          <Grid item xs={ 11 } ><br /></Grid>

          <Grid item xs={ 11 } lg={ 10 }>
            { username.length > 0 &&
              ( <>
                { amplifyInitilaized === false ? (<h1> Loading </h1>) :
                  (
                <Switch>
                  <Route path="/list/:listid/:listtype/:itemid" children={
                      <ListGraphQL
                        token={ jwtTocken } username={ username } apikey={ apikey } errorHandle={ errorHandle } lists={ userConfiguration } />
                  } />                  
                  <Route path="/list/:listid/:listtype" children={
                    <ListGraphQL
                      token={ jwtTocken } username={ username } apikey={ apikey } errorHandle={ errorHandle } lists={ userConfiguration } />
                  } />
                  <Route path="/time" >
                    <TimeSeries username={ username } token={ jwtTocken } errorHandle={ errorHandle } />
                  </Route>

                
                <Route path="/timetree" >
                  <TimeTree username={ username } token={ jwtTocken } timetreeToken={ apikeyTimetree } />
                </Route>

                <Route path="/diff" >
                  <CompareLists />
                </Route>
                <Route path="/replace" >
                  <ReplaceLists />
                </Route>

                <Route exact path="/" >
                  <Grid container justify="center" spacing={ 5 } >
                    <Grid item xs={ 12 } md={ 6 }>
                      <Paper elevation={ 3 } >
                        <MyCard>
                          <MyCardHeader >
                            <MainNavigation
                              apikey={ apikey }
                              userConfig={ userConfiguration }
                              navId="1622632885409"
                              username={ username }
                              handleSetConfig={ handleSetConfig } />
                          </MyCardHeader>
                        </MyCard>
                      </Paper>
                    </Grid>
                    <Grid item xs={ 12 } md={ 6 }>
                      {/* <TimeTree username={ username } token={ jwtTocken } timetreeToken={ apikeyTimetree } /> */ }
                    </Grid>
                  </Grid>
                </Route>
                <Route exact path="/sandboxQl" >
                  { amplifyInitilaized === false ? (<h1> Loading </h1>) : (
                    <SandboxQl token={ jwtTocken } apikey={ apikey } listid={ 1 } lists={ userConfiguration } listtype="todo" />
                  ) }
                </Route>
                <Route exact path="/sandbox" >
                  <Grid container justify="center" >
                    <Sandbox token={ jwtTocken } apikey={ apikey } listid={ 1 } lists={ userConfiguration } listtype="todo" />
                  </Grid>
                </Route>
                <Route exact path="/demo" component={ StyleDemo }></Route>
                </Switch>
                  ) }
              </>) }
            
          </Grid>
          <Grid>
            <Error errorMessages={ errors } />
          </Grid>
        </Grid>
      </Router>


    </ThemeProvider>

  );
};

render(<App />, document.getElementById("root"));

