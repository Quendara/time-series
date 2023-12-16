import React, { Component, useState, useEffect } from "react";



import { AlertTitle, Alert, Toolbar, Box, Button, TextField, Grid, Chip, Card, CardContent, FormGroup, Paper, ListItem, ListItemText, Divider, Stepper, Step, StepButton } from '@mui/material';
import { MyCard, MyCardHeader, MySubCardHeader, MyTextareaAutosize } from "../components/StyledComponents"

import { TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'

import { findUnique, csvToJson, sumArray } from "../components/helpers";




const bull = <span style={{ "margin": "5px" }}>•</span>;

interface PropsSimple {

    valueArr: string[]; // parsed header
}


const ListCsvItemSimple = (props: PropsSimple) => {

    const getValueOf = (column: number) => {
        return props.valueArr[column]
    }

    return (
        <ListItem>
            <ListItemText
                primary={
                    getValueOf(0)
                }
                secondary={
                    <>
                        {getValueOf(1)}
                        {props.valueArr.length > 2 &&
                            <>
                                {bull}
                                {getValueOf(2)}
                            </>
                        }

                    </>
                }
            />
        </ListItem>
    )
}

interface Props {
    line: any; // json data
    headerCheckedArr: string[]; // parsed header
}


const ListCsvItem = (props: Props) => {

    const getValueOf = (column: number) => {

        const keyName = props.headerCheckedArr[column]
        return props.line[keyName]
    }

    const value0 = getValueOf(0)
    const value1 = getValueOf(1)
    const value2 = getValueOf(2)

    return (
        <>
            {(value0 || value1 || value2) ? (
                <ListItem>
                    <ListItemText
                        primary={
                            getValueOf(0)
                        }
                        secondary={
                            <>
                                {getValueOf(1)}
                                {props.headerCheckedArr.length > 2 &&
                                    <>
                                        {value2 && bull}
                                        {getValueOf(2)}
                                    </>
                                }
                            </>
                        }
                    />

                </ListItem>) : (
                <></>
            )
            }

        </>
    )
}

interface PropsCsvTools {
    csvInput: string;
    configuation: string;
    skippedLinesCallback :  ( x:string[] ) => void
    headerCallback: ( x:string[] ) => void;
}

export const CsvTools = (props: PropsCsvTools) => {

    // const [inputData, setInputData] = useState(props.csvInput);
    // const [configData, setConfigData] = useState(props.configuation);

    const [headerStringArr, setHeaderStringArr] = useState<string[]>([]);

    const [data, setData] = useState<any>([]);
    const [skippedLines, setSkippedLines] = useState<any>([]);

    const [seperator, setSeperator] = useState<string>(";");

    const [groupname, setGroupname] = useState<string>("");
    const [subgroupname, setSubGroupname] = useState<string>("");
    const [sumField, setSumField] = useState<string>("");
    const [columnWidth, setColumnWidth] = useState<string>("3");

    const [state, setState] = React.useState({
        primary: "Ausgaben",
        secondaryA: "Kategorie",
        secondaryB: ""
    });




    useEffect(() => {
        performHandle()

        setJsonConfig( props.configuation )

        const output = csvToJson(props.csvInput, seperator)

        setData(output.json)
        setSkippedLines(output.skippedLines)

        props.skippedLinesCallback( output.skippedLines )
        props.headerCallback( output.headers )


    }, [ props.csvInput, props.configuation ]); 
 
    function performHandle() {

        let localHeaderArr = {};
        let localHeaderStringArr: string[] = [];
        const lines = props.csvInput.split("\n");

        for (let i = 0; i < lines.length; ++i) {

            let line = lines[i].trim();
            if (line.length === 0)
                continue;

            const lineArr = lines[i].split(seperator);

            // so long header array is 0 
            if (localHeaderStringArr.length === 0) {
                localHeaderStringArr = lines[i].split(seperator);
            }
        }

        setHeaderStringArr(localHeaderStringArr);
    }

    const groups = findUnique(data, groupname, false)

    const getColunmWidth = (columnWidth: string | undefined) => {
        switch (columnWidth) {
            case "2": return 2;
            case "3": return 3;
            case "4": return 4;
            case "6": return 6;
            case "12": return 12;
            default: return 2;
        }
    }

    const handleChange = (key: string, value: string) => {
        setState({ ...state, [key]: value });
        console.log(state)
    };


    // TODO remove setJsonConfig
    const setJsonConfig = (data: string) => {
        
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

    return (

        <Grid container justifyContent="flex-start" spacing={1} >
            <Grid item xs={12} >
                {
                    props.configuation
                }
            </Grid>
            <Grid item xs={12} >
                <Grid container justifyContent="flex-start" spacing={1} >
                    {
                        groups.map((group, index) => (

                            <Grid item xs={getColunmWidth(columnWidth)} >
                                <MyCard>
                                    <MyCardHeader subheader={(sumArray(group.listitems, sumField))} title={group.value} />

                                    {subgroupname.length === 0 ? (
                                        <>
                                            {group.listitems.map((line: any) => (<>

                                                <ListCsvItem
                                                    line={line}
                                                    headerCheckedArr={[state.primary, state.secondaryA, state.secondaryB]}
                                                />
                                            </>))}

                                        </>
                                    ) : (
                                        <>
                                            {findUnique(group.listitems, subgroupname, false).map((subgroup: any) => (
                                                <>
                                                    <MySubCardHeader title={subgroup.value} subheader={[(sumArray(subgroup.listitems, sumField))]} />

                                                    {subgroup.listitems.map((line: any) => (<>

                                                        <ListCsvItem
                                                            line={line}
                                                            headerCheckedArr={[state.primary, state.secondaryA, state.secondaryB]}
                                                        />
                                                    </>))}

                                                </>

                                            ))}
                                        </>
                                    )}
                                </MyCard>
                            </Grid>
                        ))
                    }
                </Grid>
            </Grid>
        </Grid >
    )
}
