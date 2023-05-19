import React from "react"
import { Box, Card, Divider, Stack } from "@mui/material"

interface IProps {
    children?: React.ReactNode;
    number: number
}

const TestS = (props: IProps) => {
    // const localStyle = { background: "#aaa", width: "300px", float: "left" }

    const test = (n: number) => {

        var indents: React.ReactElement[] = [];

        for (let i = 0; i < n; i++) {
            indents.push(
                <Box component="div" sx={{ p: 1 }}>
                    {i}
                </Box>
            )
        }
        return indents
    }

    return (<div style={{
        float: "left",
        margin: "10px",
        width: "200px",
        position: "sticky",
        top: "10px"
    }}
    ><Card>
            {test(props.number)}
        </Card>
    </div>)
}

const TestR = (props: IProps) => {
    // const localStyle = { background: "#aaa", width: "300px", float: "left" }

    const test = (n: number) => {

        var indents: React.ReactElement[] = [];

        for (let i = 0; i < n; i++) {
            indents.push(
                <Box component="div" sx={{ p: 1 }}>
                    {i}
                </Box>
            )
        }
        return indents
    }

    return (<div style={{
        float: "left",
        margin: "10px",
        width: "200px",
        position: "relative"
    }}
    ><Card>
            {test(props.number)}
        </Card>
    </div>)
}


export const SandboxH = () => {

    return (
        <>
            <div style={{ width: "900px", position: "relative", height: "300vh" }} >

                <TestR number={10} />
                <TestS number={3} />
                <TestS number={30} />
                <TestS number={20} />
            </div>

            <div style={{ clear: "both", paddingTop: "1em" }} ></div>

            <div style={{

                width: "250px",
                scrollSnapType: "x mandatory",
                overflowX: "scroll"
            }}>
                <div style={{ width: "900px", position: "relative", height: "200vh" }} >

                    <TestR number={10} />
                    <TestS number={3} />
                    <TestS number={30} />
                    <TestS number={20} />
                </div>

            </div>


        </>

    )
}
