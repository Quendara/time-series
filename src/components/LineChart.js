import React from "react";
import { Scatter } from "react-chartjs-2";
import { groupBy } from "underscore";
import { Divider, Grid } from '@material-ui/core';

import { DashboardNumber } from "./DashboardNumber"
// import {numberWithCommas} from "./helpers"
// import { Dashboard } from "@material-ui/icons";

export const LineChart = ({ group_unit, group_id, values, render = "simple" }) => {

  let avgDay = 0;
  let avgMonth = 0;
  let avgYear = 0;

  const data = {
    datasets: []
  }

  const fontColor = '#b0bec5'
  const gridColor = '#102027'

  const options = {
    // aspectRatio:5,
    maintainAspectRatio: false,
    legend: {
      labels: {
        // This more specific font property overrides the global property
        fontColor: fontColor
      }
    },
    scales: {
      xAxes: [
        {
          type: "time",
          time: {
            unit: "month"
          },
          ticks: {
            fontColor: fontColor,
          },
          gridLines: {
            display: true,
            color: gridColor,

          },
        }
      ],
      yAxes: [
        {
          gridLines: {
            display: true,
            color: gridColor
          },
          ticks: {
            fontColor: fontColor,
          }
        }
      ]
    }
  };



  const calAvg = (timedate) => {

    if (timedate === undefined) {
      return 2
    }

    if (timedate.length === 0) {
      return 0
    }


    const startDate = timedate[0];
    const endDate = timedate[timedate.length - 1];

    var one_day = 1000 * 60 * 60 * 24;

    const days = (endDate.x.getTime() - startDate.x.getTime()) / one_day;
    const usage = endDate.y - startDate.y;
    const perDay = usage / days;

    avgDay = Math.round(perDay);
    avgMonth = Math.round(perDay * 30);
    avgYear = Math.round(perDay * 365);
    return avgDay;
  }

  const splitDataInYears = (timedate) => {
    // const year = timedate[0].x.getFullYear();

    let groupsArr = groupBy(timedate, function (date) {
      return date.x.getFullYear();
    });

    console.log("splitDataInYears", groupsArr);
    return groupsArr;
  }

  const getDatasets = (items) => {
    if (items == null || !Array.isArray(items)) {
      console.error("Array expected, got (" + group_id + ") : ");
      console.error(items);
      return undefined;
    }

    const timedate = items
    // calAvg(timedate);


    const color01 = "rgba(153, 102, 255, ";
    const color02 = "rgba(54, 162, 235, ";

    if (render === "simple") {
      const avgLine = [];
      avgLine.push(timedate[0]);
      avgLine.push(timedate[timedate.length - 1]);

      data.datasets = [
        {
          label: group_unit,
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
    } else {

      const dataInGroups = splitDataInYears(timedate);
      data.datasets = [];

      const firstvalue = timedate[0];
      const firstyear = firstvalue.x.getFullYear();
      const secondsperyear = 31536000000

      for (var key in dataInGroups) {

        let localtimedate = dataInGroups[key];

        if (localtimedate == null || !Array.isArray(localtimedate)) {
          console.error("Array expected, got (" + group_id + ") : ");
          console.error("Array expected, got (" + key + ") : ");
          console.error(items);
          continue
        }

        const firstyearLocal = localtimedate[0].x.getFullYear();
        const delta = firstyearLocal - firstyear

        if (render === "compare") {
          // firstyear

          // const timedata = result.map(dataField => {
          //   return { x: new Date(dataField.x * 1000), y: +dataField.y };
          // });          

          localtimedate = localtimedate.map((item, index) => 
          {
            // let newObject = Object.assign({}, item)

            const newX = item.x.getTime() - (delta * secondsperyear)
            // console.log( "Print X, N", item.x, new Date(newX) )
            return { x: new Date(newX), y: +item.y };
          })
        }

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
    }

    return data
  }

  return (
    <>
      <div className="chart-container" style={ { "height": "35vh" } }>
        { data.datasets.length === undefined ? (<h1>No Data</h1>) :
          (<Scatter data={ getDatasets(values) } options={ options } />) }
      </div>
      <br />
      <Divider variant="middle" />

      <Grid container spacing={ 3 } justify="space-between" alignItems="flex-start" >
        <DashboardNumber value={ calAvg(values) } unit={ group_unit } info=" per day" />
        <DashboardNumber value={ avgMonth } unit={ group_unit } info=" per month" />
        <DashboardNumber value={ avgYear } unit={ group_unit } info=" per year" />
      </Grid>

    </>
  )
}

