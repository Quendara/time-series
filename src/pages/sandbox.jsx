import React, { Component, useState, useEffect } from "react";
import { useQuery } from '@apollo/react-hooks'
import { Details } from "../components/Details";
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

import {ImageOnDemand} from "../components/ImageOnDemand"

// import { Image } from "../Definitions"

export async function restCallToBackendAsync(url, token, loggingMessage )
{
    const options = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: token // token.access
        },
    };

  let response = await fetch(url, options)
  let data = await response.json()
  return data;
}



export const Sandbox = ({ username, token, lists, listtype }) => {

  const endpoint = " https://srxdhyyhm2.execute-api.eu-central-1.amazonaws.com/dev"

  const [image, setImage] = useState(undefined)

  // useEffect(() => {

  //   const folder = "2022 - Familie"
  //   const id = "2022-01-30_20.23.54.660_BE95F9EF-6C88-4BA5-9B23-3DA0490B937F.jpeg"
  //   const url = [endpoint, "photoData", folder, id ].join("/") 
 
  //     // const signed_url = ""
  //     restCallToBackendAsync(url, token).then(data => {
  //         console.log( "Image", data )
  //         setImage( )
  //     })
  //     .catch(err => {
  //       console.log( "Failed to sign URL signed_url : " )
  //     })
  // }, [ ]);  

  

  const fakeItem = {
    id: 1,
    listid: 10,
    name: "Hello", 
    description: `* List 
* Item 1
* Item 2
* Item 3
`
  }

  const folder = "2022 - Familie"
  const id = "2022-01-30_20.23.54.660_BE95F9EF-6C88-4BA5-9B23-3DA0490B937F.jpeg"
  const url = [endpoint, "photoData", folder, id ].join("/")   

  const updateFunction = () => { }


  const fakeImage = {
    filename: id,
    source_url: url
  }

 
  return (

    <Grid container spacing={ 1 }>

      <Details selectedItem={ fakeItem } updateFunction={ updateFunction } lists={ lists }  ></Details>

      <Grid item xs={ 3 } >




        <ImageOnDemand image={ fakeImage }
          className=""
          onClick={ undefined }
          fullRes={ false }
          token=""
        >

        </ImageOnDemand>
      </Grid>

    </Grid>

  )

  // 

}