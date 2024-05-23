import { useEffect, useState } from "react";

import { Theme, makeStyles, useTheme } from '@mui/material/styles';
import { AppBar, Box, CssBaseline, Divider, Drawer, Grid, IconButton, Link, TextField, Toolbar, Typography } from "@mui/material";
import Icon from '@mui/material/Icon';
// import { id } from "date-fns/locale";

import { JolinNote, JoplinData, NotePriority, folderNameFromId } from "./JolinNote";
import { useParams, useNavigate } from "react-router-dom";

// import { useStyles } from "../Styles";
import { ListNotesJoplin } from "./ListNotesJoplin";
import { MultipleNotesJoplin } from "./MultipleNoteTabs";
import { settings } from "./JoplinCommon";
import React from "react";

import { cssClasses } from "../Styles"

interface Props {
    toggleColorMode: () => void
}

export interface NotedToSort {
    note: JoplinData
    prio: NotePriority
}

const getStyles = (theme: Theme) => {
    const drawerWidth = 300;
    return {
        content: {
            height: "100vw",
            background: theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[100],
            padding: theme.spacing(3)
        },
        root: {
            display: "flex"
        },
        drawer: {
            width: drawerWidth,
            flexShrink: 0,
            zIndex: 10,

        },
        drawerPaper: {
            width: drawerWidth,
            // backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[900] : theme.palette.grey[100]
        },
    }
}


