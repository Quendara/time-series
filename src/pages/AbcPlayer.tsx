import React, { useRef, useEffect } from "react";
import { getUniqueId } from "../components/helpers";
import abcjs from "abcjs";
import "abcjs/abcjs-audio.css";

interface Props {
    play: string;
}

export const AbcPlayer = (props: Props) => {
    const paperId = getUniqueId();
    const paperRef = useRef<HTMLDivElement | null>(null);
    const cursorRef = useRef<SVGLineElement | null>(null);

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

        const onEvent = (event: any) => {
            if (cursorRef.current) {
                cursorRef.current.setAttribute("x1", `${event.left - 2}`);
                cursorRef.current.setAttribute("x2", `${event.left - 2}`);
                cursorRef.current.setAttribute("y1", `${event.top}`);
                cursorRef.current.setAttribute("y2", `${event.top + event.height}`);
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
            const synth = new abcjs.synth.CreateSynth();
            const cursorControl = CursorControl();
            const synthControl = new abcjs.synth.SynthController();

            synthControl.load("#audio" + paperId, cursorControl, {
                displayRestart: true,
                displayPlay: true,
                displayProgress: true,
                // displayClock: true,
            });

            synth.init({
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
                    alert( "Error initializing the synthesizer:"+ error )
                    console.error("Error initializing the synthesizer:", error);
                });
        } else {
            console.log("Audio is not supported on this browser");
        }
    }, [props.play]);

    return (
        <>
            <div id={"songPaper" + paperId} ref={paperRef}></div>
            <div id={"audio" + paperId}></div>
        </>
    );
};