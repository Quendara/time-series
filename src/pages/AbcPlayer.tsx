import React, { useRef, useEffect, useState } from "react";
import { getUniqueId } from "../components/helpers";
import abcjs, { MidiBuffer, NoteTimingEvent, parseOnly, TuneObject, VoiceItem } from "abcjs";
import "abcjs/abcjs-audio.css";
import { Grid, Icon, IconButton } from "@mui/material";

interface Props {
    play: string;
    callback_current_Measure: (m: number) => void
}

// Typdefinitionen
interface Note {
    pitches: string[]; // Liste der Notennamen
    duration: number; // Notendauer
    lyrics?: string; // Zugehöriger Text
}



export interface Measure {
    notes: Note[]; // Noten im Takt
    voice: string; // Stimme (RH oder LH)
}

export interface PartRange {
    name: string;
    start: number;
}

interface AnalysisResult {
    measures_v1: Measure[]; // Alle Takte, voice 1
    measures_v2: Measure[]; // Alle Takte, voice 2
    title: string; // Titel des Stücks
    meter: string; // Taktart
    key: string; // Tonart
    tempo: number; // Tempo (QPM)
    // sections: { [section: string]: Measure[][] };
    sections_range: PartRange[] 
}


export const myParseAbc = (abcNotaion: string): TuneObject => {
    const tunes: TuneObject[] = abcjs.parseOnly(abcNotaion)
    return tunes[0]
}

// Funktion zur Gruppierung der Noten pro Takt
export const groupNotesByMeasure = (tune: TuneObject): AnalysisResult => {
    // Use an array to hold measures for each voice
    const voice_arr: Measure[][] = [];
    // const sections: { [section: string]: Measure[][] } = {}; // To store measures by section
    const sections_range: PartRange[]  = []; // To store measures by section

    let currentSection = "Part A"; // Default section

    // Metadaten des Stücks
    const title = tune.metaText.title || "Unbekannt";
    const meter = tune.getMeter().value?.map(fraction => `${fraction.num}/${fraction.den}`).join(", ") || "Unbekannt";
    const key = tune.getKeySignature().root + (tune.getKeySignature().acc || "") + " " + tune.getKeySignature().mode;
    const tempo = tune.getBpm();

    voice_arr[0] = [];
    

    // Gruppiere Noten nach Stimme und Takt
    tune.lines.forEach((line, index ) => {

        //         
        if (line.text) {
            console.log(  "text : ", line.text )
            currentSection = "" + line.text.text  // .replace("%%text", "").trim();
            // currentSection = "aaa" + index + line.text.text
            // if (!sections[currentSection]) {
            //     sections[currentSection] = [];
            // }
               
            const range : PartRange = { name: currentSection, start: voice_arr[0].length }
            sections_range.push(range)            
        }

        if (line.staff) {
            

            line.staff.forEach((staff, staffIndex) => {
                // Ensure an array exists for the current voice
                if (!voice_arr[staffIndex]) {
                    voice_arr[staffIndex] = [];
                }

                const voiceLabel = `Voice ${staffIndex + 1}`;
                if (staff.voices === undefined) return;
                const voice = staff.voices[0]; // Erste Stimme
                let currentMeasureNotes: Note[] = [];

                

                voice.forEach((item: VoiceItem) => {
                    // Detect section changes

                    if (item.el_type === 'bar') {

                        // Beende den aktuellen Takt und speichere ihn
                        if (currentMeasureNotes.length > 0) {
                            const measure: Measure = {
                                notes: currentMeasureNotes,
                                voice: voiceLabel,
                            }
                            voice_arr[staffIndex].push( measure );

                            // if (!sections[currentSection]) {
                            //     sections[currentSection] = [];
                            // }                              
                            
                            // if (!sections[currentSection][staffIndex]) {
                            //     sections[currentSection][staffIndex] = [];
                            // }                            
                            // sections[currentSection][staffIndex].push(measure);
                            currentMeasureNotes = [];
                        }
                    } else if (item.el_type === 'note') {
                        // Füge eine Note hinzu
                        currentMeasureNotes.push({
                            pitches: item.pitches?.map((p: any) => p.name) || [],
                            duration: item.duration || 0,

                            lyrics: item.lyric?.map((lyric: any) => lyric.syllable).join(" ") || undefined,
                        });
                    }
                });

                // Speichere den letzten Takt
                if (currentMeasureNotes.length > 0) {
                    // voice_arr[staffIndex].push({
                    //     notes: currentMeasureNotes,
                    //     voice: voiceLabel,
                    // });
                    const measure: Measure = {
                        notes: currentMeasureNotes,
                        voice: voiceLabel,
                    }
                    voice_arr[staffIndex].push( measure );

                    // if (!sections[currentSection][staffIndex]) {
                    //     sections[currentSection][staffIndex] = [];
                    // }                            
                    // sections[currentSection][staffIndex].push(measure);
                    currentMeasureNotes = [];                    
                }
            });
        }
    });

    // Log the results
    console.log("Voice-specific measures:", voice_arr);

    return {
        measures_v1: voice_arr[0] || [],
        measures_v2: voice_arr[1] || [],
        title,
        meter,
        key,
        tempo,        
        sections_range
    };
};

