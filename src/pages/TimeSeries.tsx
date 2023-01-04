
import React, { useState, useEffect } from "react";

import { Grid, List, Box, CircularProgress } from '@mui/material';

import { MyCard, MyPaperHeader } from "../components/StyledComponents"
import { HorizontallyGrid, HorizontallyItem } from "../components/HorizontallyGrid"

// import { Navigation } from "../organisms/navigation"

import Settings from "../Settings";
import SingleTimeSerie from "../SingleTimeSerie";
import { findUnique, GenericGroup } from "../components/helpers";

interface Props {
  username: string;
  token: string;
}

export const TimeSeries = ({ username, token }: Props) => {

  const [timeseries, setTimeseries] = useState<any[]>([]);
  const [error, setError] = useState("");

  const groups: GenericGroup<any>[] = findUnique(timeseries, "group_category", false)

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

        <Grid container spacing={4} >
          {timeseries.length == 0 ? (<>
            <Grid item xs={12} lg={4}>
              <MyCard>
                <MyPaperHeader >
                  <List>
                    <Grid container justifyContent="center" alignItems="center" spacing={4}>
                      <Grid item><CircularProgress /></Grid>
                      <Grid item><Box component="span" m={1}> Loading ... </Box></Grid>
                    </Grid>
                  </List>
                </MyPaperHeader>
              </MyCard>
            </Grid>
          </>) : (
            <>
              {groups.map((item: GenericGroup<any>, index: number) => (
                  <Grid key={"hg"+index} item xs={12} >
                    <h1>{item.value}</h1>
                    <HorizontallyGrid horizontally={true} >

                      {item.listitems.map((item: any, sindex: number) => (
                        <HorizontallyItem key={"hgi"+index+"_"+sindex}  horizontally={true} >
                          <Grid  id={item.group_id} item xs={12} >

                            <SingleTimeSerie
                              group_id={item.group_id}
                              group_unit={item.group_unit}
                              group_name={item.group_name}
                            />
                          </Grid>
                        </HorizontallyItem>
                      ))}
                    </HorizontallyGrid>
                  </Grid>
              )
              )}
            </>)}

        </Grid>
      

  )
}

export default TimeSeries;