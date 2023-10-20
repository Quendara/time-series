import React, { useState } from "react"
import { Box, Button, Card, CardContent, Divider, Stack, TextField } from "@mui/material"
import { restCallToBackendAsync } from "../components/helpers";
import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { GPTBox } from "../organisms/GptBox";

interface Props {
    children?: React.ReactNode;
    apikey: string;

}


export const SandboxGPT = (props: Props) => {


    const [system, setSystem] = useState("You will be provided with statements, and your task is to convert them to standard English.");

    return (
        <Card sx={{ margin: "10%" }}>
            <CardContent>
                <Stack spacing={2}>
            <TextField
                value={system}
                label="System"
                size="small"
                fullWidth
                variant="outlined"
                onChange={e => setSystem(e.target.value)}
            />
            <Divider></Divider>
            <GPTBox apikey={props.apikey} systemMessage={system} />
            </Stack>
            </CardContent>
        </Card>

    )
}
