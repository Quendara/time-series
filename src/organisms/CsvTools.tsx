import React, { Component, useState, useEffect, useContext } from "react";



import { AlertTitle, Alert, Toolbar, Box, Button, TextField, Grid, Chip, Card, CardContent, FormGroup, Paper, ListItem, ListItemText, Divider, Stepper, Step, StepButton, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { MyCard, MyCardHeader, MySubCardHeader, MyTextareaAutosize } from "../components/StyledComponents"

import { TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'

import { findUnique, csvToJson, sumArray } from "../components/helpers";
import { CsvContext } from "../context/CsvProvider";
import { MyIcon } from "../components/MyIcon";



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
    // configuation: string;
    skippedLinesCallback: (x: JSX.Element[]) => void
    headerCallback: (x: string[]) => void;
}

export const CsvTools = (props: PropsCsvTools) => {

    // const [inputData, setInputData] = useState(props.csvInput);
    // const [configData, setConfigData] = useState(props.configuation);

    const [headerStringArr, setHeaderStringArr] = useState<string[]>([]);

    const [data, setData] = useState<any>([]);
    const [skippedLines, setSkippedLines] = useState<any>([]);

    const myContext = useContext(CsvContext)

    useEffect(() => {
        performHandle()


        const output = csvToJson(props.csvInput, myContext.seperator)

        setData(output.json)
        setSkippedLines(output.skippedLines)

        props.skippedLinesCallback(output.skippedLines)
        props.headerCallback(output.headers)


    }, [props.csvInput]);

    function performHandle() {

        let localHeaderArr = {};
        let localHeaderStringArr: string[] = [];
        const lines = props.csvInput.split("\n");

        for (let i = 0; i < lines.length; ++i) {

            let line = lines[i].trim();
            if (line.length === 0)
                continue;

            const lineArr = lines[i].split(myContext.seperator);

            // so long header array is 0 
            if (localHeaderStringArr.length === 0) {
                localHeaderStringArr = lines[i].split(myContext.seperator);
            }
        }

        setHeaderStringArr(localHeaderStringArr);
    }

    const groups = findUnique(data, myContext.groupname, false)

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

    return (

        <Grid container justifyContent="flex-start" spacing={1} >
            <Grid item xs={12} >
                <Accordion>
                    <AccordionSummary
                        expandIcon={<MyIcon icon="expand_more" /> }
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                         { skippedLines.length === 0 ? "No Skipped Lines " : <Alert severity="warning">Skipped Lines : {skippedLines.length}</Alert> }
                    </AccordionSummary>
                    <AccordionDetails>


                    {skippedLines.map((line: any) => (
                        <p>
                            {line} 
                        </p>
                    ))}
                     </AccordionDetails>
                </Accordion>
            </Grid>
            {/* <Grid item xs={12} >
                {data.map((line: any) => (
                    <ListCsvItem
                        line={line}
                        headerCheckedArr={[state.primary, state.secondaryA, state.secondaryB]}
                    />
                )
                )}
            </Grid> */}
            <Grid item xs={12} >
                <Grid container justifyContent="flex-start" spacing={1} >
                    {
                        groups.map((group, index) => (

                            <Grid item xs={getColunmWidth(myContext.columnWidth)} >
                                <MyCard>
                                    <MyCardHeader subheader={(sumArray(group.listitems, myContext.sumField))} title={group.value} />

                                    {myContext.subgroupname.length === 0 ? (
                                        <>
                                            {group.listitems.map((line: any) => (<>

                                                <ListCsvItem
                                                    line={line}
                                                    headerCheckedArr={[myContext.format.primary, myContext.format.secondaryA, myContext.format.secondaryB]}
                                                />
                                            </>))}

                                        </>
                                    ) : (
                                        <>
                                            {findUnique(group.listitems, myContext.subgroupname, false).map((subgroup: any) => (
                                                <>
                                                    <MySubCardHeader title={subgroup.value} subheader={[(sumArray(subgroup.listitems, myContext.sumField))]} />

                                                    {subgroup.listitems.map((line: any) => (<>

                                                        <ListCsvItem
                                                            line={line}
                                                            headerCheckedArr={[myContext.format.primary, myContext.format.secondaryA, myContext.format.secondaryB]}
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
