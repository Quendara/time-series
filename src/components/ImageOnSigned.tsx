import React, { useState, useEffect } from "react"; // , { useState }
import { restCallToBackendAsync } from "./helpers"

import { useVisible } from 'react-hooks-visible'


interface Props {
  folder : string;
  dirname_physical : string;
  item : string;
  className : string;
  media : string;
  token : string;
}

export const ImageOnSigned = ({ folder, dirname_physical, item, className, media, token } : Props) => {

  const endpoint = " https://srxdhyyhm2.execute-api.eu-central-1.amazonaws.com/dev/photoData"

  const [surl, setSUrl] = useState("")

  const my_folder = dirname_physical ? dirname_physical : folder;
  

  

  useEffect(() => {

    const conv_extension = ".720.conv.mp4"

    const url = (media === "video") ? [endpoint, my_folder, item+conv_extension,"raw"].join("/") : [endpoint, my_folder, item,"raw"].join("/")


      // const signed_url = ""
      restCallToBackendAsync(url, token).then(data => {
          console.log( "signed_url", data )
          setSUrl(data.presigned_url)
      })
      .catch(err => {
        console.log( "Failed to sign URL signed_url : " )
      })
  }, [item, media, my_folder]);

 
  return (
      <>
    { media === "video" ? (
      <>
          { surl &&
          <>
              <video src={surl} className={className} controls  style={ { backgroundColor: "#2D2D31", width: "100%" } } preload="metadata" muted>
                  {/* <source src={surl} type="video/mp4" />  */}
              </video>
              {surl}
            </>
          }
      </>
    ) : (
        <>
        { surl &&
            <>
                <img className={className} src={surl}  />
            </>
        }</>
    ) 
    }
</> 
)

  // <p>{signed_url}</p>

}