import React from "react";
import { Grid } from '@mui/material';
import { DashboardValue, DashboardInfo } from "./StyledComponents"
import {numberWithCommas} from "./helper"

export const DashboardNumber = ({ value, unit, info }) => {


    const formatValue = ( val ) => {
        if(typeof val === 'number' ) { return numberWithCommas( val )  }
        return val
    }
    return (
      <Grid item xs={4}>
        <DashboardValue>{ formatValue(value) }</DashboardValue>
        <DashboardInfo>{ "[" + unit + "] " + info }</DashboardInfo>      
      </Grid>
    )
  }
  
  
   