import React from "react";
import { Scatter } from "react-chartjs-2";

import "./Style.css"

class GetComponent extends React.Component {
  constructor(props) {
    super(props);

    this.group_unit = props.group_unit;
    this.group_id = props.group_id;

    this.state = {
      error: null,
      isLoaded: false,
      // items: []
    };

    this.data = {};
    this.options = {};
  }

  setValues(items) {

    if( items == null || !Array.isArray( items ) )
    {
      console.error( "Array expected, got" )
      console.error( items )
      return
    }
   

    const timedate = items.map(dataField => {
      return { x: new Date(dataField.x * 1000), y: +dataField.y };
    });

    this.data = {
      datasets: [
        {
          label: this.group_unit,
          type: "line",
          fill: false,
          backgroundColor: "rgba(75,192,192,0.4)",
          pointBorderColor: "rgba(75,192,192,1)",
          pointBackgroundColor: "#fff",
          pointBorderWidth: 5,
          pointHoverRadius: 7,
          pointHoverBackgroundColor: "rgba(75,192,192,1)",
          pointHoverBorderColor: "rgba(220,220,220,1)",
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: timedate
        }
      ]
    };

    this.options = {
      // aspectRatio:5,
      maintainAspectRatio: false,
      scales: {
        xAxes: [
          {
            type: "time",
            time: {
              unit: "month"
            }
          }
        ]
      }
    };

    console.log("GetComponent.setValues");
    console.log(this.state.items);
     this.setState({
      isLoaded: true,
      // items: items
    });

    this.forceUpdate();
  }

  render() {
    console.log("GetComponent.renders");

    const { error, isLoaded, items } = this.state;

    if (error) {
      return <div>Error {error} </div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      // console.log( items )
      // plot( items )
      return ( 
        <div className="chart-container" >
        <Scatter data={this.data} options={this.options} /> 
        </div> );
    }
  }
}

export default GetComponent;
