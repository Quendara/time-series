// import React, { Component, useState } from "react";
// // import { Row, Col, List, Button, DatePicker, Card, version } from "antd";
// import { Button } from '@material-ui/core';

// const SetComponent = ({ lastValue, submitted, onChange, onSubmit }) => {
//   const [valid, setValid] = useState(false);

//   const formatDate = x => {
//     const d = new Date(x * 1000);
//     const ret = "" + d.getFullYear();
//     ret += "-" + (+d.getMonth() + 1);
//     ret += "-" + d.getDay();

//     return ret;
//   };

//   const getButton = () => {
//     let button = "";
//     if (!submitted) {
//       if (valid) {
//         button = (
//           <Button type="primary" onClick={this.mySubmitHandler}>
//             Submit
//           </Button>
//         );
//       } else {
//         button = (
//           <Button type="primary" disabled>
//             Submit
//           </Button>
//         );
//       }
//     } else {
//       // submitted
//       // if (!this.state.error) {
//       button = (
//         <Button type="dashed" disabled>
//           Ok
//         </Button>
//       );
//     }
//     return button;
//   };

//   return (
//     <>
//       {getButton()}
//       last value : {formatDate(lastValue.x)},{lastValue.y}
//     </>
//   );
// };

// export default SetComponent;
