import { Button } from "@mui/material";
import React, { Component, useState, useEffect, useContext } from "react";
import { MyTextareaAutosize } from "../components/StyledComponents";
import { CsvContext } from "../context/CsvProvider";

interface Props {
    data: string;
    onChange: (x: string) => void
}

export const CsvToolsImport = (props: Props) => {

    const [inputData, setInputData] = useState("");
    const myContext =  useContext(CsvContext)

    const detectFormat = (inputData: string) => {

        let staticconfig = `
        {
            "groupname": "Jahr",
            "subgroupname": "",
            "sumField": "Ausgaben",
            "seperator": ";",
            "columnWidth": "3",
            "format.primary": "",
            "format.secondaryA": "Ausgaben",
            "format.secondaryB": "Kategorie"
          }`

          if( inputData.trim().indexOf("Spanne") === 0 ){
            staticconfig = `{
                "groupname": "Hauptprojekt",
                "subgroupname": "",
                "sumField": "",
                "seperator": ";",
                "columnWidth": "3",
                "format.primary": "",
                "format.secondaryA": "Spanne",
                "format.secondaryB": "Bemerkung"
              }`               
          }

          myContext.setJsonConfig( staticconfig )

    }

    useEffect(() => {
        setInputData( props.data )

    }, [props.data ]);

    return (

        <>

            <MyTextareaAutosize
                sx={{ whiteSpace: "nowrap", minHeight: "50vh" }}
                value={ inputData }
                onChange={e => props.onChange(e.target.value)} />

            <Button onClick={() => detectFormat(inputData)}>Detect Format</Button>
        </>
    )
}

