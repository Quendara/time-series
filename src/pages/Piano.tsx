import { Box, Button, Grid, Paper, TextField } from "@mui/material";
import { grid } from "@mui/system";
import React, { useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom";


import { AbcPlayer } from "./AbcPlayer"

export const createPianoClasses = (showNodes: boolean) => {

    const keyDistance = 25
    const height = 3 * keyDistance

    const blackKeyOffset = keyDistance / 2 + 5
    const blackKeyWidth = keyDistance * 0.7

    return {
        calcBlackKeyPos: (keyIndex: number) => {

            return { left: blackKeyOffset + keyDistance * keyIndex }
        },
        layout: {
            display: "grid",
            gridTemplateColumns: "1fr",
            //            gridTemplateRows: "auto",
            //            placeItems: "center",
        },
        header: {
            // display: "relative",
            // gridTemplateColumns: "1fr",
            // gridTemplateRows: "auto",
            // textAlign: "center"
        },
        piano: {
            // show 100px for the noted than 3 time one ovtave
            gridTemplateColumns: showNodes ? "100px repeat(7, " + keyDistance * 7 + "px)" : "repeat(7, " + keyDistance * 7 + "px)",
            display: "grid",
            // backgroundColor: "#111",
            borderRadius: "10px",
            position: "relative",
        },
        "keyOctav": {
            display: "grid",
            gridTemplateColumns: "repeat(7, " + keyDistance + "px)", // width of one key
            height: height + "px",                        // height of the keyboard 
            width: "100%",
            position: "relative",
            backgroundColor: "transparent",
            overflow: "hidden",
            borderRadius: "0px 0px 3px 3px",
        },

        keyNormal: {
            height: "100%",
            position: "relative",
            float: "left",
            border: "1px solid black",
            borderRadius: "0px 0px 3px 3px",
            backgroundColor: "ghostwhite",
            boxShadow: "5px 5px 5px black",
        },

        keyBlack: {
            height: "65%", // Adjust the height of sharp keys
            width: blackKeyWidth + "px", // Adjust the width of sharp keys
            backgroundColor: "black",
            border: "1px solid black",
            position: "absolute",
            borderRadius: "0px 0px 3px 3px",
        },
        keyHover_right_current: {
            backgroundColor: "#1565C0",            
            // backgroundColor: "#F54645", // red
            cursor: "pointer"
        },
        keyHover_right_bar: {
            backgroundColor: "#A6DBFF",
            transition: "background-color 100ms linear",
            cursor: "pointer"
        },
        keyHover_left_current: {
            backgroundColor: "#3D8F40",
            // backgroundColor: "#F54645",            
            cursor: "pointer"
        },
        keyHover_left_bar: {
            backgroundColor: "#66ED6A",
            transition: "background-color 100ms linear",
            cursor: "pointer"
        }
    }
}


interface PartProps {
    play: string
    showNodes: boolean
    showTextinput?: boolean
    showAbcOnly?: boolean
}


export const PianoPart = (props: PartProps) => {

    const ticks = props.play.split("|")

    const extractStringInQuotes = (input: string): { extracted: string, remaining: string } => {
        // Regular expression to match a string enclosed in quotes
        const quoteRegex = /"([^"]*)"/;

        // Use the regular expression to find the quoted string
        const match = input.match(quoteRegex);

        if (match) {
            // Extract the string within quotes (the first capturing group)
            const extracted = match[1];

            // Remove the quoted string from the original input
            const remaining = input.replace(quoteRegex, '').trim();

            return { extracted, remaining };
        } else {
            // If no quoted string is found, return an empty string for extracted and the original input as remaining
            return { extracted: '', remaining: input };
        }
    }

    // // Example usage
    // const inputString = 'abc "Refrain" abd';
    // const result = extractStringInQuotes(inputString);

    // console.log('Extracted:', result.extracted); // Output: "Refrain"
    // console.log('Remaining:', result.remaining); // Output: "abc abd"


    function parseNoteSequence(noteSequence: string): string[] {
        const noteArray: string[] = [];

        for (let i = 0; i < noteSequence.length; i++) {
            let currentNote = noteSequence[i];
            // if( currentNote === undefined )
            let nextChar = noteSequence.at(i + 1)

            if (currentNote === "^" || currentNote === "_") {
                currentNote += noteSequence[i + 1];
                i++;

                nextChar = noteSequence.at(i + 1)
            }
            if (nextChar && nextChar === ",") {
                currentNote += nextChar
                i++;
            }
            noteArray.push(currentNote);
        }

        return noteArray;
    }

    return (
        <>
            <Box sx={{ maxHeight: "80vh", mb: 4, overflowY: "scroll" }}>

                {ticks.map(tick => {

                    if (tick.trim().length === 0)
                        return (<></>)

                    const result = extractStringInQuotes(tick)

                    const header = result.extracted
                    const notes = result.remaining


                    return (
                        <>
                            {notes.length !== 0 &&
                                <Grid item xs={12} >
                                    <Piano title={header} left_current={parseNoteSequence(notes)} showNodes={props.showNodes} />
                                </Grid>
                            }
                        </>)
                })}
            </Box>
        </>
    )
}

