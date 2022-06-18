import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

// import { remark } from 'remark'
// import remarkParse from 'remark-parse'
// import remarkGfm from 'remark-gfm'
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

// { value ? value : "No Description" } 

export const DetailsMarkdown = ({ value }) => {

    // const [markdown, setMarkdown] = useState("false");

    // async function loadMD( value ) {
    //     const data =  await unified()
    //     .use(remarkParse)
    //     .use(remarkGfm)
    //     .use(remarkMath)
    //     // .use(remarkRehype)                
    //     .use(rehypeKatex)
    //     // .use(rehypeHighlight)                 
    //     // .use(remarkSource) 
    //     .use(remarkHtml)

    //     .parse(value)

    //     // return data
        
    //     setMarkdown(String(data))
    //     // .then((file) => {
    //     //     //     // console.log(String(file))

            
    //     // })
    // }

    // useEffect(
    //     () => {
    //         // const data = 
    //         loadMD( value )
    //         // setMarkdown(String(data))


    //         // setMarkdown(String(file))
    //     },
    //     [value]

    // ) 


    /* <ReactMarkdown children={ value } remarkPlugins={ [] } /> */
    return (
        <>
            <ReactMarkdown children={ value ? value : "Add comments here ..." } remarkPlugins={ [] } />
        </>
    )

} 

