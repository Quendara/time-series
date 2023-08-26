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

import { ThemeProvider, Grid, CssBaseline, Paper, Menu, MenuItem, ListItemIcon, IconButton, Divider, Avatar, Tooltip, Box, Icon, useMediaQuery, useTheme } from "@mui/material";

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
import { Details } from "./components/Details";
import { UpdateTodosInput } from "./API";

// import { Clock } from "./components/Clock";
// import { error } from "./components/erros"



const App = () => {

  const [username, setUsername] = useState("");
  const [jwtTocken, setJwtToken] = useState("");
  const [errors, setErrors] = useState<string[]>([]);

  // const [hackyNavId, sethackyNavId] = useState("");

  const [ todoMainItems, setTodoMainItems] = useState<TodoMainItem[]>([]);

  const [apikey, setApi] = useState("");
  const [amplifyInitilaized, setAmplifyInitilaized] = useState(false);
  const [apikeyTimetree, setApikeyTimetree] = useState("");

  const theme2 = useTheme();
  const matchesUpXs = useMediaQuery(theme2.breakpoints.up('sm'));


  const handleSetConfig = (config: TodoMainItem[]) => {
    setTodoMainItems(config)
  }

  const authSuccessCallback = (username: string, token: string, apikey: string, apikeyTimetree: string) => {
    setUsername(username);

    setJwtToken(token);
    setApi(apikey);
    setApikeyTimetree(apikeyTimetree)

    console.log("username        : ", username);
    console.log("authSuccess     : ", token);
    console.log("apikey          : ", apikey);
  
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
      }
    }, [apikey])

    const colorArr = [
      "rgb(144, 202, 249)",
      "rgb(206, 147, 216)",
      "rgb(255, 167, 38)"
  ]    


  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Router>

        <Auth authSuccessCallback={authSuccessCallback} >

          <NavLink key={"nl_" + 1332} to={"/"}  >
            <IconButton sx={cssClasses.title}><Icon  >home</Icon></IconButton>
          </NavLink>

          {amplifyInitilaized &&
            <MainNavigation
              horizontally={false}
              render="navlink"
              username={username}
              handleSetConfig={handleSetConfig} />}

        </Auth>

        <Grid container pt={ matchesUpXs?2:0 } justifyContent="center" spacing={1} >
        
          <Grid item xs={12} lg={11}>
            {username.length > 0 &&
              (<>
                {!amplifyInitilaized ? (<h1> Loading </h1>) :
                  (
                    <Routes>
                      <Route path="/list/:listid/:listtype/:itemid" element={
                        <ListGraphQL username={username} lists={todoMainItems} color={ colorArr[0]} horizontally={false}
                        />
                      } />
                      <Route path="/list/:listid/:listtype" element={
                        <ListGraphQL username={username} lists={todoMainItems} color={ colorArr[0]} horizontally={false} />
                      } />
                      <Route path="/time/:id/:idx" element={
                        <TimeSeries username={username} token={jwtTocken} />
                      } >
                      </Route>
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
                            <MainNavigation
                              horizontally={true}
                              render="main"
                              username={username}
                              handleSetConfig={handleSetConfig} />
                          
                        
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

      <Grid item xs={12} md={6}>
        <Box sx={{height:"90px"}} >
          </Box>
      </Grid>


    </ThemeProvider>
  )



};

render(<App />, document.getElementById("root"));

