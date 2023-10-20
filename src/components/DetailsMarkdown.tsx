import React, { useEffect, useState } from "react";

// import remark from 'remark';
import ReactMarkdown from "react-markdown";

// import { remark } from 'remark'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'

import remarkTypescript from 'remark-typescript'



import { ImageFromPhotos } from "./ImageFromPhotos";
import { Accordion, AccordionDetails, AccordionSummary, Alert, AlertColor, AlertTitle, Box, Card, CardContent, Checkbox, Chip, FormControlLabel, Grid, Icon, IconButton, TextField, Typography } from "@mui/material";
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
    updateFunction: (s: string) => void;
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
                currentLine.startsWith("$$Accordion")
                ) {

                let width = 6
                const splittetLine = currentLine.split(":")
                if (splittetLine.length == 2) {
                    width = +splittetLine[1]
                }

                let color = splittetLine.at(2)

                if (color === undefined) color = 'linear-gradient(rgba(0, 0, 0, 0.30), rgba(0, 0, 0, 0.20))'

                const mdcontent = content
                content = ""
                const retJSX = <>
                    {currentLine.startsWith("$$Accordion") &&
                        <Grid item xs={12} md={width} >
                            
                            <Accordion sx={{ background: color }} >
                                <AccordionSummary
                                    expandIcon={<Icon>expand_more</Icon> }
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                    sx={{ background: color }}
                                >
                                    <Typography>more</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    {markdownWithExtension(mdcontent, offset)}
                                </AccordionDetails>
                            </Accordion>
                            
                        </Grid>
                    }
                    {currentLine.startsWith("$$Grid") &&
                        <Grid item xs={12} md={width}  >
                            <Box>
                                {markdownWithExtension(mdcontent, offset)}
                            </Box>
                        </Grid>
                    }
                    {currentLine.startsWith("$$Card") &&
                        <Grid xs={12} md={width} p={1}>
                            <Card sx={{ background: color }} >
                                <CardContent>
                                    {markdownWithExtension(mdcontent, offset)}
                                </CardContent>
                            </Card>
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



    return (
        <>
            <Grid container spacing={1}>
                {parseText(props.value)}
            </Grid>
        </>
    )

}

