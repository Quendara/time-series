import React from "react"
import { TextField, Grid } from "@mui/material"
import { useState } from "react"
import { AbcPlayer } from "./AbcPlayer"
import { PianoPart } from "./Piano"


interface SongProps {
    play: string
    showNodes: boolean
    showTextinput?: boolean
    showAbcOnly?: boolean
}

export const PianoSong = (props: SongProps) => {

    const [play, setPlay] = useState(props.play);
    const parts = play ? play.split("\n") : []

    return (
        <>
            {props.showTextinput &&
                <div className="no-print" >
                    <TextField
                        value={play}
                        // error={trySend}
                        // fullWidth
                        defaultValue={play}
                        multiline
                        sx={{ m: 8, width: "50vw" }}
                        variant="outlined"
                        // className={getInputClass(username)}
                        label="Name"
                        onChange={e => setPlay(e.target.value)}
                    />
                </div>
            }

            {props.showAbcOnly ? <>
                <AbcPlayer play={ play } />
            </> :

                <Grid container spacing={4} >
                    {parts.map(part => (
                        <Grid item xs={12} md={6} >
                            <PianoPart play={part} showNodes={props.showNodes} />
                        </Grid>
                    ))
                    }
                </Grid>}
        </>
    )
}