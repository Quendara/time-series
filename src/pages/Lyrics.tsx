import { Box, Divider } from "@mui/material";
import React, { useEffect, useState } from "react";

import "tailwindcss";
// import "./typography.css";

interface PartProps {
    lyrics: string
}



interface LyricsLine {
    original: string
    translation: string
}


export const Lyrics = (props: PartProps) => {

    const [lines, setLines] = useState<LyricsLine[]>([]);
    const [markedLines, setMarkedLines] = useState<number[]>([ 3, 7 ]);

    useEffect(() => {
        const processedLines = processLyrics(props.lyrics);
        setLines(processedLines);
    }, [props.lyrics]);


    const processLyrics = (lyrics: string) => {


        let currentLime: LyricsLine = { original: "", translation: "" };
        let lineParts: LyricsLine[] = [];

        // array of number of lines

        let labledLines = []

        lyrics.split("\n").map( (line, index)  => {

            if( line.startsWith("[") && line.endsWith("]" ) ) {

                // parse json inside brackets
                const result = JSON.parse( line )
                // typeof of array of lines

                if( Array.isArray( result ) ) {
                    labledLines = result
                }
            }


            const currentLine = line.trim();

            if (currentLine.length === 0) {
                if (currentLime.original.length > 0 && currentLime.translation.length > 0) {

                    lineParts.push(currentLime);
                    currentLime = { original: "", translation: "" };
                    return null;
                }
            }

            if (currentLine.startsWith("**")) {
                currentLime.original = currentLine.slice(2).trim();

                // remove surrounding ** if present
                if (currentLime.original.endsWith("**")) {
                    currentLime.original = currentLime.original.slice(0, -2).trim();
                }
                return null;
            }
            else {
                currentLime.translation = currentLine;
                return null;
            }
        });
        return lineParts;
    }

    const getClassName = ( index: number ) => {
        
        if( markedLines.includes( index ) ) {
            return  " text-yellow-300" 
        }
        return ""
    }


    const defaultClassName = "origin-center inline-block origin-center transition duration-300 hover:brightness-125 hover:scale-105";

    return (
        <>
            {lines.map((line, index) => (
                <Box key={index} style={{ marginBottom: "1em" }}>

                    <Box className={ defaultClassName + getClassName( index ) } onClick={ () => {
                        if( markedLines.includes( index ) ) {
                            setMarkedLines( markedLines.filter( l => l !== index ) )
                        }
                        else {
                            setMarkedLines( [ ...markedLines, index ] )
                        }
                    }} >    
                        <Box className={getClassName( index ) }>{line.original}</Box>
                        {line.translation && <Box style={{ fontStyle: "italic", color: "gray" }}>{line.translation}</Box>}
                    </Box>
                </Box>
            ))}

            <Divider />
            # Lyrics nLines : {lines.length}
        </>
    )
}