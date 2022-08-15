import React, { Component, useState, useEffect } from "react";


// import { Row, Col, List, Button, DatePicker, Card, version } from "antd";

import { Toolbar, Box, Button, TextField, Grid, Chip, Card, CardContent, FormGroup, Paper, ListItem, ListItemText, Divider, Stepper, Step, StepButton } from '@material-ui/core/';

import { MyCard, MyCardHeader, MySubCardHeader, MyTextareaAutosize } from "../components/StyledComponents"

import { TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import { TextEdit } from "../components/TextEdit";

import { findUnique, csvToJson, sumArray } from "../components/helpers";


const l1 = `Jahr; Ausgaben; Kategorie
2022; 120; Gas
2022; 200; Oil
2022; 100; Coal
2021; 150; Gas
2021; 180; Oil
2021; 100; Coal
`



const blue = "#02735E"
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

interface ConfigFieldProps {
    header: string;
    children: React.ReactNode
}

const ConfigItem = (props: ConfigFieldProps) => {

    return (
        <MyCard>
            <Box style={{ background: blue, padding: "5px" }} >{props.header}</Box>
            <ListItem>
                {props.children}
            </ListItem>
        </MyCard>
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

export const CsvTools = ({ }) => {

    const [activeStep, setActiveStep] = React.useState(0);

    const [inputData, setInputData] = useState(l1);
    const [configData, setConfigData] = useState("");

    const [headerStringArr, setHeaderStringArr] = useState<string[]>([]);

    const [data, setData] = useState<any>([]);

    const [seperator, setSeperator] = useState<string>(";");

    const [groupname, setGroupname] = useState<string>("Jahr");
    const [subgroupname, setSubGroupname] = useState<string>("");
    const [sumField, setSumField] = useState<string>("");
    const [columnWidth, setColumnWidth] = useState<string>("3");

    const [state, setState] = React.useState({
        primary: "Ausgaben",
        secondaryA: "Kategorie",
        secondaryB: ""
    });

    const handleStep = (step: number) => () => {
        setActiveStep(step);
    };


    useEffect(() => {
        performHandle()
        setData(csvToJson(inputData, seperator))

    }, [state, seperator, inputData]); // second parameter avoid frequent loading

    // useEffect(() => {
    //     console.log("Monitor subgroupname : ", subgroupname)
    // }, [subgroupname]); // second parameter avoid frequent loading


    const performHandle = () => {

        let localHeaderArr = {}
        let localHeaderStringArr: string[] = []
        const lines = inputData.split("\n")

        for (let i = 0; i < lines.length; ++i) {

            let line = lines[i].trim()
            if (line.length === 0) continue;

            const lineArr = lines[i].split(seperator)

            // so long header array is 0 
            if (localHeaderStringArr.length === 0) {
                localHeaderStringArr = lines[i].split(seperator)
            }
        }

        setHeaderStringArr(localHeaderStringArr)
    }

    const handleChange = (key: string, value: string) => {
        setState({ ...state, [key]: value });
        console.log(state)
    };


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

    const getOptions = (headerStringArr: string[]) => {
        let arr: any = headerStringArr.map(x => { return { value: x } })
        arr.push({ key: "EMPTY", value: "" })

        return arr
    }

    const setJsonConfig = (data: string) => {
        setConfigData(data)
        const jsonObj: any = JSON.parse(data);

        console.log("groupname", jsonObj.hasOwnProperty('groupname'))

        jsonObj.hasOwnProperty('groupname') ? setGroupname(jsonObj['groupname']) : ""
        jsonObj.hasOwnProperty('subgroupname') ? setSubGroupname(jsonObj['subgroupname']) : ""
        jsonObj.hasOwnProperty('sumField') ? setSumField(jsonObj['sumField']) : ""
        jsonObj.hasOwnProperty('columnWidth') ? setColumnWidth(jsonObj['columnWidth']) : ""
        jsonObj.hasOwnProperty('format.primary') ? handleChange("primary", jsonObj['format.primary']) : ""
        jsonObj.hasOwnProperty('format.secondaryA') ? handleChange("secondaryA", jsonObj['format.secondaryA']) : ""
        jsonObj.hasOwnProperty('format.secondaryB') ? handleChange("secondaryB", jsonObj['format.secondaryB']) : ""
    }

    const createJsonConfig = ( ) => {

        const json = {
            "groupname": groupname,
            "subgroupname": subgroupname,
            "sumField": sumField,
            "columnWidth": columnWidth,
            "format.primary": state.primary,
            "format.secondaryA": state.secondaryA,
            "format.secondaryB": state.secondaryB
       }

       return JSON.stringify(json, null, 2 )
    }




    return (

        <Grid container justify="flex-start" spacing={1} >

            <Grid item xs={12}   >
                <Stepper nonLinear activeStep={activeStep}>

                    <Step><StepButton color="inherit" onClick={handleStep(0)}>Data Input</StepButton></Step>
                    <Step><StepButton color="inherit" onClick={handleStep(1)}>Configuration</StepButton></Step>
                    <Step><StepButton color="inherit" onClick={handleStep(2)}>Output</StepButton></Step>

                </Stepper>
            </Grid>

            {activeStep === 0 &&


                <Grid item xs={12}   >
                    <Grid container justify="flex-start" spacing={1} >

                        <Grid item xs={3} >
                            <ConfigItem header="Seperator" >
                                <TextEdit
                                    value={seperator}
                                    label="Primary"
                                    groups={[{ value: "\t", key: "TAB" }, { value: ";", key: "Semikolon" }]}
                                    callback={(s) => { setSeperator(s) }}
                                />
                            </ConfigItem>
                        </Grid>
                        <Grid item xs={9} >
                            <ConfigItem header="Header" >
                                {headerStringArr.map(x => {
                                    return (<Chip label={x} />)
                                })}
                            </ConfigItem>
                        </Grid>



                        <Grid item xs={12}   >
                            <MyCard>
                                <Box style={{ background: blue, padding: "5px" }} >Input </Box>
                                <MyTextareaAutosize
                                    value={inputData ? inputData : "" }
                                    rowsMin={10}
                                    onChange={e => setInputData(e.target.value)} />
                            </MyCard>
                        </Grid>
                    </Grid>
                </Grid>
            }
            {activeStep === 1 &&
                <>
                    <Grid item xs={12}   >
                        <MyCard>
                            <Box style={{ background: blue, padding: "5px" }} >Input </Box>
                            <MyTextareaAutosize
                                value={configData ? configData : createJsonConfig() }
                                rowsMin={10}
                                onChange={e => setJsonConfig(e.target.value)} />

                            <Divider></Divider>
                            <ListItemText
                                primary="groupname"
                                secondary={groupname}
                            />
                        </MyCard>
                    </Grid>
                </>
            }
            {activeStep === 2 &&
                <>
                    <Grid item xs={3} >
                        <ConfigItem header="Group" >
                            <TextEdit
                                value={groupname}
                                label="Primary"
                                groups={getOptions(headerStringArr)}
                                callback={(s) => { setGroupname(s) }}
                            />
                        </ConfigItem>
                    </Grid>
                    <Grid item xs={3} >
                        <ConfigItem header="SubGroup" >
                            <TextEdit
                                value={subgroupname}
                                label="Primary"
                                groups={getOptions(headerStringArr)}
                                callback={(s) => { setSubGroupname(s) }}
                            />
                        </ConfigItem>
                    </Grid>
                    <Grid item xs={3} >
                        <ConfigItem header="Sum Field" >
                            <TextEdit
                                value={sumField}
                                label="Primary"
                                groups={getOptions(headerStringArr)}
                                callback={(s) => { setSumField(s) }}
                            />
                        </ConfigItem>
                    </Grid>
                    <Grid item xs={3} >
                        <ConfigItem header="Width" >
                            <TextEdit
                                value={columnWidth}
                                label="Primary"
                                groups={[{ value: "2" }, { value: "3" }, { value: "4" }, { value: "6" }, { value: "12" }]}
                                callback={(s) => { setColumnWidth(s) }}
                            />
                        </ConfigItem>
                    </Grid>

                    <Grid item xs={3} >
                        <ConfigItem header="Specify your Layout " >


                            <ListItemText
                                primary={
                                    <TextEdit
                                        value={state.primary}
                                        label="Primary"
                                        groups={getOptions(headerStringArr)}
                                        callback={(s) => { handleChange("primary", s) }}
                                    />
                                }
                                secondary={
                                    <>
                                        <TextEdit
                                            value={state.secondaryA}
                                            label="SecondaryA"
                                            groups={getOptions(headerStringArr)}
                                            callback={(s) => { handleChange("secondaryA", s) }}

                                        />
                                        {bull}
                                        <TextEdit
                                            value={state.secondaryB}
                                            label="SecondaryB"
                                            groups={getOptions(headerStringArr)}
                                            callback={(s) => { handleChange("secondaryB", s) }}
                                        />
                                    </>
                                }
                            />

                        </ConfigItem>



                    </Grid>
                    <Grid item xs={12} >
                        <Grid container justify="flex-start" spacing={1} >
                            {
                                groups.map((group, index) => (

                                    <Grid item xs={getColunmWidth(columnWidth)} >
                                        <MyCard>
                                            <MyCardHeader title={(sumArray(group.listitems, sumField))} subheader={group.value} />

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
                                                            <MySubCardHeader subheader={subgroup.value} title={[(sumArray(subgroup.listitems, sumField))]} />

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
                </>
            }
        </Grid >
    )
}
