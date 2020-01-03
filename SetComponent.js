import React from 'react';
import { Button, InputNumber } from "antd";

import Settings from "./Settings";

class SetComponent extends React.Component {
  constructor(props) {
    super(props);

    this.group_name = props.group_name;
    this.unit = props.group_unit;
    this.group_id = props.group_id;
    this.dateob = new Date();

    this.addValueCallback = props.addValueFcn;

    this.state = {
      lastValue: 0,
      y: "", 
      x: "" + Math.round(this.dateob.getTime() / 1000),
      dataValid: false,
      submitted: false,
      errorFlag: false
    };
  }

  setLastValue(val) {
    this.setState({ lastValue: val });
  }

  mySubmitHandler = event => {

    console.log("mySubmitHandler");
    console.log(this.state);
    // event.preventDefault();

    

    // check if submitting is allowed
    if (this.state.dataValid && !this.state.submitted) {
      console.log("Submitting... ");

      this.setState({ dataValid: false, submitted: true }); // disable button while submitting
      this.resource = "group/" + this.group_id + "/data";

      fetch( Settings.baseAwsUrl + this.resource, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(this.state)
      }).then(
        result => {
          this.setState({ submitted: true });
        },
        error => {
          this.setState({
            errorFlag: true,
            error
          });
          console.error(error);
        }
      );
    } else {
      console.log("Submit not allowed yet.!");
    }

    // this.setState( { submitted:true } )
  };

  myChangeHandler = value => {
    console.log(value);
    // set state is a automatic setter for this.state

    if ( value > this.state.lastValue) {
      this.setState({ y: value, dataValid: true });
      this.addValueCallback({
        x: this.state.x,
        y: value
      });
    } else {
      // cannot submit invalid data
      this.setState({ y: value, dataValid: false });
    }
  };

  render() {
    let button;

    if (!this.state.submitted) {
      if (this.state.dataValid) {
        button = <Button type="primary" onClick={this.mySubmitHandler} >Submit</Button>;
      } else {
        button = (
          <Button type="primary"  disabled>
            Submit
          </Button>
        );
      }
    } else {
      // submitted
      if (!this.state.error) {
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
  

    return (
      <div className="container">
        
          <div className="form-group">
            <label>
              Enter a new value and submit ( at{" "}
              {this.dateob.toLocaleTimeString()} ){" "}
            </label>
            <br/>
            <InputNumber
              min={this.state.lastValue}              
              defaultValue={3}
              onChange={this.myChangeHandler}
            /> {button} <hr/>

            last value : {this.state.lastValue}
          </div>

          
        
      </div>
    );
  }
}

export default SetComponent;