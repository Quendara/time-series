
import { styled } from '@material-ui/core/styles';
import { Card, CardHeader, Typography, ListItem, TextareaAutosize } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import { lightBlue } from '@material-ui/core/colors/';

export const MyCard = styled(Card)({
  // background: 'linear-gradient(45deg, #102027 30%, #263238 90%)',
  background: '#263238',
  border: 0,
  borderRadius: 10,
});

export const MyPaperHeader = styled(Paper)({
  background: '#102027',
});

export const MyCardHeader = styled(CardHeader)({
  background: '#102027',
});


export const TypographyDisabled = styled(Typography)({
  color: "#AAA",});

export const TypographyEnabled = styled(Typography)({
  color: "#FFF",  
});


export const DashboardValue = styled(Typography)({
  fontSize:"1.9em",
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

export const MyListItemHeader = styled(ListItem)({
  background: '#102027',
  color: lightBlue[200],  
  fontSize:"1em",
  fontWeight:"100",
  letterSpacing:"0.2em",
  //#paddingTop:"0px"
});

export const MyTextareaAutosize = styled(TextareaAutosize)({
  background: '#102027',
  color: lightBlue[200],  
  fontSize:"1em",
  fontWeight:"100",
  width: "100%",
  borderRadius: "5px",
  height:"52vh"
  // letterSpacing:"0.2em",
  //#paddingTop:"0px"

});

export  const MyTextareaRead = styled(Typography)({
  fontFamily:"monospace",
  whiteSpace:"pre-line"
});



