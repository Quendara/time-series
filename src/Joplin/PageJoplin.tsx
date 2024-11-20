import { useContext, useEffect, useState } from "react";

import { Theme, makeStyles, useTheme } from '@mui/material/styles';
import { AppBar, Box, Button, CssBaseline, Divider, Drawer, Grid, IconButton, Link, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Paper, TextField, Toolbar, Typography } from "@mui/material";
import Icon from '@mui/material/Icon';
// import { id } from "date-fns/locale";

import { JolinNote, JoplinData, NotePriority, folderNameFromId } from "./JolinNote";
import { FolderNav } from "./FolderNav";
import { useParams, useNavigate, NavLink } from "react-router-dom";

// import { useStyles } from "../Styles";
import { ListNotesJoplin } from "./ListNotesJoplin";
import { MultipleNotesJoplin } from "./MultipleNoteTabs";
import { settings } from "./JoplinCommon";
import React from "react";

import { cssClasses } from "../Styles"
import { TodoMainContext } from "../context/TodoMainProvider";

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
            width: "80%",
            // background: theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[100],
            padding: theme.spacing(3)
        },
        root: {
            display: "flex"
        },
        drawer: {
            zIndex: 10,
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
                width: drawerWidth,
                boxSizing: 'border-box',
            },

        },
        drawerPaper: {
            width: drawerWidth,
            // backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[900] : theme.palette.grey[100]
        },
    }
}



