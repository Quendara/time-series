import React from "react";

import GetComponent from "./GetComponent";
import SetComponent from "./SetComponent";

import SetDialog from "./SetDialog";

// import { Row, Col, List, Button, DatePicker, Card, version } from "antd";
import { Button } from '@material-ui/core';
import { Card, CardContent, Typography, TextField } from '@material-ui/core';

// import { InputNumber } from "antd";
import Settings from "./Settings";

class SingleTimeSerie extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.mySubmitHandler = this.mySubmitHandler.bind(this);

    this.group_name = props.group_name;
    this.group_id = props.group_id;
    this.group_unit = props.group_unit;
    this.dateob = new Date();

    this.resource = "group/" + props.group_id + "/data";

    this.state = {
      error: null,
      isLoaded: false,
      group_unit: props.group_unit,
      items: [],
      last_item: {},
      lastValue: { x: 0, y: 0 },
      item_to_send: {
        x: "" + Math.round(this.dateob.getTime() / 1000),
        y: 0
      }
    };

    // Bind the this context to the handler function
    // this.handleAddValue = this.handleAddValue.bind(this);
    // this.handleChange = this.handleChange.bind(this);
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

      console.log(this.state.item_to_send);

      fetch(Settings.baseAwsUrl + this.resource, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(this.state.item_to_send)
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

  handleKeyPress = (event) => {
    console.log(event.key);    
  }

  handleChange = event => {

    const value = +event.target.value

    console.log(event.target.value);    
    // set state is a automatic setter for this.state

    if (value > this.state.lastValue.y) {
      let valObj = {
        x: this.state.item_to_send.x,
        y: value
      };

      // const items = this.state.items.push(this.state.last_item);
      let local_items = this.state.items.slice();
      local_items.push(valObj);

      this.getComponent.setValues(local_items);

      this.setState({ item_to_send: valObj, dataValid: true });

      // this.addValueCallback({
      //   x: this.state.x,
      //   y: value
      // });
    } else {
      // cannot submit invalid data
      this.setState({ y: value, dataValid: false });
    }
  };

  componentDidMount() {
    fetch(Settings.baseAwsUrl + this.resource)
      .then(res => res.json())
      .then(
        result => {
          this.setState({
            isLoaded: true,
            items: result
          });

          if (result.length > 0) {
            var last_element = result[result.length - 1];

            this.setState({
              lastValue: last_element,
              isLoaded: true
            });

            // this.setComponent.setLastValue();
            this.getComponent.setValues(result);
          }
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        error => {
          this.setState({
            lastValue: { x: 0, y: 0 },
            isLoaded: true,
            error
          });
        }
      );
  }

  formatDate(x) {
    const d = new Date(x * 1000);
    let ret = "" + d.getFullYear();
    ret += "-" + (+d.getMonth() + 1);
    ret += "-" + d.getDate();

    return ret;
  }

  render() {
    let button;

    if (!this.state.submitted) {
      if (this.state.dataValid) {
        button = (
          <Button variant="contained" color="primary" onClick={ this.mySubmitHandler }>
            Submit
          </Button>
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
      <Card>
          <CardContent>
            <Typography variant="h5" component="h2">
              { this.group_name } - <small>[ { this.group_unit } ]</small>
            </Typography>
          </CardContent>
          <CardContent>
            <GetComponent
              ref={ getComponent => {
                this.getComponent = getComponent;
              } }
              group_unit={ this.group_unit }
              group_id={ this.group_id }
              group_name={ this.group_name }
            />
          </CardContent>


          <CardContent>
            <SetDialog>
              <div className="form-group">
                {/* <InputNumber
                  min={ this.state.lastValue.y }
                  defaultValue={ 3 }
                  onChange={ this.handleChange }
                /> */}
                <TextField id="standard-basic" label="Value" defaultValue={ this.state.lastValue.y } onKeyPress={this.handleKeyPress} onChange={this.handleChange} />
                { button } <br />
                last value : <b> { this.state.lastValue.y } </b> from { this.formatDate(this.state.lastValue.x) } <br /><br />
              </div>
            </SetDialog>
          </CardContent>
      </Card>

    );
    //
  }
}

// <label>
//   New value ( at {this.dateob.toLocaleTimeString()} )
//   {" : "}
//   {this.state.item_to_send.y}
// </label>

//       <CardContent>
// <SetComponent
//           lastValue={this.state.lastValue}
//           submitted={false}
//           onChange={this.handleChange}
//           onSubmit={this.mySubmitHandler}

//         />    

//       </li>    

export default SingleTimeSerie;
