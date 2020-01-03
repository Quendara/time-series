import React from 'react';
import { Scatter } from "react-chartjs-2";


class GetComponent extends React.Component {
  constructor(props) {
    super(props);

    this.group_unit = props.group_unit;
    this.group_id = props.group_id;

    this.state = {
      error: null,
      isLoaded: false,
      items: []
    };
  }

  setValues(items) {
    this.setState({
      isLoaded: true,
      items: items
    });

    console.log("GetComponent.setValues");
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
        <LineGraph
          group_unit={this.group_unit}
          group_id={this.group_id}
          group_data={items}
        />
      );
    }
  }
}

class LineGraph extends React.Component {
  constructor(props) {
    // this.data = props.group_data

    const timedate = props.group_data.map(dataField => {
      return { x: new Date(dataField.x * 1000), y: +dataField.y };
    });

    this.data = {
      datasets: [
        {
          label: "My First dataset",
          type: "line",
          fill: false,
          backgroundColor: "rgba(75,192,192,0.4)",
          pointBorderColor: "rgba(75,192,192,1)",
          pointBackgroundColor: "#fff",
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: "rgba(75,192,192,1)",
          pointHoverBorderColor: "rgba(220,220,220,1)",
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: timedate
        }
      ]
    };
  }
  render() {
    return (
      <Scatter
        data={this.data}
        options={{
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
        }}
      />
    );
  }

  componentDidMount() {}
}

export default GetComponent;