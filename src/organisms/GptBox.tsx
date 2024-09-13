import React, { useEffect, useState } from "react"
import { Box, Button, Card, Divider, Icon, IconButton, Stack, TextField } from "@mui/material"
import { restCallToBackendAsync } from "../components/helpers";
import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { MyMarkdown } from "../components/MyMarkdown";
import { relative } from "path";
import { Buffer } from "buffer";


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

interface Props {
    children?: React.ReactNode;
    systemMessage: string;
    apikey: string;
}

export const GPTBox = (props: Props) => {

    // restCallToBackendAsync


    const [messages, setMessages] = useState<ChatCompletionMessageParam[]>([]);
    const [current, setCurrent] = useState("");



    const checkEnter = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            if (e.shiftKey) {
                callGPT()
            }
            // alert("Enter")

        }
    }

    useEffect(() => {
        initChat()
    }, [props.systemMessage]);

    const initChat = () => {
        let mgs: ChatCompletionMessageParam[] = []
        mgs = [{ role: "system", content: props.systemMessage }]
        setMessages(mgs)
    }


    const callGPT = async () => {

        // const key = apikey

        const openai = new OpenAI({
            apiKey: props.apikey, dangerouslyAllowBrowser: true
        });

        // const url = "https://api.openai.com/v1/chat/completions"

        let mgs: ChatCompletionMessageParam[] = []
        mgs = [...messages]

        // mgs.push({ role: "system", content: "What's you favorite color?" })
        mgs.push({ role: "user", content: current })
        setCurrent("")
        setMessages(mgs)


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






    return (
        <>
            <Box m={3} sx={{ color: "#FFF" }} >
                {messages.map(message => (
                    <ChatMessage message={message} apikey={props.apikey} />
                )

                )}
                <Divider />
            </Box>

            <Stack direction={"row"} spacing={2}>

                <TextField
                    value={current}
                    label="Input GPT"
                    size="small"
                    multiline
                    fullWidth
                    variant="outlined"
                    onKeyDown={e => checkEnter(e)}
                    onChange={e => setCurrent(e.target.value)}
                />



                <Button variant="contained" onClick={callGPT} >ASK</Button>
                <Button variant="contained" color="error" onClick={initChat} ><Icon>delete</Icon></Button>
            </Stack>

        </>

    )
}
