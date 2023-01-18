import React, { useEffect, useState } from "react";

// import remark from 'remark';
import ReactMarkdown from "react-markdown";

// import { remark } from 'remark'
// import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
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

export const DetailsMarkdown = ({ value, initValue } : Props ) => {
   
    return (
        <>
            <ReactMarkdown children={ value ? value : initValue } remarkPlugins={ [ remarkGfm ] } />
        </>
    )

} 

