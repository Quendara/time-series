
import React, { useState, useEffect, useRef, SyntheticEvent, KeyboardEvent } from "react";


import { MyTextareaAutosize, MyTextareaRead } from "./StyledComponents"


interface PropMTA {
    initValue: String;
    updateFunction: (s: string) => void;
}


export const MarkdownTextareaAutosize = (props: PropMTA) => {
    const textFieldRef = useRef<any>(); // textFieldRef.current.

    const [caret, setCaret] = useState({
        start: 0,
        end: 0
    });

    useEffect(() => {

        textFieldRef.current.value = props.initValue;

        return () => {

        };

    }, [props.initValue]);

    const insertText = (value: String, caret_start: number, caret_end: number, textToInsert: String) => {

        const pre = value.substring(0, caret_start)
        const post = value.substring(caret_end, value.length)

        const insertItem = textToInsert
        const newPos = caret_start + insertItem.length

        return pre
            + insertItem
            + post
    }

    const getLineWithCursor = (value: String, caret_start: number) => {
        const pre = value.substring(0, caret_start)
        const index = pre.lastIndexOf("\n")
        const line = pre.substring(index + 1, pre.length)
        return line
    }

    const updateTextArea = (newText: string, cursorPos: number) => {
        if (newText.length > 0) {
            if (textFieldRef && textFieldRef.current) {
                textFieldRef.current.value = newText;
                textFieldRef.current.selectionStart = cursorPos
                textFieldRef.current.selectionEnd = cursorPos

                props.updateFunction(newText)
            }
        }
        // setCaret({ start: cursorPos, end: cursorPos })            
    }


    const handleSelect = (e: any) => {

        console.log("handleSelect : ", e.target.selectionStart)
        setCaret({ start: e.target.selectionStart, end: e.target.selectionEnd });
    }

    // React.KeyboardEvent<HTMLTextAreaElement>
    const handleKeyPress = (event: any) => {

        const initialCursor = event.target.selectionStart
        let cursorPos = event.target.selectionStart
        let selectionEnd = event.target.selectionEnd

        const previous_value = textFieldRef.current.value as string

        const lineWithCursor = getLineWithCursor(previous_value, cursorPos)
        let insertion_str = "";
        let insertedText = ""

        console.log("lineBeforeCursor : ", lineWithCursor)

        switch (event.key) {
            case "Tab":
                event.preventDefault()
                if (event.shiftKey) {
                    let shiftBack = 0
                    const trimmedLine = lineWithCursor.trim()
                    if ( trimmedLine.startsWith('*')) {
                        shiftBack = 2
                    }
                    if ( trimmedLine.startsWith('$$')) {
                        shiftBack = 2
                    }                    
                    else if (trimmedLine.startsWith('*')) {
                        shiftBack = 2
                    }
                    else if (lineWithCursor.startsWith('#')) {
                        shiftBack = 1
                    }

                    cursorPos = cursorPos - lineWithCursor.length
                    selectionEnd = cursorPos + shiftBack

                    if (shiftBack > 0) {
                        insertedText = insertText(previous_value, cursorPos, selectionEnd, insertion_str)
                        updateTextArea(insertedText, initialCursor - shiftBack)
                    }
                } else {
                    
                    const trimmedLine = lineWithCursor.trim()
                    if (trimmedLine.startsWith('*')) {
                        insertion_str = "  ";
                    }
                    else if (trimmedLine.startsWith('$$')) {
                        insertion_str = "  ";
                    }  
                    else if (lineWithCursor.startsWith('#')) {
                        insertion_str = "#";
                    } else {
                        // if nothing then add *
                        insertion_str = "";
                    }

                    // set cursor to begin of this line
                    cursorPos = cursorPos - lineWithCursor.length
                    selectionEnd = cursorPos

                    insertedText = insertText(previous_value, cursorPos, selectionEnd, insertion_str)
                    updateTextArea(insertedText, initialCursor + insertion_str.length)
                }
                break;
            case "Enter":
                event.preventDefault()

                if (lineWithCursor.startsWith('*')) {
                    insertion_str = "\n* ";
                } else if (lineWithCursor.startsWith('  *')) {
                    insertion_str = "\n  * ";
                } else if (lineWithCursor.startsWith('    *')) {
                    insertion_str = "\n    * ";
                } else {
                    insertion_str = "\n";
                }

                insertedText = insertText(previous_value, cursorPos, selectionEnd, insertion_str)
                updateTextArea(insertedText, initialCursor + insertion_str.length)            
        }
    }

    return (
        <MyTextareaAutosize
            // value={ selectedItemValue ? selectedItemValue : "" }
            minRows={20}
            maxRows={40}
            // error={ hasError(linkName) }
            // label="Name"
            // size="small"
            autoFocus={true}
            // fullWidth
            // variant="outlined"
            ref={textFieldRef}
            onSelect={(e) => handleSelect(e)}
            onKeyDown={e => handleKeyPress(e)}
            onChange={e => props.updateFunction(e.target.value)} />
    )

    // <Grid item xs={12} >{caret.start} - {caret.end}</Grid>
}
