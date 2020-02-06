import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Route,
  Link,
  useLocation
} from "react-router-dom";

import { render } from "react-dom";

import { Layout } from "antd";
import { Row, Col, List, Button, DatePicker, Card, version } from "antd";

import SingleTimeSerie from "./SingleTimeSerie";
import TestComponent from "./TestComponent";

import Settings from "./Settings";
import queryString from "query-string";

import "antd/dist/antd.css";

const { Header, Footer, Sider, Content } = Layout;

// https://jerairrest.github.io/react-chartjs-2/

const fakeResponse = {};
fakeResponse["andre"] = [
  {
    group_name: "Dummy",
    group_id: 99,
    group_unit: "km"
  },
  {
    group_name: "Andres Auto",
    group_id: 2,
    group_unit: "km"
  },
  {
    group_name: "Strom",
    group_id: 1,
    group_unit: "kWh"
  }
];

fakeResponse["irena"] = [
  {
    group_name: "Irenas Auto",
    group_id: 3,
    group_unit: "km"
  }
];

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

    this.resource = "group/1/data";
  }

  componentDidMount() {
    const user = this.state.location.get("user");

    fetch(Settings.baseAwsUrl + this.resource)
      .then(res => res.json())
      .then(
        result => {
          if (fakeResponse[user] === undefined) {
            this.setState({
              isLoaded: true,
              timeseries: []
            });
          } else {
            // TODO get REAL RESPONSE FORM DB
            this.setState({
              isLoaded: true,
              timeseries: fakeResponse[user]
            });
          }
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
            <Col offset={2} span={20}>
              <SingleTimeSerie
                key={item.group_id}
                group_id={item.group_id}
                group_unit={item.group_unit}
                group_name={item.group_name}
              />
            </Col>
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
      <Layout>
          <Header> 
            <Link to="/search?user=andre">Andre</Link> |
            <Link to="/search?user=irena">Irena</Link> |
            <Link to="/test">Test</Link> |
          </Header>
          <Content>
            <Route exact path="/search" component={TimeSeries} />
            <Route exact path="/test" component={TestComponent} />
          </Content>
        <Footer>Footer</Footer>
      </Layout>
        </Router>
    );
  }
}

render(<App />, document.getElementById("root"));
