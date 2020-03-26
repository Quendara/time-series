import React, { Component, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faAngleDoubleRight,
  faSignOutAlt
} from "@fortawesome/free-solid-svg-icons";

// import { AmazonCognitoIdentity } from "amazon-cognito-identity-js";

import jwt_decode from "jwt-decode";

// https://www.npmjs.com/package/amazon-cognito-identity-js

// Or, using CommonJS modules
require("cross-fetch/polyfill");
var AmazonCognitoIdentity = require("amazon-cognito-identity-js");

const poolData = {
  UserPoolId: "eu-central-1_8LkzpXcOV",
  ClientId: "5v3et57vfoqijj81g3ksbidm5k"
};

const Auth = ({ authSuccessCallback }) => {
  const [username, setUsername] = useState("Test");
  const [password, setPassword] = useState("TestUser123");
  const [authError, setAuthError] = useState("");
  const [token, setToken] = useState("");
  const [trySend, setTrySend] = useState(false);

  const [cognitoUser, setCognitoUser] = useState(null);

  useEffect(() => { 
    // check if user is already logged in
    if (cognitoUser == null) {
      // Update the document title using the browser API
      console.log("useEffect called");
      const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
      const cognitoUser = userPool.getCurrentUser();

      console.log("cognitoUser", cognitoUser);

      if (cognitoUser != null) {
        cognitoUser.getSession(function(err, session) {
          if (err) {
            alert(err.message || JSON.stringify(err));
            return;
          }
          console.log("session validity: " + session.isValid());

          const username = cognitoUser["username"];
          const jwtToken = session.getIdToken().getJwtToken();

          setCognitoUser(cognitoUser);
          setUsername(username);
          // callback to parent
          authSuccessCallback(username, jwtToken);
        });
      }
    }
  });

  const handleClick = event => {
    event.preventDefault();

    if (username.length > 0 && password.length > 0) {
      // send ONLY when it's filled out
      // authSuccessCallback(token);

      authImpl(username, password);
    } else {
    }
  };

  const signOut = () => {
    console.log("signOut");
    if (cognitoUser != null) {
      console.log("cognitoUser", cognitoUser);
      
      setUsername("");
      setPassword("");
      setAuthError("")
      setCognitoUser(null);

      cognitoUser.signOut();
      
      
      authSuccessCallback("", "");
    }
  };

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

    // cognitoUser.changePassword('Test123!', 'UserTest123!', function(err, result) {
    //     if (err) {
    //         alert(err.message || JSON.stringify(err));
    //         return;
    //     }
    //     console.log('call result: ' + result);
    // });

    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: function(result) {
        var accessToken = result.getAccessToken().getJwtToken();

        // Use the idToken for Logins Map when Federating User Pools with identity pools or when passing through an Authorization Header to an API Gateway Authorizer
        let idToken = result.idToken.jwtToken;

        let decoded = jwt_decode(idToken);
        console.log(decoded);

        let username = decoded["cognito:username"];

        // callback to parent
        authSuccessCallback(username, idToken);

        setAuthError("Success" + JSON.stringify(decoded));
        setCognitoUser(cognitoUser);
      },

      onFailure: function(err) {
        console.error("Cannot log in ", JSON.stringify(err));
        setAuthError("Cannot log in " + JSON.stringify(err));
      }
    });
  };

  const getInputClass = val => {
    let ret = "form-control mr-sm-2";
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
      <form className="form-inline" onSubmit={handleClick}>
        <input
          value={username}
          className={getInputClass(username)}
          placeholder="Name"
          onChange={e => setUsername(e.target.value)}
        />
        <input
          value={password}
          className={getInputClass(password)}
          placeholder="Password"
          onChange={e => setPassword(e.target.value)}
        />
        <button className="btn btn-primary">
          <FontAwesomeIcon icon={faAngleDoubleRight} />
        </button>
        { authError }
      </form>
    );
  } else {
    return (
      <>
        <button className="btn btn-primary mr-sm-2" onClick={signOut} >
          {username} {" "} <FontAwesomeIcon icon={faSignOutAlt} />
        </button>
      </>
    );
  }
};

export { Auth };

/*



*/
