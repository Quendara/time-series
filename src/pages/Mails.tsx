import { Avatar, ListItem, ListItemAvatar, ListItemText, Paper, Stack, Typography } from "@mui/material"
import React, { useEffect, useState } from "react"
import Settings from "../Settings";

interface Props {
    token : string
}

export const Mails = ( props : Props) => {

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
                  setMails(response.body);
                },
                error => setError(error)
              );
          }
    
        }, [props.token]
      )    

    return (

        <Paper sx={{m:2}} >
            
            { mails && mails.map( (mail : any ) => (
            
            <Stack direction="row" alignItems={"center"} sx={{m:2}}>
                 <ListItemAvatar><Avatar sx={{ backgroundColor:mail.seen_status?"green":"gray"}} >{ mail.from [0]}</Avatar></ListItemAvatar>
                <Stack sx={{m:2}}>
                   
                    <Typography variant="body1"  sx={{ fontWeight:500 }} >{ mail.from }</Typography>
                    <Typography variant="body1" sx={{ }} >{ mail.subject }</Typography>
                    <Typography variant="body2" sx={{ color:"gray" }} >{ mail.preview }</Typography>
                </Stack>
                </Stack>
            )  

            )

            }
        </Paper>
    )
}
