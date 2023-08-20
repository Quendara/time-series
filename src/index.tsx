import React, { useState, useEffect } from "react";
import Amplify, { } from 'aws-amplify';

import { render } from "react-dom";
import {
  BrowserRouter as Router,
  Route,
  NavLink,
  Routes
} from "react-router-dom";


import { cssClasses, theme } from "./Styles"

import { ThemeProvider, Grid, CssBaseline, Paper, Menu, MenuItem, ListItemIcon, IconButton, Divider, Avatar, Tooltip, Box, Icon } from "@mui/material";

// import { ListTodo } from './listTodo';
import { Error } from "./components/Error"
import { MyIcon } from "./components/MyIcon";


import { MainNavigation } from './organisms/navigation';

import { ListGraphQL } from './pages/listGraphQL';
import TimeSeries from "./pages/TimeSeries";
import { CompareLists } from "./pages/CompareLists";
import { ReplaceLists } from "./pages/ReplaceLists";
import { CsvToolsPage } from "./pages/CsvToolsPage";


import { TodoMainItem } from "./models/TodoItems"

import { StyleDemo } from "./StyleDemo";
import { Auth } from "./Auth";

import './mstyle.css';
import { SandboxH } from "./pages/SandboxH";
import { Sandbox } from "./pages/sandbox";

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

          <NavLink key={"nl_" + 1332} to={"/"}  >
            <IconButton sx={cssClasses.title}><Icon  >home</Icon></IconButton>
          </NavLink>

          {/* {userConfiguration.map((item, index) => {
            if (item.navbar) return (
              <Box key={"fdf" + index} sx={cssClasses.menuButton}    >
                <Tooltip title={item.name} aia-label="add">
                  <NavLink key={"nl_" + index} to={"/" + [item.component, item.listid, item.render].join('/')}   >
                    <IconButton sx={cssClasses.menuButton} >
                      <Icon>{item.icon}</Icon>
                    </IconButton>
                  </NavLink>
                </Tooltip>
              </Box>
            )
          }
          )} */}

          {amplifyInitilaized &&

            <MainNavigation
              horizontally={false}
              render="navlink"
              username={username}
              handleSetConfig={handleSetConfig} />}

          <IconButton
            sx={cssClasses.menuButton}
            onClick={menuHandleClick} >
            <Icon>more_horiz</Icon>
          </IconButton>

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

            {/*  */}
          </Menu>
        </Auth>


        <Grid container justifyContent="center" spacing={1} >
          <Grid item xs={11} ><br /></Grid>

          <Grid item xs={12} lg={11}>
            {username.length > 0 &&
              (<>
                {!amplifyInitilaized ? (<h1> Loading </h1>) :
                  (
                    <Routes>
                      <Route path="/list/:listid/:listtype/:itemid" element={
                        <ListGraphQL username={username} lists={userConfiguration} horizontally={false}
                        />
                      } />
                      <Route path="/list/:listid/:listtype" element={
                        <ListGraphQL username={username} lists={userConfiguration} horizontally={false} />
                      } />
                      <Route path="/time/:id/:idx" element={
                        <TimeSeries username={username} token={jwtTocken} />
                      } >
                      </Route>


                      {/* <Route path="/timetree" >
                        <TimeTree username={username} token={jwtTocken} timetreeToken={apikeyTimetree} />
                      </Route> */}

                      <Route path="/diff" element={<CompareLists />}>
                      </Route>
                      <Route path="/replace" element={<ReplaceLists />}>
                      </Route>
                      <Route path="/sandboxH" element={<SandboxH />}>
                      </Route>
                      <Route path="/sandbox" element={<Sandbox />}>
                      </Route>


                      <Route path="/csvtools" element={<CsvToolsPage />}>
                      </Route>


                      <Route path="/" element={
                        <Grid container justifyContent="center" spacing={2} >
                          <Grid item xs={12} md={12}>
                            <MainNavigation
                              horizontally={true}
                              render="main"
                              username={username}
                              handleSetConfig={handleSetConfig} />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            {/* <TimeTree username={ username } token={ jwtTocken } timetreeToken={ apikeyTimetree } /> */}
                          </Grid>
                        </Grid>
                      } >
                      </Route>
                      <Route path="/demo" element={<StyleDemo />}></Route>
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

