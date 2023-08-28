import React, { useEffect, useState } from "react";

// import remark from 'remark';
import ReactMarkdown from "react-markdown";

// import { remark } from 'remark'
// import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import { ImageFromPhotos } from "./ImageFromPhotos";
import { Alert, AlertColor, Box, Card, CardContent, Checkbox, FormControlLabel, Grid } from "@mui/material";
import { extract } from "query-string/base";
import { stringMap } from "aws-sdk/clients/backup";
import { bool } from "aws-sdk/clients/signer";
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


    const getPhotoJSX = (line: string) => {

        const regex = /\$\$Photo:"([^"]+)"/;
        const matches = line.match(regex);

        if (matches && matches.length >= 2) {
            const extractedString = matches[1];
            const filename = extractedString.split("/")
            return (
                <ImageFromPhotos folder={filename[0]} file={filename[1]} />
            )
        } else {
            console.log("Kein Übereinstimmung gefunden.");
            return (<></>)
        }
    }

    function isAlertColor(color: string): boolean {
        return ['success', 'info', 'warning', 'error'].includes(color);
      }    

    const getAlertJSX = (line: string) => {
        let isAlert = false

        if (line.trim().startsWith("$$Alert")) { isAlert = true }

        if (isAlert) {
            
            let extractedString = line.split(":").at(1)
            let severity : AlertColor = "success" 

            if( extractedString?.split("/").length === 2 ){
                const arr = extractedString?.split("/")   
                severity = isAlertColor( arr[0] ) ? arr[0] as AlertColor : "success"
                extractedString = arr[1]
            }
            
            return (
                <Box mt={1} mb={1} >
                <Alert severity={severity}>{extractedString}</Alert>
                </Box>
            )
        } else {
            console.log("Kein Übereinstimmung gefunden.");
            return (<></>)
        }
    }    

    const getCheckboxJSX = (line: string, index: number) => {

        let isCheckbox = false
        let isChecked = false
        if (line.trim().startsWith("$$ []")) { isCheckbox = true }
        else if (line.trim().startsWith("$$ [x]")) { isCheckbox = true; isChecked = true }
        var indent = line.indexOf( "$$" ); 

        const handleCheck = (check: bool, label: string) => {

            const checkStr = check ? "[x]" : "[]"
            let whiteSpace = ""

            for( let i=0; i<indent; ++i){
                whiteSpace = whiteSpace+" "
            }
            
            const replacedLine = `${whiteSpace}$$ ${checkStr} ${label.trim()}`
            const replacedContent = replaceLineInContent(index, replacedLine)
            props.updateFunction(replacedContent)
        }

        if (isCheckbox) {
            const labelFromLine = line.split("]").at(1)
            let label = labelFromLine ? labelFromLine : "label"

            return (
                    <Box ml={2*indent} mr={2*indent}>
                        <FormControlLabel control={
                            <Checkbox
                                defaultChecked={isChecked}
                                onChange={() => handleCheck(!isChecked, label)}
                            />} label={ label } />
                    </Box>
                
            )
        } else {
            return (<></>)
        }
    }

    const markdownWithExtension = (linesStr: string, offset: number ) => {

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
                    {getPhotoJSX( currentLine)}
                    {getAlertJSX( currentLine)}
                    {getCheckboxJSX(currentLine, offset + index)}
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
                        <Grid item xs={width} >
                            <Box ml={2} mr={2}>
                                {markdownWithExtension(mdcontent, offset )}
                            </Box>
                        </Grid> : <Grid item xs={width} >
                            <Card >
                                <CardContent>
                                    {markdownWithExtension(mdcontent, offset )}
                                </CardContent>
                            </Card>
                        </Grid>
                    }
                </>

                offset = index+1

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
                    {markdownWithExtension(content, offset )}
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

