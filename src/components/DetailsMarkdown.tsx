import React, { useEffect, useState } from "react";

// import remark from 'remark';
import ReactMarkdown from "react-markdown";

// import { remark } from 'remark'
// import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import { ImageFromPhotos } from "./ImageFromPhotos";
import { Alert, AlertColor, AlertTitle, Box, Card, CardContent, Checkbox, FormControlLabel, Grid, IconButton } from "@mui/material";
import { extract } from "query-string/base";
import { stringMap } from "aws-sdk/clients/backup";
import { bool } from "aws-sdk/clients/signer";

import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import tsx from 'react-syntax-highlighter/dist/cjs/languages/prism/tsx';
import typescript from 'react-syntax-highlighter/dist/cjs/languages/prism/typescript';
import scss from 'react-syntax-highlighter/dist/cjs/languages/prism/scss';
import bash from 'react-syntax-highlighter/dist/cjs/languages/prism/bash';
// import markdown from 'react-syntax-highlighter/dist/cjs/languages/prism/markdown';
import json from 'react-syntax-highlighter/dist/cjs/languages/prism/json';
import { getAlertJSX, getPhotoJSX, getVideoJSX } from "./MarkdownComponents";
import { DetailsById, DetailsLinkById } from "./Details";
import { UpdateTodosInput } from "../API";
import { MyIcon } from "./MyIcon";
import { useNavigate } from "react-router-dom";

SyntaxHighlighter.registerLanguage('tsx', tsx);
SyntaxHighlighter.registerLanguage('typescript', typescript);
SyntaxHighlighter.registerLanguage('scss', scss);
SyntaxHighlighter.registerLanguage('bash', bash);
// SyntaxHighlighter.registerLanguage('markdown', markdown);
SyntaxHighlighter.registerLanguage('json', json);


// import  {remarkTypescript}  from 'remark-typescript'

// import remarkMath from 'remark-math'
// import remarkRehype from 'remark-rehype'
// //import remarkSource from 'remark-sources' 
// import remarkHtml from 'remark-html'
// import rehypeKatex from 'rehype-katex'
// import rehypeHighlight from 'rehype-highlight'
// import { unified } from 'unified'

// remarkPlugins={[remarkGfm]}
// 

// <ReactMarkdown>
// {selectedItemValue ? selectedItemValue : "No Description"}
//  <ReactMarkdown children={ selectedItemValue ? selectedItemValue : "No Description" }  remarkPlugins={ [remarkGfm] } >// </ReactMarkdown>
// remarkGfm


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
// <ReactMarkdown children={markdown} remarkPlugins={[remarkGfm]} />,

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

        if (todoStrId) {

            return (
                <>
                    <DetailsById 
                        itemid={todoStrId}
                        listtype={""}
                        lists={[]} username={""}
                        action={
                            undefined
                        }
                    />
                </>
            )
        }
    }

    const getTodoLinkJSX = (line: string) => {
        let todoStrId = line.split(":").at(1)

        if (todoStrId) {

            return (
                <>
                    <DetailsLinkById itemid={todoStrId}
                        listtype={""}
                        lists={[]} username={""} action={undefined} />
                </>
            )
        }
    }

    const checkOwnMarkup = (line: string, index: number) => {

        type Component = "Alert" | "Photo" | "Checkbox" | "Todo" | "Video" | "TodoInclude" | undefined
        let type: Component = undefined
        const trimmedLine = line.trim()

        if (trimmedLine.startsWith("$$Alert")) { type = "Alert" }
        if (trimmedLine.startsWith("$$Photo")) { type = "Photo" }
        if (trimmedLine.startsWith("$$Video")) { type = "Video" }
        if (trimmedLine.startsWith("$$Todo")) { type = "Todo" }
        if (trimmedLine.startsWith("$$TodoInclude")) { type = "TodoInclude" }
        if (trimmedLine.startsWith("$$ [")) { type = "Checkbox" }

        switch (type) {
            case "Alert":
                return getAlertJSX(line)
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
        if (line.trim().startsWith("$$ []")) { isCheckbox = true }
        else if (line.trim().startsWith("$$ [x]")) { isCheckbox = true; isChecked = true }

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

        if (isCheckbox) {
            const labelFromLine = line.split("]").at(1)
            let label = labelFromLine ? labelFromLine : "label"

            return (
                <Box ml={2 * indent} mr={2 * indent}>
                    <FormControlLabel control={
                        <Checkbox
                            defaultChecked={isChecked}
                            onChange={() => handleCheck(!isChecked, label)}
                        />} label={label} />
                </Box>
            )
        } else {
            return (<></>)
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
                            <ReactMarkdown children={mdcontent} remarkPlugins={[remarkGfm]} />
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
                    <ReactMarkdown children={content} remarkPlugins={[remarkGfm]} />
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
            if (currentLine.startsWith("$$Grid") || currentLine.startsWith("$$Card")) {

                let width = 6
                const splittetLine = currentLine.split(":")
                if (splittetLine.length == 2) {
                    width = +splittetLine[1]
                }

                const mdcontent = content
                content = ""
                const retJSX = <>
                    {currentLine.startsWith("$$Grid") ?
                        <Grid item xs={12} md={width} >
                            <Box>
                                {markdownWithExtension(mdcontent, offset)}
                            </Box>
                        </Grid> : <Grid xs={12} md={width} p={1}>
                            <Card>
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

