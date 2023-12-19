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
    setSeperator: ( v : string ) => void
    setGroupname: ( v : string ) => void
    setSubGroupname: ( v : string ) => void
    setSumField: ( v : string ) => void
    setColumnWidth: ( v : string ) => void
    setFormat: ( v : Format ) => void
}

const defaultTodos: CsvContent = {
    seperator: ";",
    groupname: "",
    subgroupname: "",
    sumField: "",
    columnWidth: "",
    format:   {primary:"", secondaryA:"", secondaryB:""},
    setSeperator: () =>{},
    setGroupname: () =>{},
    setSubGroupname: () =>{},
    setSumField: () =>{},
    setColumnWidth: () =>{},
    setFormat: () =>{},
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
        {primary:"", secondaryA:"", secondaryB:""}
    );    

    
    const heroContext = {
        seperator: seperator,
        groupname: groupname,
        subgroupname: subgroupname,
        sumField: sumField,
        columnWidth: columnWidth,
        format: format,
        setSeperator: ( x : string ) =>{
            setSeperator(x)
        },
        setGroupname: ( x : string ) =>{
            setGroupname(x)
        },
        setSubGroupname:  ( x : string ) =>{
            setSubGroupname(x)
        },
        setSumField:  ( x : string ) =>{
            setSumField(x)
        },
        setColumnWidth:  ( x : string ) =>{
            setColumnWidth(x)
        },
        setFormat: ( x : Format ) =>{
            setFormat(x)
        },
    };

    return (
        <CsvContext.Provider value={heroContext}>
            {props.children}
        </CsvContext.Provider>
    );
};

export { CsvContext, CsvProvider };