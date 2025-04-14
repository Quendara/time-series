import { Avatar, Badge, Box, Icon, ListItem, ListItemAvatar, ListItemText, Paper, Stack, Typography } from "@mui/material"


import {
    Drawer, List, ListItemButton, ListItemIcon, Divider
} from '@mui/material';


import React, { useEffect, useState } from "react"
import Settings from "../Settings";
import { bool } from "aws-sdk/clients/signer";
import { findUnique, sortArrayBy } from '../components/helpers'

import { red, purple, blue, green } from '@mui/material/colors';

type RenderAs = "icon" | "table"

interface Props {
    token: string
    renderAs: RenderAs
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

    const [selectedGroup, setSelectedGroup] = useState<string | null>(null);



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

    function decodeMimeHeader(header: string): string {
        const regex = /=\?([^?]+)\?([BQbq])\?([^?]*)\?=/g;
    
        return header.replace(regex, (_, charset, encoding, encodedText) => {
            if (encoding.toUpperCase() === "Q") {
                const decoded = encodedText
                    .replace(/_/g, ' ')
                    .replace(/=([A-F0-9]{2})/gi, (_ : any, hex: any) => String.fromCharCode(parseInt(hex, 16)));
                try {
                    return decodeURIComponent(escape(decoded)); // decode UTF-8 bytes
                } catch {
                    return decoded; // fallback
                }
            }
            return encodedText; // fallback if not Q
        });
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

    const groupedMails = findUnique(mails, "domain")

    const colorArr = [red[500], purple[900], blue[600], green[800]]

    const renderAsIcon = () => (
        <Badge badgeContent={mails.length} color="primary" >
            <Icon>mail</Icon>
        </Badge>
    )

    return props.renderAs === "icon" ? renderAsIcon() : (

        <Box sx={{ display: 'flex' }}>
            {/* Left Sidebar Drawer */}
            <Drawer variant="permanent" anchor="left" sx={{ zIndex: 1 }} >
                <Box sx={{ width: 280, pt:10  }}>
                    <Typography variant="h6" sx={{ p: 2 }}>Domains</Typography>
                    <Divider />
                    <List>
                        {groupedMails.map((group, index) => (
                            <ListItemButton
                                key={group.value}
                                selected={selectedGroup === group.value}
                                onClick={() => setSelectedGroup(group.value)}
                            >
                                <ListItemIcon>
                                    <Badge badgeContent={group.listitems.length} color="primary">
                                        <Avatar sx={{ backgroundColor: colorArr[index % colorArr.length] }}>
                                            {group.value[0]}
                                        </Avatar>
                                    </Badge>
                                </ListItemIcon>
                                <ListItemText primary={group.value} />
                            </ListItemButton>
                        ))}
                    </List>
                </Box>
            </Drawer>

            {/* Main Content */}
            <Box sx={{ flexGrow: 1, p: 1, pl: "300px" }}>
                <Paper sx={{p:2}}>
                    {groupedMails
                        .filter(group => selectedGroup === null || group.value === selectedGroup)
                        .map((group, index) => (
                            <Box key={group.value}>
                                <Typography variant="h6" sx={{ pl: 1, pb: 1 }}>{group.value}</Typography>
                                {sortArrayBy(group.listitems, "date", false).map((mail: Mail) => (
                                    <Stack direction="row" alignItems="center" sx={{ mb: 2, p: 0.5 }} key={mail.date + mail.subject}>
                                        <ListItemAvatar>
                                            <Avatar sx={{ backgroundColor: colorArr[index % colorArr.length] }}>
                                                {mail.domain[0]}
                                            </Avatar>
                                        </ListItemAvatar>
                                        <Stack sx={{ width: "100%" }}>
                                            <Stack direction="row" justifyContent="space-between">
                                                <Typography variant="body1" noWrap sx={{ fontWeight: 500 }}>
                                                    {decodeQuotedPrintable(mail.from)}
                                                </Typography>
                                                <Typography variant="body1" noWrap sx={{ color: "gray" }}>
                                                    {mail.date}
                                                </Typography>
                                            </Stack>
                                            <Typography variant="body2">{mail.subject}</Typography>
                                            <Typography variant="body2" paragraph sx={{ color: "gray" }}>
                                                {mail.preview}
                                            </Typography>
                                        </Stack>
                                    </Stack>
                                ))}

                            </Box>
                        ))}
                </Paper>
            </Box>
        </Box>
    )
}
