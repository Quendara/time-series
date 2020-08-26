import React from "react";
import { Scatter } from "react-chartjs-2";
import { sortBy, groupBy } from "underscore";

class GetComponent extends React.Component {
  constructor(props) {
    super(props);

    this.group_unit = props.group_unit;
    this.group_id = props.group_id;

    this.state = {
      error: null,
      isLoaded: false,
      avgDay: 0,
      avgMonth: 0,
      avgYear: 0
      // items: []
    };

    this.data = {};
    this.options = {};
  }

  numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  calAvg(timedate) {
    const startDate = timedate[0];
    const endDate = timedate[timedate.length - 1];

    var one_day = 1000 * 60 * 60 * 24;

    const days = (endDate.x.getTime() - startDate.x.getTime()) / one_day;
    const usage = endDate.y - startDate.y;
    const perDay = usage / days;

    this.state.avgDay = Math.round(perDay);
    this.state.avgMonth = Math.round(perDay * 30);
    this.state.avgYear = this.numberWithCommas(Math.round(perDay * 365));
  }

  splitDataInYears(timedate) {
    const year = timedate[0].x.getFullYear();

    const datasets = [];

    // timedate.map(     )

    let groupsArr = groupBy(timedate, function(date) {
      return date.x.getFullYear();
    });

    console.log("splitDataInYears", groupsArr);
    return groupsArr;
  }

  setValues(items) {
    if (items == null || !Array.isArray(items)) {
      console.error("Array expected, got");
      console.error(items);
      return;
    }

    const timedate = items.map(dataField => {
      return { x: new Date(dataField.x * 1000), y: +dataField.y };
    });

    this.calAvg(timedate);

    const avgLine = [];
    avgLine.push(timedate[0]);
    avgLine.push(timedate[timedate.length - 1]);

    const color01 = "rgba(153, 102, 255, ";
    const color02 = "rgba(54, 162, 235, ";

    if (false) {
      this.data = {
        datasets: [
          {
            label: this.group_unit,
            type: "line",
            fill: true,
            backgroundColor: color01 + "0.3)",
            pointBorderColor: color01 + "0.7)",
            borderColor: color01 + "0.4)",
            pointBorderWidth: 4,
            pointHoverRadius: 8,
            pointHoverBackgroundColor: color01 + "0.4)",
            pointHoverBorderColor: color01 + "0.4)",
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: timedate
          },
          {
            label: "avg",
            type: "line",
            borderDash: [5, 5],
            backgroundColor: color02 + "0.0)",
            borderColor: color02 + "0.4)",
            borderWidth: 1,
            fill: false,

            data: avgLine
          }
        ]
      };
    } else {
      const dataInGroups = this.splitDataInYears(timedate);

      this.data.datasets = [];

      console.log( "dataInGroups", dataInGroups )

      for (var key in dataInGroups) {
        // console.log("o." + prop + " = " + obj[prop]);

        const localtimedate = dataInGroups[key];

        console.log( "plot", key )
        console.log( "localtimedate", localtimedate )


        this.data.datasets.push({
          label: key,
          type: "line",
          fill: true,
          backgroundColor: color01 + "0.3)",
          pointBorderColor: color01 + "0.7)",
          borderColor: color01 + "0.4)",
          pointBorderWidth: 4,
          pointHoverRadius: 8,
          pointHoverBackgroundColor: color01 + "0.4)",
          pointHoverBorderColor: color01 + "0.4)",
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: localtimedate
        });
      }
    }

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
      isLoaded: true
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
        <>
          <div className="chart-container">
            <div className="chart-container" style={{ "height":"35vh" }}>
              <Scatter data={this.data} options={this.options} />
            </div>
          </div>
          {this.state.avgDay + " " + this.group_unit + " per day"} <br />
          {this.state.avgMonth + " " + this.group_unit + " per month"} <br />
          {this.state.avgYear + " " + this.group_unit + " per year"}
        </>
      );
    }
  }
}

export default GetComponent;

// .chart-container {
//   position: relative;
//   margin: auto;
//   height: 35vh;
//   width: 100%;
// }