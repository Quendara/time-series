"use strict";

import React, { Component, useState } from "react";


import { render } from "react-dom";
import {
  BrowserRouter as Router,
  Route,
  NavLink,
  Switch,
  IndexRoute,
  useLocation
} from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


import Icon from '@material-ui/core/Icon';

import TimelineIcon from '@material-ui/icons/Timeline';
import ShareIcon from '@material-ui/icons/Share';
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';
import ChatIcon from '@material-ui/icons/Chat';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import MoreIcon from '@material-ui/icons/MoreVert';


// import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import { useStyles, theme } from "./Styles"

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import { ThemeProvider, Grid, CssBaseline, Badge, Paper, Menu, MenuItem, ListItemIcon, IconButton, Divider, Avatar, ListItemText } from "@material-ui/core";

// import { ListTodo } from './listTodo';
import { Error } from "./components/Error"
import { MyIcon } from "./components/MyIcon";


import { MainNavigation } from './organisms/navigation';

import { ListGraphQL } from './pages/listGraphQL';
import TimeSeries from "./pages/TimeSeries";
import { Sandbox } from "./pages/sandbox";
import { TimeTree } from "./pages/TimeTree2";

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
  const [userConfiguration, setUserConfiguration] = useState([]);

  const [apikey, setApi] = useState(undefined);
  const [apikeyTimetree, setApikeyTimetree] = useState(undefined);

  const classes = useStyles();




  const authSuccessCallback = (username, token, apikey, apikeyTimetree) => {
    setUsername(username);

    if (username === "andre") {
      const config = [
        { component: "list", id: 0, icon: "share", name: "Links", render: "links", navbar: true },
        { component: "time", id: "x", icon: "timeline", name: "Timeline", render: "x", navbar: true },
        { component: "timetree", id: "x", icon: "calendar", name: "Calendar", render: "x", navbar: true },
        { component: "list", id: 9, icon: "flower", name: "Pflanzen", render: "todo", navbar: false },
        { component: "list", id: 2, icon: "assignmentTurnedIn", name: "Meine Todos", render: "todo", navbar: true },
        { component: "list", id: 21, icon: "developer", name: "Meine Apps", render: "todo", navbar: false },
        { component: "list", id: 22, icon: "child", name: "YUKI", render: "todo", navbar: false },
        { component: "list", id: 1, icon: "shoppingCart", name: "Einkauf", render: "todo", navbar: true },
        { component: "list", id: 7, icon: "chat", name: "Arbeit", render: "todo", navbar: false },
        { component: "list", id: 6, icon: "work", name: "DHL", render: "todo", navbar: false },
        // { component: "list", id: 3, icon: "work", name: "Nachrichten", render: "message", navbar: false },

      ]
      setUserConfiguration(config)
    }
    if (username === "jonna") {
      const config = [
        { component: "list", id: 11, icon: "shoppingCart", render: "todo", navbar: true },
        { component: "list", id: 13, icon: "assignmentTurnedIn", render: "todo", navbar: true }
      ]
      setUserConfiguration(config)
    }

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

  return (
    <ThemeProvider theme={ theme }>
      <CssBaseline />

      <Router>

        <Auth authSuccessCallback={ authSuccessCallback } >

          { userConfiguration.map((item, index) => {
            if (item.navbar) return (
              <NavLink to={ "/" + [item.component, item.id, item.render].join('/') } className={ classes.menuButton }   ><MyIcon icon={ item.icon } /> </NavLink>
            )
          }
          ) }

          <IconButton variant="inherit" className={ classes.menuButton } onClick={ menuHandleClick } ><MyIcon icon="more" /> </IconButton>


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

            { userConfiguration.map((item, index) => {
              // <NavLink to={ "/" + [item.component, item.id, item.render].join('/') } className={ classes.menuButton }   ><MyIcon icon={ item.icon } /> </NavLink>
              return (
                <NavLink className={ classes.title } to={ "/" + [item.component, item.id, item.render].join('/') }   >
                  <MenuItem>


                    <ListItemIcon>
                      <MyIcon icon={ item.icon } />
                    </ListItemIcon>
                    <ListItemText
                      primary={ item.name }
                    ></ListItemText>
                  </MenuItem>
                </NavLink>

              )
            }
            ) }

            {/* { username == "andre" && (
              <>
                
                <MenuItem>
                  <NavLink to="/list/3/message" className={ classes.menuButton }   ><ListItemIcon><ChatIcon fontSize="small" /></ListItemIcon><Typography variant="inherit" color="inherit" >   Messages</Typography></NavLink>
                </MenuItem>
                <MenuItem>
                  <NavLink to="/sandbox" className={ classes.menuButton }   ><ListItemIcon><ChatIcon fontSize="small" /></ListItemIcon>  <Typography variant="inherit" color="inherit" >Sandbox</Typography></NavLink>
                </MenuItem>
              </>
            ) } */}
          </Menu>
        </Auth>


        <Grid container justify="center" spacing={ 1 } >
          <Grid item xs={ 11 } ><br /></Grid>

          <Grid item xs={ 11 } lg={ 10 }>
            { username.length > 0 &&
              <>
                <Switch>
                  <Route path="/list/:listid/:listtype" children={ 
                    <ListGraphQL 
                      token={ jwtTocken } username={ username } apikey={ apikey } errorHandle={ errorHandle } lists={ userConfiguration } /> 
                    } />
                  <Route path="/time" >
                    <TimeSeries username={ username } token={ jwtTocken } errorHandle={ errorHandle } />
                  </Route>

                </Switch>
                <Route path="/timetree" >
                  <TimeTree username={ username } token={ jwtTocken } timetreeToken={ apikeyTimetree } />
                </Route>

                <Route exact path="/" >
                  <Grid container justify="center" spacing={ 5 } >
                    <Grid item xs={ 12 } md={ 6 }>
                      <MainNavigation userConfig={ userConfiguration } />
                    </Grid>
                    <Grid item xs={ 12 } md={ 6 }>
                      <TimeTree username={ username } token={ jwtTocken } timetreeToken={ apikeyTimetree } />
                    </Grid>
                  </Grid>
                </Route>
                <Route exact path="/sandbox" >
                  <Grid container justify="center" >
                    <Sandbox token={ jwtTocken } apikey={ apikey } listid={ 1 } listtype="todo" />
                  </Grid>
                </Route>
                <Route exact path="/demo" component={ StyleDemo }></Route>
              </>
            }
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

