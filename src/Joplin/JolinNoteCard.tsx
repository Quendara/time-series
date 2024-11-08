// JoplinNoteCard.tsx
import React from 'react';
import { Grid, Card, CardContent, Stack, ListItemButton, ListItemIcon, Icon, ListItemText, Typography, CardActions, useTheme } from '@mui/material';
import { JoplinData, NoteStlye, getPaperColor, muiColor, renderActions, renderBody, timestampToDate } from './JolinNote';
import { GPTBox, Tuple } from '../organisms/GptBox';

interface NoteProps {
    data: JoplinData
    folderTitle: string;
    xs: number;
    // renderAs: NoteStlye;
    icon: string;
    cardColor: muiColor;
    selectedId?: string;
    selectCallback: (id: string) => void;
}

const JoplinNoteCard = (props: NoteProps) => {

    const theme = useTheme();

    let gpt : Tuple[] = [] 
    gpt.push( { button:"Sum", systemPrompt: "Summarize content you are provided with for a second-grade student." } )
    gpt.push( { button:"Meeting Notes", systemPrompt: "Ich gebe dir rohe Meeting notes. Kannst Du die Notizen etwas erweitern." } )
    gpt.push( { button:"Mail", systemPrompt: "Email Maestro is a helpful assistant specialized in writing emails. It helps users draft clear, professional, and effective emails for various purposes, such as business communication, customer support, personal correspondence, and more. The assistant offers suggestions on tone, structure, and content to ensure the emails are well-received and achieve their intended purpose. Email Maestro emphasizes a clear tone, suggests tiny improvements, corrects grammar and typos, and shows the changes at the end. It avoids informal language unless explicitly asked and ensures all emails are concise and to the point. It always answers in the same language as the user was asked." })
    

    return (
        <Grid item xs={props.xs}>
            <Card sx={getPaperColor(theme, props.cardColor)} >
                <CardContent sx={{ borderBottom: "1px solid #ddd" }} >
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        spacing={0}>

                        <ListItemButton onClick={() => props.selectCallback(props.data.id)} color={props.cardColor}>
                            <ListItemIcon >
                                <Icon color={props.cardColor}>
                                    {props.icon}
                                </Icon>
                            </ListItemIcon>
                            <ListItemText
                                primary={props.data.title}
                                secondary={props.folderTitle} />
                        </ListItemButton>
                       
                        <Typography color="text.secondary">
                            {timestampToDate(props.data.updated_time)}
                        </Typography>
                    </Stack>
                </CardContent>
                <CardContent >
                    {renderBody(props.data.body, props.selectCallback)}
                </CardContent>
                <CardContent >
                    <GPTBox
                        systemMessages ={ gpt }
                        initialUserMessage={props.data.body} />
                </CardContent>
                <CardActions>
                    {renderActions(props.data.id)}
                </CardActions>
            </Card>
        </Grid>
    );
};

export default JoplinNoteCard;