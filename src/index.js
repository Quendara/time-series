"use strict";

import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Route,
  Link,
  useLocation
} from "react-router-dom";

// /search?user=andre

import { render } from "react-dom";

import { Layout } from "antd";
import { Row, Col, List, Button, DatePicker, Card, version } from "antd";

import SingleTimeSerie from "./SingleTimeSerie";


import Settings from "./Settings";
import queryString from "query-string";

import "antd/dist/antd.css";

const { Header, Footer, Sider, Content } = Layout;

// A custom hook that builds on useLocation to parse
// the query string for you.
function useQuery() {
  return;
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
        <Row>
          {this.state.timeseries.map(item => (
            <SingleTimeSerie
              key={item.group_id}
              group_id={item.group_id}
              group_unit={item.group_unit}
              group_name={item.group_name}
            />
          ))}
        </Row>
      );
    } else {
      return <Row>No time series created</Row>;
    }
  }
}

class App extends React.Component {
  render() {
    return (
      <Router>
            <Route exact path="/search" component={TimeSeries} />
      </Router>
    );
  }
}

render(<App />, document.getElementById("root"));
