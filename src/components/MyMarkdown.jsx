import React, { useEffect, useState } from "react";

import ReactMarkdown from "react-markdown";

// import { remark } from 'remark'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
// import remarkRaw from 'rehype-raw'
// import remarkTypescript from 'remark-typescript'

export const MyMarkdown = ({content}) => {
    return (        
        <ReactMarkdown children={content} remarkPlugins={[remarkGfm, remarkParse ]} />
    )
}
 