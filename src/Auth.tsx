import React, { useState, useEffect, useContext } from "react";
import { AppBar, Toolbar, Button, TextField, Grid, Card, Typography, Divider, CardContent, IconButton, Box, css, Icon, Menu, Avatar, ListItemIcon, MenuItem, ListItemText, ListItemAvatar, useMediaQuery } from '@mui/material';
import { List, ListItem } from '@mui/material';
import { Alert, AlertTitle } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import { MyIcon } from "./components/MyIcon";

import { cssClasses } from "./Styles"

import jwt_decode from "jwt-decode";
import { TodoMainContext } from "./context/TodoMainProvider";

// https://www.npmjs.com/package/amazon-cognito-identity-js

// // Or, using CommonJS modules
// require("cross-fetch/polyfill");
// var AmazonCognitoIdentity = require("amazon-cognito-identity-js");

import "cross-fetch/polyfill";
// import { Buffer } from 'buffer';
import * as AmazonCognitoIdentity from "amazon-cognito-identity-js";

const poolData = {
  UserPoolId: "eu-central-1_8LkzpXcOV",
  ClientId: "5v3et57vfoqijj81g3ksbidm5k"
};

interface Props {
  jwtTocken: string,
  authSuccessCallback: (username: string, token: string, apikey: string, apikeyOpenAi: string) => void;
  children: React.ReactNode
}



