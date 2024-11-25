import React, { useRef, useEffect, useState } from "react";
import { getUniqueId } from "../components/helpers";
import abcjs, { MidiBuffer, NoteTimingEvent, parseOnly, TuneObject, VoiceItem } from "abcjs";
import "abcjs/abcjs-audio.css";
import { Grid, Icon, IconButton } from "@mui/material";

interface Props {
    play: string;
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

interface AnalysisResult {
    measures_v1: Measure[]; // Alle Takte, voice 1
    measures_v2: Measure[]; // Alle Takte, voice 2
    title: string; // Titel des Stücks
    meter: string; // Taktart
    key: string; // Tonart
    tempo: number; // Tempo (QPM)
}


export const myParseAbc = (abcNotaion: string): TuneObject => {
    const tunes: TuneObject[] = abcjs.parseOnly(abcNotaion)
    return tunes[0]
}

// Funktion zur Gruppierung der Noten pro Takt
export const groupNotesByMeasure = (tune: TuneObject): AnalysisResult => {

    // const tune = tunes[0]; // Nimm die erste TuneObject
    const measures_v1: Measure[] = []; // voice 1
    const measures_v2: Measure[] = []; // voice 2


    // Metadaten des Stücks
    const title = tune.metaText.title || "Unbekannt";
    const meter = tune.getMeter().value?.map(fraction => `${fraction.num}/${fraction.den}`).join(", ") || "Unbekannt";
    const key = tune.getKeySignature().root + (tune.getKeySignature().acc || "") + " " + tune.getKeySignature().mode;
    const tempo = tune.getBpm();
    tune.getBarLength()

    tune.getMeterFraction()
    

    // Gruppiere Noten nach Stimme und Takt
    tune.lines.forEach((line) => {
        if (line.staff) {
            line.staff.forEach((staff, staffIndex) => {
                const voiceLabel = `Voice ${staffIndex + 1}`;

                if (staff.voices === undefined) return
                const voice = staff.voices[0]; // Erste Stimme
                let currentMeasureNotes: Note[] = [];

                voice.forEach((item: VoiceItem) => {

                    if (item.el_type === 'clef') {

                    }
                    if (item.el_type === 'bar') {
                        // Beende den aktuellen Takt und speichere ihn
                        if (currentMeasureNotes.length > 0) {
                            if (staffIndex === 0) {
                                measures_v1.push({
                                    notes: currentMeasureNotes,
                                    voice: voiceLabel,
                                });
                            }
                            else {
                                // if( staffIndex === 0 ){
                                measures_v2.push({
                                    notes: currentMeasureNotes,
                                    voice: voiceLabel,
                                });
                            }
                            currentMeasureNotes = [];
                        }
                    } else if (item.el_type === 'note') {
                        // Füge eine Note hinzu
                        currentMeasureNotes.push({
                            pitches: item.pitches?.map((p: any) => p.name) || [],
                            duration: item.duration || 0,
                        });
                    }
                });

                // Speichere den letzten Takt
                if (currentMeasureNotes.length > 0) {
                    if (staffIndex === 0) {
                        measures_v1.push({
                            notes: currentMeasureNotes,
                            voice: voiceLabel,
                        });
                    }
                    else {
                        // if( staffIndex === 0 ){
                        measures_v2.push({
                            notes: currentMeasureNotes,
                            voice: voiceLabel,
                        });
                    }

                }
            });
        }
    });

    // let groups = groupBy(measures, "voice");


    // const measures = groupNotesByMeasure(tunes[0]);
    console.log("Taktspezifische voice 1:", measures_v1);
    console.log("Taktspezifische voice 1:", measures_v2);


    return { measures_v1, measures_v2, title, meter, key, tempo };
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

            // console.log(" - pitches ", event.midiPitches)
            // // Aktuell gespielte Note
            // console.log(`Aktuelle Note: ${event.note[0]?.name || "Keine Note"}`);

            // // Noten des aktuellen Takts (falls verfügbar)
            // if (event.measureStart !== undefined && event.elements) {
            //     const taktNoten = event.elements.map((element) => element.abcelem.notes.map((note) => note.name));
            //     console.log("Noten im aktuellen Takt:", taktNoten.flat());
            // }

            // console.log(event)
            if (cursorRef.current) {
                cursorRef.current.setAttribute("x1", `${event.left !== undefined ? event.left - 2 : 0}`);
                cursorRef.current.setAttribute("x2", `${event.left !== undefined ? event.left - 2 : 0}`);
                cursorRef.current.setAttribute("y1", `${event.top !== undefined ? event.top : 0}`);
                cursorRef.current.setAttribute("y2", `${event.top !== undefined && event.height !== undefined ? event.top + event.height : 0}`);
            }
        };

        const onFinished = () => console.log("Finished playback");

        return { onStart, onEvent, onFinished };
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
                displayRestart: false,
                displayPlay: true,
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
            <Grid item xs={4} >
                <div id={"audio" + paperId}></div>
            </Grid>
            <Grid item xs={6} >
                <IconButton
                    onClick={playMusic} ><Icon>{playing ? "stop" : "play_arrow"} </Icon></IconButton>

            </Grid>
            <Grid item xs={12} >
                <div id={"songPaper" + paperId} ref={paperRef}></div>
            </Grid>
        </Grid>
    );
};

function groupBy(measures: Measure[], arg1: string) {
    throw new Error("Function not implemented.");
}
