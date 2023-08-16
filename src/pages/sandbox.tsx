import React, { Component, useState, useEffect } from "react";
import { Details } from "../components/Details";
import {Grid} from '@mui/material'

import { ImageFromPhotos } from "../components/ImageFromPhotos";


// import { Image } from "../Definitions"

// export async function restCallToBackendAsync(url, token, loggingMessage )
// {
//     const options = {
//         headers: {
//             'Accept': 'application/json',
//             'Content-Type': 'application/json',
//             Authorization: token // token.access
//         },
//     };

//   let response = await fetch(url, options)
//   let data = await response.json()
//   return data;
// }



export const Sandbox = () => {

 
 
  return (

    <Grid container spacing={ 2 }>

      <Grid item xs={ 3 } >

        <ImageFromPhotos 
          folder = "2022 - Familie"
          file = "2022-01-30_20.23.54.660_BE95F9EF-6C88-4BA5-9B23-3DA0490B937F.jpeg"
          /> 
        
      </Grid>
      <Grid item xs={ 3 } >

        <ImageFromPhotos 
          folder = "2023 - Familie"
          file = "IMG_4868.JPG"
          />
      </Grid>

      <Grid item xs={ 3 } >

        <ImageFromPhotos 
          folder = "2023 - Familie"
          file = "IMG_4856.JPG"
          />
      </Grid>      

         
            

    </Grid>

  )

  // 

}