const Auth = ( props : Props) => {

  const context = useContext(TodoMainContext)


  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState<any>("");

  const theme = useTheme();
  const matchesUpXs = useMediaQuery(theme.breakpoints.up('sm'));

  // let authError = {}
  //  const [token, setToken] = useState("");

  const [trySend, setTrySend] = useState(false);
  const [cognitoUser, setCognitoUser] = useState<any>(null);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null); //

  const menuHandleClick = (event: any) => { // : 
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {

    console.log( "username" , username )

    // check if user is already logged in
    if (cognitoUser === null) {
      // Update the document title using the browser API
      console.log("useEffect called");
      const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
      const cognitoUser = userPool.getCurrentUser();

      console.log("cognitoUser", cognitoUser);

      if (cognitoUser !== null) {
        cognitoUser.getSession(function (err: any, session: any) {
          if (err) {
            alert(err.message || JSON.stringify(err));
            return;
          }
          console.log("session validity: " + session.isValid());

          const username = cognitoUser["username"];
          const jwtToken = session.getIdToken().getJwtToken();

          const decoded: any = jwt_decode(jwtToken);

          console.log("decoded jwtToken");
          console.log(decoded);

          const apikey = decoded["custom:APIKEY"];
          // const apikey_timetree = decoded["custom:TIMETREETOKEN"];
          const apikey_openai = decoded["custom:OPENAITOKEN"];

          context.setOpenAiKey(apikey_openai)

          // console.log("apikey_timetree : ", apikey_timetree);
          console.log("apikey_openai : ", apikey_openai);

          setCognitoUser(cognitoUser);
          setUsername(username);
          // callback to parent
          props.authSuccessCallback(username, jwtToken, apikey, apikey_openai);
        });
      }
    }
  }, []);

  const signIn = (event: any) => {
    // event.preventDefault();
    console.log("username ", username);
    console.log("password ", password);

    if (username.length > 0 && password.length > 0) {

      setTrySend(true);
      authImpl(username.trim(), password.trim());
    } else {
    }
  };

  const signOut = () => {
    console.log("signOut");
    if (cognitoUser !== null) {
      console.log("cognitoUser", cognitoUser);

      setUsername("");
      setPassword("");
      setAuthError("");
      setCognitoUser(null);

      cognitoUser.signOut();

      props.authSuccessCallback("", "", "", "");
    }
  };

  const onPasswortChange = (e: any) => {

    if (e.key === "Enter") {
      signIn(e)
    }
    else {
      // setPassword( e.target.value  )
    }
  }

  const authImpl = (username: string, password: string) => {
    // Amazon Cognito creates a session which includes the id, access, and refresh tokens of an authenticated user.

    const authenticationData = {
      Username: username,
      Password: password
    };

    const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(
      authenticationData
    );

    console.log(authenticationData, "authenticationDetails");

    const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
    const userData = {
      Username: authenticationData.Username,
      Pool: userPool
    };
    const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: function (result: any) {
        // var accessToken = result.getAccessToken().getJwtToken();

        // Use the idToken for Logins Map when Federating User Pools with identity pools or when passing through an Authorization Header to an API Gateway Authorizer
        let idToken = result.idToken.jwtToken;

        let decoded: any = jwt_decode(idToken);

        let username = decoded["cognito:username"];
        let apikey = decoded["custom:APIKEY"];

        // callback to parent
        props.authSuccessCallback(username, idToken, apikey, "");

        setAuthError("");
        setCognitoUser(cognitoUser);
        setTrySend(false);
      },
      onFailure: function (err: any) {
        setTrySend(false);
        console.error("Cannot log in ", err);
        setAuthError({
          'code': err.code,
          'message': err.message,
          'name': err.name
        })
      }

    });
  };

  const getInputClass = (val: string) => {
    let ret = "form-control m-2";
    if (val.length > 0) {
      ret += " is-valid";
    } else if (trySend) {
      // show issues when length is 0 and the user has tried to send
      ret += " is-invalid";
    }
    return ret;
  };

  if (cognitoUser == null) {
    return (
      <>
        <Grid
          container
          sx={{ height: "100vh" }}
          justifyContent="center"
          alignItems="center"  >

          <Grid item xs={11} md={4} >
            <Card>
              <List>
                <ListItem>
                  <Typography pl={2} variant="h4" >Log in</Typography>
                  <Divider variant="middle" />
                </ListItem>
                <form className="form-inline" onSubmit={signIn} >
                  <ListItem>
                    <TextField
                      value={username}
                      error={trySend}
                      fullWidth
                      style={{ margin: 8 }}
                      variant="outlined"
                      className={getInputClass(username)}
                      label="Name"
                      onChange={e => setUsername(e.target.value)}
                    />
                  </ListItem>
                  <ListItem>
                    <TextField
                      type="password"
                      value={password}
                      error={trySend}
                      fullWidth
                      style={{ margin: 8 }}
                      variant="outlined"
                      className={getInputClass(password)}
                      label="Password"
                      onKeyPress={e => onPasswortChange(e)}
                      // onKeyPress={ e => onPasswortChange ( e.target.value ) }
                      onChange={e => setPassword(e.target.value)}
                    />
                  </ListItem>
                  <ListItem>
                    <Button
                      disabled={password.length === 0 || username.length < 5}
                      color="primary"
                      variant="contained"
                      onClick={signIn}
                      style={{ margin: 8 }} >
                      {trySend ? "Loading" : "Sign-In"}
                      <MyIcon icon={"chevron_right"}></MyIcon>
                    </Button>
                  </ListItem>
                </form>
              </List>
              <CardContent>
                {authError &&
                  <Alert severity="error">
                    <AlertTitle>Failed to Login</AlertTitle>
                    {authError.message}
                  </Alert>
                }
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </>
    );
  } else {
    //<li><NavLink className="nav-item nav-link mr-2 " to="/sandbox" activeClassName="blue">Sandbox</NavLink></li>
    return (
      <>
        <AppBar sx={{ zIndex: 20 }} position={matchesUpXs ? "static" : "fixed"}  >
          <Toolbar>

            {props.children}

            <Box>
              <IconButton
                onClick={menuHandleClick} >
                <Icon>account_circle</Icon>
              </IconButton>
            </Box>

            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem>
                <ListItemAvatar><Avatar>{username[0]}</Avatar></ListItemAvatar>
                <ListItemText primary={username} />
              </MenuItem>
              <Divider />
              <MenuItem onClick={signOut}>
                <ListItemAvatar><Avatar><MyIcon icon="exit_to_app" /></Avatar></ListItemAvatar>
                <ListItemText primary="Logout" />
              </MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>
      </>
    );
  }
};

export { Auth };

