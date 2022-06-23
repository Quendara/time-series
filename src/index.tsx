"use strict";

import React, { Component, useState, useEffect } from "react";
import Amplify, { API, graphqlOperation } from 'aws-amplify';

import { render } from "react-dom";
import {
  BrowserRouter as Router,
  Route,
  NavLink,
  Routes,
  // IndexRoute,
  useLocation
} from "react-router-dom";


import { useStyles, theme } from "./Styles"

import { ThemeProvider, Grid, CssBaseline, Badge, Paper, Menu, MenuItem, ListItemIcon, IconButton, Divider, Avatar, Tooltip } from "@material-ui/core";

// import { ListTodo } from './listTodo';
import { Error } from "./components/Error"
import { MyIcon } from "./components/MyIcon";

import { MyCard, MyPaperHeader } from "./components/StyledComponents"

import { MainNavigation } from './organisms/navigation';

import { ListGraphQL } from './pages/listGraphQL';
import TimeSeries from "./pages/TimeSeries";
import { Sandbox } from "./pages/sandbox";
import { SandboxQl } from "./pages/SandboxQl";
import { TimeTree } from "./pages/TimeTree2";
import { CompareLists } from "./pages/CompareLists";
import { ReplaceLists } from "./pages/ReplaceLists";
import { CsvTools } from "./pages/CsvTools";


import { TodoItem, TodoMainItem } from "./models/TodoItems"

import { Clock } from "./components/Clock";
import { StyleDemo } from "./StyleDemo";
import { Auth } from "./Auth";

import './mstyle.css';

// import { Clock } from "./components/Clock";
// import { error } from "./components/erros"



const App = () => {

  const [username, setUsername] = useState("");
  const [jwtTocken, setJwtToken] = useState("");
  const [errors, setErrors] = useState<string[]>([]);

  // const [hackyNavId, sethackyNavId] = useState("");

  const [userConfiguration, setUserConfiguration] = useState<TodoMainItem[]>([]);

  const [apikey, setApi] = useState("");
  const [amplifyInitilaized, setAmplifyInitilaized] = useState(false);
  const [apikeyTimetree, setApikeyTimetree] = useState("");

  const classes = useStyles();

  const handleSetConfig = (config: TodoMainItem[]) => {
    setUserConfiguration(config)
  }

  const authSuccessCallback = (username: string, token: string, apikey: string, apikeyTimetree: string) => {
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

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null); //

  const menuHandleClick = (event: any) => { // : 
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const errorHandle = (message: string) => {

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
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Router>

        <Auth authSuccessCallback={authSuccessCallback} >

          <NavLink key={"nl_" + 1332} to={"/"} className={classes.menuButton}   ><MyIcon icon={"home"} /> </NavLink>

          {userConfiguration.map((item, index) => {
            if (item.navbar) return (
              <div key={ "fdf"+index } className={classes.menuButton}   >
                <Tooltip title={item.name} aia-label="add">
                  <NavLink key={"nl_" + index} to={"/" + [item.component, item.listid, item.render].join('/')} className={classes.menuButton}    >
                    <MyIcon icon={item.icon} />
                  </NavLink>
                </Tooltip>
              </div>
            )
          }
          )}

          <IconButton className={classes.menuButton} onClick={menuHandleClick} ><MyIcon icon="more_horiz" /> </IconButton>


          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem>
              <ListItemIcon><Avatar>{username[0]}</Avatar></ListItemIcon>{username}
            </MenuItem>
            <Divider />

            {amplifyInitilaized &&

              <MainNavigation
                render="simple"
                username={username}
                handleSetConfig={handleSetConfig} />}
          </Menu>
        </Auth>


        <Grid container justify="center" spacing={1} >
          <Grid item xs={11} ><br /></Grid>

          <Grid item xs={11} lg={10}>
            {username.length > 0 &&
              (<>
                {!amplifyInitilaized ? (<h1> Loading </h1>) :
                  (
                    <Routes>
                      <Route path="/list/:listid/:listtype/:itemid" element={
                        <ListGraphQL
                          username={username} lists={userConfiguration} />
                      } />
                      <Route path="/list/:listid/:listtype" element={
                        <ListGraphQL
                          username={username} lists={userConfiguration} />
                      } />
                      <Route path="/time/:id/:idx" element={
                        <TimeSeries username={username} token={jwtTocken} />
                      } >                        
                      </Route>


                      {/* <Route path="/timetree" >
                        <TimeTree username={username} token={jwtTocken} timetreeToken={apikeyTimetree} />
                      </Route> */}

                      <Route path="/diff" element={ <CompareLists /> }>                        
                      </Route>
                      <Route path="/replace" element={ <ReplaceLists /> }>                        
                      </Route>
                      <Route path="/csvtools" element={ <CsvTools /> }>                        
                      </Route>
                     

                      <Route path="/" element={
                        <Grid container justify="center" spacing={5} >
                          <Grid item xs={12} md={6}>
                            <Paper elevation={3} >
                              <MyCard>
                                <MyPaperHeader >
                                  <MainNavigation
                                    render="nnx"
                                    username={username}
                                    handleSetConfig={handleSetConfig} />
                                </MyPaperHeader>
                              </MyCard>
                            </Paper>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            {/* <TimeTree username={ username } token={ jwtTocken } timetreeToken={ apikeyTimetree } /> */}
                          </Grid>
                        </Grid>
                        } >
                      </Route>
                      {/* <Route path="/sandboxQl" >
                        {!amplifyInitilaized ? (<h1> Loading </h1>) : (
                          <SandboxQl />
                        )}
                      </Route> */}
                      <Route path="/sandbox" element={ 
                        <Grid container justify="center" >
                        
                        </Grid>
                      } />                      
                      <Route path="/demo" element={ <StyleDemo /> }></Route>
                    </Routes>
                  )}
              </>)}

          </Grid>
          <Grid>
            <Error errorMessages={errors} />
          </Grid>
        </Grid>
      </Router>


    </ThemeProvider>
  )



};

render(<App />, document.getElementById("root"));

