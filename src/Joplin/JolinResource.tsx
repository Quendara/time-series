import { useTheme } from '@mui/material/styles';
import React, { useEffect, useState } from "react";
import { settings } from './JoplinCommon';
import { Button } from '@mui/material';

export interface JoplinResource {
    id: string;
}

export interface JoplinLInk {
    id: string;
    name: string;
    selectCallback: (id: string) => void;
}


export const JolinNoteLink = (props: JoplinLInk) => {

    const [currentID, setID] = useState<string | undefined>(undefined);

    // set ID when request was successful
    useEffect(() => {
        selectNote(props.id)
    }, [props.id]);

    const selectNote = (node_id: string | undefined) => {
        console.log("selectNote " + node_id)

        setID(undefined)

        const fields = "fields=id,title,updated_time,body,parent_id&"
        const url = "http://localhost:41184/notes/" + node_id + "?" + fields + settings.token

        fetch(url).then(response => {
            return response.json();
        }).then(jsonResp => {
            console.log("Is node: ", jsonResp)
            if (jsonResp.error) {
                // do nothing
            }
            else {
                setID(node_id)
            }
        })
    }

    return (
        <>
            {currentID &&
                <Button onClick={() => props.selectCallback(currentID)} >{props.name}</Button>
            }
        </>
    );
};



export const JolinResource = (props: JoplinResource) => {

    const theme = useTheme();

    const [currentID, setID] = useState<string | undefined>(undefined);

    // set ID when request was successful
    useEffect(() => {
        selectNote(props.id)
    }, [props.id]);

    const selectNote = (node_id: string | undefined) => {
        console.log("selectNote " + node_id)

        setID(undefined)
        const url = "http://localhost:41184/resources/" + node_id+ "?" + settings.token;

        fetch(url).then(response => {
            return response.json();
        }).then(jsonResp => {
            console.log("Is node: ", jsonResp)
            if (jsonResp.error) {
                // do nothing
            }
            else {
                setID(node_id)
            }
        })
    }

    return (
        <>  { currentID && 
            <img src={"http://localhost:41184/resources/" + currentID + "/file?" + settings.token } style={{ width: "50%" }} />
         } 
        </>

    );

};