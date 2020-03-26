"use strict";

import React, { Component, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Link,
  useLocation
} from "react-router-dom";

// /search?user=andre

import { render } from "react-dom";

import { Layout } from "antd";
import { Row, Col, List, Button, DatePicker, Card, version } from "antd";

import SingleTimeSerie from "./SingleTimeSerie";
import TestComponent from "./TestComponent";
import { Auth } from "./Auth";

import Settings from "./Settings";
import queryString from "query-string";

import "antd/dist/antd.css";

const { Header, Footer, Sider, Content } = Layout;

// A custom hook that builds on useLocation to parse
// the query string for you.
function useQuery() {
  return;
}

class TimeSeriesQuery extends React.Component {
  constructor(props) {
    super(props);

    this.props = props;

    console.log(props);
    this.state = {
      timeseries: [],
      error: null,
      isLoaded: false,
      location: new URLSearchParams(props.location.search)
    };
  }

  componentDidMount() {
    const user = this.state.location.get("user");

    this.resource = "groups/" + user;

    fetch(Settings.baseAwsUrl + this.resource)
      .then(res => res.json())
      .then(
        result => {
          //          {
          //              group_name: "Dummy",
          //              group_id: 99,
          //              group_unit: "km"
          //          }

          this.setState({
            isLoaded: true,
            timeseries: result
          });
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        error => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      );
  }

  render() {
    const { error, isLoaded, items, location } = this.state;

    if (error) {
      return <div>Error {error} </div>;
    } else if (this.state.timeseries.length > 0) {
      return (
        <div className="container">
          <div className="row">
            {this.state.timeseries.map(item => (
              <div className="col-md-12 col-lg-4">
                <SingleTimeSerie
                  key={item.group_id}
                  group_id={item.group_id}
                  group_unit={item.group_unit}
                  group_name={item.group_name}
                />
              </div>
            ))}
          </div>
        </div>
      );
    } else {
      return <Row>No time series created</Row>;
    }
  }
}

class TimeSeries extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;

    console.log(props);

    this.state = {
      timeseries: [],
      error: null,
      isLoaded: false,
      username: props.username,
      token: props.token
    };
  }

  componentDidMount() {
    const resource = "groups/" + this.state.username;
    const url = Settings.baseAwsUrl + resource;

    const options = {
      headers: {
        "Content-Type": "application/json",
        Authorization: this.state.token
      }
    };

    fetch(url, options)
      .then(res => res.json())
      .then(
        result => {
          //          {
          //              group_name: "Dummy",
          //              group_id: 99,
          //              group_unit: "km"
          //          }

          this.setState({
            isLoaded: true,
            timeseries: result 
          });
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        error => {
          this.setState({
            isLoaded: true,
            error
          }); 
        }
      );
  }

  render() {
    const { error, isLoaded, items, location } = this.state;

    if (error) {
      return <div>Error {error} </div>;
    } else if (this.state.timeseries.length > 0) {
      return (
        <div className="container">
          <div className="row">
            {this.state.timeseries.map(item => (
              <div className="col-md-12 col-lg-4">
                <SingleTimeSerie
                  key={item.group_id}
                  group_id={item.group_id}
                  group_unit={item.group_unit}
                  group_name={item.group_name}
                />
              </div>
            ))}
          </div>
        </div>
      );
    } else {
      return <Row>No time series created</Row>;
    }
  }
}

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
    <div className="container"> 
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
