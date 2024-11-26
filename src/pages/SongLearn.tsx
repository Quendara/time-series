import React, { useEffect } from "react"
import { TextField, Grid, Slider, Button, ButtonGroup, Divider, IconButton, Icon, listSubheaderClasses, Accordion, AccordionSummary, AccordionDetails } from "@mui/material"
import { useState } from "react"
import { AbcPlayer, groupNotesByMeasure, Measure, myParseAbc, PartRange } from "./AbcPlayer"
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

    const [songStructure, setSongStructure] = useState<PartRange[]>([]);

    const [currentSongPart, setCurrentSongPart] = useState("");
    const [currentMeasure, setCurrentMeasure] = useState(0); // the current measure, used to show keyboard


    const measureToAbc = (measures: Measure[], startIntervall: number, numberOfIntervalls: number) => {

        const measures_out: string[] = []
        const lyrics_out: string[] = []


        if (startIntervall >= measures.length) return ""

        for (let i = startIntervall; i < (startIntervall + numberOfIntervalls); ++i) {
            const measure = measures.at(i)
            if (measure === undefined) break;

            // iterate through all notes of this measure / TAKT
            lyrics_out.push(
                measure.notes.map((note, nindex) => {
                    return note.lyrics ? note.lyrics + " " : " "
                }).join("")
            )

            measures_out.push(measure.notes.map((note, nindex) => {

                // 

                const nodeDuration = (note.duration / 0.125) as integer

                if (note.pitches.length === 0) {
                    return "z" + nodeDuration
                }
                else if (note.pitches.length === 1) {
                    return "" + note.pitches.at(0) + nodeDuration
                }
                return "[" + note.pitches.map((p) => { return p }).join("") + "]" + nodeDuration

            }
            ).join(""))
        }

        // return measures_out.join("|")            
        let notes = "";
        let lyrics = "";
        let result = ""

        for (let i = 0; i < measures_out.length; i++) {
            notes += measures_out[i]
            lyrics += lyrics_out[i]
            // avoid last |
            if (i < (measures_out.length - 1)) {
                notes += "|";
                lyrics += "|";
            }
            // add new line every 4th
            if ((i + 1) % 4 === 0) {
                result += notes + "\n"
                result += "w:" + lyrics.trim() + "\n"
                notes = "";
                lyrics = "";
            }
        }

        if (notes.length) {
            result += notes + "\n"
            result += "w:" + lyrics.trim() + "\n"
            notes = "";
            lyrics = "";
        }



        return result.trim()
    }

    const getMeasureCount = (startIntervall: number, numberOfIntervalls: number) => {
        let val = "w:"
        for (let i = startIntervall; i < (startIntervall + numberOfIntervalls); ++i) {
            val += (i + 1) + "|"
        }
        return val

    }

    const getSong = (measures_treble: Measure[], measures_bass: Measure[], headless: boolean, startIntervall: number, numberOfIntervalls: number) => {


        let val = ""

        if (!headless) {
            val += songHeader
            val += "V:RH\n"
        }

        // val += "///"
        val += measureToAbc(measures_treble, startIntervall, numberOfIntervalls)

        // val += getMeasureCount(startIntervall, numberOfIntervalls)


        if (!headless) {
            val += "\n"
            val += "V:LH\n"
        }
        val += measureToAbc(measures_bass, startIntervall, numberOfIntervalls)

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
        const { measures_v1, measures_v2, title, meter, key, tempo, sections_range } = groupNotesByMeasure(myTune)
        setSongStructure(sections_range)

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

    const setNewStartInterval = (m: number) => {
        setStartIntervall(m)
        setCurrentMeasure(m)
    }

    const handleStartIntervallChange = (event: Event, newValue: number | number[]) => {
        if (typeof newValue === "number") {
            setNewStartInterval(newValue as number);
        }
        else {
            const numberL = (newValue as number[])
            if (numberL.length === 2) {
                const start = numberL[0]
                const stop = numberL[1]

                if (start !== startIntervall) {
                    setNewStartInterval(start)
                }
                else {
                    setNumberOfIntervalls(stop - start)
                }
            }

        }

    };
    const handleNumberOfIntervallChange = (event: Event, newValue: number | number[]) => {
        setNumberOfIntervalls(newValue as number);
    };


    const callback_current_Measure = (m: number) => {
        // the player gets just a subset of the song

        setCurrentMeasure(startIntervall + m)
    }

    const getSongParts = () => {

        const keys = songStructure.map(part => {
            console.log("key", part.name, part.start)
            return part.name
        });
        return keys
    }

    const setSongPart = (name: string) => {

        let start = 0;
        let stop = measures_v1.length

        songStructure.map((part, index) => {
            if (part.name === name) {
                start = part.start;
                const nextPart = songStructure.at(index + 1)
                if (nextPart) {
                    stop = nextPart.start
                }
            }
        });

        setCurrentSongPart(name)

        setNewStartInterval(start);
        setNumberOfIntervalls(stop - start)

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
                        value={[startIntervall, (startIntervall + numberOfIntervalls)]}
                        onChange={handleStartIntervallChange}
                        valueLabelDisplay="auto"
                        min={0}
                        max={measures_v1.length}
                    />


                </Grid>
                <Grid item xs={2}>
                    <ButtonGroup variant="text" aria-label="Basic button group">
                        {[1, 2, 4, 8].map((value) => (
                            <Button variant={(numberOfIntervalls === value) ? "contained" : "text"} onClick={() => { setNumberOfIntervalls(value) }} >{value}</Button>
                        ))}
                    </ButtonGroup>
                </Grid>
                <Grid item xs={6} >
                    <ButtonGroup variant="text" >
                        {
                            songStructure.map(part => {
                                // console.log("key", part.name, part.start)
                                return <Button
                                    variant={(part.name === currentSongPart) ? "contained" : "text"}
                                    onClick={() => { setSongPart(part.name) }} > {part.name} </Button>

                            })
                        }
                        <Button onClick={() => { setSongPart('Full') }} > Full </Button>
                    </ButtonGroup>
                </Grid>
                <Grid item xs={6} >
                    Start : {startIntervall + 1} / {measures_v1.length} | Intervalsize : {numberOfIntervalls}
                </Grid>
                <Grid item xs={12} >
                    <AbcPlayer
                        play={getSong(measures_v1, measures_v2, false, startIntervall, numberOfIntervalls)}
                        callback_current_Measure={callback_current_Measure}
                    />
                </Grid>

                <Grid item xs={12} md={6} >
                    {/* Show the current measure */}
                    <PianoPart play={getSong(measures_v1, measures_v2, true, currentMeasure, 1)} showNodes={props.showNodes} />
                </Grid>
            </Grid>

            <br />
            <br />
            <br />
            <Accordion>
                <AccordionSummary
                    expandIcon={<Icon>expand</Icon>}
                    aria-controls="panel1-content"
                    id="panel1-header"
                >
                    Accordion 1
                </AccordionSummary>
                <AccordionDetails>
                    <pre>
                        {getSongParts()}
                        <br></br>

                        {/* {getSong(true, startIntervall, numberOfIntervalls)}
                <Divider />*/}
                        {getSong(measures_v1, measures_v2, false, startIntervall, numberOfIntervalls)}

                    </pre>
                </AccordionDetails>
            </Accordion>
        </>
    )
}

