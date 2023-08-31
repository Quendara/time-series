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