import React, { Component, useState, useEffect } from "react";
import { render } from "react-dom";
import { ListQ } from "./list";

import Settings from "./Settings";



export const ListMain = ({token}) => {

//   const [username, setUsername] = useState("");
//   const [jwtTocken, setJwtToken] = useState("");
  const [items, setItems] = useState([]);
//  const [once, setOnce] = useState(true);

  const loadWhenTokenSet = (token) => {

    // console.log("username", username);
    console.log("authSuccess", token);

    if (token.length > 0 && items.length == 0 ) {
      
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
            console.error( "Could not load links : ", error.message);
          }
        )
        .catch(err => { console.log( "XX", err) })
    }
  };

  useEffect(() => {
    
  }, []);

  // handles
  const addItemHandle = (name, link) => {
    const id = new Date().getTime();
    setItems([...items, { name, link, id }]); // push to the end
  };

  const removeItemHandle = id => {
    const items2 = items.filter(item => item.id !== id);
    setItems(items2); // push to the end
  };

  return (
    <>
        {loadWhenTokenSet(token)}
        <ListQ
          items={items}
          addItemHandle={addItemHandle}
          removeItemHandle={removeItemHandle}
        />
    </>
  );
};


