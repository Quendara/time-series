import React, { Component, useState, useEffect } from "react";


// import { Row, Col, List, Button, DatePicker, Card, version } from "antd";

import { Toolbar, Box, Button, TextField, Grid, Card, CardContent, FormGroup, Paper, ListItem, ListItemText, Divider } from '@material-ui/core/';

import { MyCard, MyCardHeader, MyTextareaAutosize } from "../components/StyledComponents"

import { TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import { TextEdit } from "../components/TextEdit";

import { findUnique } from "../components/helpers";

const doku = `---
Brackets
`

const l1 = `Jahr;Monat;Woche;Teilwoche;Teilwoche bis;Name;Vorname;MitId;K�rzel;HauptprojektBez;HauptprojektNr;TeilprojektBez;TeilprojektNr;Arbeitsauftrag;Spanne;Tag;Bemerkung;(Projekt-)Typ;Fakt_Kennz;Erledigt;Freigegeben;Mitarb_BU;Mitarb_Bereich;Mitarb_Abteilung;Mitarb_Team;Mitarb_OrgNr
2022;6;24;"N";"";"Garstka";"Mark-Andr�";10066;GaM;"DHL (Hauptprojekt)";"8441005F";"DHL, nGKP";"43201135";"BTG-Scrum Master";"1";13.06.2022;"Daily";"EX";"J";N;N;"BL Digital Transformation";"BL Digital Transformation";"BL DT Software Factory";"BL DT Software Factory 02";"01_BL-DE-AAP-02_6"
2022;6;24;"N";"";"Garstka";"Mark-Andr�";10066;GaM;"Daimler, SCiP Verbauquote";"43201225";"Daimler, SCiP Verbauquote";"43201225";"BTG-Skill Klasse B1-B, Scrum Master";"1";13.06.2022;"Daily";"EX";"J";N;N;"BL Digital Transformation";"BL Digital Transformation";"BL DT Software Factory";"BL DT Software Factory 02";"01_BL-DE-AAP-02_6"
2022;6;24;"N";"";"Garstka";"Mark-Andr�";10066;GaM;"Mercedes-Benz Mobility AG, Comet 2022";"43201239";"Mercedes-Benz Mobility AG, Comet 2022";"43201239";"BTG-Projektleitung";"1";13.06.2022;"Projektleitung";"EX";"J";N;N;"BL Digital Transformation";"BL Digital Transformation";"BL DT Software Factory";"BL DT Software Factory 02";"01_BL-DE-AAP-02_6"
2022;6;24;"N";"";"Garstka";"Mark-Andr�";10066;GaM;"Daimler Truck Financial Services GmbH, COMET f�r DTFS 2022";"43201238";"Daimler Truck Financial Services GmbH, COMET f�r D";"43201238";"BTG-Umsetzung";"1";13.06.2022;"Daily und Follow ups";"EX";"J";N;N;"BL Digital Transformation";"BL Digital Transformation";"BL DT Software Factory";"BL DT Software Factory 02";"01_BL-DE-AAP-02_6"
2022;6;24;"N";"";"Garstka";"Mark-Andr�";10066;GaM;"DHL (Hauptprojekt)";"8441005F";"DHL, nGKP";"43201135";"BTG-Scrum Master";"1";13.06.2022;"Sprint Wechsel Vorbereitung";"EX";"J";N;N;"BL Digital Transformation";"BL Digital Transformation";"BL DT Software Factory";"BL DT Software Factory 02";"01_BL-DE-AAP-02_6"
2022;6;24;"N";"";"Garstka";"Mark-Andr�";10066;GaM;"2022 VU - Software Factory (neu g�ltig ab 30.05.22) !!";"43101016";"2022 VU - Software Factory (neu g�ltig ab 30.05.22";"43101016";"BTG-Diverse VU";"2";13.06.2022;"SCiP Projekte";"VU";"N";N;N;"BL Digital Transformation";"BL Digital Transformation";"BL DT Software Factory";"BL DT Software Factory 02";"01_BL-DE-AAP-02_6"
2022;6;24;"N";"";"Garstka";"Mark-Andr�";10066;GaM;"BL DE AaP 02";"43221002";"BL DE AaP 02";"43221002";"NON-Weiterbildung";"1";13.06.2022;"AWS";"IN";"N";N;N;"BL Digital Transformation";"BL Digital Transformation";"BL DT Software Factory";"BL DT Software Factory 02";"01_BL-DE-AAP-02_6"
2022;6;24;"N";"";"Garstka";"Mark-Andr�";10066;GaM;"";"";"";"";"";"7";14.06.2022;"Sprint Wechsel";"";"N";N;N;"BL Digital Transformation";"BL Digital Transformation";"BL DT Software Factory";"BL DT Software Factory 02";"01_BL-DE-AAP-02_6"
2022;6;24;"N";"";"Garstka";"Mark-Andr�";10066;GaM;"Daimler Truck Financial Services GmbH, COMET f�r DTFS 2022";"43201238";"Daimler Truck Financial Services GmbH, COMET f�r D";"43201238";"BTG-Projektleitung";"1";14.06.2022;"Weekly, Projektleitung";"EX";"J";N;N;"BL Digital Transformation";"BL Digital Transformation";"BL DT Software Factory";"BL DT Software Factory 02";"01_BL-DE-AAP-02_6"
2022;6;24;"N";"";"Garstka";"Mark-Andr�";10066;GaM;"2022 VU - Software Factory (neu g�ltig ab 30.05.22) !!";"43101016";"2022 VU - Software Factory (neu g�ltig ab 30.05.22";"43101016";"BTG-Diverse VU";"1";15.06.2022;"VU IHK";"VU";"N";N;N;"BL Digital Transformation";"BL Digital Transformation";"BL DT Software Factory";"BL DT Software Factory 02";"01_BL-DE-AAP-02_6"
2022;6;24;"N";"";"Garstka";"Mark-Andr�";10066;GaM;"DHL (Hauptprojekt)";"8441005F";"DHL, nGKP";"43201135";"BTG-Scrum Master";"1,5";15.06.2022;"SoS Extended";"EX";"J";N;N;"BL Digital Transformation";"BL Digital Transformation";"BL DT Software Factory";"BL DT Software Factory 02";"01_BL-DE-AAP-02_6"
2022;6;24;"N";"";"Garstka";"Mark-Andr�";10066;GaM;"Daimler, SCiP Verbauquote";"43201225";"Daimler, SCiP Verbauquote";"43201225";"BTG-Skill Klasse B1-B, Scrum Master";"4";15.06.2022;"Daily, Refinements";"EX";"J";N;N;"BL Digital Transformation";"BL Digital Transformation";"BL DT Software Factory";"BL DT Software Factory 02";"01_BL-DE-AAP-02_6"
2022;6;24;"N";"";"Garstka";"Mark-Andr�";10066;GaM;"Mercedes-Benz Mobility AG, Comet 2022";"43201239";"Mercedes-Benz Mobility AG, Comet 2022";"43201239";"BTG-Projektleitung";"1";15.06.2022;"Weekly";"EX";"J";N;N;"BL Digital Transformation";"BL Digital Transformation";"BL DT Software Factory";"BL DT Software Factory 02";"01_BL-DE-AAP-02_6"
2022;6;24;"N";"";"Garstka";"Mark-Andr�";10066;GaM;"Mercedes-Benz Mobility AG, Comet 2022";"43201239";"Mercedes-Benz Mobility AG, Comet 2022";"43201239";"BTG-Umsetzung";"0,5";15.06.2022;"Daily";"EX";"J";N;N;"BL Digital Transformation";"BL Digital Transformation";"BL DT Software Factory";"BL DT Software Factory 02";"01_BL-DE-AAP-02_6"
`


const l2 = `case $1:
return $1
`

const l3 = `(.*)`

const fullMatch = "#00a152"
const orange = "#ff9100"
const blue = "#2979ff"

const seperator = ";"


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

    const [list1, setList1] = useState(l1);

    const [result, setResult] = useState("");
    // const [headerArr, setHeaderArr] = useState({});

    const [headerStringArr, setHeaderStringArr] = useState<string[]>([]);
    const [csvLineArr, setCsvLineArr] = useState<string[]>([]);

    const [data, setData] = useState<any>([]);
    const [groupname, setGroupname] = useState<string>("HauptprojektBez");


    const csvToJson = (csv: string) => {
        // Convert the data to String and
        // split it in an array
        var array = csv.toString().split("\n");

        // All the rows of the CSV will be
        // converted to JSON objects which
        // will be added to result in an array
        let result = [];

        // The array[0] contains all the
        // header columns so we store them
        // in headers array
        let headers = array[0].split(seperator)

        // Since headers are separated, we
        // need to traverse remaining n-1 rows.
        for (let i = 1; i < array.length - 1; i++) {
            let obj: any = {}

            // Create an empty object to later add
            // values of the current row to it
            // Declare string str as current array
            // value to change the delimiter and
            // store the generated string in a new
            // string s
            let str = array[i]
            let s = ''

            // By Default, we get the comma separated
            // values of a cell in quotes " " so we
            // use flag to keep track of quotes and
            // split the string accordingly
            // If we encounter opening quote (")
            // then we keep commas as it is otherwise
            // we replace them with pipe |
            // We keep adding the characters we
            // traverse to a String s
            let flag = 0
            for (let ch of str) {
                if (ch === '"' && flag === 0) {
                    flag = 1
                }
                else if (ch === '"' && flag == 1) flag = 0
                if (ch === seperator && flag === 0) ch = '|'
                if (ch !== '"') s += ch
            }

            // Split the string using pipe delimiter |
            // and store the values in a properties array
            let properties = s.split("|")

            // For each header, if the value contains
            // multiple comma separated data, then we
            // store it in the form of array otherwise
            // directly the value is stored
            for (let j in headers) {
                if (properties[j].includes(seperator)) {
                    obj[headers[j]] = properties[j]
                        .split(seperator).map(item => item.trim())
                }
                else obj[headers[j]] = properties[j]
            }

            // Add the generated object to our
            // result array
            result.push(obj)
        }

        // Convert the resultant array to json and
        // generate the JSON output file.
        // let json = JSON.stringify(result);
        console.log(result)
        return result
    }



    const [state, setState] = React.useState({
        prim: "Bemerkung",
        secA: "Arbeitsauftrag",
        secB: "Spanne"
    });


    useEffect(() => {
        performHandle()

    }, []); // second parameter avoid frequent loading

    const performHandle = () => {

        let localHeaderArr = {}
        let localHeaderStringArr: string[] = []

        let localResult = ""

        setData(csvToJson(list1))

        const lines = list1.split("\n")
        setCsvLineArr(lines)

        for (let i = 0; i < lines.length; ++i) {

            let line = lines[i].trim()
            if (line.length === 0) continue;

            const lineArr = lines[i].split(seperator)

            // so long header array is 0 
            if (localHeaderStringArr.length === 0 && lineArr.length > 1) {

                localHeaderStringArr = lines[i].split(seperator)

                lineArr.map((name, i) => {
                    return { ...localHeaderArr, [name]: { index: i, checked: false } }
                })
                //  = lines[i].split(seperator)
            }
        }

        setResult(localResult)
        setHeaderStringArr(localHeaderStringArr)

        // setResult(headerArr.join(" -- "))
    }



    const handleChange = (key: string, value: string) => {
        setState({ ...state, [key]: value });
        console.log(state)
    };


    const groups = findUnique(data, groupname, false)



    return (

        <Grid container justify="flex-start" spacing={1} >
            <Grid item xs={12}   >
                <Box style={{ background: blue, padding:"5px" }} >Input</Box>
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
            <Grid item xs={12} >
                <MyCard>
                    <Grid container justify="flex-start" spacing={1} >

                        <Grid item xs={3} >
                            <Box style={{ background: blue, padding:"5px" }} >Group</Box>
                            <TextEdit
                                value={groupname}
                                label="Primary"
                                groups={headerStringArr.map(x => { return { value: x } })}
                                callback={(s) => { setGroupname(s) }}
                            />
                        </Grid>
                        <Grid item xs={3} >
                            <Box style={{ background: blue, padding:"5px" }}>Specify your Layout </Box>

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

            
        </Grid >



    )
}
