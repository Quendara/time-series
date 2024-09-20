import { useState } from "react";
import { JolinNote, JoplinData, NoteOrder } from "./JolinNote";
import { settings } from "./JoplinCommon";
import { ListNotesJoplin } from "./ListNotesJoplin";
import { Box, Grid, Paper } from "@mui/material";
import React from "react";


export interface NotesProps {
    query: string
    folders: JoplinData[]
    order: NoteOrder
    autoSelect: boolean // select first item
    selectCallback: (id: string) => void;
}

export const MultipleNotesJoplin = (props: NotesProps) => {

    const [selectedItem, setSelectedItem] = useState<JoplinData | undefined>(undefined);

    const selectNote = (node_id: string | undefined) => {
        console.log("selectNote " + node_id)

        if (node_id === undefined) {
            setSelectedItem(undefined)
            return
        }

        let fields = "fields=id,title,updated_time,body,parent_id&"
        const url = "http://localhost:41184/notes/" + node_id + "?" + fields + settings.token

        fetch(url).then(response => {
            return response.json();
        }).then(jsonResp => {
            console.log("Single Note : ", jsonResp)
            setSelectedItem(jsonResp)
        })
    }


    return (
        <Paper elevation={3} >
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    
                    <ListNotesJoplin
                        query={props.query}
                        order="prio"
                        renderAs="horizontal"
                        selectedNoteId={selectedItem?.id}
                        autoSelect={true}
                        folders={props.folders}
                        selectCallback={(id) => selectNote(id)} />
                </Grid>
                <Grid item xs={12}>
                    {selectedItem &&
                        <>
                            <Box sx={{ height: "30vh", overflowY: "scroll", pl: 5, pr: 5 }}>
                                <JolinNote
                                    data={selectedItem}
                                    folders={props.folders}
                                    xs={12}
                                    
                                    renderAs="body"
                                    selectCallback={(id) => selectNote(id)}
                                />
                            </Box>
                            <Box sx={{ pl: 5, pr: 5, pb:3 }}>
                            <JolinNote
                                data={selectedItem}
                                folders={props.folders}
                                xs={12}
                                
                                renderAs="actions"
                                selectCallback={(id) => selectNote(id)}
                            />
                            </Box>
                        </>
                    }
                </Grid>
            </Grid>

        </Paper>
    )
}  