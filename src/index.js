import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Route,
  Link,
  useLocation
} from "react-router-dom";

import { render } from "react-dom";

import { Row, Col, List, Button, DatePicker, Card, version } from "antd";

import GetComponent from "./GetComponent";
import SetComponent from "./SetComponent";

import Settings from "./Settings";
import queryString from "query-string";

import "antd/dist/antd.css";

// https://jerairrest.github.io/react-chartjs-2/

const fakeResponse = {};
fakeResponse["andre"] = [
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
          <hr />
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

class SingleTimeSerie extends React.Component {
  constructor(props) {
    super(props);

    this.group_name = props.group_name;
    this.group_id = props.group_id;
    this.group_unit = props.group_unit;

    this.resource = "group/" + props.group_id + "/data";

    this.state = {
      error: null,
      isLoaded: false,
      group_unit: props.group_unit,
      items: [],
      last_item: {}
    };

    // Bind the this context to the handler function
    this.handleAddValue = this.handleAddValue.bind(this);
  }

  // gets and object x,y
  handleAddValue(obj) {
    console.log("SingleTimeSerie.handleAddValue");

    console.log(obj);

    this.setState({
      last_item: obj
    });

    const items = this.state.items.push(this.state.last_item);
    this.getComponent.setValues(items);
  }

  componentDidMount() {
    fetch(Settings.baseAwsUrl + this.resource)
      .then(res => res.json())
      .then(
        result => {
          this.setState({
            isLoaded: true,
            items: result
          });

          if (result.length > 0) {
            var last_element = result[result.length - 1];
            this.setComponent.setLastValue(last_element.y);
            this.getComponent.setValues(result);
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
    return (
      <List bordered style={{ margin: 5 }}>
        <List.Item>
          <h1>
            {this.group_name} <small>[ {this.group_unit} ]</small>
          </h1>
        </List.Item>
        <List.Item>
          <GetComponent
            ref={getComponent => {
              this.getComponent = getComponent;
            }}
            group_unit={this.group_unit}
            group_id={this.group_id}
            group_name={this.group_name}
          />
        </List.Item>
        <List.Item>
          <SetComponent
            ref={setComponent => {
              this.setComponent = setComponent;
            }}
            addValueFcn={this.handleAddValue}
            group_unit={this.group_unit}
            group_id={this.group_id}
            group_name={this.group_name}
          />
          <br />
        </List.Item>
      </List>
    );
  }
}

class CreateDummy extends React.Component {
  constructor(props) {
    super(props);
  }
  render(){
    return <h1> Just a test </h1>

  }
}

class App extends React.Component {
  render() {
    return (
      <Router>
        <Link to="/search?user=andre">Andre</Link> |
        <Link to="/search?user=irena">Irena</Link> |
        <Link to="/test">Test</Link> |

        <hr />
        <Route exact path="/search" component={TimeSeries} />
        <Route exact path="/test" component={CreateDummy} />
      </Router>
    );
  }
}

render(<App />, document.getElementById("root"));