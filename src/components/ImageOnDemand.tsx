import React, { useState } from "react";
import { useVisible } from 'react-hooks-visible'
import { ImageOnSigned } from "./ImageOnSigned";

// className={isVisible ? 'excited' : ''}

import { Image, Mediatype } from "./Definitions"


interface Props {
  image: Image;
  className: string;
  onClick: any;
  fullRes: boolean;
  token: string;
  visibilityThreshold: number;
}


// 
export const ImageOnDemand = ({
  image,
  className,
  onClick,
  fullRes = false,
  token,
  visibilityThreshold = 0.01 }: Props) => {

  // Boolean. This example is 50% visible.
  // const [targetRef, visible] = useVisible()
  // Boolean. This example is 50% visible.
  // const [targetRef, isVisible] = useVisible((vi: number) => vi > 0.02)

  // Percent value.
  // const [targetRef, visibility] = useVisible()    
  const [isVisibleState, setVisible] = useState(false)
  const [loaded, setLoaded] = useState(false)

  // const [targetRef, visibility] = useVisible((vi) => vi)
  const visibility = 1;


  const getClassName = (image: Image, className: string, visibility: number) => {

    if (visibility > visibilityThreshold) {
      if (loaded === false) {
        setLoaded(true)
        // console.log("set loaded TRUE")
      }
    }
    let r = className



    if (image !== undefined && image.rotate !== undefined) {
      if (image.rotate === 180) {
        r += " rotate180"
      }
    }
    return r
  }

  const getMediaType = (url: string): string => {

    let extension = url.split('.').pop();
    if (extension !== undefined) {
      extension = extension.toLowerCase();

      switch (extension) {
        case "png":
        case "jpg":
        case "jpeg":
          return "image"
        case "mov":
        case "mp4":
          return "video"
        default:
          return "unknown"
      }
    }
    return "unknown"
  }

  // const mediaType: string = getMediaType(image.filename)

  //  {/* (visibility > 0.01 ) */}

  return (

    // ref={ targetRef as any } 

    <div style={{ backgroundColor: "#2D2D31", height: "100%" }} >

      { visibility }

      {image !== undefined &&
        <>
          { getMediaType(image.filename) === "video" ?
            (
              <>
                {(visibility > 0.01) &&
                  <ImageOnSigned className={getClassName(image, className, visibility)} folder={image.dirname} dirname_physical={image.dirname_physical} item={image.filename} token={token} media={getMediaType(image.filename)} />
                }
              </>
            ) : (
              <>
                {fullRes ? (
                  <>
                    <ImageOnSigned className={getClassName(image, className, visibility)} folder={image.dirname} dirname_physical={image.dirname_physical} item={image.filename} token={token} media={getMediaType(image.filename)} />
                  </>
                ) : (
                  <>
                    <img className={getClassName(image, className, visibility)} onClick={onClick} src={(visibility > visibilityThreshold) ? image.source_url : ''} />
                  </>
                )
                }
              </>
            )

          }
        </>
      }

    </div>

  )
}
