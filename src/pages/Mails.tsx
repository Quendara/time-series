import { Avatar, Box, ListItem, ListItemAvatar, ListItemText, Paper, Stack, Typography } from "@mui/material"
import React, { useEffect, useState } from "react"
import Settings from "../Settings";
import { bool } from "aws-sdk/clients/signer";
import { findUnique, sortArrayBy } from '../components/helpers'

import { red, purple, blue, green } from '@mui/material/colors';

interface Props {
    token: string
}

interface Mail {
    date: string
    from: string
    domain: string
    subject: string
    preview: string
    seen_status: boolean

}

export const Mails = (props: Props) => {

    const [error, setError] = useState("");
    const [mails, setMails] = useState<Mail[]>([]);

    useEffect(
        () => {
            if (props.token) {
                const resource = "mails"
                const url = Settings.baseAwsUrl + resource;

                const options = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: props.token
                    }
                };

                fetch(url, options)
                    .then(res => res.json())
                    .then(
                        response => {
                            setMails(response.body.map((mail: any) => {

                                const email = mail.from.match(/<([^>]+)>/)?.[1] || mail.from;
                                const domain = getDomainFromEmail(email);


                                return { ...mail, domain, date: getDate(mail.date) }
                            })

                            );
                        },
                        error => setError(error)
                    )
                    .catch(error => setError(error))
            }

        }, [props.token]
    )

    const getDate = (dateStr: string) => {
        const date = new Date(dateStr)
        const date_ = "" + date.toISOString();
        return date_.slice(0, 10)
    }

    function decodeQuotedPrintable(input: string): string {
        // Replace =XX with the actual character
        const utf8Str = input.replace(/=([A-F0-9]{2})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));

        // Decode the UTF-8 string
        return decodeURIComponent(escape(utf8Str));
    }

    function getDomainFromEmail(email: string): string {
        // Find the position of the "@" symbol
        const atIndex = email.indexOf('@');

        // If "@" is found, return the substring after it
        if (atIndex !== -1) {
            return email.substring(atIndex + 1);
        } else {
            // If "@" is not found, return an empty string or handle error
            throw new Error('Invalid email address');
        }
    }

    const groupedMails = findUnique( mails, "domain")

    const colorArr = [ red[500], purple[900], blue[600], green[800]]

    return (

        <Paper  >

            <h1>Mails</h1>

            {groupedMails.map((group, index) => (
                <>
                    
                    <Typography variant="body1" noWrap sx={{ fontWeight: 500, pl:1 }} >{group.value}</Typography>
                    {sortArrayBy( group.listitems, "date", false ).map((mail: Mail) => (

                        <Stack direction="row" alignItems={"center"} sx={{ mb: 2, p: 0.5 }} >
                            <ListItemAvatar><Avatar sx={{ backgroundColor: colorArr[index % colorArr.length ] }} >{mail.domain[0]}</Avatar></ListItemAvatar>
                            <Stack sx={{ width: "100%" }} >

                                <Stack direction="row" justifyContent="space-between" >
                                    <Typography variant="body1" noWrap sx={{ fontWeight: 500 }} >{decodeQuotedPrintable(mail.from)}</Typography>
                                    <Typography variant="body1" noWrap sx={{ color: "gray" }}  >{mail.date}</Typography>
                                </Stack>

                                <Typography variant="body2" sx={{}} >{mail.subject}</Typography>
                                <Typography variant="body2" paragraph sx={{ color: "gray" }} >{mail.preview}</Typography>
                            </Stack>
                        </Stack>
                    ))}
                </>
            ))
            }


        </Paper>
    )
}
