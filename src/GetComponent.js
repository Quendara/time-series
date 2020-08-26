import React from "react";
import { Scatter } from "react-chartjs-2";
import { sortBy, groupBy } from "underscore";

const GetComponent = ({ group_unit, group_id, values }) => {
  // constructor(props) {
  //   super(props);

  //   this.group_unit = props.group_unit;
  //   this.group_id = props.group_id;

  //   this.state = {
  //     error: null,
  //     isLoaded: false,
  //     avgDay: 0,
  //     avgMonth: 0,
  //     avgYear: 0
  //     // items: []
  //   };

  //   this.data = {};
  //   this.options = {};
  // }

  let avgDay = 0;
  let avgMonth = 0;
  let avgYear = 0;

  // const datasets = [];

  const data = {
    datasets: []
  }

  const options = {
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

  const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  const calAvg = (timedate) => {

    if( timedate === undefined ){
      return 2
    }


    const startDate = timedate[0];
    const endDate = timedate[timedate.length - 1];

    var one_day = 1000 * 60 * 60 * 24;

    const days = (endDate.x.getTime() - startDate.x.getTime()) / one_day;
    const usage = endDate.y - startDate.y;
    const perDay = usage / days;

    avgDay = Math.round(perDay);
    avgMonth = Math.round(perDay * 30);
    avgYear = numberWithCommas(Math.round(perDay * 365));
    return avgDay;
  }

  const splitDataInYears = (timedate) => {
    const year = timedate[0].x.getFullYear();


    // timedate.map(     )

    let groupsArr = groupBy(timedate, function (date) {
      return date.x.getFullYear();
    });

    console.log("splitDataInYears", groupsArr);
    return groupsArr;
  }

  const getDatasets = (items) => {
    if (items == null || !Array.isArray(items)) {
      console.error("Array expected, got");
      console.error(items);
      return;
    }

    const timedate = items
    // calAvg(timedate);

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
      const dataInGroups = splitDataInYears(timedate);

      data.datasets = [];

      console.log("dataInGroups", dataInGroups)

      for (var key in dataInGroups) {
        // console.log("o." + prop + " = " + obj[prop]);

        const localtimedate = dataInGroups[key];

        console.log("plot", key)
        console.log("localtimedate", localtimedate)

        data.datasets.push({
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

      return data
    }



    // console.log("GetComponent.setValues");
    // console.log(this.state.items);
    // this.setState({
    //   isLoaded: true
    //   // items: items
    // });

    // this.forceUpdate();
  }

  return (
    <>
      <div className="chart-container">
        <div className="chart-container" style={ { "height": "35vh" } }>
          <Scatter data={ getDatasets( values ) } options={ options } />
        </div>
      </div>
      { calAvg( values ) }
      { avgDay + " " + group_unit + " per day" } <br />
      { avgMonth + " " + group_unit + " per month" } <br />
      { avgYear + " " + group_unit + " per year" }
    </>

  )

  // render() {
  //   console.log("GetComponent.renders");

  //   const { error, isLoaded, items } = this.state;

  //   if (error) {
  //     return <div>Error {error} </div>;
  //   } else if (!isLoaded) {
  //     return <div>Loading...</div>;
  //   } else {
  //     // console.log( items )
  //     // plot( items )
  //     return (

  //     );
  //   }
  // }
}

export default GetComponent;