export const AbcPlayer = (props: Props) => {
    const paperId = getUniqueId();
    const paperRef = useRef<HTMLDivElement | null>(null);
    const cursorRef = useRef<SVGLineElement | null>(null);
    const [synth, setSynth] = useState<MidiBuffer | null>(null);
    const [playing, setPlay] = useState(false);


    const CursorControl = () => {
        const onStart = () => {
            const svg = paperRef.current?.querySelector("svg");
            if (cursorRef.current === null) {
                cursorRef.current = document.createElementNS("http://www.w3.org/2000/svg", "line");
            }

            cursorRef.current.setAttribute("class", "abcjs-cursor");
            cursorRef.current.setAttribute("x1", "0");
            cursorRef.current.setAttribute("y1", "0");
            cursorRef.current.setAttribute("x2", "0");
            cursorRef.current.setAttribute("y2", "0");
            svg?.appendChild(cursorRef.current);
        };

        const onEvent = (event: NoteTimingEvent) => {

            console.log(" - pitches ", event.measureNumber)
            props.callback_current_Measure(event.measureNumber ? event.measureNumber : 0)       

            // console.log(event)
            if (cursorRef.current) {
                cursorRef.current.setAttribute("x1", `${event.left !== undefined ? event.left - 2 : 0}`);
                cursorRef.current.setAttribute("x2", `${event.left !== undefined ? event.left - 2 : 0}`);
                cursorRef.current.setAttribute("y1", `${event.top !== undefined ? event.top : 0}`);
                cursorRef.current.setAttribute("y2", `${event.top !== undefined && event.height !== undefined ? event.top + event.height : 0}`);
            }
        };
        
        const onBeat = (beatNumber: number, totalBeats: number, totalTime: number) => {
            console.log( "onBeat", beatNumber )
        }

        const onFinished = () => console.log("Finished playback");

        return { onStart, onEvent, onFinished, onBeat };
    };

    useEffect(() => {

    }, [])

    useEffect(() => {
        const tunes = abcjs.renderAbc(
            "songPaper" + paperId,
            props.play,
            {
                responsive: "resize",
                // generateDownload: false, // Keine Akkorde oder Extras
                selectionColor: "", // Optionale Anpassung                
            }
        );

        if (abcjs.synth.supportsAudio()) {
            const localsynth: MidiBuffer = new abcjs.synth.CreateSynth();

            setSynth(localsynth)
            const cursorControl = CursorControl();
            const synthControl = new abcjs.synth.SynthController();

            synthControl.load("#audio" + paperId, cursorControl, {
                displayRestart: true,
                displayPlay: true,
                // displayLoop: true,
                displayWarp: false,
                displayProgress: false,
                // displayClock: true,
            });

            localsynth.init({
                visualObj: tunes[0],
                options: { chordsOff: true }, // Akkorde deaktiviert
                audioContext: new window.AudioContext(),
            })
                .then(() => {
                    synthControl.setTune(tunes[0], true).then(() => {
                        synthControl.restart();
                    });
                })
                .catch((error) => {
                    alert("Error initializing the synthesizer:" + error)
                    console.error("Error initializing the synthesizer:", error);
                });
        } else {
            alert("Error initializing the synthesizer:" )
            console.log("Audio is not supported on this browser");
        }
    }, [props.play]);

    async function playMusic() {
        if (playing) {
            synth?.stop()
            setPlay(false)
        }
        else {
            await synth?.prime();
            synth?.start();
            setPlay(true)
        }
    }

    return (
        <Grid container spacing={1} >
            <Grid item xs={12} >
                <div id={"songPaper" + paperId} ref={paperRef}></div>
            </Grid>
            <Grid item xs={4} >
                <div id={"audio" + paperId}></div>
            </Grid>
            <Grid item xs={6} >
                {/* <IconButton
                    onClick={playMusic} ><Icon>{playing ? "stop" : "play_arrow"} </Icon></IconButton> */}

            </Grid>
        </Grid>
    );
};

function groupBy(measures: Measure[], arg1: string) {
    throw new Error("Function not implemented.");
}
