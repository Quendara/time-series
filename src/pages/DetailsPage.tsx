import React, { Component, useState } from "react";
import { DetailsById } from "../components/Details"

interface Props {
    id: string;
    updateFunction: any;
}

const DetailsPage = ({ id, updateFunction } : Props) => {
    return (
        <DetailsById id={ id } updateFunction={updateFunction} lists={lists}  />
    )
}