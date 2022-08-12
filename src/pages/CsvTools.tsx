import React, { Component, useState, useEffect } from "react";


// import { Row, Col, List, Button, DatePicker, Card, version } from "antd";

import { Toolbar, Box, Button, TextField, Grid, Chip, Card, CardContent, FormGroup, Paper, ListItem, ListItemText, Divider, Stepper, Step, StepButton } from '@material-ui/core/';

import { MyCard, MyCardHeader, MySubCardHeader, MyTextareaAutosize } from "../components/StyledComponents"

import { TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import { TextEdit } from "../components/TextEdit";

import { findUnique, csvToJson, sumArray } from "../components/helpers";



const doku = `---
Brackets
`

const l1 = `Jahr;Monat;Woche;Teilwoche;Teilwoche bis;Name;Vorname;MitId;K�rzel;HauptprojektBez;HauptprojektNr;TeilprojektBez;TeilprojektNr;Arbeitsauftrag;Spanne;Tag;Bemerkung;(Projekt-)Typ;Fakt_Kennz;Erledigt;Freigegeben;Mitarb_BU;Mitarb_Bereich;Mitarb_Abteilung;Mitarb_Team;Mitarb_OrgNr
2022;6;24;"N";"";"Garstka";"Mark-Andr�";10066;GaM;"DHL (Hauptprojekt)";"8441005F";"DHL, nGKP";"43201135";"BTG-Scrum Master";"1";13.06.2022;"Daily";"EX";"J";J;J;"BL Digital Transformation";"BL Digital Transformation";"BL DT Software Factory";"BL DT Software Factory 02";"01_BL-DE-AAP-02_6"
2022;6;24;"N";"";"Garstka";"Mark-Andr�";10066;GaM;"Daimler, SCiP Verbauquote";"43201225";"Daimler, SCiP Verbauquote";"43201225";"BTG-Skill Klasse B1-B, Scrum Master";"1";13.06.2022;"Daily";"EX";"J";J;J;"BL Digital Transformation";"BL Digital Transformation";"BL DT Software Factory";"BL DT Software Factory 02";"01_BL-DE-AAP-02_6"
2022;6;24;"N";"";"Garstka";"Mark-Andr�";10066;GaM;"Mercedes-Benz Mobility AG, Comet 2022";"43201239";"Mercedes-Benz Mobility AG, Comet 2022";"43201239";"BTG-Projektleitung";"1";13.06.2022;"Projektleitung";"EX";"J";J;J;"BL Digital Transformation";"BL Digital Transformation";"BL DT Software Factory";"BL DT Software Factory 02";"01_BL-DE-AAP-02_6"
2022;6;24;"N";"";"Garstka";"Mark-Andr�";10066;GaM;"Daimler Truck Financial Services GmbH, COMET f�r DTFS 2022";"43201238";"Daimler Truck Financial Services GmbH, COMET f�r D";"43201238";"BTG-Umsetzung";"1";13.06.2022;"Daily und Follow ups";"EX";"J";J;J;"BL Digital Transformation";"BL Digital Transformation";"BL DT Software Factory";"BL DT Software Factory 02";"01_BL-DE-AAP-02_6"
2022;6;24;"N";"";"Garstka";"Mark-Andr�";10066;GaM;"DHL (Hauptprojekt)";"8441005F";"DHL, nGKP";"43201135";"BTG-Scrum Master";"1";13.06.2022;"Sprint Wechsel Vorbereitung";"EX";"J";J;J;"BL Digital Transformation";"BL Digital Transformation";"BL DT Software Factory";"BL DT Software Factory 02";"01_BL-DE-AAP-02_6"
2022;6;24;"N";"";"Garstka";"Mark-Andr�";10066;GaM;"2022 VU - Software Factory (neu g�ltig ab 30.05.22) !!";"43101016";"2022 VU - Software Factory (neu g�ltig ab 30.05.22";"43101016";"BTG-Diverse VU";"2";13.06.2022;"SCiP Projekte";"VU";"N";J;J;"BL Digital Transformation";"BL Digital Transformation";"BL DT Software Factory";"BL DT Software Factory 02";"01_BL-DE-AAP-02_6"
2022;6;24;"N";"";"Garstka";"Mark-Andr�";10066;GaM;"BL DE AaP 02";"43221002";"BL DE AaP 02";"43221002";"NON-Weiterbildung";"1";13.06.2022;"AWS";"IN";"N";J;J;"BL Digital Transformation";"BL Digital Transformation";"BL DT Software Factory";"BL DT Software Factory 02";"01_BL-DE-AAP-02_6"
2022;6;24;"N";"";"Garstka";"Mark-Andr�";10066;GaM;"DHL (Hauptprojekt)";"8441005F";"DHL, nGKP";"43201135";"BTG-Scrum Master";"7";14.06.2022;"Sprint Wechsel";"EX";"J";J;J;"BL Digital Transformation";"BL Digital Transformation";"BL DT Software Factory";"BL DT Software Factory 02";"01_BL-DE-AAP-02_6"
2022;6;24;"N";"";"Garstka";"Mark-Andr�";10066;GaM;"Daimler Truck Financial Services GmbH, COMET f�r DTFS 2022";"43201238";"Daimler Truck Financial Services GmbH, COMET f�r D";"43201238";"BTG-Projektleitung";"1";14.06.2022;"Weekly, Projektleitung";"EX";"J";J;J;"BL Digital Transformation";"BL Digital Transformation";"BL DT Software Factory";"BL DT Software Factory 02";"01_BL-DE-AAP-02_6"
2022;6;24;"N";"";"Garstka";"Mark-Andr�";10066;GaM;"2022 VU - Software Factory (neu g�ltig ab 30.05.22) !!";"43101016";"2022 VU - Software Factory (neu g�ltig ab 30.05.22";"43101016";"BTG-Diverse VU";"1";15.06.2022;"VU IHK";"VU";"N";J;J;"BL Digital Transformation";"BL Digital Transformation";"BL DT Software Factory";"BL DT Software Factory 02";"01_BL-DE-AAP-02_6"
2022;6;24;"N";"";"Garstka";"Mark-Andr�";10066;GaM;"DHL (Hauptprojekt)";"8441005F";"DHL, nGKP";"43201135";"BTG-Scrum Master";"1,5";15.06.2022;"SoS Extended";"EX";"J";J;J;"BL Digital Transformation";"BL Digital Transformation";"BL DT Software Factory";"BL DT Software Factory 02";"01_BL-DE-AAP-02_6"
2022;6;24;"N";"";"Garstka";"Mark-Andr�";10066;GaM;"Daimler, SCiP Verbauquote";"43201225";"Daimler, SCiP Verbauquote";"43201225";"BTG-Skill Klasse B1-B, Scrum Master";"4";15.06.2022;"Daily, Refinements";"EX";"J";J;J;"BL Digital Transformation";"BL Digital Transformation";"BL DT Software Factory";"BL DT Software Factory 02";"01_BL-DE-AAP-02_6"
2022;6;24;"N";"";"Garstka";"Mark-Andr�";10066;GaM;"Mercedes-Benz Mobility AG, Comet 2022";"43201239";"Mercedes-Benz Mobility AG, Comet 2022";"43201239";"BTG-Projektleitung";"1";15.06.2022;"Weekly";"EX";"J";J;J;"BL Digital Transformation";"BL Digital Transformation";"BL DT Software Factory";"BL DT Software Factory 02";"01_BL-DE-AAP-02_6"
2022;6;24;"N";"";"Garstka";"Mark-Andr�";10066;GaM;"Mercedes-Benz Mobility AG, Comet 2022";"43201239";"Mercedes-Benz Mobility AG, Comet 2022";"43201239";"BTG-Umsetzung";"0,5";15.06.2022;"Daily";"EX";"J";J;J;"BL Digital Transformation";"BL Digital Transformation";"BL DT Software Factory";"BL DT Software Factory 02";"01_BL-DE-AAP-02_6"
`


const l2 = `case $1:
return $1
`

const l3 = `(.*)`

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

    const [list1, setList1] = useState(l1);

    const [headerStringArr, setHeaderStringArr] = useState<string[]>([]);

    const [data, setData] = useState<any>([]);

    const [groupname, setGroupname] = useState<string>("HauptprojektBez");
    const [subgroupname, setSubGroupname] = useState<string>("Arbeitsauftrag");

    const [seperator, setSeperator] = useState<string>(";");
    const [sumField, setSumField] = useState<string>("Spanne");
    const [columnWidth, setColumnWidth] = useState<string>("2");


    const [state, setState] = React.useState({
        prim: "Bemerkung",
        secA: "Arbeitsauftrag",
        secB: "Spanne"
    });

    const handleStep = (step: number) => () => {
        setActiveStep(step);
    };


    useEffect(() => {
        performHandle()
        setData(csvToJson(list1, seperator))

    }, [state, seperator, list1]); // second parameter avoid frequent loading

    useEffect(() => {
        console.log("Monitor : ", subgroupname)

    }, [subgroupname]); // second parameter avoid frequent loading




    const performHandle = () => {

        let localHeaderArr = {}
        let localHeaderStringArr: string[] = []
        const lines = list1.split("\n")

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




    return (

        <Grid container justify="flex-start" spacing={1} >

            <Grid item xs={12}   >
                <Stepper nonLinear activeStep={activeStep}>

                    <Step><StepButton color="inherit" onClick={handleStep(0)}>Data Input</StepButton></Step>
                    <Step><StepButton color="inherit" onClick={handleStep(1)}>Output</StepButton></Step>

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
                                value={list1 ? list1 : ""}
                                rowsMin={10}
                                // error={ hasError(linkName) }
                                // label="Name"

                                // size="small"
                                // fullWidth
                                //variant="outlined"
                                // onKeyPress={ e => checkEnter(e) }
                                onChange={e => setList1(e.target.value)} />
                            </MyCard>
                        </Grid>
                    </Grid>
                </Grid>
            }
            {activeStep === 1 &&
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
                                        value={state.prim}
                                        label="Primary"
                                        groups={getOptions(headerStringArr)}
                                        callback={(s) => { handleChange("prim", s) }}
                                    />
                                }
                                secondary={
                                    <>
                                        <TextEdit
                                            value={state.secA}
                                            label="Secondary 1"
                                            groups={getOptions(headerStringArr)}
                                            callback={(s) => { handleChange("secA", s) }}

                                        />
                                        {bull}
                                        <TextEdit
                                            value={state.secB}
                                            label="Secondary 2"
                                            groups={getOptions(headerStringArr)}
                                            callback={(s) => { handleChange("secB", s) }}
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
                                                            headerCheckedArr={[state.prim, state.secA, state.secB]}
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
                                                                    headerCheckedArr={[state.prim, state.secA, state.secB]}
                                                                />
                                                            </>))}

                                                        </>

                                                    ))}
                                                </>
                                            )}


                                            {/* <ListCsvItemSimple
                                                valueArr={[String(sumArray(group.listitems, sumField)), "Summe"]}
                                            />
                                            <Divider></Divider> */}



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
