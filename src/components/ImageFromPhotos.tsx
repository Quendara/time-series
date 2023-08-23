import React from "react";
import { useState } from "react";

import { ImageOnDemand } from "./ImageOnDemand"
import { Image, Mediatype } from "../models/Image"
import { Dialog } from "@mui/material";



interface Props {
    folder: string;
    file: string;
}


// 
export const ImageFromPhotos = (props: Props) => {

    const endpoint = " https://srxdhyyhm2.execute-api.eu-central-1.amazonaws.com/dev"

    const [image, setImage] = useState(undefined)


    const folder = props.folder
    const id = props.file
    const url = [endpoint, "photoData", folder, id].join("/")

    const [edit, setEdit] = useState(false);

    const updateFunction = () => { }


    const fakeImage: Image = {
        filename: id,
        source_url: url,
        date: new Date(),
        year: "",
        month: "",
        day: "",
        hour: "",
        minute: "",
        sameday: "",
        dirname: props.folder,
        dirname_logical: "",
        dirname_physical: "",
        orientation: "",
        id: "",
        src: "",
        faces: [],
        nFaces: 0,
        rating: 0,
        mediatype: Mediatype.Image,
        country: "",
        state: "",
        city: "",
        rotate: 0,
        width: 0,
        height: 0
    }



    return (
        <>
        <Dialog
                    open={edit}
                    onClose={() => setEdit(false)}
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                >
 <ImageOnDemand image={fakeImage}
            className="responsive-img"
            onClick={undefined}
            fullRes={false}
            token=""
        />
                </Dialog>
        <ImageOnDemand image={fakeImage}
            className="responsive-img"
            onClick={ () => setEdit(true )}
            fullRes={false}
            token=""
        />
        </>
    )
}