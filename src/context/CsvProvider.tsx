import React, { ReactNode, useEffect } from "react";
import { useState } from "react";

import { TodoMainItem } from "../models/TodoItems";
import { fetchTodosMainFcn } from "./TodoMainProviderFcns";

export interface Format {
    primary: string,
    secondaryA: string,
    secondaryB: string
}



export type CsvContent = {
    seperator: string
    groupname: string
    subgroupname: string
    sumField: string
    columnWidth: string
    format: Format
    setSeperator: (v: string) => void
    setGroupname: (v: string) => void
    setSubGroupname: (v: string) => void
    setSumField: (v: string) => void
    setColumnWidth: (v: string) => void
    setFormat: (v: Format) => void
    setJsonConfig: (v: string) => void
}

const defaultTodos: CsvContent = {
    seperator: ";",
    groupname: "",
    subgroupname: "",
    sumField: "",
    columnWidth: "",
    format: { primary: "", secondaryA: "", secondaryB: "" },
    setSeperator: () => { },
    setGroupname: () => { },
    setSubGroupname: () => { },
    setSumField: () => { },
    setColumnWidth: () => { },
    setFormat: () => { },
    setJsonConfig: () => { },
}

const CsvContext = React.createContext<CsvContent>(defaultTodos);

type Props = {
    children: ReactNode
}

const CsvProvider = (props: Props) => {

    // const [todosState, setTodos] = useState<TodoMainItem[]>([]);
    // const [openAiKeyInt, setOpenAiKeyInt] = useState("");

    const [seperator, setSeperator] = useState<string>(";");
    const [groupname, setGroupname] = useState<string>("");
    const [subgroupname, setSubGroupname] = useState<string>("");
    const [sumField, setSumField] = useState<string>("");
    const [columnWidth, setColumnWidth] = useState<string>("3");
    const [format, setFormat] = React.useState<Format>(
        { primary: "", secondaryA: "", secondaryB: "" }
    );

    const handleChange = (key: string, value: string) => {
        setFormat({ ...format, [key]: value });
        console.log( "handleChange" , format)
    };    


    const heroContext = {
        seperator: seperator,
        groupname: groupname,
        subgroupname: subgroupname,
        sumField: sumField,
        columnWidth: columnWidth,
        format: format,
        setSeperator: (x: string) => {
            setSeperator(x)
        },
        setGroupname: (x: string) => {
            setGroupname(x)
        },
        setSubGroupname: (x: string) => {
            setSubGroupname(x)
        },
        setSumField: (x: string) => {
            setSumField(x)
        },
        setColumnWidth: (x: string) => {
            setColumnWidth(x)
        },
        setFormat: (x: Format) => {
            setFormat(x)
        },
        setJsonConfig : (data: string) => {
            // setConfigData(data)
            const jsonObj: any = JSON.parse(data);

            console.log("groupname", jsonObj.hasOwnProperty('groupname'))

            jsonObj.hasOwnProperty('groupname') ? setGroupname(jsonObj['groupname']) : ""
            jsonObj.hasOwnProperty('subgroupname') ? setSubGroupname(jsonObj['subgroupname']) : ""
            jsonObj.hasOwnProperty('sumField') ? setSumField(jsonObj['sumField']) : ""
            jsonObj.hasOwnProperty('seperator') ? setSeperator(jsonObj['seperator']) : ""

            jsonObj.hasOwnProperty('columnWidth') ? setColumnWidth(jsonObj['columnWidth']) : ""
            jsonObj.hasOwnProperty('format.primary') ? handleChange("primary", jsonObj['format.primary']) : ""
            jsonObj.hasOwnProperty('format.secondaryA') ? handleChange("secondaryA", jsonObj['format.secondaryA']) : ""
            jsonObj.hasOwnProperty('format.secondaryB') ? handleChange("secondaryB", jsonObj['format.secondaryB']) : ""
        }
    };

    return (
        <CsvContext.Provider value={heroContext}>
            {props.children}
        </CsvContext.Provider>
    );
};

export { CsvContext, CsvProvider };