export const PageJoplin = ({ toggleColorMode }: Props) => {

    let { context, query } = useParams<{ context?: string, query?: string }>();

    const theme = useTheme();
    // const history = useHistory();
    const navigate = useNavigate()

    const styles = getStyles(theme)
    // const cssClasses = makeStyles((theme: Theme) => (
    //     {
    //         drawerPaper: {
    //             width: 300,
    //             backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[900] : theme.palette.grey[100]
    //         }
    //     }  
    //     ))
    
    

    // all folders and notes
    const [folders, setFolders] = useState<JoplinData[]>([]);
    const [notes, setNotes] = useState<JoplinData[]>([]);


    const [currentParentID, setParentID] = useState<String | undefined>(undefined);

    // filtered folders and notes based on selected folder
    const [currentFolders, setCurrentFolders] = useState<JoplinData[]>([]);
    const [currentNotes, setCurrentNotes] = useState<JoplinData[]>([]);
    const [selectedItem, setSelectedItem] = useState<JoplinData | undefined>(undefined);

    useEffect(() => {
        console.log("PageJoplin mounted")
        const order = "order_by=title&order_dir=ASC&"

        const url = "http://localhost:41184/folders?" + order + settings.token

        fetch(url).then(response => {
            console.log("response", response)
            return response.json();
        }).then(jsonResp => {
            console.log("Folders : ", jsonResp)
            setFolders(jsonResp["items"])
            setParentID("")
        })

        // const order = "order_by=updated_time&order_dir=DESC&"

        const query = "/search?query=-tag:generated&type=note&"
        // const urlNotes = "http://localhost:41184/notes?" + order + token
        const urlNotes = "http://localhost:41184" + query + order + settings.token

        fetch(urlNotes).then(response => {
            console.log("response", response)
            return response.json();
        }).then(jsonResp => {
            console.log("Notes : ", jsonResp)
            setNotes(jsonResp["items"])
        })

        return () => {
            console.log("PageJoplin unmounted")
        }
    }, []);

    useEffect(() => {

        const filteredFolders = folders.filter((item: any) => { return item.parent_id === currentParentID })
        const filteredNotes = notes.filter((item: any) => { return item.parent_id === currentParentID })

        // # const currentItems = currentFolders.concat(currentNotes)
        setCurrentFolders(filteredFolders)
        setCurrentNotes(filteredNotes)
    }, [currentParentID]);

    const selectFolderByParentId = (id: string) => {
        console.log("selectFolder " + id)
        setParentID(id)
    }

    const selectParentFolderByParentId = (id: string) => {
        console.log("selectParentFolder " + id)
        const parentFolder = folders.filter((item: any) => { return item.id === id })
        if (parentFolder.length === 1) {
            const c: any = parentFolder[0]
            setParentID(c.parent_id)
        }
    }


    const selectNote = (node_id: string | undefined) => {
        console.log("selectNote " + node_id)

        if (node_id === undefined) {
            setSelectedItem(undefined)
            return
        }

        const fields = "fields=id,title,updated_time,body,parent_id&"
        const url = "http://localhost:41184/notes/" + node_id + "?" + fields + settings.token

        fetch(url).then(response => {
            return response.json();
        }).then(jsonResp => {
            console.log("Single Note : ", jsonResp)
            setSelectedItem(jsonResp)
        })
    }


    return (
        <Box sx={styles.root}>
            <CssBaseline />
            <AppBar position="fixed"  >
                <Toolbar>
                    <Typography variant="h6" >
                        Joplin
                    </Typography>
                    <Link m={1} color="grey.50" href="/joplin/all">Alle</Link>
                    <Link m={1} color="grey.50" href="/joplin/todos">Todos</Link>
                    <Link m={1} color="grey.50" href="/joplin/recently">Recently</Link>

                    <Box sx={{ "flexGrow": 1 }} />
                    <TextField
                        sx={{ input: { color: "#FAFAFA" } }}
                        value={query}
                        // error = { hasError(internalName) }
                        label={"search"}
                        size="small"
                        fullWidth={false}
                        variant="outlined"
                        onChange={(e: any) => navigate('/joplin/search/' + e.target.value)}
                    />

                    <Box sx={{ width: "50px" }} />


                    <IconButton sx={{ ml: 1 }} onClick={() => toggleColorMode()} color="inherit">
                        {theme.palette.mode === 'dark' ? <Icon>dark_mode</Icon> : <Icon>light_mode</Icon>}
                    </IconButton>
                </Toolbar>
            </AppBar>

            <Drawer
                anchor="left"
                variant={"permanent"}
                sx={styles.drawer}
                classes={{
                    paper: "width:300px"
                }}

                ModalProps={{
                    keepMounted: true // Better open performance on mobile.
                }}
            >
                <Toolbar />

                {context === "all" &&

                    <>
                        {/* <Atoms
                            atom={{ "type": "Button", "value": folderNameFromId(folders, currentParentID as string), "color": "primary", "startIcon": "arrow_back" }}
                            callback={(x) => { selectParentFolderByParentId(currentParentID as string); }} />


                        <Molecules molecules={currentFolders.map((item: any) => { return { "type": "ListItem", "value": item.title, "startIcon": "folder", "id": item.id } })}
                            callback={(x) => selectFolderByParentId(x)}
                        />
                        <Divider />
                        <Molecules molecules={currentNotes.map((item: any) => { return { "type": "ListItem", "color": "info", "value": item.title, "startIcon": "text_snippet", "id": item.id } })}
                            callback={(x ) => selectNote(x)}
                        /> */}
                        <Divider />
                    </>
                }
                {context === "todos" &&
                    <>
                        <Typography variant="h6" m={1} >Current Todos</Typography>
                        <Divider sx={{ m: 1 }}></Divider>
                        <ListNotesJoplin
                            query="/search?query=tag:week&type=note&"
                            folders={folders}
                            autoSelect={false}
                            renderAs="vertical"
                            order="prio"
                            selectedNoteId={selectedItem?.id}
                            selectCallback={(id) => selectNote(id)} />


                        <Typography variant="h6" m={1} >Project Todos</Typography>
                        <Divider sx={{ m: 1 }}></Divider>
                        <ListNotesJoplin
                            query="/search?query=tag:todo&type=note&"
                            order="prio"
                            renderAs="vertical"
                            autoSelect={false}
                            selectedNoteId={selectedItem?.id}
                            folders={folders}
                            selectCallback={(id) => selectNote(id)} />
                    </>
                }
                {context === "recently" &&
                    <>
                        <Typography variant="h6" m={1} >recently updated </Typography>
                        <Divider sx={{ m: 1 }}></Divider>
                        <ListNotesJoplin
                            query="/search?query=updated:day-2 -tag:generated&type=note&"
                            order="date"
                            renderAs="vertical"
                            selectedNoteId={selectedItem?.id}
                            autoSelect={true}
                            folders={folders} selectCallback={(id) => selectNote(id)} />
                    </>
                }
                {context === "search" &&
                    <>
                        <Typography variant="h6" m={1} >search {query} </Typography>
                        <Divider sx={{ m: 1 }}></Divider>

                        <ListNotesJoplin
                            query={"/search?query=" + query + " -tag:generated&type=note&"}
                            folders={folders}
                            renderAs="vertical"
                            autoSelect={false}
                            order="title"
                            selectedNoteId={selectedItem?.id}
                            selectCallback={(id) => selectNote(id)} />
                    </>
                }
            </Drawer>

            <Box sx={styles.content}>
                <Toolbar />

                {selectedItem ?
                    <>
                        <JolinNote
                            data={selectedItem}
                            folders={folders}
                            xs={12}
                            renderAs="card"
                            selectCallback={(id) => selectNote(id)}
                        />
                    </> :
                    <>
                        {context === "todos" &&
                            <Grid container spacing={4}>
                                <Grid item xs={6}>
                                    <MultipleNotesJoplin
                                        query="/search?query=tag:today&type=note&"
                                        folders={folders}
                                        order="prio"
                                        autoSelect={true}
                                        selectCallback={(id) => selectNote(id)} />

                                </Grid>
                                <Grid item xs={6}>
                                    <MultipleNotesJoplin
                                        query="/search?query=tag:week&type=note&"
                                        folders={folders}
                                        order="prio"
                                        autoSelect={true}
                                        selectCallback={(id) => selectNote(id)} />
                                </Grid>
                                <Grid item xs={12}>
                                    <MultipleNotesJoplin
                                        query="/search?query=tag:todo&type=note&"
                                        folders={folders}
                                        order="prio"
                                        autoSelect={true}
                                        selectCallback={(id) => selectNote(id)} />
                                </Grid>
                            </Grid>
                        }
                    </>
                }
            </Box>

        </Box>
    )
}
