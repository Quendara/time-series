import React from "react";
import { ImageFromPhotos } from "./ImageFromPhotos";
import { Alert, AlertColor, Box } from "@mui/material";

export const getPhotoJSX = (line: string) => {

    const regex = /\$\$Photo:"([^"]+)"/;
    const matches = line.match(regex);

    if (matches && matches.length >= 2) {
        const extractedString = matches[1];
        const filename = extractedString.split("/")

        return (
            <ImageFromPhotos folder={filename[0]} file={filename[1]} />
        )
    } else {
        console.log("Kein Übereinstimmung gefunden.");
        return (<></>)
    }
}

function isAlertColor(color: string): boolean {
    return ['success', 'info', 'warning', 'error'].includes(color);
}

export const getAlertJSX = (line: string) => {

    let extractedString = line.split(":").at(1)
    let severity: AlertColor = "success"

    if (extractedString?.split("/").length === 2) {
        const arr = extractedString?.split("/")
        severity = isAlertColor(arr[0]) ? arr[0] as AlertColor : "success"
        extractedString = arr[1]
    }

    return (
        <Box mt={1} mb={1} >
            <Alert severity={severity}>{extractedString}</Alert>
        </Box>
    )
}

export const getVideoJSX = (line: string) => {

    let indexOf = line.indexOf(":")
    if (indexOf) {

        const videoUrl = line.slice(indexOf + 1, line.length).trim()
        if (videoUrl) {

            const prefix = "https://www.youtube.com/embed/"

            return (
                <Box mt={1} mb={1} >
                    {/* {videoUrl} <br /> */}
                    <iframe style={{ border:0, aspectRatio:"4/3" }} width="100%" src={prefix + videoUrl}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                    
                    allowFullScreen
                    >
                    </iframe>
                </Box>
            )
        }
    }




    return (
        <Box mt={1} mb={1} >
            <Alert severity={"error"}>{"Unexpected video"}</Alert>
        </Box>
    )
}