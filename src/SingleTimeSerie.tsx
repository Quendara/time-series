import React, { useState, useEffect } from "react";

// import SetComponent from "./SetComponent";
// import SetDialog from "./SetDialog";

// import { Row, Col, List, Button, DatePicker, Card, version } from "antd";
import { Button, CardContent, Typography, TextField, Grid, Divider } from '@mui/material';

import { MyCard, MyDivider } from "./components/StyledComponents"
import { LineChart, ValueType } from "./components/LineChart";
import { DashboardNumber } from "./components/DashboardNumber"
import { SelectionView } from "./components/SelectionView"

// import { InputNumber } from "antd";
import Settings from "./Settings";
import {addLeadingZeros} from "./components/helpers";
import { MyIcon } from "./components/MyIcon";


// class SingleTimeSerie extends React.Component {

interface Props {
  group_name: string;
  group_id: string;
  group_unit: string;
}

interface ValueToSendType {
  x: number;
  y: number;  
}

const SingleTimeSerie = ({ group_name, group_id, group_unit } : Props) => {

  const [lastValue, setLastValue] = useState<ValueType>({ x: new Date(), y: 0  })
  const [itemToSend, setItemToSend] = useState<ValueToSendType | undefined>(undefined)

  const [renderMode, setRenderMode] = useState("simple")

  const [fetchedItems, setFetchedItems] = useState<ValueType[]>([])
  const [localItems, setLocalItems] = useState<any>(undefined)

  const [submitted, setSubmitted] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState(false)
  const [dataValid, setDataValid] = useState(false)

  const [edit, setEdit] = useState(false)



  const mySubmitHandler = ( event : any )  => {
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

  const handleKeyPress = (event : any ) => {
    console.log(event.key);
  }

  const handleChange = ( event : any ) => {

    const value = +event.target.value

    console.log(event.target.value);
    
    if (value > lastValue.y) {

      const dateob = new Date();
      let valObj : ValueType = {
        // x: dateob, // dateob.getTime() / 1000 , // Math.round( dateob.getTime() / 1000 ),
        x: dateob,
        y: value
      };

      // add elemet to line / graph 
      let local_items = fetchedItems.slice();
      local_items.push(valObj);


      let item_2_send : ValueToSendType = {
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

          const timedata = result.map( ( dataField : any ) => {
            const value : ValueType = { x: new Date( dataField.x * 1000) , y: +dataField.y }
            return value;
          });

          setFetchedItems(timedata)
          setLocalItems(timedata)
          setIsLoaded(result)

          if (result.length > 0) {
            const last_element : ValueType = timedata[timedata.length - 1];
            setLastValue( last_element )
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



  const formatDate = ( d : Date ) => {

    try{
      let ret = "" + d.getFullYear();
      ret += "-" + addLeadingZeros( d.getMonth() + 1, 2) ;
      ret += "-" + addLeadingZeros( d.getDate() , 2);
  
      return ret;  
    }
    catch( e ){
      return e;
    }
    
  }

  const getButton = () => {
    let button;

    if (!submitted) {
      if (dataValid) {
        button = (
          (<Button variant="contained" color="primary" onClick={ mySubmitHandler }>
            <MyIcon icon="add" />
          </Button>
          )
        );
      } else {
        button = (
          <Button variant="contained" disabled>
            <MyIcon icon="add" />
          </Button>
        );
      }
    } else {
      // submitted
      if (!error) {
        button = (
          <Button variant="contained" disabled>
            <MyIcon icon="check" />
          </Button>
        );
      } else {
        button = (
          <Button variant="contained" disabled>
            Error..
          </Button>
        );
      }
    }

    return button
  }

  const helperText = (lastValue : ValueType) => {
    return "last value was " + lastValue.y + " from " + formatDate(lastValue.x)
  }


  return (
    <MyCard>
      <CardContent>
        <Typography variant="h5" component="h2">
          { group_name } - <small>[ { group_unit } ]</small>
        </Typography>
        <MyDivider></MyDivider>

        <SelectionView  currentValue={ renderMode } iconsOnly={ false } valueArr={ ['simple', 'year', 'compare'] } callback={ setRenderMode } ></SelectionView>
      </CardContent>
      <CardContent>

        <LineChart
          values={ localItems }
          render={renderMode}
          group_unit={ group_unit }
          group_id={ group_id }
          
        />
      </CardContent>
      <CardContent>
        <Grid item container
          spacing={ 2 } >

          { edit ? (
            <>
              <Grid item xs={ 9 }>
                <TextField
                  variant="outlined"
                  id="standard-basic"
                  fullWidth
                  label="New Value"
                  defaultValue={ lastValue.y }
                  onChange={ handleChange }
                  helperText={ helperText(lastValue) }
                />
              </Grid>
              <Grid item xs={ 1 }>
                { getButton() }
              </Grid>
            </>
          ) :
            (
              <>
                <DashboardNumber value={ lastValue.y } unit={ group_unit } info={ "latest value from " + formatDate(lastValue.x) } />
                <Grid item xs={ 1 }>
                  <Button onClick={ () => setEdit(true) }><MyIcon icon="edit" /></Button>
                </Grid>
              </>
            )
          }


        </Grid>

      </CardContent>
    </MyCard>

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
