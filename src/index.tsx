import React, { useState, useEffect } from "react";
import Amplify, { } from 'aws-amplify';

import { render } from "react-dom";
import {
  BrowserRouter as Router,
  Route,
  NavLink,
  Routes
} from "react-router-dom";


import { cssClasses } from "./Styles"

import { ThemeProvider, Grid, CssBaseline, Paper, Menu, MenuItem, ListItemIcon, IconButton, Divider, Avatar, Tooltip, Box, Icon, useMediaQuery, useTheme } from "@mui/material";
import { createTheme } from '@mui/material/styles';

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
import { TodoMainProvider } from "./context/TodoMainProvider";
import { SandboxGPT } from "./pages/SandboxGPT";
import { PianoSong } from "./pages/PianoSong";
import { Mails } from "./pages/Mails";
import { PageJoplin } from "./Joplin/PageJoplin";

// import { Clock } from "./components/Clock";
// import { error } from "./components/erros"


const App = () => {

  type MyPaletteMode = 'light' | 'dark';


  const [mode, setMode] = React.useState<MyPaletteMode>('dark'); // PaletteMode

  const [username, setUsername] = useState("");
  const [jwtTocken, setJwtToken] = useState("");
  const [errors, setErrors] = useState<string[]>([]);

  // const [hackyNavId, sethackyNavId] = useState("");

  const [todoMainItems, setTodoMainItems] = useState<TodoMainItem[]>([]);

  const [apikey, setApi] = useState("");
  const [amplifyInitilaized, setAmplifyInitilaized] = useState(false);
  // const [apikeyTimetree, setApikeyTimetree] = useState("");
  const [apikeyOpenAi, setApikeyOpenAi] = useState("");

  const theme2 = useTheme();
  const matchesUpXs = useMediaQuery(theme2.breakpoints.up('sm'));

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          // primary:{
          //   // main: options?options.primary.main:inittheme.palette.primary.main
          // },
          // secondary:{
          //   // main: options?options.secondary.main:inittheme.palette.secondary.main
          // },          
          // primary: options?options.primary:undefined,
          mode
        }
      }),
    [mode],
  );

  const toggleColorMode = () => {
    const newMode = mode === 'light' ? 'dark' : 'light'
    setMode(newMode);
    // window.localStorage.setItem( localStorageKeyForTheme, newMode )
  }


  const handleSetConfig = (config: TodoMainItem[]) => {
    setTodoMainItems(config)
  }

  const authSuccessCallback = (username: string, token: string, apikey: string, apikeyOpen_Ai: string) => {

    setUsername(username);
    setJwtToken(token);
    setApi(apikey);
    setApikeyOpenAi(apikeyOpen_Ai)

    console.log("username        : ", username);
    // console.log("authSuccess     : ", token);
    console.log("apikey          : ", apikey);
    console.log("apikeyOpenAi    : ", apikeyOpen_Ai);

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
      <TodoMainProvider>
        <CssBaseline />


        <Router>
          <Auth jwtTocken={jwtTocken} authSuccessCallback={authSuccessCallback} >

            <NavLink key={"nl_" + 1332} to={"/"}  >
              <IconButton sx={cssClasses.title}><Icon  >home</Icon></IconButton>
            </NavLink>
            <NavLink key={"nl_" + 98978} to={"/mails"}  >
              <IconButton sx={cssClasses.title}><Mails token={jwtTocken} renderAs="icon" /></IconButton>
            </NavLink>


            {amplifyInitilaized &&

              <MainNavigation
                horizontally={false}
                render="navlink"
                username={username}
                handleSetConfig={handleSetConfig} />

            }

            <IconButton sx={{ ml: 1 }} onClick={toggleColorMode} color="inherit">
              {theme.palette.mode === 'dark' ? <Icon>dark_mode</Icon> : <Icon>light_mode</Icon>}
            </IconButton>

          </Auth>

          <Grid container pt={matchesUpXs ? 0 : 0} justifyContent="center" spacing={1} >

            <Grid item xs={12} lg={12}>
              {username.length > 0 &&
                (<>
                  {!amplifyInitilaized ? (<h1> Loading </h1>) :
                    (
                      <Routes>
                        <Route path="/list/:listid/:listtype/:itemid" element={
                          <ListGraphQL username={username} lists={todoMainItems} color={colorArr[0]} horizontally={false}
                          />
                        } />
                        <Route path="/list/:listid/:listtype" element={
                          <ListGraphQL username={username} lists={todoMainItems} color={colorArr[0]} horizontally={false} />
                        } />

                        <Route path="/time/:id/:idx" element={
                          <TimeSeries username={username} token={jwtTocken} />
                        } >
                        </Route>

                        <Route path="/piano" element={
                          <Paper sx={{ m: 5, p: 2 }}>
                            <PianoSong play="" showNodes={true} showTextinput={true} />
                          </Paper>
                        }>
                        </Route>
                        <Route path="/abc" element={
                          <Paper sx={{ m: 5, p: 2 }}>
                            <PianoSong play="" showNodes={true} showTextinput={true} showAbcOnly={true} />
                          </Paper>
                        }>
                        </Route>

                        <Route path="/diff" element={<CompareLists />}>
                        </Route>
                        <Route path="/replace" element={<ReplaceLists />}>
                        </Route>

                        {/* <Route path="/joplin" element={<PageJoplin toggleColorMode={ toggleColorMode } />}>
                        </Route> */}
                        <Route path="/joplin/:context" element={<PageJoplin toggleColorMode={toggleColorMode} />} ></Route>
                        <Route path="/joplin/:context/:query" element={<PageJoplin toggleColorMode={toggleColorMode} />} ></Route>


                        <Route path="/sandboxH" element={<SandboxH />}>
                        </Route>
                        <Route path="/SandboxGPT" element={<SandboxGPT apikey={apikeyOpenAi} />}>
                        </Route>

                        <Route path="/sandbox" element={<Sandbox />}>
                        </Route>

                        <Route path="/csvtools" element={<CsvToolsPage />}>
                        </Route>

                        <Route path="/mails" element={<Mails token={jwtTocken} renderAs="table" />}>
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
          <Box sx={{ height: "90px" }} >
          </Box>
        </Grid>

      </TodoMainProvider>
    </ThemeProvider>
  )

};

render(<App />, document.getElementById("root"));

