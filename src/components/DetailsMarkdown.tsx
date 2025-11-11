import React, { useEffect, useState } from "react";

// import remark from 'remark';
import ReactMarkdown from "react-markdown";

// import { remark } from 'remark'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'

import remarkTypescript from 'remark-typescript'



import { ImageFromPhotos } from "./ImageFromPhotos";
import { Accordion, AccordionDetails, AccordionSummary, Alert, AlertColor, AlertTitle, Box, Card, CardContent, CardHeader, Checkbox, Chip, Divider, FormControlLabel, Grid, Icon, IconButton, Paper, TextField, Typography } from "@mui/material";
import { bool } from "aws-sdk/clients/signer";

// import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
// import tsx from 'react-syntax-highlighter/dist/cjs/languages/prism/tsx';
// import typescript from 'react-syntax-highlighter/dist/cjs/languages/prism/typescript';
// import scss from 'react-syntax-highlighter/dist/cjs/languages/prism/scss';
// import bash from 'react-syntax-highlighter/dist/cjs/languages/prism/bash';
// // import markdown from 'react-syntax-highlighter/dist/cjs/languages/prism/markdown';
// import json from 'react-syntax-highlighter/dist/cjs/languages/prism/json';

import { getAlertJSX, getPhotoJSX, getVideoJSX } from "./MarkdownComponents";
import { DetailsById, DetailsLinkById } from "./Details";
import { MyMarkdown } from "./MyMarkdown";
import { MyIcon } from "./MyIcon";
import { TextEdit } from "./TextEdit";
import { PianoSong } from "../pages/PianoSong";
import { SongLearn } from "../pages/SongLearn";
import { Lyrics } from "../pages/Lyrics";
import { GPTBox } from "../organisms/GptBox";




// SyntaxHighlighter.registerLanguage('tsx', tsx);
// SyntaxHighlighter.registerLanguage('typescript', typescript);
// SyntaxHighlighter.registerLanguage('scss', scss);
// SyntaxHighlighter.registerLanguage('bash', bash);
// // SyntaxHighlighter.registerLanguage('markdown', markdown);
// SyntaxHighlighter.registerLanguage('json', json);


// import  {remarkTypescript}  from 'remark-typescript'

// import remarkMath from 'remark-math'
// import remarkRehype from 'remark-rehype'
// //import remarkSource from 'remark-sources' 
// import remarkHtml from 'remark-html'
// import rehypeKatex from 'rehype-katex'
// import rehypeHighlight from 'rehype-highlight'
// import { unified } from 'unified'



const markdown = `A paragraph with *emphasis* and **strong importance**.

> A block quote with ~strikethrough~ and a URL: https://reactjs.org.

* Lists
* [ ] todo
* [x] done

A table:

| a | b |
| - | - |
$$
L = \frac{1}{2} \rho v^2 S C_L
$$ 
  
`
// import remarkGfm from 'remark-gfm'

// { value ? value : "No Description" } 

interface Props {
    value: string;
    initValue: string
    updateFunction: (s: string) => void; // callback to update the markdown
}

