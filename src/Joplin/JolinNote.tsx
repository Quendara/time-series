import { Grid, Card, CardContent, Stack, ListItemButton, ListItemIcon, Icon, ListItemText, Typography, IconButton, CardActions, Button, Box, CardHeader, Tab } from "@mui/material";
// import { useTheme } from "@mui/styles";
import { Theme, useTheme } from '@mui/material/styles';

import React, { useState } from "react";
import { JolinNoteLink, JolinResource } from "./JolinResource";
// import { muiColor, getPaperColor } from "../Atoms/Atoms";


export type NoteStlye = 'card' | 'list' | 'body' | 'tab' | 'actions'
export type NotePriority = '1-urgent' | '2-normal' | "3-done"
export type NoteOrder = 'date' | 'title' | 'prio'

export type muiColor = 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' | undefined


export interface JoplinData {
    parent_id: string;
    title: string;
    body: string;
    updated_time: string;
    id: string;
}


interface NoteProps {
    data: JoplinData
    folders: JoplinData[]
    xs: number;
    renderAs: NoteStlye;
    defaultIcon?: string;

    selectedId?: string;
    selectCallback: (id: string) => void;
}

export const getPaperColor = (theme: Theme, color: muiColor): any => {

    let sx = {}
    let fix = { width: "100%" }

    switch (color) {
        // case "primary": return {  backgroundColor: theme['palette']['primary'][theme.mode] }
        case "error":
            sx = {
                backgroundColor: theme.palette.mode === 'dark' ? 'rgb(22, 11, 11)' : 'rgb(253, 237, 237)',
                color: theme.palette.mode === 'dark' ? theme.palette.error.light : theme.palette.error.dark,
            }
            break;
        case "success":
            sx = {
                backgroundColor: theme.palette.mode === 'dark' ? 'rgb(12, 19, 13)' : 'rgb(237, 247, 237)',
                color: theme.palette.mode === 'dark' ? theme.palette.success.light : theme.palette.success.dark
            }
            break;
        case "info":
        case "primary":
            sx = {
                backgroundColor: theme.palette.mode === 'dark' ? 'rgb(7, 19, 24)' : 'rgb(229, 246, 253)',
                color: theme.palette.mode === 'dark' ? theme.palette.info.light : theme.palette.info.dark
            }
            break;
        case "warning":
            sx = {
                backgroundColor: theme.palette.mode === 'dark' ? 'rgb(25, 18, 7)' : 'rgb(255, 244, 229)',
                //color: theme.palette.mode === 'dark' ? theme.palette.success.dark : theme.palette.success.light
            }
            break;
        default: return fix;
    }

    const ret = { ...sx, ...fix }
    return ret
};

export const folderNameFromId = (folders: JoplinData[], id: string) => {
    const filteredFolders = folders.filter((folder: any) => { return id === folder.id })

    let folderTitle = "Root"
    if (filteredFolders.length === 1) {
        const c: any = filteredFolders[0]
        folderTitle = c.title
    }

    return folderTitle
}



export const getNotePriority = (note: JoplinData) => {

    let prio: NotePriority = '2-normal'

    if (note.body !== undefined) {
        if (note.body.trim() === "keine") {
            return '3-done'
        }
        if (note.body.includes("urgent")) {
            return '1-urgent'
        }
    }
    return prio

}

