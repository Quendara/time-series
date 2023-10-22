import React, { useEffect, useState } from "react"
import { Box, Button, Card, Divider, Icon, IconButton, Stack, TextField } from "@mui/material"
import { restCallToBackendAsync } from "../components/helpers";
import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { MyMarkdown } from "../components/MyMarkdown";
import { relative } from "path";


interface ChatProps {
    children?: React.ReactNode;
    message: ChatCompletionMessageParam;

}


const ChatMessage = (props: ChatProps) => {

    const clickHandle = () => {
        if (props.message.content !== null) {
            navigator.clipboard.writeText(props.message.content)
        }
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
            {(props.message.content !== null && props.message.content.length > 0) &&
                <Box m={1} sx={getStyleFromMessage(props.message)}>

                    <IconButton sx={{ position: "absolute", right: "2%" }} onClick={clickHandle}><Icon>content_copy</Icon></IconButton>
                    <Box sx={{ width: "95%" }}>
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
            // alert("Enter")
            callGPT()
        }
    }


    useEffect(() => {

        let mgs: ChatCompletionMessageParam[] = []

        if (messages.length > 0) {
            // check if the first message is a system, replace content
            if (messages.at(0)?.role === "system") {
                mgs = [...messages]
                mgs[0].content = props.systemMessage
            }
            else {
                mgs = [{ role: "system", content: props.systemMessage }, ...messages]
            }
        }
        else {
            // add system to the beginning
            mgs = [{ role: "system", content: props.systemMessage }, ...messages]

        }


        setMessages(mgs)

    }, [props.systemMessage]);


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
            model: "gpt-3.5-turbo",
            messages: mgs,
            temperature: 1,
            max_tokens: 256,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
        });

        console.log("response : ", response.choices.at(0)?.message.content)

        const assistant = response.choices.at(0)?.message.content

        if (assistant !== undefined && assistant !== null) {
            const mgs2 = [...mgs]
            mgs2.push({ role: "assistant", content: assistant })
            setMessages(mgs2)
        }
    }




    return (
        <>
            <Box m={3} sx={{ color: "#FFF" }} >
                {messages.map(message => (
                    <ChatMessage message={message} />
                )

                )}
                <Divider />
            </Box>

            <Stack direction={"row"} spacing={2}>

                <TextField
                    value={current}
                    label="Input GPT"
                    size="small"
                    fullWidth
                    variant="outlined"
                    onKeyDown={e => checkEnter(e)}
                    onChange={e => setCurrent(e.target.value)}
                />

                <Button variant="contained" onClick={callGPT} >Go</Button>
            </Stack>

        </>

    )
}
