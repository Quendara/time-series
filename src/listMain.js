import React, { Component, useState, useEffect } from "react";
import { render } from "react-dom";
import { ListQ } from "./list";
import { findUnique } from "./helper";


import { MyCard } from "./StyledComponents"

import { Tab, Tabs, Card, Paper } from '@material-ui/core';

import Settings from "./Settings";



export const ListMain = ({ token }) => {

  const [tabValue, setTabValue] = useState("Start");
  const [tabIndex, setTabIndex] = useState(0);
  const [items, setItems] = useState([]);

  const tabChange = ( index, newValue ) => {
    
    setTabIndex(index);
    setTabValue(newValue);
  };

  //  const [once, setOnce] = useState(true);

  const loadWhenTokenSet = (token) => {

    // console.log("username", username);
    console.log("authSuccess", token);

    if (token.length > 0 && items.length == 0) {

      // fetch URL with valid token
      const url = Settings.baseAwsUrl + "links";

      console.log("useEffect");

      const fakeToken = "bnbvbnvbnvnb";

      const options = {
        headers: {
          "Content-Type": "application/json",
          Authorization: token
        }
      };

      fetch(url, options)
        .then(res => res.json())
        .then(
          result => {
            console.log("result", result);
            setItems(result);
          },
          (error) => {
            console.error("Could not load links : ", error.message);
          }
        )
        .catch(err => { console.log("XX", err) })
    }
  };
  // handles
  const addItemHandle = (name, link) => {
    const id = new Date().getTime();
    setItems([...items, { name, link, id }]); // push to the end
  };

  const removeItemHandle = id => {
    const items2 = items.filter(item => item.id !== id);
    setItems(items2); // push to the end
  };

  const createHeader = (items) => {
    return findUnique(items, "group").map((item, index) => (
      <>
        <Tab onClick={() => tabChange(index, item.value) } key={ index } label={ item.value } />
      </>
    ))
  }

  const filterItems = ( items ) => {
    return items.filter( item => {
      return  item.group === tabValue
    })
  }

  return (
    <>
      { loadWhenTokenSet(token) }

      <MyCard>

      <Paper square>
        <Tabs
          value={tabIndex}
          
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
          aria-label="simple tabs example"
        >
          { createHeader(items) }
        </Tabs>
        </Paper>
        <br></br>

        

        <ListQ
          items={ filterItems( items ) }
          addItemHandle={ addItemHandle }
          removeItemHandle={ removeItemHandle }
        />
      </MyCard >
    </>
  );
};


