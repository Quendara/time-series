
// import { styled } from '@material-ui/core/styles';
import { styled } from '@mui/system';
import { Card, CardHeader, Typography, ListItem, TextareaAutosize, Divider, Paper, Box, Dialog, DialogContent } from '@mui/material';
import { lightBlue } from '@mui/material/colors/';

export const MyCard = styled(Card)({
  // background: 'linear-gradient(45deg, #102027 30%, #263238 90%)',
  background: '#263238',
  // border: 0,
  borderRadius: 10,
});

export const MyCard2 = styled(Card)({
  background: 'linear-gradient(45deg, #102027 3%, #2F3E45 90%)',
  // background: '#2F3E45',
  // border: 0,
  borderRadius: 10,
});

export const MyDialogContentBlur = styled(DialogContent)({
  background: 'linear-gradient(45deg, #102027 3%, #2F3E45 90%)',
  // background: '#2F3E45',
  // border: 0,
  borderRadius: 0,
});

export const MyCardBlur = styled(Box)({
  backdropFilter: 'blur(10px);',
  // background: '#2F3E45',
  // border: 0,
  borderRadius: 0,
});

export const MyDivider = styled(Divider)({
  "marginTop": "10px",
  "marginBottom": "10px",
});


export const MyPaperHeader = styled(Paper)({
  // background: '#102027',
});

export const MySubCardHeader = styled(CardHeader)({
  background: '#014040',
  textOverflow: "ellipsis",  
  overflow: "hidden",
  whiteSpace: "nowrap"
});

export const MyCardHeaderAlt = styled(CardHeader)({
  background: '#02735E',
  textOverflow: "ellipsis",  
  overflow: "hidden",
  whiteSpace: "nowrap"
});

export const MyCardHeader = styled(CardHeader)({
  color:"#FFF",
  background: '#102027',
  textOverflow: "ellipsis",  
  overflow: "hidden",
  whiteSpace: "nowrap"
});

export const TypographyDisabled = styled(Typography)({
  color: "#AAA",});

export const TypographyEnabled = styled(Typography)({
  color: "#FFF",  
});


export const DashboardValue = styled(Typography)({
  fontSize:"1.9em",
  fontWeight:"10",
  color: "#FFF"
});

export const DashboardInfo = styled(Typography)({
  fontSize:"0.9em",
  fontWeight:"10",
  color: "#AAA"
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
  height:"52vh",
  // whiteSpace: "nowrap"
  
  // letterSpacing:"0.2em",
  //#paddingTop:"0px"

}); 

export  const MyTextareaRead = styled(Typography)({
  fontFamily:"monospace",
  whiteSpace:"pre-line"
});



