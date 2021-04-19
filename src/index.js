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



import { ThemeProvider, Grid, CssBaseline, Badge, Paper, Menu, MenuItem, ListItemIcon, IconButton, Divider, Avatar } from "@material-ui/core";

// import { ListTodo } from './listTodo';
import { ListGraphQL } from './pages/listGraphQL';

import TimeSeries from "./pages/TimeSeries";
import { Sandbox } from "./pages/sandbox";
import { Clock } from "./components/Clock";


import { StyleDemo } from "./StyleDemo";
import { Auth } from "./Auth";


import './mstyle.css';

const App = () => {
  const [username, setUsername] = useState("");
  const [jwtTocken, setJwtToken] = useState("");
  const [apikey, setApi] = useState(undefined);

  const classes = useStyles();

  const authSuccessCallback = (username, token, apikey) => {
    setUsername(username);
    setJwtToken(token);
    setApi(apikey);

    console.log("username : ", username);
    console.log("authSuccess : ", token);
    console.log("apikey : ", apikey);
  };

  const [anchorEl, setAnchorEl] = useState(null); // <null | HTMLElement>
  const menuHandleClick = (event) => { // : React.MouseEvent<HTMLButtonElement>
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  // listid={ 0 } listtype="links" 
  // listid={ 1 } listtype="todo" // einkaufen
  // - listid={ 2 } listtype="todo"    // todo
  // listid={ 3 } listtype="message" // message

  return (
    <ThemeProvider theme={ theme }>
      <CssBaseline />

      <Router>

        <Auth authSuccessCallback={ authSuccessCallback } >
        { username == "andre" && ( <>
          <NavLink to="/list/0/links" className={ classes.menuButton }   ><ShareIcon /></NavLink>
          <NavLink to="/time" className={ classes.menuButton }   ><TimelineIcon /></NavLink>
          <NavLink to="/list/1/todo" className={ classes.menuButton }   ><ShoppingCartIcon /></NavLink>
          <NavLink to="/list/2/todo" className={ classes.title }   ><AssignmentTurnedInIcon /></NavLink>
          <IconButton variant="inherit" className={ classes.menuButton } onClick={ menuHandleClick } ><MoreIcon /></IconButton>
          </> )}

          { username == "jonna" && ( <>          
            <NavLink to="/list/10/links" className={ classes.menuButton }   ><ShareIcon /></NavLink>
            <NavLink to="/list/11/todo" className={ classes.menuButton }   ><ShoppingCartIcon /></NavLink>
            <NavLink to="/list/12/todo" className={ classes.title }   ><AssignmentTurnedInIcon /></NavLink>

          </> )}

          <Menu
            id="simple-menu"
            anchorEl={ anchorEl }
            keepMounted
            open={ Boolean(anchorEl) }
            onClose={ handleClose }
          >
            <MenuItem>
              <ListItemIcon><Avatar>J</Avatar></ListItemIcon>
            </MenuItem>


            { username == "andre" && (
                  <>
                  <MenuItem><Divider /> </MenuItem>
                  <MenuItem>
                  <NavLink to="/list/3/message" className={ classes.menuButton }   ><ListItemIcon><ChatIcon fontSize="small" /></ListItemIcon><Typography variant="inherit" color="inherit" >   Messages</Typography></NavLink>
                  </MenuItem>
                  <MenuItem>
                  <NavLink to="/sandbox" className={ classes.menuButton }   ><ListItemIcon><ChatIcon fontSize="small" /></ListItemIcon>  <Typography variant="inherit" color="inherit" >Sandbox</Typography></NavLink>
                  </MenuItem>
                  </>
                  ) }
          </Menu>
        </Auth>


        <Grid container justify="center" spacing={ 1 } >
          <Grid item xs={ 11 } ><br /></Grid>

          <Grid item xs={ 11 } lg={ 10 }>
            { username.length > 0 &&
              <>
                <Route exact path="/time" >
                  <TimeSeries username={ username } token={ jwtTocken } />
                </Route>



                <Switch>
                  <Route path="/list/:listid/:listtype" children={ <ListGraphQL token={ jwtTocken } apikey={ apikey } /> } />
                </Switch>
                {/* <Route exact path="/" >
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
                  <Grid container justify="center" spacing={8} >
                    <Grid item xs={ 12 } md={6} >
                      <ListGraphQL token={ jwtTocken } apikey={ apikey } listid={ 2 } listtype="todo" />
                    </Grid>
                  </Grid>
                </Route>
                <Route exact path="/message" >
                  <Grid container justify="center" >
                      <ListGraphQL token={ jwtTocken } apikey={ apikey } listid={ 3 } listtype="message" />
                  </Grid>
                </Route> */}
                <Route exact path="/" >
                  <Grid container justify="center" >
                    <Clock />
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
        </Grid>
      </Router>


    </ThemeProvider>

  );
};

render(<App />, document.getElementById("root"));

