
import React from "react";

import { makeStyles, styled  } from '@material-ui/core/styles';
import { Card, Grid } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';

export const MyCard = styled(Card)({
    // background: 'linear-gradient(45deg, #102027 30%, #263238 90%)',
    background: '#263238',
    border: 0,
    borderRadius: 10,        
    
  });

  export const MyGridSpace = styled(Grid)({
    // background: 'linear-gradient(45deg, #102027 30%, #263238 90%)',
    paddingTop: '20px'
  });

