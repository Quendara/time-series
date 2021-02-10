
import React, { Component, useState, useEffect } from "react";
// import { Row, Col, List, Button, DatePicker, Card, version } from "antd";
import Settings from "../Settings";
import SingleTimeSerie from "../SingleTimeSerie";

import { Grid, List, ListItem, Hidden } from '@material-ui/core';

import { MyCard, MyCardHeader } from "../components/StyledComponents"


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

  // <a href={ "#"+item.group_id } 

  const jumpTo = (anchor) => {
    window.location.href = "#" + anchor;
  }

  return (

    <Grid container spacing={ 4 } >

      <Hidden mdDown>
        <Grid item lg="2" h >
          <MyCard>
            <MyCardHeader >
              <List>

                { timeseries.map((item, index) => (
                  <ListItem button onClick={ () => jumpTo(item.group_id) } key={ item.group_id } >{ item.group_name } </ListItem>
                )) }

              </List>
            </MyCardHeader>
          </MyCard>
        </Grid>
      </Hidden>

      <Grid item lg="10" xs={ 12 } >
        <Grid container spacing={ 4 } >
          { timeseries.length == 0 && <>
            <Grid item xs={ 12 } lg={ 4 }>
              <MyCard>
                <MyCardHeader >
                  <List>
                    <ListItem>Loading</ListItem>
                  </List>
                </MyCardHeader>
              </MyCard>
            </Grid>
          </> }


          { timeseries.map((item, index) => (

            <Grid id={ item.group_id } key={ index } item xs={ 12 } lg={ 4 }>

              <SingleTimeSerie
                key={ item.group_id }
                group_id={ item.group_id }
                group_unit={ item.group_unit }
                group_name={ item.group_name }
              />
            </Grid>
          )) }
        </Grid>
      </Grid>
    </Grid>

  )
}

export default TimeSeries;