import React from "react";

import GetComponent from "./GetComponent";
import SetComponent from "./SetComponent";
import SetDialog from "./SetDialog";

import { Row, Col, List, Button, DatePicker, Card, version } from "antd";
import { Button, InputNumber } from "antd";
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
      lastValue: 0,
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

      console.log( this.state.item_to_send  )

      fetch(Settings.baseAwsUrl + this.resource, {

        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify( this.state.item_to_send )
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

  handleChange = value => {
    console.log(value);
    // set state is a automatic setter for this.state

    if (value > this.state.lastValue) {

      let valObj = {
        x : this.state.item_to_send.x,
        y : value
      }


      // const items = this.state.items.push(this.state.last_item);
      let local_items = this.state.items.slice()
      local_items.push( valObj )

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
              lastValue: last_element.y,
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
            lastValue: 0,
            isLoaded: true,
            error
          });
        }
      );
  }

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
      <List bordered style={{ margin: 5 }}>
        <List.Item>
          <h1>
            {this.group_name} <small>[ {this.group_unit} ]</small>
          </h1>
        </List.Item>
        <List.Item>
          <GetComponent
            ref={getComponent => {
              this.getComponent = getComponent;
            }}
            group_unit={this.group_unit}
            group_id={this.group_id}
            group_name={this.group_name}
          />
        </List.Item>
        <List.Item>
          <SetDialog>
            <div className="form-group">
              <label>
                Enter a new value and submit ( at{" "}
                {this.dateob.toLocaleTimeString()} ){" "}
              </label>
              <br />
              <InputNumber
                min={this.state.lastValue}
                defaultValue={3}
                onChange={this.handleChange}
              />
              {button}
              <hr />
              last value : {this.state.lastValue}
              <hr />
              {this.state.item_to_send.x},{this.state.item_to_send.y}
            </div>

            
          </SetDialog>
        </List.Item>
      </List>
    );
  }
}

//  <SetComponent
//             ref={setComponent => {
//               this.setComponent = setComponent;
//             }}
//             addValueFcn={this.handleAddValue}
//             group_unit={this.group_unit}
//             group_id={this.group_id}
//             group_name={this.group_name}
//           />

export default SingleTimeSerie;
