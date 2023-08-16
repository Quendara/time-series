import React, { useEffect, useState } from "react";

// import remark from 'remark';
import ReactMarkdown from "react-markdown";

// import { remark } from 'remark'
// import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import { ImageFromPhotos } from "./ImageFromPhotos";
import { Grid } from "@mui/material";
import { extract } from "query-string/base";
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
}

export const DetailsMarkdown = (props: Props) => {

    const getPhotoJSX = (line: string) => {

        const regex = /\$\$Photo:"([^"]+)"/;

        const matches = line.match(regex);

        if (matches && matches.length >= 2) {
            const extractedString = matches[1];
            const filename = extractedString.split("/")
            return (

                <Grid item xs={3} ><ImageFromPhotos folder={filename[0]} file={filename[1]} /></Grid>

            )
        } else {
            console.log("Kein Übereinstimmung gefunden.");
            return (<></>)
        }
    }


    const parseText = (val: string) => {

        const lines = val.split("\n")
        let content = ""

        const contentJSX = lines.map((currentLine) => {

            if (currentLine.startsWith("$$Grid")) {

                let width = 6
                const splittetLine = currentLine.split(":")
                if( splittetLine.length == 2 ){
                    width = +splittetLine[1]
                }

                const mdcontent = content
                content = ""
                return (<>

                    <Grid item xs={width} >
                        <ReactMarkdown children={mdcontent} remarkPlugins={[remarkGfm]} />
                    </Grid>

                </>
                )
            }

            if (currentLine.startsWith("$$")) {

                const mdcontent = content
                content = ""
                return (<>

                    {mdcontent.length > 0 &&
                        <Grid item xs={12} >
                            <ReactMarkdown children={mdcontent} remarkPlugins={[remarkGfm]} />
                        </Grid>}
                    {getPhotoJSX(currentLine)}
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

        return contentJSX
    }




    return (
        <>
            <Grid container spacing={1}>
                {parseText(props.value)}
            </Grid>



            {/* <Grid container spacing={2}>

                {images.map((image: string) => {
                    const filename = image.split("/")
                    return (<Grid item xs={3} ><ImageFromPhotos folder={filename[0]} file={filename[1]} /></Grid>)
                })
                }
            </Grid> */}
        </>
    )

}

