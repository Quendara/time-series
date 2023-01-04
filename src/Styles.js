import React, { Component, useState } from "react";

import { ThemeProvider, createTheme } from '@mui/material/styles';
import { createStyles, makeStyles } from '@material-ui/core/styles';

import { purple, lightGreen, pink, lightBlue, red, green } from '@material-ui/core/colors/';


// export const theme = createTheme({
//   palette: {
//     type: "dark",
//     primary: lightBlue,
//     secondary: pink,
//     danger: red
//   }
// });

export const theme = createTheme({
  palette: {
    mode: 'dark',
  },
});

export const useStyles = makeStyles( (theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    horizontalSnapContainer: {

      "scrollSnapType": "x mandatory",
      "overflowX": "scroll",
      "display": "flex",
      "marginLeft":"5px"

    },
    horizontalSnapItem: {
      "min-width": "340px",
      "float": "left",
      "marginRight": "10px",
      
      "scrollSnapAlign": "start"
    }, 
    paper: {
      // paddingTop: 50,
      // opacity: 0.5,
      // backgroundImage: "https://s3.eu-central-1.amazonaws.com/quendara.de/background/Grafitti-Stonewall-2.jpg"
    },
    navigation: {
      position: "fixed",
    },
    navigationOuter: {
      position: "relative",
      maxWidth: "100%",
    },
    navigationInner: {
      position: "relative",
      width: "700px",
      minHeight: "700px",
      maxHeight: "900px",
      overflowY: "auto",
    },
    menuButton: {
      flexGrow: 1,
      color: "#FFFFFF",
      textDecoration: "none"
    },
    title: {
      flexGrow: 2,
      color: "#FFFFFF",
      textDecoration: "none"
    },
    selected: {
      color: "#FFFF00",
    },
    appBar: {
      //top: 'auto',
      //bottom: 0,
    },
    chiplist: {
      display: 'flex',
      justifyContent: 'left',
      flexWrap: 'wrap',
      '& > *': {
        margin: theme.spacing(0.5),
      },
    },
    green: {
      color: '#fff',
      backgroundColor: green[500],
    },
    today: {
      color: green[500],
      // backgroundColor: green[500],
    },
    weekend: {
      color: red[500],
      // backgroundColor: green[500],
    },

  }),
);
