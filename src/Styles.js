import React, { Component, useState } from "react";
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { createMuiTheme } from "@material-ui/core/styles";
import { purple, lightGreen, pink, lightBlue, red, green } from '@material-ui/core/colors/';


export const theme = createMuiTheme({
    palette: {
      type: "dark",
      primary: lightBlue,
      secondary: pink,
      danger: red
    }
  });
  
export const useStyles = makeStyles((theme) =>
    createStyles({
      root: {
        flexGrow: 1,
      },
      paper: {
        // paddingTop: 50,
        // opacity: 0.5,
        // backgroundImage: "https://s3.eu-central-1.amazonaws.com/quendara.de/background/Grafitti-Stonewall-2.jpg"
      },
      menuButton: {
        marginRight: theme.spacing(6),
        color: "#FFFFFF",
        textDecoration: "none"
      },
      navigation: {
        position:"fixed",
      },

      title: {
        flexGrow: 1,
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
      green: {
        color: '#fff',
        backgroundColor: green[500],
      },            
    }),
  );
  