export const JolinNote = (props: NoteProps) => {
    const theme = useTheme();
    // const [showMore, setShowMore] = useState(!props.collapsed);

    const folderTitle = folderNameFromId(props.folders, props.data.parent_id)

    const openNoteInJoplin = (node_id: string) => {
        // # alert("openNoteInJoplin " + node_id )

        const url = "joplin://x-callback-url/openNote?id=" + node_id
        window.open(url, "_blank")
        //note id>
    }

    let myColor: muiColor = undefined
    let myIcon: string = props.defaultIcon ? props.defaultIcon : "text_snippet"

    const notePri = getNotePriority(props.data)

    if (notePri === "3-done") {
        myColor = "success"
        myIcon = "task_alt"

    }
    if (notePri === "1-urgent") {
        myColor = "error"
        myIcon = "report"
    }

    const timestampToDate = (timestamp: string) => {
        const date = new Date(timestamp)
        return date.toISOString().split('T')[0]
    }

    const hasMore = props.data.body && props.data.body.trim().split("\n").length > 1


    const renderHeaderLine = (line: string) => {
        const regex = /^(#+)\s+(.+)$/gm;
        const match = regex.exec(line)

        return (
            <>
                <Box sx={{ color: theme.palette.grey[500], float: "left", mr: 1 }} >{match?.at(1)}</Box>
                {match?.at(2)}
            </>
        )
    }

    const parseLine = ( line: string) => {

        if( line.trim().length === 0 ){
            return( <br/> )
        }

        // check header
        if (line.startsWith("### ")) {
            return (<Typography sx={{ fontSize: "1.1em", fontWeight: 700 }} component="p">{renderHeaderLine(line)} </Typography>)
        }
        if (line.startsWith("## ")) {
            return (<Typography sx={{ fontSize: "1.3em", fontWeight: 700, mb: 0.5 }} component="p">{renderHeaderLine(line)} </Typography>)
        }
        if (line.startsWith("# ")) {
            return (<Typography sx={{ fontSize: "1.5em", fontWeight: 700, mb: 0.5 }} component="p">{renderHeaderLine(line)} </Typography>)
        }
        // check if link is resource / image
        // - [Abteilung](:/504e6b5cbd5e4d268c0f81bdd4b281fc)

        // const str = "[Name](:/504e6b5cbd5e4d268c0f81bdd4b281fc)";
        // const regex = /\[([^\]]+)\]\(:\/([a-zA-Z0-9]+)\)/;
        // const regex = /\[([^\]]+)\]\((:?\/?([a-zA-Z0-9]+))\)/;
        // const regex = /\[([^\]]+)\]\s*\(([a-zA-Z0-9]+)\)/;
        // const regex = /\[([\w\ ]+)\]\s*\(:\/(.+?)\)/;
        const regex = /\[([^\]]+)\]\s*\(:\/(.+?)\)/;
        // const regex = /\[([^\]]+)\]\s*\(:\/(.+?)\)/;
        const match = line.match(regex);

        if (match ) {
            // const id = match[1];
            const name = match[1]; // Der Name innerhalb der eckigen Klammern
            const id = match[2];   // Die ID nach `(:/` und vor `)`

            return (
            <>
                <JolinResource id={ id }  />
                <JolinNoteLink id={ id } name={name} selectCallback={props.selectCallback} />
            
            </>)
        } else {
            return (<Typography sx={{ fontSize: "1.1em", fontWeight: 400 }} >{line} </Typography>)
        }
    }


    const renderBody = () => {
        return (
            <>
                <Typography variant="body1" >
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="flex-start"
                        spacing={2}>

                        <Box>
                            {props.data.body.trim().split("\n").map(line => {                            
                                return ( parseLine( line ) )
                            })}
                        </Box>

                    </Stack>
                </Typography>
            </>)
    }

    const renderActions = () => (
        <Button onClick={() => openNoteInJoplin(props.data.id)} >Open in app</Button>
    )

    // openNoteInJoplin(props.data.id)
    const renderAsCard = () => (
        <Grid item xs={props.xs}>
            <Card sx={getPaperColor(theme, myColor)} >
                <CardContent sx={{ borderBottom: "1px solid #ddd" }} >
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        spacing={0}>

                        <ListItemButton onClick={() => props.selectCallback(props.data.id)} color={myColor}>
                            <ListItemIcon >
                                <Icon color={myColor}>
                                    {myIcon}
                                </Icon>
                            </ListItemIcon>
                            <ListItemText
                                primary={props.data.title}
                                secondary={folderTitle} />

                        </ListItemButton>
                        <Typography color="text.secondary">
                            {timestampToDate(props.data.updated_time)}
                        </Typography>
                    </Stack>
                </CardContent>
                <CardContent >

                    {renderBody()}
                </CardContent>
                <CardContent >

                </CardContent>

                <CardActions>
                    {renderActions()}
                </CardActions>

            </Card>
        </Grid>
    )

    const renderAsList = () => (
        <ListItemButton
            onClick={() => props.selectCallback(props.data.id)}
            // sx={getPaperColor(theme, myColor)}
            color={myColor}
            selected={props.data.id === props.selectedId}
        >
            <ListItemIcon >
                <Icon color={myColor}>
                    {myIcon}
                </Icon>
            </ListItemIcon>
            <ListItemText
                // secondary={folderTitle}
                primary={props.data.title.split("-").at(0)} />

        </ListItemButton>
    )

    const renderAsTab = () => (
        <Tab
            key={props.data.id}
            id={props.data.id}
            value={props.data.id}
            icon={<Icon color={myColor}>{myIcon}</Icon>}
            onClick={() => props.selectCallback(props.data.id)}
            sx={(props.data.id === props.selectedId) ?
                { borderBottom: "3px solid", borderColor: theme.palette.primary.main }
                : {}}
            //
            // disabled={props.data.id === props.selectedId}
            // disabled={true}
            //label={renderAsList()}
            label={props.data.title.split("-").at(0)}
        />
    )

    if (props.renderAs === "card") {
        return renderAsCard()
    }
    else if (props.renderAs === "body") {
        return renderBody()
    }
    else if (props.renderAs === "list") {
        return renderAsList()
    }
    else if (props.renderAs === "actions") {
        return renderActions()
    }
    else {
        return renderAsTab()
    }


}