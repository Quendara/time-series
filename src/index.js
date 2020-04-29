"use strict";

import React, { Component, useState } from "react";
// import {
//   BrowserRouter as Router,
//   Route,
//   Redirect,
//   Link,
//   useLocation
// } from "react-router-dom";

// /search?user=andre

import { render } from "react-dom";
import { Layout } from "antd";

import TimeSeries from "./TimeSeries";
import TestComponent from "./TestComponent";

import { Auth } from "./Auth";

import "antd/dist/antd.css";

// const { Header, Footer, Sider, Content } = Layout;

// A custom hook that builds on useLocation to parse
// the query string for you.
// import queryString from "query-string";
// function useQuery() {
//   return;
// }

const App = () => {
  const [username, setUsername] = useState("");
  const [jwtTocken, setJwtToken] = useState("");

  const authSuccessCallback = (username, token) => {
    setUsername(username);
    setJwtToken(token);

    console.log("username", username);
    console.log("authSuccess", token);
  };

  return (
    <div className="container-fluid"> 
      <br />
      <nav className="navbar navbar-dark bg-dark">
        <a className="navbar-brand mr-auto " href="#">
          Home
        </a>
        <Auth authSuccessCallback={authSuccessCallback} />
      </nav>
      <hr />
      {username.length > 0 && <TimeSeries username={username} token={ jwtTocken } />}
    </div>
  );
};

render(<App />, document.getElementById("root"));
