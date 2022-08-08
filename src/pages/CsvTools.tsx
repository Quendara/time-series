import React, { Component, useState, useEffect } from "react";


// import { Row, Col, List, Button, DatePicker, Card, version } from "antd";

import { Toolbar, Box, Button, TextField, Grid, Card, CardContent, FormGroup, Paper, ListItem, ListItemText, Divider, Stepper, Step, StepButton } from '@material-ui/core/';

import { MyCard, MyCardHeader, MyTextareaAutosize } from "../components/StyledComponents"

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

const fullMatch = "#00a152"
const orange = "#ff9100"
const blue = "#2979ff"




interface Props {

    line: any; // json data
    headerCheckedArr: string[]; // parsed header


}
const bull = <span style={{ "margin": "5px" }}>•</span>;

const ListCsvItem = (props: Props) => {

    const getValueOf = (column: number) => {

        const keyName = props.headerCheckedArr[column]
        return props.line[keyName]

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
                        {bull}
                        {getValueOf(2)}
                    </>
                }
            />

        </ListItem>
    )

}

export const CsvTools = ({ }) => {

    const [activeStep, setActiveStep] = React.useState(0);

    const [list1, setList1] = useState(l1);

    const [headerStringArr, setHeaderStringArr] = useState<string[]>([]);

    const [data, setData] = useState<any>([]);

    const [groupname, setGroupname] = useState<string>("HauptprojektBez");
    const [seperator, setSeperator] = useState<string>(";");
    const [sumField, setSumField] = useState<string>("Spanne");

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

    }, [state, list1]); // second parameter avoid frequent loading

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

                    <Grid item xs={3} >
                        <Box style={{ background: blue, padding: "5px" }} >Seperator</Box>
                        <TextEdit
                            value={seperator}
                            label="Primary"
                            groups={[{ value: "\t" }, { value: ";" }]}
                            callback={(s) => { setSeperator(s) }}
                        />
                    </Grid>

                    <Box style={{ background: blue, padding: "5px" }} >Input - nLines:  {data?.length}</Box>
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
                </Grid>
            }
            {activeStep === 1 &&
                <>
                    <Grid item xs={12} >
                        <MyCard>
                            <Grid container justify="flex-start" spacing={1} >

                                <Grid item xs={3} >
                                    <Box style={{ background: blue, padding: "5px" }} >Group</Box>
                                    <TextEdit
                                        value={groupname}
                                        label="Primary"
                                        groups={headerStringArr.map(x => { return { value: x } })}
                                        callback={(s) => { setGroupname(s) }}
                                    />
                                </Grid>
                                <Grid item xs={3} >
                                    <Box style={{ background: blue, padding: "5px" }} >Sum Field</Box>
                                    <TextEdit
                                        value={sumField}
                                        label="Primary"
                                        groups={headerStringArr.map(x => { return { value: x } })}
                                        callback={(s) => { setSumField(s) }}
                                    />
                                </Grid>                                
                                <Grid item xs={3} >
                                    <Box style={{ background: blue, padding: "5px" }}>Specify your Layout </Box>

                                    <ListItem>
                                        <ListItemText
                                            primary={
                                                <TextEdit
                                                    value={state.prim}
                                                    label="Primary"
                                                    groups={headerStringArr.map(x => { return { value: x } })}
                                                    callback={(s) => { handleChange("prim", s) }}
                                                />
                                            }
                                            secondary={
                                                <>
                                                    <TextEdit
                                                        value={state.secA}
                                                        label="Secondary 1"
                                                        groups={headerStringArr.map(x => { return { value: x } })}
                                                        callback={(s) => { handleChange("secA", s) }}

                                                    />
                                                    {bull}
                                                    <TextEdit
                                                        value={state.secB}
                                                        label="Secondary 2"
                                                        groups={headerStringArr.map(x => { return { value: x } })}
                                                        callback={(s) => { handleChange("secB", s) }}
                                                    />
                                                </>
                                            }
                                        />
                                    </ListItem>
                                </Grid>
                            </Grid>
                        </MyCard>
                    </Grid>
                    <Grid item xs={12} >
                        <Grid container justify="flex-start" spacing={1} >
                            {
                                groups.map((group, index) => (

                                    <Grid item xs={2} >
                                        <MyCard>
                                            <MyCardHeader subheader={group.value} />

                                            { sumArray( group.listitems, sumField ) }

                                            {group.listitems.map((line: any) => (

                                                <ListCsvItem
                                                    line={line}
                                                    headerCheckedArr={[state.prim, state.secA, state.secB]}
                                                />
                                            ))}
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
