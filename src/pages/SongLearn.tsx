import React, { useEffect } from "react"
import { TextField, Grid, Slider, Button, ButtonGroup, Divider, IconButton, Icon, listSubheaderClasses } from "@mui/material"
import { useState } from "react"
import { AbcPlayer, groupNotesByMeasure, Measure, myParseAbc } from "./AbcPlayer"
import { PianoPart } from "./Piano"

import abcjs, { NoteTimingEvent, parseOnly, TuneObject, VoiceItem } from "abcjs";
import { integer } from "aws-sdk/clients/cloudfront"


interface SongProps {
    play: string
    showNodes: boolean
    showTextinput?: boolean
    showAbcOnly?: boolean
}




export const SongLearn = (props: SongProps) => {

    const [parts, setParts] = useState<string[]>([]);
    const [songHeader, setSongHeader] = useState("");

    const [measures_v1, setVoice1] = useState<Measure[]>([]);
    const [measures_v2, setVoice2] = useState<Measure[]>([]);

    const [currentMeasure, setCurrentMeasure] = useState(0);



    // const parseSong = (song: string) => {

    //     const lines = song.split("\n")

    //     let ticks: string[] = []

    //     let header = ""
    //     let notes = false


    //     lines.map(((line, index) => {

    //         let trimmedLine = line.trim()
    //         if (trimmedLine.endsWith("|")) {
    //             trimmedLine = trimmedLine.slice(0, trimmedLine.length - 1)
    //         }
    //         if (trimmedLine.startsWith("|")) {
    //             trimmedLine = trimmedLine.slice(1, trimmedLine.length)
    //         }

    //         const parts = trimmedLine.split("|")
    //         if (line.startsWith("w:")) {
    //             return
    //         }


    //         if (parts.length > 1) {
    //             notes = true
    //             // console.log( "### ", index, parts.length, line )
    //             ticks = [...ticks, ...parts]
    //         }
    //         else if (!notes) {
    //             header += line + "\n"

    //         }
    //     }))

    //     return { header, ticks }
    // }

    // const getSong = (headless: boolean, startIntervall: number, numberOfIntervalls: number) => {
    //     // console.log( "### HEADER: ", songHeader )
    //     // console.log( "### PARTS:", parts.join( " | " ) )
    //     const stopIntervall = startIntervall + numberOfIntervalls
    //     let val = ""
    //     if (!headless) {
    //         val += songHeader
    //     }

    //     const increment = (numberOfIntervalls >= 4) ? 4 : numberOfIntervalls


    //     for (let i = startIntervall; i < stopIntervall; i += increment) {
    //         val += "|"
    //         val += parts.slice(i, i + increment).join(" | ")
    //         val += "|\n"

    //         if (!headless) {
    //             val += "w:"
    //             for (let j = i; j < stopIntervall; j += 1) {
    //                 val += (j + 1) + "|"
    //             }
    //             val += "\n"
    //         }
    //     }


    //     // val += ":| \n"
    //     //val += "w:" + (startIntervall+1)
    //     return val
    // }

    const measureToAbc = (measures: Measure[], startIntervall: number, numberOfIntervalls: number) => {

        const measures_out : string[] = []
        const lyrics_out : string[] = []


        if( startIntervall >= measures.length) return ""

        for( let i=startIntervall; i<(startIntervall+numberOfIntervalls); ++i ){
            const m = measures.at(i)
            if( m === undefined ) break;
            console.log( "measures_out # ", i )
            console.log( "measures_out : ", m )

            

            measures_out.push(  m.notes.map((n, nindex) => {

                lyrics_out.push( n.lyrics?n.lyrics:"" )

                const nodeDuration = (n.duration / 0.125) as integer
                
                if (n.pitches.length === 0) {                    
                    return "z" + nodeDuration
                }
                else if( n.pitches.length === 1 ){
                    return "" + n.pitches.at(0) + nodeDuration
                }
                return "[" + n.pitches.map( (p) => { return p } ).join("") + "]" + nodeDuration
                
            }
            ).join("") )
        }

         // return measures_out.join("|")            
         let result = "";
         let lyrics = "";
         for (let i = 0; i < measures_out.length; i++) {
             result += measures_out[i] 
             lyrics += lyrics_out[i] 
             // avoid last |
             if( i <  (measures_out.length-1) ) {
               result += "|";
               lyrics += "|";
             } 
             // add new line every 4th
             if ((i + 1) % 4 === 0) {
                 result += "\n";
                 lyrics += "\n";
             }
         }
     
         return result.trim() + "\nw:" + lyrics.trim();          
    }

    const getMeasureCount = ( startIntervall: number, numberOfIntervalls: number) => {
        let val = "w:"
        for( let i=startIntervall; i<(startIntervall+numberOfIntervalls); ++i ){
            val += (i+1) + "|"
        }
        return val

    }

    const getSong = (headless: boolean, startIntervall: number, numberOfIntervalls: number) => {


        let val = ""

        if (!headless) {
            val += songHeader
            val += "V:RH\n"
        }

        // val += "///"
        val += "|:"
        val += measureToAbc(measures_v1, startIntervall, numberOfIntervalls)
        val += ":|\n"

        
        val += getMeasureCount( startIntervall, numberOfIntervalls)
        

        if (!headless) {
            val += "\n"
            val += "V:LH\n"
        }
        val += "|:"
        val += measureToAbc(measures_v2, startIntervall, numberOfIntervalls)
        val += ":|"

        if (headless) {
            val = val.replace(/\|/g, ""); // Entferne alle `|` im songHeader
        }
        
        return val
    }

    useEffect(() => {
        // const { header, ticks } = parseSong(props.play)
        // setSongHeader(header);
        // setParts(ticks);

        const myTune = myParseAbc(props.play)
        const { measures_v1, measures_v2, title, meter, key, tempo } = groupNotesByMeasure(myTune)

        setVoice1(measures_v1)
        setVoice2(measures_v2)

        // T: Set fire to the rain
        // M: 4/4
        // L: 1/8
        // K: Dm
        // V:RH clef=treble
        // V:LH clef=bass
        // Q:120      
        let header = ""
        // header += "T:" + title + "\n"
        header += "K:" + key + "\n"
        header += "M:" + meter + "\n"
        header += "Q:" + tempo + "\n"
        header += "V:RH clef=treble\n"
        header += "V:LH clef=bass\n"


        setSongHeader(header)



        // const song = getFirstTwoBars( props.play )
        // setSongHeader(song);

    }, [props.play])




    const [startIntervall, setStartIntervall] = React.useState<number>(0);
    const [numberOfIntervalls, setNumberOfIntervalls] = React.useState<number>(4);

    const setNewStartInterval = ( m : number ) => {
        setStartIntervall( m )
        setCurrentMeasure( m )
    }

    const handleStartIntervallChange = (event: Event, newValue: number | number[]) => {
        if( typeof newValue === "number" ){
            setNewStartInterval(newValue as number);        
        }
        else{
            const numberL = (newValue as number[])
            if( numberL.length === 2 ){
                const start = numberL[0]
                const stop = numberL[1]

                if( start !== startIntervall ){
                    setNewStartInterval( start )
                }
                else{
                    setNumberOfIntervalls( stop-start)
                }
            }

        }
        
    };
    const handleNumberOfIntervallChange = (event: Event, newValue: number | number[]) => {
        setNumberOfIntervalls(newValue as number);
    };

    
    const callback_current_Measure = ( m : number ) => {
        // the player gets just a subset of the song

        setCurrentMeasure( startIntervall + m )
    }




    return (
        <>

            <Grid container spacing={4} >

                <Grid item xs={2}  >
                    <ButtonGroup variant="text" aria-label="Basic button group">
                        <IconButton onClick={() => {
                            const newStartIntervall = startIntervall - numberOfIntervalls
                            setNewStartInterval((newStartIntervall < 0) ? 0 : newStartIntervall)
                        }}><Icon>navigate_before</Icon></IconButton>
                        <IconButton onClick={() => {
                            setNewStartInterval(startIntervall + numberOfIntervalls)
                        }}><Icon>navigate_next</Icon></IconButton>
                    </ButtonGroup>
                </Grid>
                <Grid item xs={8}  >                    
                    <Slider
                        value={ [startIntervall, (startIntervall+numberOfIntervalls)]}
                        onChange={handleStartIntervallChange}
                        valueLabelDisplay="auto"
                        min={0}
                        max={measures_v1.length}
                    />
                    Start : {startIntervall + 1} / { measures_v1.length } | Intervalsize : {numberOfIntervalls}
                
                </Grid>
                <Grid item xs={2}>
                    <ButtonGroup variant="text" aria-label="Basic button group">
                        {[1, 2, 4, 8].map((value) => (
                            <Button variant={(numberOfIntervalls === value) ? "contained" : "text"} onClick={() => { setNumberOfIntervalls(value) }} >{value}</Button>
                        ))}
                    </ButtonGroup>
                    
                    </Grid>
                    {/* <Grid item xs={3}  >                      
                    <Slider
                        value={numberOfIntervalls}
                        onChange={handleNumberOfIntervallChange}
                        valueLabelDisplay="auto"
                        min={1}
                        max={12}
                    /> 
                </Grid> */}
            </Grid>
            <Grid item xs={12} >
                    <AbcPlayer 
                        play={getSong(false, startIntervall, numberOfIntervalls)} 
                        callback_current_Measure={ callback_current_Measure }
                    />
                </Grid>            

            <Grid item xs={12} md={6} >
                {/* Show the current measure */}
                <PianoPart play={getSong(true, currentMeasure, 1)} showNodes={props.showNodes} />
            </Grid>
            <pre>
                {/* {getSong(true, startIntervall, numberOfIntervalls)}
                <Divider />*/}
                {getSong(false, startIntervall, numberOfIntervalls)} 
            </pre>
        </>
    )
}

