
import React, { Component, useState, useEffect } from "react";
// import { Row, Col, List, Button, DatePicker, Card, version } from "antd";
import Settings from "../Settings";
import SingleTimeSerie from "../SingleTimeSerie";

import { Grid, List, ListItem, Hidden, Box } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';

import { MyCard, MyPaperHeader } from "../components/StyledComponents"
import { Navigation } from "../organisms/navigation"
import { useStyles } from "../Styles"




export const TimeSeries = ({ username, token }) => {

  const classes = useStyles();

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

    <Grid container spacing={ 4 } >

      <Hidden mdDown>
        <Grid item lg="2" elevation={ 3 } >
          <Grid item className={ classes.navigation } >
            {/* <Navigation list={ timeseries } anchor="group_id" name="group_name" /> */}
          </Grid>
        </Grid>
      </Hidden>

      <Grid item lg="10" xs={ 12 } >
        <Grid container spacing={ 4 } >
          { timeseries.length == 0 && <>
            <Grid item xs={ 12 } lg={ 4 }>
              <MyCard>
                <MyPaperHeader >
                  <List>
                    <Grid container justify="center" alignItems="center" spacing={ 4 }>
                      <Grid item><CircularProgress /></Grid>
                      <Grid item><Box component="span" m={ 1 }> Loading ... </Box></Grid>
                    </Grid>
                  </List>
                </MyPaperHeader>
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