interface PianoProps {
    // right_current?: string[], // TODO : SUPPORT LEFT and RIGHT HAND
    right_bar?: string[],
    left_current?: string[],
    left_bar?: string[],
    title: string
    showNodes: boolean
}

export const Piano = (props: PianoProps) => {

    const isPlayed = (key: string, key2 : string ) => {


        if (props.right_bar?.includes(key) || props.right_bar?.includes(key2) ) {
            // right_current?: string[], // TODO : SUPPORT LEFT and RIGHT HAND
            // if (props.right_current?.includes(key) || props.right_current?.includes(key2) ) {
            if (props.left_current?.includes(key) || props.left_current?.includes(key2) ) {
                return pianoClasses.keyHover_right_current
            }
    
            return pianoClasses.keyHover_right_bar
        }
        if (props.left_bar?.includes(key) || props.left_bar?.includes(key2) ) {
            if (props.left_current?.includes(key) || props.left_current?.includes(key2) ) {
                return pianoClasses.keyHover_left_current
            }
    
            return pianoClasses.keyHover_left_bar
        }
        return {}
    }

    // const playabc = "K:C\nL:1/4\n [ " + props.right_current?.join("") + "]\n"
    // useEffect(() => { 
    //     // abcjs.renderAbc("notepaper" + playabc, playabc)// "X:1\nK:D\nDD AA|BBA2|\n");
    //     <AbcPlayer play={playabc} callback_current_Measure={(m) => { } } callback_current_Beat={ (m) => { } } />
    //     // console.log(playabc)
    // }, [props.right_current, props.right_current, props.left_current, props.left_bar]);

    const pianoClasses = createPianoClasses(props.showNodes)

    return (<>
        <Box sx={pianoClasses.layout}>

            <Box sx={pianoClasses.header}>
                <h3>{props.title} </h3>
                {/* {props.play} */}
            </Box>
            <Box sx={pianoClasses.piano}>
                {/* {props.showNodes &&
                    <div id={"notepaper" + playabc} >
                        -
                    </div>
                } */}

                <Box sx={pianoClasses.keyOctav}>
                    <Box sx={{ ...pianoClasses.keyNormal, ...isPlayed('C,,',"X") }}  ></Box>
                    <Box sx={{ ...pianoClasses.keyNormal, ...isPlayed('D,,',"X") }}  ></Box>
                    <Box sx={{ ...pianoClasses.keyNormal, ...isPlayed('E,,',"X") }}  ></Box>
                    <Box sx={{ ...pianoClasses.keyNormal, ...isPlayed('F,,',"X") }}  ></Box>
                    <Box sx={{ ...pianoClasses.keyNormal, ...isPlayed('G,,',"X") }}  ></Box>
                    <Box sx={{ ...pianoClasses.keyNormal, ...isPlayed('A,,',"X") }}  ></Box>
                    <Box sx={{ ...pianoClasses.keyNormal, ...isPlayed('B,,',"X") }}  ></Box>

                    <Box sx={{ ...pianoClasses.keyBlack, ...pianoClasses.calcBlackKeyPos(0), ...isPlayed('^C,,', '_D,,')  }}  ></Box>
                    <Box sx={{ ...pianoClasses.keyBlack, ...pianoClasses.calcBlackKeyPos(1), ...isPlayed('^D,,', '_E,,')  }}  ></Box>

                    <Box sx={{ ...pianoClasses.keyBlack, ...pianoClasses.calcBlackKeyPos(3), ...isPlayed('^F,,', '_G,,') }}  ></Box>
                    <Box sx={{ ...pianoClasses.keyBlack, ...pianoClasses.calcBlackKeyPos(4), ...isPlayed('^G,,', '_A,,') }}  ></Box>
                    <Box sx={{ ...pianoClasses.keyBlack, ...pianoClasses.calcBlackKeyPos(5), ...isPlayed('^A,,', '_B,,') }}  ></Box>
                </Box>

                <Box sx={pianoClasses.keyOctav}>
                    <Box sx={{ ...pianoClasses.keyNormal, ...isPlayed('C,', "X") }}  ></Box>
                    <Box sx={{ ...pianoClasses.keyNormal, ...isPlayed('D,', "X") }}  ></Box>
                    <Box sx={{ ...pianoClasses.keyNormal, ...isPlayed('E,', "X") }}  ></Box>
                    <Box sx={{ ...pianoClasses.keyNormal, ...isPlayed('F,', "X") }}  ></Box>
                    <Box sx={{ ...pianoClasses.keyNormal, ...isPlayed('G,', "X") }}  ></Box>
                    <Box sx={{ ...pianoClasses.keyNormal, ...isPlayed('A,', "X") }}  ></Box>
                    <Box sx={{ ...pianoClasses.keyNormal, ...isPlayed('B,', "X") }}  ></Box>

                    <Box sx={{ ...pianoClasses.keyBlack, ...pianoClasses.calcBlackKeyPos(0), ...isPlayed('^C,', '_D,')  }}  ></Box>
                    <Box sx={{ ...pianoClasses.keyBlack, ...pianoClasses.calcBlackKeyPos(1), ...isPlayed('^D,', '_E,')  }}  ></Box>

                    <Box sx={{ ...pianoClasses.keyBlack, ...pianoClasses.calcBlackKeyPos(3), ...isPlayed('^F,', '_G,') }}  ></Box>
                    <Box sx={{ ...pianoClasses.keyBlack, ...pianoClasses.calcBlackKeyPos(4), ...isPlayed('^G,', '_A,') }}  ></Box>
                    <Box sx={{ ...pianoClasses.keyBlack, ...pianoClasses.calcBlackKeyPos(5), ...isPlayed('^A,', '_B,') }}  ></Box>

                </Box>
                <Box sx={pianoClasses.keyOctav}>
                    <Box sx={{ ...pianoClasses.keyNormal, ...isPlayed('C', 'X') }}  ></Box>
                    <Box sx={{ ...pianoClasses.keyNormal, ...isPlayed('D', 'X') }}  ></Box>
                    <Box sx={{ ...pianoClasses.keyNormal, ...isPlayed('E', 'X') }}  ></Box>
                    <Box sx={{ ...pianoClasses.keyNormal, ...isPlayed('F', 'X') }}  ></Box>
                    <Box sx={{ ...pianoClasses.keyNormal, ...isPlayed('G', 'X') }}  ></Box>
                    <Box sx={{ ...pianoClasses.keyNormal, ...isPlayed('A', 'X') }}  ></Box>
                    <Box sx={{ ...pianoClasses.keyNormal, ...isPlayed('B', 'X') }}  ></Box>

                    <Box sx={{ ...pianoClasses.keyBlack, ...pianoClasses.calcBlackKeyPos(0), ...isPlayed('^C', '_D')  }}  ></Box>
                    <Box sx={{ ...pianoClasses.keyBlack, ...pianoClasses.calcBlackKeyPos(1), ...isPlayed('^D', '_E')  }}  ></Box>

                    <Box sx={{ ...pianoClasses.keyBlack, ...pianoClasses.calcBlackKeyPos(3), ...isPlayed('^F', '_G') }}  ></Box>
                    <Box sx={{ ...pianoClasses.keyBlack, ...pianoClasses.calcBlackKeyPos(4), ...isPlayed('^G', '_A') }}  ></Box>
                    <Box sx={{ ...pianoClasses.keyBlack, ...pianoClasses.calcBlackKeyPos(5), ...isPlayed('^A', '_B') }}  ></Box>
                </Box>
                <Box sx={pianoClasses.keyOctav}>
                    <Box sx={{ ...pianoClasses.keyNormal, ...isPlayed('c', "X") }} ></Box>
                    <Box sx={{ ...pianoClasses.keyNormal, ...isPlayed('d', "X") }} ></Box>
                    <Box sx={{ ...pianoClasses.keyNormal, ...isPlayed('e', "X") }} ></Box>
                    <Box sx={{ ...pianoClasses.keyNormal, ...isPlayed('f', "X") }} ></Box>
                    <Box sx={{ ...pianoClasses.keyNormal, ...isPlayed('g', "X") }} ></Box>
                    <Box sx={{ ...pianoClasses.keyNormal, ...isPlayed('a', "X") }} ></Box>
                    <Box sx={{ ...pianoClasses.keyNormal, ...isPlayed('b', "X") }} ></Box>

                    <Box sx={{ ...pianoClasses.keyBlack, ...pianoClasses.calcBlackKeyPos(0), ...isPlayed('^c', '_d')  }}  ></Box>
                    <Box sx={{ ...pianoClasses.keyBlack, ...pianoClasses.calcBlackKeyPos(1), ...isPlayed('^d', '_e')  }}  ></Box>

                    <Box sx={{ ...pianoClasses.keyBlack, ...pianoClasses.calcBlackKeyPos(3), ...isPlayed('^f', '_g') }}  ></Box>
                    <Box sx={{ ...pianoClasses.keyBlack, ...pianoClasses.calcBlackKeyPos(4), ...isPlayed('^g', '_a') }}  ></Box>
                    <Box sx={{ ...pianoClasses.keyBlack, ...pianoClasses.calcBlackKeyPos(5), ...isPlayed('^a', '_b') }}  ></Box>
                </Box>
            </Box>
        </Box>
    </>)
}
