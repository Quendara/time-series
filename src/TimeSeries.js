
import React, { Component, useState } from "react";
import { Row, Col, List, Button, DatePicker, Card, version } from "antd";
import Settings from "./Settings";
import SingleTimeSerie from "./SingleTimeSerie";

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
          <div className="row">
            {this.state.timeseries.map(item => (
              <div className="col-md-12 col-lg-2">
                <SingleTimeSerie
                  key={item.group_id}
                  group_id={item.group_id}
                  group_unit={item.group_unit}
                  group_name={item.group_name}
                />
              </div>
            ))}
          </div>
      );
    } else {
      return <Row>No time series created</Row>;
    }
  }
}

export default TimeSeries;