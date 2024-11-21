import { Box, Button, Grid, Paper, TextField } from "@mui/material";
import { grid } from "@mui/system";
import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom";

import abcjs from "abcjs";
import 'abcjs/abcjs-audio.css';
import { getUniqueId } from "../components/helpers";

interface SongProps {
    play: string
    showNodes: boolean
    showTextinput?: boolean
    showAbcOnly?: boolean
}

interface PianoProps {
    play: string[]
    title: string
    showNodes: boolean
}

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
        keyHover: {
            backgroundColor: "blue",
            cursor: "pointer"
        }
    }
}

export const PianoSong = (props: SongProps) => {

    const [play, setPlay] = useState(props.play);
    const parts = play ? play.split("\n") : []

    const paperId = getUniqueId()

    useEffect(() => {

        const tunes = abcjs.renderAbc("songPaper" + paperId, play)// "X:1\nK:D\nDD AA|BBA2|\n");
        if (abcjs.synth.supportsAudio()) {
            // const visualObj = abcjs.renderAbc("songPaper" + paperId, play);


            const synth = new abcjs.synth.CreateSynth();
            const controlOptions = {
                displayRestart: true,
                displayPlay: true,
                displayProgress: true,
                displayClock: true,
            };
    
            const synthControl = new abcjs.synth.SynthController();
            synthControl.load("#audio" + paperId, null, controlOptions);
    
            synth
                .init({
                    visualObj: tunes[0],
                })
                .then(() => {
                    synthControl.setTune(tunes[0], true).then(() => {
                        console.log("Synthesizer ready, playing tune...");
                        synthControl.restart();
                    });
                })
                .catch((error) => {
                    console.error("Error initializing the synthesizer:", error);
                });
        } else {
            console.log("Audio is not supported on this browser");
        }        

    }, [play]);

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
                <div id={"songPaper" + paperId} />
                {/* <Button onClick={ activate }>Play</Button> */}
                <div id={"audio" + paperId}></div> 
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

export const PianoPart = (props: SongProps) => {

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

                    const result = extractStringInQuotes(tick)

                    const header = result.extracted
                    const notes = result.remaining


                    return (
                        <>
                            {notes.length !== 0 &&
                                <Grid item xs={12} >
                                    <Piano title={header} play={parseNoteSequence(notes)} showNodes={props.showNodes} />
                                </Grid>
                            }
                        </>)
                })}


            </Box>


        </>
    )

}

