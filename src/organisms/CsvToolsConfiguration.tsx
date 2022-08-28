import React, { Component, useState, useEffect } from "react";


// import { Row, Col, List, Button, DatePicker, Card, version } from "antd";

import { Toolbar, Box, Button, TextField, Grid, Chip, Card, CardContent, FormGroup, Paper, ListItem, ListItemText, Divider, Stepper, Step, StepButton } from '@material-ui/core/';
import { AlertTitle, Alert } from '@material-ui/lab';



import { MyCard, MyCardHeader, MySubCardHeader, MyTextareaAutosize } from "../components/StyledComponents"

import { TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import { TextEdit } from "../components/TextEdit";

import { findUnique, csvToJson, sumArray } from "../components/helpers";

const blue = "#02735E"
const bull = <span style={{ "margin": "5px" }}>•</span>;

interface ConfigFieldProps {
    header: string;
    children: React.ReactNode
}

export const ConfigItem = (props: ConfigFieldProps) => {

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
    header: string[];
    configuation: string;
    configCallback :  ( x:string ) => void
    // children: React.ReactNode;
    
}



export const CsvToolsConfiguration = ( props : Props ) => {
    
    // const [headerStringArr, setHeaderStringArr] = useState<string[]>([]);
    const [configData, setConfigData] = useState( "" );

    const [seperator, setSeperator] = useState<string>(";");
    const [groupname, setGroupname] = useState<string>("");
    const [subgroupname, setSubGroupname] = useState<string>("");
    const [sumField, setSumField] = useState<string>("");
    const [columnWidth, setColumnWidth] = useState<string>("3");
    const [state, setState] = React.useState({
        primary: "",
        secondaryA: "",
        secondaryB: ""
    });

    const getOptions = (headerStringArr: string[]) => {
        let arr: any = headerStringArr.map(x => { return { value: x } })
        arr.push({ key: "EMPTY", value: "" })

        return arr
    }    

    const handleChange = (key: string, value: string) => {
        setState({ ...state, [key]: value });
        console.log(state)
    };

    useEffect(() => {
        
        props.configCallback( createJsonConfig() )

    }, [ groupname, subgroupname, seperator, sumField, columnWidth, state  ]); 



    const createJsonConfig = () => {

        const json = {
            "groupname": groupname,
            "subgroupname": subgroupname,
            "sumField": sumField,
            "seperator": seperator,
            "columnWidth": columnWidth,
            "format.primary": state.primary,
            "format.secondaryA": state.secondaryA,
            "format.secondaryB": state.secondaryB
        }

        return JSON.stringify(json, null, 2)
    }

    const setJsonConfig = (data: string) => {
        setConfigData(data)
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
        <Grid container justify="flex-start" spacing={1} >
   
                    <Grid item xs={12}   >
                        <MyCard>
                            <Box style={{ background: blue, padding: "5px" }} >Input </Box>
                            <MyTextareaAutosize
                                value={configData ? configData : createJsonConfig()}
                                rowsMin={20}
                                onChange={e => setJsonConfig(e.target.value)} />

                            <Divider></Divider>
                            <ListItemText
                                primary="groupname"
                                secondary={groupname}
                            />
                        </MyCard>
                    </Grid>
                    <Grid item xs={3} >
                            <ConfigItem header="Seperator" >
                                <TextEdit
                                    value={seperator}
                                    label="Primary"
                                    groups={[{ value: "\t", key: "Tab" }, { value: ",", key: "Komma" }, { value: ";", key: "Semikolon" }]}
                                    callback={(s) => { setSeperator(s) }}
                                />
                            </ConfigItem>
                        </Grid>                    
                
            <Grid item xs={3} >
                <ConfigItem header="Group" >
                    <TextEdit
                        value={groupname}
                        label="Primary"
                        groups={getOptions( props.header )}
                        callback={(s) => { setGroupname(s) }}
                    />
                </ConfigItem>
            </Grid>
            <Grid item xs={3} >
                <ConfigItem header="SubGroup" >
                    <TextEdit
                        value={subgroupname}
                        label="Primary"
                        groups={getOptions( props.header )}
                        callback={(s) => { setSubGroupname(s) }}
                    />
                </ConfigItem>
            </Grid>
            <Grid item xs={3} >
                <ConfigItem header="Sum Field" >
                    <TextEdit
                        value={sumField}
                        label="Primary"
                        groups={getOptions( props.header )}
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
                                groups={getOptions( props.header )}
                                callback={(s) => { handleChange("primary", s) }}
                            />
                        }
                        secondary={
                            <>
                                <TextEdit
                                    value={state.secondaryA}
                                    label="SecondaryA"
                                    groups={getOptions( props.header )}
                                    callback={(s) => { handleChange("secondaryA", s) }}

                                />
                                {bull}
                                <TextEdit
                                    value={state.secondaryB}
                                    label="SecondaryB"
                                    groups={getOptions( props.header )}
                                    callback={(s) => { handleChange("secondaryB", s) }}
                                />
                            </>
                        }
                    />

                </ConfigItem>
            </Grid>
        </Grid>

    )
}