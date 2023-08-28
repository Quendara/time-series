
import React, { useState, useEffect, useRef, SyntheticEvent, KeyboardEvent } from "react";


import { MyTextareaAutosize, MyTextareaRead } from "./StyledComponents"
import { Calendar } from "../organisms/Calendar";
import { Button, Divider, IconButton, Stack, Tooltip } from "@mui/material";
import { MyIcon } from "./MyIcon";
import dayjs from "dayjs";


interface PropMTA {
    initValue: string;
    onSave: (s: string) => void;
}


export const MarkdownTextareaAutosize = (props: PropMTA) => {
    const textFieldRef = useRef<HTMLTextAreaElement>(null); // textFieldRef.current.

    const [selectedItemValue, setSelectedValue] = useState("");

    const [caret, setCaret] = useState({
        start: 0,
        end: 0
    });

    useEffect(() => {

        setSelectedValue(props.initValue)


        if (textFieldRef) {
            if (textFieldRef.current) {
                textFieldRef.current.value = props.initValue;
            }
        }

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

                setSelectedValue(newText)
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

        const checkLineEnterPress = (originalLine: string, trimmedLine: string, searchVal: string) => {
            let insertion_str = ""
            if (trimmedLine.startsWith(searchVal)) {
                const indexOfVal = originalLine.indexOf(searchVal)
                insertion_str = "\n" + originalLine.slice(0, indexOfVal + searchVal.length + 1)
            }
            return insertion_str
        }

        const initialCursor = event.target.selectionStart
        let cursorPos = event.target.selectionStart
        let selectionEnd = event.target.selectionEnd

        setCaret({ start: cursorPos, end: selectionEnd })

        const previous_value = textFieldRef?.current?.value as string

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
                    if (trimmedLine.startsWith('*')) {
                        shiftBack = 2
                    }
                    if (trimmedLine.startsWith('$$')) {
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

                const trimmedLine = lineWithCursor.trim()

                // if( trimmedLine.startsWith('*') ){
                //     const indexOfVal = lineWithCursor.indexOf("*")
                //     insertion_str = "\n" + lineWithCursor.slice( 0, indexOfVal+1 )

                if (insertion_str.length === 0) {
                    insertion_str = checkLineEnterPress(lineWithCursor, trimmedLine, "*")
                }
                if (insertion_str.length === 0) {
                    insertion_str = checkLineEnterPress(lineWithCursor, trimmedLine, "$$ []")
                }
                if (insertion_str.length === 0) {
                    insertion_str = checkLineEnterPress(lineWithCursor, trimmedLine, "$$ [x]")
                }

                if (insertion_str.length === 0)
                    insertion_str = "\n";

                insertedText = insertText(previous_value, cursorPos, selectionEnd, insertion_str)
                updateTextArea(insertedText, initialCursor + insertion_str.length)
        }

    }




    const handleTextAreaChange = (val: string) => {
        setSelectedValue(val)
    }

    const onSave = () => {
        props.onSave(selectedItemValue)
    }

    // const handleDateChange = (newDate: string) => {

    //     const previous_value = textFieldRef?.current?.value as string
    //     let cursorPos = caret.start
    //     let selectionEnd = caret.end

    //     textFieldRef.current?.focus()

    //     const insertedText = insertText(previous_value, cursorPos, selectionEnd, newDate)
    //     updateTextArea(insertedText, cursorPos + newDate.length)
    // }

    const insertTextToCurrentPosition = (newText: string) => {

        const previous_value = textFieldRef?.current?.value as string
        let cursorPos = caret.start
        let selectionEnd = caret.end

        textFieldRef.current?.focus()

        const insertedText = insertText(previous_value, cursorPos, selectionEnd, newText)
        updateTextArea(insertedText, cursorPos + newText.length)
    }

    return (
        <Stack direction="column" spacing={2}>
            <Stack direction={"row"} spacing={2} alignItems={"center"} justifyContent={"flex-start"}>
                <Button
                    startIcon={<MyIcon icon={"save"} />} variant="contained" color={"primary"}
                    onClick={onSave} > Save </Button>
                


                <Tooltip title="Add list">
                    <IconButton onClick={() => insertTextToCurrentPosition("* ")} >
                        <MyIcon icon={"format_list_bulleted"} />
                    </IconButton>
                </Tooltip>

                <Tooltip title="Add checklist">
                    <IconButton onClick={() => insertTextToCurrentPosition("$$ []")} >
                        <MyIcon icon={"checklist"} />
                    </IconButton>
                </Tooltip>

                <Tooltip title="Today">
                    <IconButton onClick={() => insertTextToCurrentPosition( dayjs(new Date()).format("YYYY-MM-DD") ) } >
                        <MyIcon icon={"today"} />
                    </IconButton>
                </Tooltip>

                <Calendar handleDateChange={insertTextToCurrentPosition} />

            </Stack>
            <Divider />

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
                onChange={e => handleTextAreaChange(e.target.value)} />
        </Stack>
    )

    // <Grid item xs={12} >{caret.start} - {caret.end}</Grid>
}
