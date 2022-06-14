
import React, { useState, useEffect, useRef, SyntheticEvent, KeyboardEvent } from "react";


import { MyCard, MyCardHeader, MyTextareaAutosize, MyTextareaRead } from "./StyledComponents"


interface PropMTA {
    initValue: String;
    updateFunction: (s: string) => void;
}


export const MarkdownTextareaAutosize = ({ initValue, updateFunction }: PropMTA) => {
    const textFieldRef = useRef<any>(); // textFieldRef.current.

    const [caret, setCaret] = useState({
        start: 0,
        end: 0
    });

    useEffect(() => {

        textFieldRef.current.value = initValue;

        return () => {

        };

    }, [initValue]);

    const insertText = (value: String, caret_start: number, caret_end: number, text: String) => {

        const pre = value.substring(0, caret_start)
        const post = value.substring(caret_end, value.length)

        const insertItem = text
        const newPos = caret_start + insertItem.length

        console.log("insertText : ", caret_start)


        return pre
            + insertItem
            + post
    }

    const lastLineBeforeCursor = (value: String, caret_start: number) => {
        const pre = value.substring(0, caret_start)
        const index = pre.lastIndexOf("\n")
        const line = pre.substring(index + 1, pre.length)
        return line
    }

    const handleSelect = (e: any) => {

        console.log("handleSelect : ", e.target.selectionStart)

        setCaret({ start: e.target.selectionStart, end: e.target.selectionEnd });
    }


    const handleKeyPress = (event: any) => {

        const initialCursor = event.target.selectionStart
        let cursorPos = event.target.selectionStart
        let selectionEnd = event.target.selectionEnd

        const previous_value = textFieldRef.current.value

        switch (event.key) {
            case "Enter":

                let insertion_str = "\n";



                const lineBeforeCursor = lastLineBeforeCursor(previous_value, cursorPos)

                console.log("lineBeforeCursor : ", lineBeforeCursor)

                if (lineBeforeCursor.startsWith('*')) {
                    insertion_str = "\n* ";
                } else if (lineBeforeCursor.startsWith('  *')) {
                    insertion_str = "\n  * ";
                } else if (lineBeforeCursor.startsWith('    *')) {
                    insertion_str = "\n    * ";
                } else {
                    insertion_str = "\n";
                }


                const insertedText = insertText(previous_value, cursorPos, selectionEnd, insertion_str)
                event.preventDefault()
                setCaret({ start: cursorPos, end: selectionEnd })

                //     let value = selectedItemValue + " *"

                //     const splittetLines = selectedItemValue.split("\n")
                //     let charCount = 0

                //     splittetLines.forEach((line: String, index: Number ) => {

                //         charCount += line.length + 1

                //         if (cursorPos < charCount) {
                //             // Add to index, 0 means delete = 0
                //             splittetLines.splice(index, 0, "* ");
                //             cursorPos = 9999999999999999999999999
                //         }

                //     });

                //     setSelectedValue( splittetLines.join("\n")  )
                //     event.preventDefault()

                if (textFieldRef && textFieldRef.current) {
                    textFieldRef.current.value = insertedText;
                    textFieldRef.current.selectionStart = initialCursor + insertion_str.length
                    textFieldRef.current.selectionEnd = initialCursor + insertion_str.length

                    updateFunction(insertedText)
                }
        }
    }

    return (
        <MyTextareaAutosize
            // value={ selectedItemValue ? selectedItemValue : "" }
            rowsMin={10}
            rowsMax={30}
            // error={ hasError(linkName) }
            // label="Name"
            // size="small"
            autoFocus={true}
            // fullWidth
            // variant="outlined"
            ref={textFieldRef}
            onSelect={(e) => handleSelect(e)}
            onKeyPress={e => handleKeyPress(e)}
            onChange={e => updateFunction(e.target.value)} />
    )

    // <Grid item xs={12} >{caret.start} - {caret.end}</Grid>
}
