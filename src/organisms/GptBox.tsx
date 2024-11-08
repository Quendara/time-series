import React, { useContext, useEffect, useState } from "react"
import { Box, Button, Card, Divider, Icon, IconButton, Stack, TextField } from "@mui/material"
import { restCallToBackendAsync } from "../components/helpers";
import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { MyMarkdown } from "../components/MyMarkdown";
import { relative } from "path";
import { Buffer } from "buffer";
import { TodoMainContext } from "../context/TodoMainProvider";


interface ChatProps {
    children?: React.ReactNode;
    message: ChatCompletionMessageParam;
    apikey: string;
}

async function text2Speech(apiKey: string, text: string) {


    console.log("text2Speech : " + text)
    console.log("apiKey : " + apiKey)

    const openai = new OpenAI({
        apiKey: apiKey, dangerouslyAllowBrowser: true
    });

    const mp3 = await openai.audio.speech.create({
        model: "tts-1",
        voice: "shimmer",
        input: text // "Today is a wonderful day to build something people love!",
    });
    // console.log(speechFile);
    const buffer = Buffer.from(await mp3.arrayBuffer());

    // Convert the buffer to a Blob
    const blob = new Blob([buffer], { type: 'audio/mp3' });
    // Create a URL for the Blob
    const url = URL.createObjectURL(blob);
    // Set the URL as the audio source
    return url
    // setAudioSrc(url);
    // await fs.promises.writeFile(speechFile, buffer);
}



const ChatMessage = (props: ChatProps) => {

    if( props.message.role === "system" ){
        return (<></>)
    }

    const [audioSrc, setAudioSrc] = useState<string | null>(null);
    const copyToClipboardHandle = () => {

        if (props.message.content) {
            if (typeof props.message.content === 'string') {
                navigator.clipboard.writeText(props.message.content)
            }
            else {
                alert("No string")
            }

        }
    }

    const text2SpeechHandle = async () => {
        // console.log("text2SpeechHandle" + props.message.content)
        const url = await text2Speech(props.apikey, props.message.content as string)
        setAudioSrc(url)
    }

    const getStyleFromMessage = (message: ChatCompletionMessageParam) => {

        const common = { position: "relative", borderRadius: "5px", padding: "10px" }
        switch (message.role) {
            case "system":
                return { ...common, ...{ width: "80%", marginLeft: "5%", backgroundColor: "#3B3B3B" } }
            case "assistant":
                return { ...common, ... { width: "80%", marginLeft: "0%", backgroundColor: "#0ea63c" } }
            case "user":
                return { ...common, ...{ width: "80%", marginLeft: "10%", backgroundColor: "#2C6BED" } }
        }
    }



    return (
        <>
            {(props.message.content) &&
                <Box m={1} sx={getStyleFromMessage(props.message)}>

                    <IconButton sx={{ position: "absolute", right: "10px" }} onClick={copyToClipboardHandle}><Icon>content_copy</Icon></IconButton>
                    <IconButton sx={{ position: "absolute", right: "50px" }} onClick={text2SpeechHandle}><Icon>play_circle</Icon></IconButton>
                    <Box sx={{ width: "95%" }}>
                        {audioSrc && (
                            <audio autoPlay>
                                <source src={audioSrc} type="audio/mp3" />
                                Your browser does not support the audio element.
                            </audio>
                        )}
                        <MyMarkdown content={props.message.content} />
                    </Box>
                </Box>
            }
        </>
    )
}

export interface Tuple {
    button: string,
    systemPrompt: string
}

interface Props {
    children?: React.ReactNode;
    initialUserMessage?: string;
    systemMessages: Tuple[]

}

export const GPTBox = (props: Props) => {

    // restCallToBackendAsync

    const context = useContext(TodoMainContext)



    // const [systemMessage, setSystemMessage] = useState("");
    const [messages, setMessages] = useState<ChatCompletionMessageParam[]>([]);
    const [current, setCurrent] = useState("");

    const checkEnter = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            if (e.shiftKey) {
                askGPT()
            }
            // alert("Enter")

        }
    }

    useEffect(() => {
        setMessages([])
    }, [props.initialUserMessage]);

    // const initChat = ( sysPrompt : string  ) => {
    //     let mgs: ChatCompletionMessageParam[] = []
    //     mgs = [
    //         { role: "system", content: systemMessage }
    //     ]

    //     if (props.initialUserMessage) {
    //         mgs.push({ role: "user", content: props.initialUserMessage })
    //     }

    //     setMessages(mgs)

    // }

    const callGPT = async (mgs: ChatCompletionMessageParam[]) => {
        // const key = props.apikey
        const key = context.openAiKey

        const openai = new OpenAI({
            apiKey: key, dangerouslyAllowBrowser: true
        });

        const response = await openai.chat.completions.create({
            // model: "gpt-3.5-turbo",
            model: "gpt-4o",
            messages: mgs,
            temperature: 1,
            max_tokens: 256,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
        });

        console.log("response : ", response.choices.at(0)?.message.content)

        const assistant = response.choices.at(0)?.message.content

        if (assistant) {
            const mgs2 = [...mgs]
            mgs2.push({ role: "assistant", content: assistant })
            setMessages(mgs2)
        }
    }



    const askGPTwithSystem = (sysPrompt: string) => {
        let mgs: ChatCompletionMessageParam[] = []
        mgs = [
            { role: "system", content: sysPrompt }
        ]

        if (props.initialUserMessage) {
            mgs.push({ role: "user", content: props.initialUserMessage })
        }

        setMessages(mgs)
        callGPT(mgs)
    }

    const askGPT = async () => {
        let mgs: ChatCompletionMessageParam[] = []
        mgs = [...messages]

        if( mgs.length === 0 ){
            const systemMsg = props.systemMessages.at(0) 
            if(systemMsg){
                mgs.push({ role: "system", content: systemMsg.systemPrompt })    
            }
        }

        // 
        mgs.push({ role: "user", content: current })
        setCurrent("")

        setMessages(mgs)
        callGPT(mgs)
    }

    return (
        <>
            {
                (messages.length == 0 && props.initialUserMessage?.length === 0) ?
                    <>
                        {props.systemMessages.map(system => (
                            <Button sx={{ mr: 2 }} startIcon={<Icon>auto_awesome</Icon>} variant="outlined" onClick={() => askGPTwithSystem(system.systemPrompt)} >
                                {system.button}
                            </Button>
                        ))}
                    </>
                    :
                    <>
                        <Box m={3} sx={{ color: "#FFF" }} >
                            {messages.map(message => (
                                <ChatMessage message={message} apikey={context.openAiKey} />
                            )

                            )}
                            <Divider />
                        </Box>

                        <Stack direction={"row"} spacing={2}>

                            <TextField
                                value={current}
                                label="Message"
                                size="small"
                                multiline
                                fullWidth
                                variant="outlined"
                                onKeyDown={e => checkEnter(e)}
                                onChange={e => setCurrent(e.target.value)}
                            />

                            <Button variant="contained" onClick={askGPT} >ASK</Button>
                            <Button variant="contained" color="error" onClick={ () => setMessages([])} ><Icon>clear</Icon></Button>
                        </Stack>
                    </>
            }

        </>

    )
}
