
import React, { Component, useState, useEffect } from "react";
// import { Row, Col, List, Button, DatePicker, Card, version } from "antd";
import Settings from "./Settings";
import SingleTimeSerie from "./SingleTimeSerie";

import { Grid } from '@material-ui/core';


export const TimeSeries = ({ username, token }) => {

  const [timeseries, setTimeseries] = useState([]);
  const [error, setError] = useState("");

  useEffect(
    () => {
      if (token) {
        const resource = "groups/" + username;
        const url = Settings.baseAwsUrl + resource;

        const options = {
          headers: {
            "Content-Type": "application/json",
            Authorization: token
          }
        };

        fetch(url, options)
          .then(res => res.json())
          .then(
            result => {
              setTimeseries(result);
            },
            error => setError(error)
          );
      }

    }, [token]
  )

  return (
    <>
      <Grid container spacing={ 4 } >

        { timeseries.length == 0 && <>
          <Grid item xs={ 12 } lg={ 4 }>
            Loading
        </Grid>
        </> }


        { timeseries.map((item, index) => (

          <Grid key={ index } item xs={ 12 } lg={ 4 }>
            <SingleTimeSerie
              key={ item.group_id }
              group_id={ item.group_id }
              group_unit={ item.group_unit }
              group_name={ item.group_name }
            />
          </Grid>
        )) }
      </Grid>
    </>
  )
}

export default TimeSeries;