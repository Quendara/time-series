import { useTheme } from '@mui/material/styles';
import React, { useContext, useEffect, useState } from "react";
import { settings } from './JoplinCommon';
import { Button } from '@mui/material';
import { TodoMainContext } from '../context/TodoMainProvider';

export interface JoplinResource {
    id: string;
}

export interface JoplinLink {
    id: string;
    name: string;
    selectCallback: (id: string) => void;
}


export const JolinNoteLink = (props: JoplinLink) => {

    const context = useContext(TodoMainContext)
    
    const [currentID, setID] = useState<string | undefined>(undefined);

    // set ID when request was successful
    useEffect(() => {
        selectNote(props.id)
    }, [props.id]);

    const selectNote = (node_id: string | undefined) => {
        console.log("selectNote " + node_id)

        setID(undefined)

        const fields = "fields=id,title,updated_time,body,parent_id&"
        const url = "http://localhost:41184/notes/" + node_id + "?" + fields + "token=" + context.joplinToken

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
    const context = useContext(TodoMainContext)

    const [currentID, setID] = useState<string | undefined>(undefined);

    // set ID when request was successful
    useEffect(() => {
        selectNote(props.id)
    }, [props.id]);

    const selectNote = (node_id: string | undefined) => {
        console.log("selectNote " + node_id)

        setID(undefined)
        const url = "http://localhost:41184/resources/" + node_id+ "?" + "token=" + context.joplinToken

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
            <img src={"http://localhost:41184/resources/" + currentID + "/file?" + "token=" + context.joplinToken } style={{ width: "50%" }} />
         } 
        </>

    );

};