export const Piano = (props: PianoProps) => {


    const playNote = (play: string) => { }

    const isPlayed = (key: string) => {
        if (props.play.includes(key)) {
            return pianoClasses.keyHover
        }
        else {
            return {}
        }
    }

    const playabc = "K:C\nL:1/4\n [ " + props.play.join("") + "]\n"

    

    useEffect(() => {


        abcjs.renderAbc("notepaper" + playabc, playabc)// "X:1\nK:D\nDD AA|BBA2|\n");
        console.log(playabc)

    }, [props.play]);

    const pianoClasses = createPianoClasses(props.showNodes)





    return (<>
        <Box sx={pianoClasses.layout}>

            <Box sx={pianoClasses.header}>
                <h3>{props.title} </h3>
                {/* {props.play} */}
            </Box>
            <Box sx={pianoClasses.piano}>
                {props.showNodes &&
                    <div id={"notepaper" + playabc} >
                        -
                    </div>
                }

                <Box sx={pianoClasses.keyOctav}>
                    <Box sx={{ ...pianoClasses.keyNormal, ...isPlayed('C,') }} onClick={() => playNote('c6')} ></Box>
                    <Box sx={{ ...pianoClasses.keyNormal, ...isPlayed('D,') }} onClick={() => playNote('d6')} ></Box>
                    <Box sx={{ ...pianoClasses.keyNormal, ...isPlayed('E,') }} onClick={() => playNote('e6')} ></Box>
                    <Box sx={{ ...pianoClasses.keyNormal, ...isPlayed('F,') }} onClick={() => playNote('f6')} ></Box>
                    <Box sx={{ ...pianoClasses.keyNormal, ...isPlayed('G,') }} onClick={() => playNote('g6')} ></Box>
                    <Box sx={{ ...pianoClasses.keyNormal, ...isPlayed('A,') }} onClick={() => playNote('a6')} ></Box>
                    <Box sx={{ ...pianoClasses.keyNormal, ...isPlayed('B,') }} onClick={() => playNote('b6')} ></Box>

                    <Box sx={{ ...pianoClasses.keyBlack, ...pianoClasses.calcBlackKeyPos(0), ...isPlayed('^C,') }} onClick={() => playNote('cs6')} ></Box>
                    <Box sx={{ ...pianoClasses.keyBlack, ...pianoClasses.calcBlackKeyPos(1), ...isPlayed('^D,') }} onClick={() => playNote('ds6')} ></Box>

                    <Box sx={{ ...pianoClasses.keyBlack, ...pianoClasses.calcBlackKeyPos(3), ...isPlayed('^F,',) }} onClick={() => playNote('fs6')} ></Box>
                    <Box sx={{ ...pianoClasses.keyBlack, ...pianoClasses.calcBlackKeyPos(4), ...isPlayed('^G,') }} onClick={() => playNote('gs6')} ></Box>
                    <Box sx={{ ...pianoClasses.keyBlack, ...pianoClasses.calcBlackKeyPos(5), ...isPlayed('^A,') }} onClick={() => playNote('as6')} ></Box>
                </Box>
                <Box sx={pianoClasses.keyOctav}>
                    <Box sx={{ ...pianoClasses.keyNormal, ...isPlayed('C') }} onClick={() => playNote('c6')} ></Box>
                    <Box sx={{ ...pianoClasses.keyNormal, ...isPlayed('D') }} onClick={() => playNote('d6')} ></Box>
                    <Box sx={{ ...pianoClasses.keyNormal, ...isPlayed('E') }} onClick={() => playNote('e6')} ></Box>
                    <Box sx={{ ...pianoClasses.keyNormal, ...isPlayed('F') }} onClick={() => playNote('f6')} ></Box>
                    <Box sx={{ ...pianoClasses.keyNormal, ...isPlayed('G') }} onClick={() => playNote('g6')} ></Box>
                    <Box sx={{ ...pianoClasses.keyNormal, ...isPlayed('A') }} onClick={() => playNote('a6')} ></Box>
                    <Box sx={{ ...pianoClasses.keyNormal, ...isPlayed('B') }} onClick={() => playNote('b6')} ></Box>

                    <Box sx={{ ...pianoClasses.keyBlack, ...pianoClasses.calcBlackKeyPos(0), ...isPlayed('^C') }} onClick={() => playNote('cs6')} ></Box>
                    <Box sx={{ ...pianoClasses.keyBlack, ...pianoClasses.calcBlackKeyPos(1), ...isPlayed('^D') }} onClick={() => playNote('ds6')} ></Box>

                    <Box sx={{ ...pianoClasses.keyBlack, ...pianoClasses.calcBlackKeyPos(3), ...isPlayed('^F') }} onClick={() => playNote('fs6')} ></Box>
                    <Box sx={{ ...pianoClasses.keyBlack, ...pianoClasses.calcBlackKeyPos(4), ...isPlayed('^G') }} onClick={() => playNote('gs6')} ></Box>
                    <Box sx={{ ...pianoClasses.keyBlack, ...pianoClasses.calcBlackKeyPos(5), ...isPlayed('^A') }} onClick={() => playNote('as6')} ></Box>
                </Box>
                <Box sx={pianoClasses.keyOctav}>
                    <Box sx={{ ...pianoClasses.keyNormal, ...isPlayed('c') }} ></Box>
                    <Box sx={{ ...pianoClasses.keyNormal, ...isPlayed('d') }} ></Box>
                    <Box sx={{ ...pianoClasses.keyNormal, ...isPlayed('e') }} ></Box>
                    <Box sx={{ ...pianoClasses.keyNormal, ...isPlayed('f') }} ></Box>
                    <Box sx={{ ...pianoClasses.keyNormal, ...isPlayed('g') }} ></Box>
                    <Box sx={{ ...pianoClasses.keyNormal, ...isPlayed('a') }} ></Box>
                    <Box sx={{ ...pianoClasses.keyNormal, ...isPlayed('b') }} ></Box>

                    <Box sx={{ ...pianoClasses.keyBlack, ...pianoClasses.calcBlackKeyPos(0), ...isPlayed('^c') }} onClick={() => playNote('cs6')} ></Box>
                    <Box sx={{ ...pianoClasses.keyBlack, ...pianoClasses.calcBlackKeyPos(1), ...isPlayed('^d') }} onClick={() => playNote('ds6')} ></Box>

                    <Box sx={{ ...pianoClasses.keyBlack, ...pianoClasses.calcBlackKeyPos(3), ...isPlayed('^f') }} onClick={() => playNote('fs6')} ></Box>
                    <Box sx={{ ...pianoClasses.keyBlack, ...pianoClasses.calcBlackKeyPos(4), ...isPlayed('^g') }} onClick={() => playNote('gs6')} ></Box>
                    <Box sx={{ ...pianoClasses.keyBlack, ...pianoClasses.calcBlackKeyPos(5), ...isPlayed('^a') }} onClick={() => playNote('as6')} ></Box>
                </Box>

            </Box>
        </Box>
    </>)
}
