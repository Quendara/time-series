import React, { Component, useState, useEffect } from "react";
import { useQuery } from '@apollo/react-hooks'
import { Details } from "../components/Details";
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'


export const Sandbox = ({ username, token, listid, listtype }) => {

 const fakeItem = {
     id:1,
     listid: 10,
     name:"Hello",
     description: `* List 
* Item 1
* Item 2
* Item 3
`
 }

    const updateFunction = () => {}
    
    


  return (

    <Grid container spacing={1}>
        
        <Details selectedItem={ fakeItem } updateFunction={ updateFunction }  ></Details>  
    
    </Grid>  

  )

  // 

}