export const PageJoplin = ({ toggleColorMode }: Props) => {

    let { context, query } = useParams<{ context?: string, query?: string }>();
    
    const mainContext = useContext(TodoMainContext)


    const theme = useTheme();
    // const history = useHistory();
    const navigate = useNavigate()

    const styles = getStyles(theme)

    // all folders and notes
    const [folders, setFolders] = useState<JoplinData[]>([]);
    const [notes, setNotes] = useState<JoplinData[]>([]);

    const [tokenToken, setJoplinToken] = useState<String | null>(null);


    const [currentParentID, setParentID] = useState<String | undefined>(undefined);

    // filtered folders and notes based on selected folder
    const [currentFolders, setCurrentFolders] = useState<JoplinData[]>([]);
    const [currentNotes, setCurrentNotes] = useState<JoplinData[]>([]);
    const [selectedItem, setSelectedItem] = useState<JoplinData | undefined>(undefined);

    useEffect(() => {

        const token = localStorage.getItem('joplinToken');
        if( token != null ){
            setJoplinToken( token )
            mainContext.setJoplinToken( token )
        }      
    }, []);    

    const setJoplinTokenToLocalStorage = (token: string) => {
        localStorage.setItem('joplinToken', token );
        setJoplinToken( token )        
    }    

    useEffect(() => {

        if( tokenToken === null ) return


        console.log("PageJoplin mounted")
        const order = "order_by=title&order_dir=ASC&"

        const url = "http://localhost:41184/folders?" + order + "token=" + tokenToken

        fetch(url).then(response => {
            console.log("response", response)
            return response.json();
        }).then(jsonResp => {
            // console.log("Folders : ", jsonResp)
            setFolders(jsonResp["items"])

            console.log("context : '" + context + "'")


            if (context === "folder") {
                if (query !== undefined) {
                    console.log("SET INITIAL FOLDER : ", query)
                    setParentID(query)
                }
                else {
                    console.log("SET INITIAL FOLDER to ROOT")
                    setParentID("")
                }
            }
        })

        // const order = "order_by=updated_time&order_dir=DESC&"

        const local_query = "/search?query=-tag:generated&type=note&"
        // const urlNotes = "http://localhost:41184/notes?" + order + token
        const urlNotes = "http://localhost:41184" + local_query + order + "token=" + tokenToken

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
    }, [tokenToken]);

    useEffect(() => {

        const filteredFolders = folders.filter((item: any) => { return item.parent_id === currentParentID })
        const filteredNotes = notes.filter((item: any) => { return item.parent_id === currentParentID })

        // # const currentItems = currentFolders.concat(currentNotes)
        setCurrentFolders(filteredFolders)
        setCurrentNotes(filteredNotes)
    }, [folders, currentParentID]);

    useEffect(() => {

        if (context === "folder") {
            if (query !== undefined) {
                getNotesByFolderID( query )
                setParentID(query)

            }
            else {
                setParentID("")
            }
        }
    }, [query]);





    const selectFolderByParentId = (id: string) => {
        console.log("selectFolderByParentId " + id)
        setParentID(id)
    }

    const getNotesByFolderID = (id: string) => {

        setParentID(id)

        if (id.length === 0) return

        let order = "order_by=updated_time&order_dir=DESC&";

        const urlNotes = "http://localhost:41184/folders/" + id + "/notes?" + order + "token=" + tokenToken
        // const urlNotes = "http://localhost:41184" + query + order + settings.token

        fetch(urlNotes).then(response => {
            console.log("response", response)
            return response.json();
        }).then(jsonResp => {
            console.log("getNotesByFolderID --- Notes : ", jsonResp)
            if (jsonResp) {
                setCurrentNotes(jsonResp["items"])
            }
        })
    }


    const getParentId = (id: string) => {

        console.log("getParentId '" + id + "'")
        const parentFolder = folders.filter((item: any) => { return item.id === id })
        if (parentFolder.length === 1) {
            const c: any = parentFolder[0]

            console.log(" - return  " + c.parent_id)

            return c.parent_id
        }
        console.error("getParentId not found " + id)
        return ""
    }


    const selectNote = (node_id: string | undefined) => {
        console.log("selectNote " + node_id)

        if (node_id === undefined) {
            setSelectedItem(undefined)
            return
        }

        const fields = "fields=id,title,updated_time,body,parent_id&"
        const url = "http://localhost:41184/notes/" + node_id + "?" + fields + "token=" + tokenToken

        fetch(url).then(response => {
            return response.json();
        }).then(jsonResp => {
            console.log("Single Note : ", jsonResp)
            setSelectedItem(jsonResp)
        })
    }

    const projects = [
        { name: "Projects", id: "9f10f4510b144fbf9dd186d17c95e44a" },
        { name: "AEF",      id: "245fa5e3f28c423db5d45287db654619" },
        { name: "AgIN",      id: "853c391ce8cc49428a6cdb745a2b74bd" },
        { name: "SDC",      id: "6e178ae70c904b8f82e3e732004e131d" }
    ]

    return (
        <Box sx={styles.root}>
            <CssBaseline />
            <AppBar position="fixed"  >
                <Toolbar>
                    <Typography variant="h6" pr={4} >
                        Joplin
                    </Typography>
                    <NavLink key={"nl_" + 1331} to={"/joplin/folder"} >
                        <Button sx={{mr:6, color: "white" }} startIcon={<Icon>folder</Icon>} >folder</Button>
                    </NavLink>

                    {projects.map( project => (
                        <NavLink key={"nl_" + 1331} to={"/joplin/folder/" + project.id}  >
                            <Button sx={{ color: "#AAA" }} >{project.name}</Button>
                        </NavLink>
                    ))}


                    <NavLink key={"nl_" + 1332} to={"/joplin/todos"}  >
                        <Button sx={{ ml:6, color: "white" }} startIcon={<Icon>check</Icon>}  >Todos</Button>
                    </NavLink>
                    <NavLink key={"nl_" + 1333} to={"/joplin/recently"}  >
                        <Button sx={{ color: "white" }} startIcon={<Icon>history</Icon>} >recently</Button>
                    </NavLink>

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

                ModalProps={{
                    keepMounted: true // Better open performance on mobile.
                }}
            >
                <Toolbar />


                {context === "folder" &&
                    <>
                        <>
                            <Typography variant="h6" m={1} >Folders</Typography>
                            <List>
                                <ListItemButton
                                    onClick={() => getNotesByFolderID(getParentId(currentParentID as string))}
                                >
                                    <ListItemText
                                        primary={folderNameFromId(folders, currentParentID as string)}
                                    // primary={props.data.title } 
                                    />

                                </ListItemButton>

                                {currentFolders.map((item: JoplinData) => (
                                    <JolinNote
                                        data={item}
                                        folders={folders}
                                        defaultIcon="folder"
                                        xs={12}
                                        selectedId={selectedItem?.id}
                                        renderAs="list"
                                        selectCallback={(x) => getNotesByFolderID(x)} />
                                ))}
                            </List>
                        </>


                        {currentNotes.length > 0 &&
                            <>
                                <Typography variant="h6" m={1} >Notes</Typography>
                                <List>
                                    {currentNotes.map((item: JoplinData) => (
                                        <JolinNote
                                            data={item}
                                            folders={folders}
                                            xs={12}
                                            selectedId={selectedItem?.id}
                                            renderAs="list"
                                            selectCallback={(x) => selectNote(x)} />
                                    ))}
                                </List>
                            </>
                        }

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
                            query="/search?query=updated:day-4 -tag:generated&type=note&"
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


            { tokenToken === null && <>
                <Paper sx={{ p: 2, mb: 1 }}>
                    <Box sx={{ pt: 2, mb: 1 }}>Here you can add your Joplin Token</Box>
                <TextField
                      value={""}                      
                      fullWidth
                      
                      variant="outlined"                      
                      label="Joplin Token"
                      onChange={e => setJoplinTokenToLocalStorage(e.target.value)}
                    />
                    </Paper>
                </>}

                {selectedItem ?
                    <>
                        <Paper sx={{ p: 1, mb: 1 }}>
                            <FolderNav
                                data={selectedItem}
                                folders={folders}
                                selectCallback={(x) => selectFolderByParentId(x)}

                            />
                        </Paper>
                        <Grid container >
                            <JolinNote
                                data={selectedItem}
                                folders={folders}
                                xs={12}
                                renderAs="card"
                                selectCallback={(id) => selectNote(id)}
                            />
                        </Grid>
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
                        {context === "folder" &&
                            <Grid container spacing={4}>
                                <Grid item xs={6}>
                                    {/* {currentFolders.map((item: JoplinData) => (
                                        <JolinNote
                                            data={item}
                                            folders={folders}
                                            defaultIcon="folder"
                                            xs={12}
                                            selectedId={undefined}
                                            renderAs="card"
                                            selectCallback={(x) => getNotesByFolderID(x)} />
                                    ))} */}
                                </Grid>
                            </Grid>
                        }
                    </>
                }
            </Box>

        </Box>
    )
}
