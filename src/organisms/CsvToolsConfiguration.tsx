import React, { useState, useEffect, useContext } from "react";

import { Box, Grid, ListItem, ListItemText, Divider } from '@mui/material';
import { MyCard, MyTextareaAutosize } from "../components/StyledComponents"

import { TextEdit } from "../components/TextEdit";
import { CsvContext } from "../context/CsvProvider";

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
    // configuation: string;
    // configCallback: (x: string) => void
    // children: React.ReactNode;

}



export const CsvToolsConfiguration = (props: Props) => {

    // const [headerStringArr, setHeaderStringArr] = useState<string[]>([]);
    const myContext =  useContext(CsvContext)
    
    const getOptions = (headerStringArr: string[]) => {
        let arr: any = headerStringArr.map(x => { return { value: x } })
        arr.push({ key: "EMPTY", value: "" })

        return arr
    }

    const handleChange = (key: string, value: string) => {
        myContext.setFormat({ ...myContext.format, [key]: value });
        console.log( "handleChange" , myContext.format)
    };


    useEffect(() => {

        // props.configCallback(createJsonConfig())

    }, [ myContext.groupname, myContext.subgroupname, myContext.seperator, myContext.sumField, myContext.columnWidth ]);



    const createJsonConfig = ( ) => {
    
        const json = {
            "groupname": myContext.groupname,
            "subgroupname": myContext.subgroupname,
            "sumField": myContext.sumField,
            "seperator": myContext.seperator,
            "columnWidth": myContext.columnWidth,
            "format.primary": myContext.format.primary,
            "format.secondaryA": myContext.format.secondaryA,
            "format.secondaryB": myContext.format.secondaryB
        }

        return JSON.stringify(json, null, 2)
    }

    // const setJsonConfig = (data: string) => {
    //     setConfigData(data)
    //     const jsonObj: any = JSON.parse(data);

    //     console.log("groupname", jsonObj.hasOwnProperty('groupname'))

    //     jsonObj.hasOwnProperty('groupname') ? setGroupname(jsonObj['groupname']) : ""
    //     jsonObj.hasOwnProperty('subgroupname') ? setSubGroupname(jsonObj['subgroupname']) : ""
    //     jsonObj.hasOwnProperty('sumField') ? setSumField(jsonObj['sumField']) : ""
    //     jsonObj.hasOwnProperty('seperator') ? setSeperator(jsonObj['seperator']) : ""

    //     jsonObj.hasOwnProperty('columnWidth') ? setColumnWidth(jsonObj['columnWidth']) : ""
    //     jsonObj.hasOwnProperty('format.primary') ? handleChange("primary", jsonObj['format.primary']) : ""
    //     jsonObj.hasOwnProperty('format.secondaryA') ? handleChange("secondaryA", jsonObj['format.secondaryA']) : ""
    //     jsonObj.hasOwnProperty('format.secondaryB') ? handleChange("secondaryB", jsonObj['format.secondaryB']) : ""
    // }

    return (
        <>
            <Grid container justifyContent="flex-start" spacing={1} p="10px">
                <Grid item xs={6}   >
                    <MyCard>
                        <Box style={{ background: blue, padding: "5px" }} >Config </Box>
                        <MyTextareaAutosize
                            value={ createJsonConfig() }
                            minRows={20} />
                            {/* onChange={e => setJsonConfig(e.target.value)} /> */}

                        <Divider></Divider>
                        <ListItemText
                            primary="groupname"
                            secondary={ myContext.groupname}
                        />
                    </MyCard>
                </Grid>

                <Grid item xs={6}   >
                    <Grid container justifyContent="flex-start" spacing={1} >
                        <Grid item xs={6} >
                            <ConfigItem header="Seperator" >
                                <TextEdit
                                    value={ myContext.seperator}
                                    label="Seperator"
                                    groups={[{ value: "\t", key: "Tab" }, { value: ",", key: "Komma" }, { value: ";", key: "Semikolon" }]}
                                    callback={(s) => { handleChange("seperator", s) }}
                                />
                            </ConfigItem>
                        </Grid>
                        <Grid item xs={6} >
                            <ConfigItem header="Sum Field" >
                                <TextEdit
                                    value={ myContext.sumField}
                                    label="Sum Field"
                                    groups={getOptions(props.header)}
                                    callback={(s) => { myContext.setSumField(s) }}
                                />
                            </ConfigItem>
                        </Grid>

                        <Grid item xs={6} >
                            <ConfigItem header="Group" >
                                <TextEdit
                                    value={myContext.groupname}
                                    label="Primary"
                                    groups={getOptions(props.header)}
                                    callback={(s) => { myContext.setGroupname(s) }}
                                />
                            </ConfigItem>
                        </Grid>
                        <Grid item xs={6} >
                            <ConfigItem header="SubGroup" >
                                <TextEdit
                                    value={ myContext.subgroupname}
                                    label="Primary"
                                    groups={getOptions(props.header)}
                                    callback={(s) => { myContext.setSubGroupname(s) }}
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
                                            value={myContext.format.primary}
                                            label="Primary"
                                            groups={getOptions(props.header)}
                                            callback={(s) => { handleChange("primary", s) }}
                                        />
                                    </Grid>
                                    <Grid item xs={5} >
                                        <TextEdit
                                            value={myContext.format.secondaryA}
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
                                            value={ myContext.format.secondaryB}
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