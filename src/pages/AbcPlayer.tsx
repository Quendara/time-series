import React from "react";
import { useRef, useEffect } from "react";
import { getUniqueId } from "../components/helpers";

import abcjs from "abcjs";
import 'abcjs/abcjs-audio.css';


interface Props {
    play: string
}

export const AbcPlayer = (props: Props) => {

    const paperId = getUniqueId()


    const paperRef = useRef<HTMLDivElement | null>(null);
    const cursorRef = useRef<SVGLineElement | null>(null);


    const CursorControl = () => {
        // const cursorRef = useRef<SVGLineElement | null> (null);
        // let cursor : SVGLineElement;



        const onStart = () => {

            console.log("Cursor created")

            const paper: any = document.getElementById("songPaper" + paperId)
            // if( cursorRef.current === null ) return;

            const svg = paperRef.current?.querySelector("svg");

            // console.log("Cursor created paper", paper)
            // console.log("Cursor created svg", svg)

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
            console.log("onEvent playback", event)

            // Das Element, das hervorgehoben wird
            // if (event.measureStart && event.left) {
            //     const element = document.querySelector(`[data-abcjs="${event.left}"]`) as HTMLElement;;
            //     if (element) {

            //         element.scrollIntoView({ behavior: "smooth", block: "center" });
            //         element.style.backgroundColor = "yellow"; // Beispiel für visuelle Hervorhebung
            //     }
            // }

            if (cursorRef.current) {
                console.log("cursor found", event.left)
                cursorRef.current.setAttribute("x1", "" + (event.left - 2));
                cursorRef.current.setAttribute("x2", "" + (event.left - 2));
                cursorRef.current.setAttribute("y1", event.top);
                cursorRef.current.setAttribute("y2", event.top + event.height);

            }
        }
        const onFinished = () => console.log("Finished playback")

        return { onStart, onEvent, onFinished };
    };


    useEffect(() => {


        const tunes = abcjs.renderAbc("songPaper" + paperId, props.play, { responsive: "resize" });
        if (abcjs.synth.supportsAudio()) {
            const synth = new abcjs.synth.CreateSynth();
            const controlOptions = {
                displayRestart: true,
                displayPlay: true,
                displayProgress: true,
                displayClock: true,
            };

            const cursorControl = CursorControl();

            const synthControl = new abcjs.synth.SynthController();
            synthControl.load("#audio" + paperId, cursorControl, controlOptions);

            synth
                .init({
                    visualObj: tunes[0],
                    // audioContext: new (window.AudioContext || window.webkitAudioContext)(),
                    audioContext: new (window.AudioContext)()
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

    }, [props.play]);

    return (
        <>

            <div id={"songPaper" + paperId} ref={paperRef} />
            {/* <Button onClick={ activate }>Play</Button> */}
            <div id={"audio" + paperId}></div>
        </>

    )

}