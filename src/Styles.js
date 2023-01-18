import { createTheme } from '@mui/material/styles'; 
 
import { purple, lightGreen, pink, lightBlue, red, green } from '@mui/material/colors/';


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

export const cssClasses = {
     horizontalSnapContainer: {
      "scrollSnapType": "x mandatory",
      "overflowX": "scroll",
      "display": "flex",
      "margin":"5px",

      '&::-webkit-scrollbar': {
        width: "11px",
        height: "11px"
      },
      '&::-webkit-scrollbar-track': {
        background: 'rgba(10, 10, 10, 0.3)'
      },
      "&::-webkit-resizer":{
        background: theme.palette.mode === 'dark' ? 'rgb(22, 11, 11)' : 'rgb(253, 237, 237)',
      },
      '&::-webkit-scrollbar-thumb': {
        width: "0.5px",
        backgroundColor: theme.palette.grey[900],
        borderRadius: "5px"      
      },          

    },
    horizontalSnapItem: {
      "min-width": "340px",
      "float": "left",
      "marginRight": "10px",      
      "marginBottom": "10px",      
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
      marginRight: "30px",
      color: "#FFFFFF",
      textDecoration: "none"
    },
    selected: {
      color: "#FFFF00",
    },
    appBar: {
      backgroundColor: theme.palette.primary.dark,
      
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
    }
  }