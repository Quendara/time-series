import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, Button, TextField, Grid, Card, Typography, Divider, CardContent, IconButton } from '@material-ui/core/';
import { List, ListItem } from '@material-ui/core/';


import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDoubleRight } from "@fortawesome/free-solid-svg-icons";
import { MyIcon } from "./components/MyIcon";
import {useStyles} from "./Styles"



import jwt_decode from "jwt-decode";

// https://www.npmjs.com/package/amazon-cognito-identity-js

// Or, using CommonJS modules
require("cross-fetch/polyfill");
var AmazonCognitoIdentity = require("amazon-cognito-identity-js");

const poolData = {
  UserPoolId: "eu-central-1_8LkzpXcOV",
  ClientId: "5v3et57vfoqijj81g3ksbidm5k"
};



const Auth = ({ authSuccessCallback, children }) => {

  const classes = useStyles();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  // let authError = {}
  //  const [token, setToken] = useState("");
  const [trySend, setTrySend] = useState(false);

  const [cognitoUser, setCognitoUser] = useState(null);

  useEffect(() => {
    // check if user is already logged in
    if (cognitoUser === null) {
      // Update the document title using the browser API
      console.log("useEffect called");
      const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
      const cognitoUser = userPool.getCurrentUser();

      console.log("cognitoUser", cognitoUser);

      if (cognitoUser !== null) {
        cognitoUser.getSession(function (err, session) {
          if (err) {
            alert(err.message || JSON.stringify(err));
            return;
          }
          console.log("session validity: " + session.isValid());

          const username = cognitoUser["username"];
          const jwtToken = session.getIdToken().getJwtToken();

          const decoded = jwt_decode(jwtToken);

          console.log("decoded jwtToken" );
          console.log( decoded);

          const apikey = decoded["custom:APIKEY"];  
          const apikey_timetree = decoded["custom:TIMETREETOKEN"];  
          
          console.log("apikey_timetree : ", apikey_timetree );
  
          setCognitoUser(cognitoUser);
          setUsername(username);
          // callback to parent
          authSuccessCallback(username, jwtToken, apikey, apikey_timetree);
        });
      }
    }
  }, [ authSuccessCallback ]);

  const signIn = event => {
    // event.preventDefault();
    console.log("username ", username);
    console.log("password ", password);

    if (username.length > 0 && password.length > 0) {
      // send ONLY when it's filled out
      // authSuccessCallback(token);

      setTrySend(true);

      authImpl(username, password);
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

      authSuccessCallback("", "", "");
    }
  };

  const onPasswortChange = (e) => {
    
    if (e.key === "Enter") {
      signIn(e)
    }
    else {
      // setPassword( e.target.value  )
    }
  }

  const authImpl = (username, password) => {
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
      onSuccess: function (result) {
        // var accessToken = result.getAccessToken().getJwtToken();

        // Use the idToken for Logins Map when Federating User Pools with identity pools or when passing through an Authorization Header to an API Gateway Authorizer
        let idToken = result.idToken.jwtToken;

        let decoded = jwt_decode(idToken);

        let username = decoded["cognito:username"];
        let apikey = decoded["custom:APIKEY"]; 

        // callback to parent
        authSuccessCallback(username, idToken, apikey);

        setAuthError("");
        setCognitoUser(cognitoUser);
        setTrySend(false);
      },
      onFailure: function (err) {
        setTrySend(false);
        console.error("Cannot log in ", err );
        setAuthError({
          'code': err.code,
          'message': err.message,
          'name': err.name
        })
      }

    });
  };

  const getInputClass = val => {
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
          justify="center"
          alignItems="center"  >

          <Grid item xs={ 11 } lg={ 12 } >
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
          </Grid>
          <Grid item xs={ 11 } lg={ 4 } >
            <Card>
              <List>
                <ListItem>
                  <Typography variant="h4" >Log in</Typography>
                  <Divider variant="middle" />
                </ListItem>
                <form className="form-inline" onSubmit={ signIn } >
                  <ListItem>
                    <TextField
                      value={ username }
                      error={ trySend }
                      fullWidth
                      style={ { margin: 8 } }
                      variant="outlined"
                      className={ getInputClass(username) }
                      label="Name"
                      onChange={ e => setUsername(e.target.value) }
                    />
                  </ListItem>
                  <ListItem>
                    <TextField
                      type="password"
                      value={ password }
                      error={ trySend }
                      fullWidth
                      style={ { margin: 8 } }
                      variant="outlined"
                      className={ getInputClass(password) }
                      label="Password"
                      onKeyPress={ e => onPasswortChange(e) }
                      // onKeyPress={ e => onPasswortChange ( e.target.value ) }
                      onChange={ e => setPassword(e.target.value) }
                    />
                  </ListItem>
                  <ListItem>
                    <Button color="primary" variant="contained" onClick={ signIn } style={ { margin: 8 } } >
                      { trySend ? "Loading" : "Sign-In" }
                      <FontAwesomeIcon icon={ faAngleDoubleRight } className="ml-2" />
                    </Button>
                  </ListItem>
                </form>
              </List>
              <CardContent>
                <h2>{ authError.message }</h2>
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
        <AppBar position="static" className={classes.appBar}>
          <Toolbar>
            

            { children }
            
            {/* <Button onClick={ signOut }><ExitToAppIcon /></Button> */}
            <IconButton variant="inherit" className={ classes.menuButton } onClick={ signOut }>
              <MyIcon icon="exit_to_app" /> </IconButton>
          </Toolbar>
        </AppBar>
      </>
    );
  }
};
// <Button><FontAwesomeIcon icon={ faUserAstronaut } className="mr-2" /> { username }</Button>
export { Auth };