export const DetailsMarkdown = (props: Props) => {



    const replaceLineInContent = (lineNumberToReplace: number, newLine: string) => {

        const val = props.value

        const lines = val.split("\n");

        const newContent = lines.map((line, index: number) => {
            if (index === lineNumberToReplace) {
                return newLine
            }
            else {
                return line
            }
        })

        return newContent.join("\n")
    }




    const getTodoIncludeJSX = (line: string) => {

        let todoStrId = line.split(":").at(1)
        let color = line.split(":").at(2)

        if (color === undefined) color = 'linear-gradient(rgba(0, 0, 0, 0.30), rgba(0, 0, 0, 0.20))'

        if (todoStrId) {

            return (
                <Box mb={2} >
                    <DetailsById
                        itemid={todoStrId}
                        listtype={""}
                        readOnly={false}
                        sx={{ background: color }}
                        lists={[]}
                        username={""}
                        action={
                            undefined
                        }
                    />
                </Box>
            )
        }
    }

    const getTodoLinkJSX = (line: string) => {
        let todoStrId = line.split(":").at(1)

        if (todoStrId) {
            return (
                <>
                    <DetailsLinkById
                        readOnly={true}
                        itemid={todoStrId}
                        listtype={""}
                        lists={[]} username={""} action={undefined} />
                </>
            )
        }
    }

    const checkOwnMarkup = (line: string, index: number) => {

        type Component = "Alert" | "Photo" | "Checkbox" | "Todo" | "Video" | "TodoInclude" | "System" | undefined
        let type: Component = undefined
        const trimmedLine = line.trim()

        if (trimmedLine.startsWith("$$Alert")) { type = "Alert" }
        if (trimmedLine.startsWith("$$Photo")) { type = "Photo" }
        if (trimmedLine.startsWith("$$Video")) { type = "Video" }
        if (trimmedLine.startsWith("$$Todo")) { type = "Todo" }
        if (trimmedLine.startsWith("$$System")) { type = "System" }
        if (trimmedLine.startsWith("$$TodoInclude")) { type = "TodoInclude" }
        if (trimmedLine.startsWith("$$ [")) { type = "Checkbox" }

        switch (type) {
            case "Alert":
                return getAlertJSX(line)
            case "System":
                return (
                    <Chip label="System Command" variant="outlined" />
                )

            case "Checkbox":
                return getCheckboxJSX(line, index)
            case "Photo":
                return getPhotoJSX(line)
            case "Todo":
                return getTodoLinkJSX(line)
            case "TodoInclude":
                return getTodoIncludeJSX(line)
            case "Video":
                return getVideoJSX(line)

            default:
                return (
                    <Box mt={1} mb={1} >
                        <Alert severity={"error"} >
                            <AlertTitle>Typo in line {index} </AlertTitle>
                            {line}</Alert>
                    </Box>)

        }
    }



    const getCheckboxJSX = (line: string, index: number) => {

        let isCheckbox = false
        let isChecked = false
        let isAdd = true
        const trimmedLine = line.trim()


        if (trimmedLine.startsWith("$$ []")) { isCheckbox = true }
        if (trimmedLine.startsWith("$$ [ ]")) { isCheckbox = true }
        else if (line.trim().startsWith("$$ [x]")) { isCheckbox = true; isChecked = true }

        if (trimmedLine.startsWith("$$ [] add")) { isAdd = true; isCheckbox = false }

        var indent = line.indexOf("$$");

        const handleCheck = (check: bool, label: string) => {

            const checkStr = check ? "[x]" : "[]"
            let whiteSpace = ""

            for (let i = 0; i < indent; ++i) {
                whiteSpace = whiteSpace + " "
            }

            const replacedLine = `${whiteSpace}$$ ${checkStr} ${label.trim()}`
            const replacedContent = replaceLineInContent(index, replacedLine)
            props.updateFunction(replacedContent)
        }

        const handleAdd = (label: string) => {

            const checkStr = "[]"
            let whiteSpace = ""

            for (let i = 0; i < indent; ++i) {
                whiteSpace = whiteSpace + " "
            }

            const replacedLine = `${whiteSpace}$$ ${checkStr} ${label} \n${whiteSpace}$$ [] add`
            const replacedContent = replaceLineInContent(index, replacedLine)
            props.updateFunction(replacedContent)
        }

        if (isCheckbox) {
            const labelFromLine = line.split("]").at(1)
            let label = labelFromLine ? labelFromLine : "label"

            return (
                <Box ml={2 * indent} mr={2 * indent}>
                    <IconButton onClick={() => handleCheck(!isChecked, label)} >
                        <Icon
                            color={isChecked ? "primary" : undefined} >{isChecked ? "check_box_outline" : "check_box_outline_blank"}</Icon>
                    </IconButton>
                    <TextEdit value={label} callback={(newL) => handleCheck(isChecked, newL)} />

                    {/* <TextField sx={{width:"80%"}} variant="standard" value={label} ></TextField> */}
                </Box>
            )
        }
        if (isAdd) {
            return (
                <Box ml={2 * indent} mr={2 * indent}>
                    <IconButton>
                        <MyIcon icon="add" />
                    </IconButton>
                    <TextEdit value="" callback={(newL) => handleAdd(newL)} />
                </Box>
            )
        }
        else {
            return (<>{line}</>)
        }
    }

    const checkFirstLine = (linesStr: string, returnFirstLine: bool): string => {

        const lines = linesStr.trim().split("\n")

        if (returnFirstLine) {
            if (lines.length >= 2) {
                const line = lines.at(0)
                return line ? line : "more";
            }
        }
        else {
            if (lines.length >= 2) {
                lines.shift();
                return lines.join("\n")
            }
        }

        return "undefined"

    }



    const markdownWithExtension = (linesStr: string, offset: number) => {

        const lines = linesStr.split("\n")
        let content = ""

        const contentJSX = lines.map((currentLine, index: number) => {

            if (currentLine.trim().startsWith("$$")) {

                const mdcontent = content
                content = ""
                return (<>
                    {mdcontent.length > 0 &&
                        <Grid item xs={12}>
                            <MyMarkdown content={mdcontent} />
                            {/* <ReactMarkdown children={mdcontent} remarkPlugins={[remarkGfm, remarkTypescript]} /> */}
                        </Grid>}
                    {/* {checkOwnMarkup( currentLine )}
                    {getAlertJSX( currentLine )} */}
                    {checkOwnMarkup(currentLine, offset + index)}
                </>
                )
            }
            else {
                content = content + currentLine + "\n"
                return (<></>)
            }
        })

        if (content.length > 0) {
            contentJSX.push(
                <Grid item xs={12} >
                    {/* <ReactMarkdown children={content} remarkPlugins={[remarkGfm]} /> */}
                    <MyMarkdown content={content} ></MyMarkdown>

                </Grid>)
        }

        return contentJSX;
    }


    const parseText = (val: string) => {

        const lines = val.split("\n")
        let content = ""
        let offset = 0 // importand to edit the correct line

        const contentJSX = lines.map((currentLine, index: number) => {

            // Paragraph
            if (currentLine.startsWith("$$Grid") ||
                currentLine.startsWith("$$Card") ||
                currentLine.startsWith("$$Keys") ||
                currentLine.startsWith("$$Abc") ||
                currentLine.startsWith("$$SongLearn") ||
                currentLine.startsWith("$$Paper") ||
                currentLine.startsWith("$$Accordion")
            ) {

                let width = 6
                const splittetLine = currentLine.split(":")
                if (splittetLine.length == 2) {
                    width = +splittetLine[1]
                }

                let color = splittetLine.at(2)

                // if (color === undefined) color = 'linear-gradient(rgba(0, 0, 0, 0.30), rgba(0, 0, 0, 0.20))'
                if (color === undefined) color = 'rgba(0, 0, 0, 0.30)'
                const dark = 'rgba(0, 0, 0, 0.30)'

                const mdcontent = content
                content = ""
                const retJSX = <>
                    {currentLine.startsWith("$$Accordion") &&
                        <Grid item xs={12} md={width} >
                            <Accordion sx={{ background: color }} >
                                <AccordionSummary
                                    expandIcon={<Icon>expand_more</Icon>}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                    sx={{ background: dark }}
                                >
                                    {checkFirstLine(mdcontent, true)}
                                </AccordionSummary>
                                <AccordionDetails>
                                    {markdownWithExtension(
                                        checkFirstLine(mdcontent, false),
                                        offset + 1
                                    )}
                                </AccordionDetails>
                            </Accordion>
                        </Grid>
                    }
                    {currentLine.startsWith("$$Card") &&
                        <Grid xs={12} md={width} p={1}>
                            <Card sx={{ background: color }} >
                                <CardContent
                                    sx={{ background: dark }}
                                >
                                    {checkFirstLine(mdcontent, true)}

                                </CardContent>
                                <CardContent
                                    sx={{ paddingTop: "2px" }}>
                                    {markdownWithExtension(
                                        checkFirstLine(mdcontent, false),
                                        offset + 1
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>
                    }
                    {currentLine.startsWith("$$Paper") &&
                        <Grid xs={12} md={width} p={1}>
                            <Card sx={{ background: color }} >
                                <CardContent>
                                    {markdownWithExtension(mdcontent, offset)}
                                </CardContent>
                            </Card>
                        </Grid>
                    }
                    {currentLine.startsWith("$$Grid") &&
                        <Grid item xs={12} md={width}  >
                            <Box>
                                {markdownWithExtension(mdcontent, offset)}
                            </Box>
                        </Grid>
                    }
                    {currentLine.startsWith("$$Keys") &&
                        <Grid item xs={12} md={12}  >
                            <Box>
                                <PianoSong play={mdcontent} showNodes={false} />
                            </Box>
                        </Grid>
                    }
                    {currentLine.startsWith("$$Abc") &&
                        <Grid item xs={12} md={12}  >
                            <Box>
                                <PianoSong play={mdcontent} showNodes={false} showAbcOnly={true} />
                            </Box>
                        </Grid>
                    }
                    {currentLine.startsWith("$$SongLearn") &&
                        <Grid item xs={12} md={12}  >
                            <Box>
                                <SongLearn play={mdcontent} showNodes={false} showAbcOnly={true} />
                            </Box>
                        </Grid>
                    }

                </>

                offset = index + 1
                return retJSX
            }
            else {
                content = content + currentLine + "\n"
                return (<></>)
            }
        })


        if (content.length > 0) {
            offset = 0
            contentJSX.push(
                <Grid item xs={12} >
                    {/* <ReactMarkdown children={content} remarkPlugins={[remarkGfm]} /> */}
                    {markdownWithExtension(content, offset)}
                </Grid>
            )
        }

        return contentJSX
    }


    const extractMarkdownContent = (markdown: string): { type: "Code" | "Header" | "Text", name: string, block: string }[] => {
        const content: { type: "Code" | "Header" | "Text", name: string, block: string }[] = [];

        const lines = markdown.split("\n");
        let currentHeader = "";
        let currentTextBlock: string[] = [];

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];

            if (line.startsWith("#")) {
                // Falls ein Header gefunden wird, vorherigen Textblock abschließen
                if (currentTextBlock.length > 0) {
                    content.push({
                        type: "Text",
                        name: currentHeader,
                        block: currentTextBlock.join("\n").trim()
                    });
                    currentTextBlock = [];
                }

                // Header hinzufügen
                currentHeader = line.replace(/^#+\s*/, "").trim();
                content.push({
                    type: "Header",
                    name: currentHeader,
                    block: line.trim()
                });
            } else if (line.startsWith("```")) {

                currentHeader = line.trim()
                // Codeblock einlesen
                const codeLines: string[] = [];
                i++; // Überspringe die ```-Zeile

                while (i < lines.length && !lines[i].startsWith("```")) {
                    codeLines.push(lines[i]);
                    i++;
                }

                content.push({
                    type: "Code",
                    name: currentHeader,
                    block: codeLines.join("\n").trim()
                });
            } else {
                // Text sammeln
                currentTextBlock.push(line);
            }
        }

        // Letzten Textblock abschließen, falls vorhanden
        if (currentTextBlock.length > 0) {
            content.push({
                type: "Text",
                name: currentHeader,
                block: currentTextBlock.join("\n").trim()
            });
        }

        return content;
    }

    const checkCodeBlock = (name: string, codeBlock: string) => {
        if (name.endsWith("abc")) {
            return <SongLearn play={codeBlock} showNodes={false} showAbcOnly={true} />
        }
        else if (name.endsWith("keys")) {
            return <PianoSong play={codeBlock} showNodes={false} />
        }
        else if (name.endsWith("lyrics")) {
            return <Lyrics lyrics={codeBlock} updateFunction={ props.updateFunction } />
        }
        else if (name.endsWith("system")) {
            return <Card >
                <pre>
                    {codeBlock}
                </pre>

                <GPTBox
                    initialUserMessage={""}
                    systemMessages={ [{ "systemPrompt":codeBlock, button:"HELLO" } ]} >

                </GPTBox>
            </Card>
        }
        else {
            let content = ""
            content += "# UNSUPPORTED CODE BLOCK \n\n"
            content += "``` \n" + codeBlock + "\n```"

            return (


                <MyMarkdown content={content} />
            )
        }
    }

    const extractMarkdown = (markdown: string) => {
        const content = extractMarkdownContent(markdown)
        // return { content };
        return content.map((c) => {

            if (c.type === "Header") {
                return (
                    <Grid item xs={12} >
                        <h1>{c.name}</h1>
                        <p>Block : {c.block}</p>
                    </Grid>
                )
            }
            if (c.type === "Code") {
                return (<Grid item xs={12} >
                    {checkCodeBlock(c.name, c.block)}
                </Grid>
                )
            }
            if (c.type === "Text") {
                return (<Grid item xs={12} >

                    <MyMarkdown content={c.block} />
                </Grid>)
            }
        })
    }

    return (
        <>
            <Grid container spacing={1}>
                {extractMarkdown(props.value)}
            </Grid>
        </>
    )

}

