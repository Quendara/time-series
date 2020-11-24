
import React, { Component, useState, useEffect } from "react";
// import { Row, Col, List, Button, DatePicker, Card, version } from "antd";
import Settings from "./Settings";
import SingleTimeSerie from "./SingleTimeSerie";

import { Grid } from '@material-ui/core';


export const TimeSeries = ({ username, token }) => {


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
              setTimeseries( result );
              // this.setState({
              //   isLoaded: true,
              //   timeseries: result
              // });
            },
            // Note: it's important to handle errors here
            // instead of a catch() block so that we don't swallow
            // exceptions from actual bugs in components.
            error => setError(error)
          );
      }

    }, [token]
  )
  
  return (
    <>
    <Grid container spacing={ 4 } >

      {timeseries.length == 0 && <>
        <Grid  item xs={ 12 } lg={ 4 }>
          Loading
        </Grid>
      </>}


    { timeseries.map((item, index) => (

      <Grid key={ index } item xs={ 12 } lg={ 4 }>
        <SingleTimeSerie
          key={ item.group_id }
          group_id={ item.group_id }
          group_unit={ item.group_unit }
          group_name={ item.group_name }
        />
      </Grid>
    )) }
  </Grid>
  </>

  )
    // const { error, isLoaded, items, location } = this.state;

  //   if (error) {
  //     return <div>Error { error } </div>;
  //   } else if ( timeseries.length > 0) {
  //     return (
       
  //     );
  //   } else {
  //     return <Grid >No time series created</Grid>;
  //   }
  // }
}



// class TimeSeries extends React.Component {
//   constructor(props) {
//     super(props);
//     this.props = props;

//     console.log(props);

//     this.state = {
//       timeseries: [],
//       error: null,
//       isLoaded: false,
//       username: props.username,
//       token: props.token
//     };
//   }

//   componentDidMount() {
//     const resource = "groups/" + this.state.username;
//     const url = Settings.baseAwsUrl + resource;

//     const options = {
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: this.state.token
//       }
//     };

//     fetch(url, options)
//       .then(res => res.json())
//       .then(
//         result => {
//           this.setState({
//             isLoaded: true,
//             timeseries: result 
//           });
//         },
//         // Note: it's important to handle errors here
//         // instead of a catch() block so that we don't swallow
//         // exceptions from actual bugs in components.
//         error => {
//           this.setState({
//             isLoaded: true,
//             error
//           }); 
//         }
//       );
//   }

//   render() {
//     const { error, isLoaded, items, location } = this.state;

//     if (error) {
//       return <div>Error {error} </div>;
//     } else if (this.state.timeseries.length > 0) {
//       return (
//         <Grid container spacing={4} >
//             {this.state.timeseries.map((item, index) => (

//                 <Grid key={index} item xs={12} lg={4}>                  
//                 <SingleTimeSerie
//                   key={item.group_id}
//                   group_id={item.group_id}
//                   group_unit={item.group_unit}
//                   group_name={item.group_name}
//                 />
//               </Grid>
//             ))}
//           </Grid>
//       );
//     } else {
//       return <Grid >No time series created</Grid>;
//     }
//   }
// }

export default TimeSeries;