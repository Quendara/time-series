import React from "react";

import { makeStyles, styled } from '@material-ui/core/styles';
import { Card, Grid, Typography, ListItem } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import { purple, lightGreen, pink, lightBlue, red } from '@material-ui/core/colors/';

export const MyCard = styled(Card)({
  // background: 'linear-gradient(45deg, #102027 30%, #263238 90%)',
  background: '#263238',
  border: 0,
  borderRadius: 10,
});

export const TypographyDisabled = styled(Typography)({
  color: "#AAA",
});

export const DashboardValue = styled(Typography)({
  fontSize:"2em",
  fontWeight:"10",
  color: "#FFF",
  fontWeight: "100"
});

export const DashboardInfo = styled(Typography)({
  fontSize:"0.9em",
  fontWeight:"10",
  color: "#AAA",
  fontWeight: "100"
});

export const TypographyEnabled = styled(Typography)({

  color: "#FFF",
  fontWeight: "100"

});

export const MyListItemHeader = styled(ListItem)({
  background: '#102027',
  color: lightBlue[200],  
  fontSize:"1em",
  fontWeight:"10",
  letterSpacing:"0.2em",
  //#paddingTop:"0px"

});


