import React, { Component, useState, useEffect } from "react";
import { Alert, AlertTitle } from '@material-ui/lab';

export const Error = ({ errorMessages }) => {

    // const [errorMessages, setErrorMessages ] = useState(["Opps"])


    return (
        <>
            { errorMessages.map((item, index) => (
                <Alert key={ index } severity="error">
                    <AlertTitle>Error</AlertTitle>
                    {item }
                </Alert>
            ))}
        </>
    )
}