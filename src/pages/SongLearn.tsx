import React, { useEffect } from "react"
import { TextField, Grid, Slider } from "@mui/material"
import { useState } from "react"
import { AbcPlayer } from "./AbcPlayer"
import { PianoPart } from "./Piano"


interface SongProps {
    play: string
    showNodes: boolean
    showTextinput?: boolean
    showAbcOnly?: boolean
}

export const SongLearn = (props: SongProps) => {

    const [parts, setParts] = useState<string[]>([]);
    const [songHeader, setSongHeader] = useState("");

    const parseSong = (song: string) => {

        const lines = song.split("\n")

        let ticks: string[] = []

        let header = ""
        let notes = false


        lines.map(((line, index) => {

            let trimmedLine = line.trim()
            if( trimmedLine.endsWith("|") ){
                trimmedLine = trimmedLine.slice(0, trimmedLine.length-1)
            }
            
            const parts = trimmedLine.split("|")
            if (line.startsWith("w:")) {
                return
            }  


            if (parts.length > 1) {
                notes = true
                // console.log( "### ", index, parts.length, line )
                ticks = [...ticks, ...parts]
            }
            else if (!notes) {
                header += line + "\n"

            }
        }))

        return { header, ticks }
    }

    const getSong = ( headless : boolean, startIntervall: number, numberOfIntervalls: number) => {
        // console.log( "### HEADER: ", songHeader )
        // console.log( "### PARTS:", parts.join( " | " ) )
        const stopIntervall = startIntervall + numberOfIntervalls
        let val = ""
        if( !headless ){
            val += songHeader
        }

        const increment = (numberOfIntervalls >= 4) ? 4 : numberOfIntervalls


        for (let i = startIntervall; i < stopIntervall; i += increment) {
            val += "|"
            val += parts.slice(i, i + increment).join(" | ")
            val += "|\n"
            if( !headless ){
                val += "w:" 
                for (let j = i; j < stopIntervall; j += 1 ) {
                    val += (j + 1) + "|"
                }
                val += "\n" 
            }
        }


        // val += ":| \n"
        //val += "w:" + (startIntervall+1)
        return val
    }

    useEffect(() => {
        const { header, ticks } = parseSong(props.play)
        setSongHeader(header);
        setParts(ticks);

    }, [props.play])




    const [startIntervall, setStartIntervall] = React.useState<number>(0);
    const [numberOfIntervalls, setNumberOfIntervalls] = React.useState<number>(4);

    const handleStartIntervallChange = (event: Event, newValue: number | number[]) => {
        setStartIntervall(newValue as number);
    };
    const handleNumberOfIntervallChange = (event: Event, newValue: number | number[]) => {
        setNumberOfIntervalls(newValue as number);
    };



    return (
        <>

            <Grid container spacing={4} >
                <Grid item xs={12} md={6} >
                    Start
                    <Slider
                        value={startIntervall}
                        onChange={handleStartIntervallChange}
                        valueLabelDisplay="auto"
                        min={0}
                        max={parts.length}
                    />
                </Grid>
                <Grid item xs={12} md={6} >
                    Size
                    <Slider
                        value={numberOfIntervalls}
                        onChange={handleNumberOfIntervallChange}
                        valueLabelDisplay="auto"
                        min={1}
                        max={12}
                    />
                </Grid>
            </Grid>

            <AbcPlayer play={getSong( false, startIntervall, numberOfIntervalls)} />
            
            <Grid item xs={12} md={6} >
                <PianoPart play={getSong( true, startIntervall, numberOfIntervalls)} showNodes={props.showNodes} />
            </Grid>
            <pre>
                {getSong( true, startIntervall, numberOfIntervalls)}
            </pre>


        </>
    )
}