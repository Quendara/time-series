import React, { useState, useEffect } from "react";

import GetComponent from "./GetComponent";
// import SetComponent from "./SetComponent";

import SetDialog from "./SetDialog";

// import { Row, Col, List, Button, DatePicker, Card, version } from "antd";
import { Button } from '@material-ui/core';
import { Card, CardContent, Typography, TextField } from '@material-ui/core';

// import { InputNumber } from "antd";
import Settings from "./Settings";

// class SingleTimeSerie extends React.Component {
const SingleTimeSerie = ({ group_name, group_id, group_unit }) => {

  const [lastValue, setLastValue] = useState({ x: 0, y: 0 })
  const [itemToSend, setItemToSend] = useState(undefined)

  const [fetchedItems, setFetchedItems] = useState(undefined)
  const [localItems, setLocalItems] = useState(undefined)

  const [submitted, setSubmitted] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState(false)
  const [dataValid, setDataValid] = useState(false)



  const mySubmitHandler = event => {
    console.log("mySubmitHandler");
    console.log();

    // event.preventDefault();
    // check if submitting is allowed
    if (dataValid && !submitted) {
      console.log("Submitting... ");

      // this.setState({ dataValid: false, submitted: true }); // disable button while submitting
      let resource = "group/" + group_id + "/data";

      console.log(itemToSend);

      fetch(Settings.baseAwsUrl + resource, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(itemToSend)
      }).then(
        result => {
          setSubmitted(true)
        },
        error => {
          setError(true)
          console.error(error);
        }
      );
    } else {
      console.log("Submit not allowed yet.!");
    }
  };

  const handleKeyPress = (event) => {
    console.log(event.key);
  }

  const handleChange = event => {

    const value = +event.target.value

    console.log(event.target.value);
    if (value > lastValue.y) {

      const dateob = new Date();
      let valObj = {
        x: dateob, // Math.round( dateob.getTime() / 1000 ),
        y: value
      };

      // add elemet to line / graph 
      let local_items = fetchedItems.slice();
      local_items.push(valObj);


      let item_2_send = {
        x: Math.round(dateob.getTime() / 1000),
        y: value
      };

      setLocalItems(local_items)
      setItemToSend(item_2_send)
      setDataValid(true)

    } else {
      // cannot submit invalid data
      // this.setState({ y: value, dataValid: false });
      setItemToSend(undefined)
      setLocalItems(fetchedItems)
      setDataValid(false)
    }
  };

  useEffect(() => {
    myFetchData()
  }, []); // second parameter avoid frequent loading

  const myFetchData = () => {

    const resource = "group/" + group_id + "/data";
    fetch(Settings.baseAwsUrl + resource)
      .then(res => res.json())
      .then(
        result => {

          const timedata = result.map(dataField => {
            return { x: new Date(dataField.x * 1000), y: +dataField.y };
          });

          setFetchedItems(timedata)
          setLocalItems(timedata)
          setIsLoaded(result)

          if (result.length > 0) {
            var last_element = result[result.length - 1];
            setLastValue(result[result.length - 1])
          }
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        error => {
          setError(true)
        }
      );
  }



  const formatDate = (x) => {
    const d = new Date(x * 1000);
    let ret = "" + d.getFullYear();
    ret += "-" + (+d.getMonth() + 1);
    ret += "-" + d.getDate();

    return ret;
  }

  const getButton = () => {
    let button;

    if (!submitted) {
      if (dataValid) {
        button = (
          (<Button variant="contained" color="primary" onClick={ mySubmitHandler }>
            Submit
          </Button>
          )
        );
      } else {
        button = (
          <Button color="primary" disabled>
            Submit
          </Button>
        );
      }
    } else {
      // submitted
      if (!error) {
        button = (
          <Button type="dashed" disabled>
            Ok
          </Button>
        );
      } else {
        button = (
          <Button type="error" disabled>
            Error..
          </Button>
        );
      }
    }

    return button
  }


  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="h2">
          { group_name } - <small>[ { group_unit } ]</small>
        </Typography>
      </CardContent>
      <CardContent>

        <GetComponent
          values={ localItems }
          group_unit={ group_unit }
          group_id={ group_id }
          group_name={ group_name }
        />
      </CardContent>
      <CardContent>
        <TextField variant="outlined" id="standard-basic" label="Value" onChange={ handleChange } />
        { getButton() } <br />
                last value : <b> { lastValue.y } </b> from { formatDate(lastValue.x) } <br /><br />
      </CardContent>
    </Card>

  );
}

// <label>
//   New value ( at {this.dateob.toLocaleTimeString()} )
//   {" : "}
//   {.item_to_send.y}
// </label>

//       <CardContent>
// <SetComponent
//           lastValue={.lastValue}
//           submitted={false}
//           onChange={this.handleChange}
//           onSubmit={this.mySubmitHandler}

//         />    

//       </li>    

export default SingleTimeSerie;
