import React, { useState, useEffect } from "react";

import { Box, Grid, ListItem, ListItemText, Divider } from '@mui/material';
import { MyCard, MyTextareaAutosize } from "../components/StyledComponents"

import { TextEdit } from "../components/TextEdit";

const blue = "#02735E"
const bull: any = <span style={{ "margin": "5px" }}>•</span>;

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
    configCallback: (x: string) => void
    // children: React.ReactNode;

}



export const CsvToolsConfiguration = (props: Props) => {

    // const [headerStringArr, setHeaderStringArr] = useState<string[]>([]);
    const [configData, setConfigData] = useState("");

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

    // useEffect(() => {

    //     setJsonConfig( props.configuation )

    // }, [props.configuation]);    

    useEffect(() => {

        props.configCallback(createJsonConfig())

    }, [groupname, subgroupname, seperator, sumField, columnWidth, state]);



    const createJsonConfig = ( config? : string ) => {

        if( config !== undefined ){
            setJsonConfig( config )
            return config
        }
        

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
        <>
            <Grid container justifyContent="flex-start" spacing={1} p="10px">
                <Grid item xs={6}   >
                    <MyCard>
                        <Box style={{ background: blue, padding: "5px" }} >Config </Box>
                        <MyTextareaAutosize
                            value={ configData ? configData : createJsonConfig( props.configuation )}
                            minRows={20}
                            onChange={e => setJsonConfig(e.target.value)} />

                        <Divider></Divider>
                        <ListItemText
                            primary="groupname"
                            secondary={groupname}
                        />
                    </MyCard>
                </Grid>

                <Grid item xs={6}   >
                    <Grid container justifyContent="flex-start" spacing={1} >
                        <Grid item xs={6} >
                            <ConfigItem header="Seperator" >
                                <TextEdit
                                    value={seperator}
                                    label="Seperator"
                                    groups={[{ value: "\t", key: "Tab" }, { value: ",", key: "Komma" }, { value: ";", key: "Semikolon" }]}
                                    callback={(s) => { handleChange("seperator", s) }}
                                />
                            </ConfigItem>
                        </Grid>
                        <Grid item xs={6} >
                            <ConfigItem header="Sum Field" >
                                <TextEdit
                                    value={sumField}
                                    label="Sum Field"
                                    groups={getOptions(props.header)}
                                    callback={(s) => { setSumField(s) }}
                                />
                            </ConfigItem>
                        </Grid>

                        <Grid item xs={6} >
                            <ConfigItem header="Group" >
                                <TextEdit
                                    value={groupname}
                                    label="Primary"
                                    groups={getOptions(props.header)}
                                    callback={(s) => { setGroupname(s) }}
                                />
                            </ConfigItem>
                        </Grid>
                        <Grid item xs={6} >
                            <ConfigItem header="SubGroup" >
                                <TextEdit
                                    value={subgroupname}
                                    label="Primary"
                                    groups={getOptions(props.header)}
                                    callback={(s) => { setSubGroupname(s) }}
                                />
                            </ConfigItem>
                        </Grid>

                        {/* <Grid item xs={6} >
                            <ConfigItem header="Column Width" >
                                <TextEdit
                                    value={columnWidth}
                                    label="Primary"
                                    groups={[{ value: "2" }, { value: "3" }, { value: "4" }, { value: "6" }, { value: "12" }]}
                                    callback={(s) => { setColumnWidth(s) }}
                                />
                            </ConfigItem>
                        </Grid> */}

                        <Grid item xs={12} >
                            <ConfigItem header="Specify your Layout " >

                                <Grid container justifyContent="flex-start" spacing={2} >
                                    <Grid item xs={12} >
                                        <TextEdit
                                            value={state.primary}
                                            label="Primary"
                                            groups={getOptions(props.header)}
                                            callback={(s) => { handleChange("primary", s) }}
                                        />
                                    </Grid>
                                    <Grid item xs={5} >
                                        <TextEdit
                                            value={state.secondaryA}
                                            label="SecondaryA"
                                            groups={getOptions(props.header)}
                                            callback={(s) => { handleChange("secondaryA", s) }}

                                        />
                                    </Grid>
                                    <Grid item xs={1} >
                                        {bull}
                                    </Grid>
                                    <Grid item xs={6} >
                                        <TextEdit
                                            value={state.secondaryB}
                                            label="SecondaryB"
                                            groups={getOptions(props.header)}
                                            callback={(s) => { handleChange("secondaryB", s) }}
                                        />
                                    </Grid>
                                </Grid>

                            </ConfigItem>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>

        </>

    )
}