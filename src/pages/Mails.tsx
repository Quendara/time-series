import { Avatar, ListItem, ListItemAvatar, ListItemText, Paper, Stack, Typography } from "@mui/material"
import React, { useEffect, useState } from "react"
import Settings from "../Settings";

interface Props {
    token: string
}

export const Mails = (props: Props) => {

    const [error, setError] = useState("");
    const [mails, setMails] = useState<any>(undefined);

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
                            setMails(response.body.map( ( mail:any ) => {
                                return { ...mail, date:getDate(mail.date) }
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

    // const sort = ( )

    return (

        <Paper sx={{ m: 2, pl:2 }} >
            
            <h1>Mails</h1>

            {mails && mails.sort( (a:any,b:any) => (b.date < a.date) ) .map((mail: any) => (

                <Stack direction="row" alignItems={"center"} sx={{ m: 2, p:0.5, width: "100%" }} >
                    <ListItemAvatar><Avatar sx={{ backgroundColor: mail.seen_status ? "green" : "gray" }} >{mail.from[0]}</Avatar></ListItemAvatar>
                    <Stack >

                        <Stack direction="row" sx={{ width: "100%" }} alignItems={"center"} alignContent="space-between" >
                            <Typography variant="body1" noWrap sx={{ fontWeight: 500 }} >{mail.from}</Typography>
                            <Typography variant="body1" sx={{ color: "gray" }}  >{ mail.date }</Typography>
                        </Stack>

                        <Typography variant="body1" sx={{}} >{mail.subject}</Typography>
                        <Typography variant="body2" sx={{ color: "gray" }} >{mail.preview}</Typography>
                    </Stack>
                </Stack>
            )

            )

            }
        </Paper>
    )
}
