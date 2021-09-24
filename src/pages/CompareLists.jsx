import React, { Component, useState, useEffect } from "react";
import { useQuery } from '@apollo/react-hooks'


// import { Row, Col, List, Button, DatePicker, Card, version } from "antd";
import Settings from "../Settings";
import SingleTimeSerie from "../SingleTimeSerie";

import { AppBar, Toolbar, Box, Button, TextField, Grid, Card, CardContent, Typography, Divider, IconButton } from '@material-ui/core/';

import CircularProgress from '@material-ui/core/CircularProgress';
import { MyCard, MyCardHeader, MyTextareaAutosize } from "../components/StyledComponents"
import { useStyles } from "../Styles"

import ReactMarkdown from "react-markdown";

import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';

// const l1 = `
// 1000
// 1001
// 1002
// 1003

// 1010a
// 1011a
// 1020
// 1020
// 1030
// 1031
// `

// const l2 = `
// 1000
// 1001
// 1002
// 1003
// 1010
// 1011
// 1020b
// 1020b
// xx 1030
// 1031 cc

// 2000
// `

const l2 = `
2000 - England Silke Tobi
2001 - Skiurlaub Sylvester
2002 - Surfcamp Frankreich
2005 - Klettern Isenberg
2005 - Lanzarote Surfen
2008 - Irena
2009 - Andre
2009 - Irena
2009 - San Francisco
2010 - Andre
2014 - Klettern Provence
2015 - Andre
2016 - Andre
2020 - Upload
2020 - Wien
2021 - Baby
2021 - Belgrad
2021 - Familie
2021 - Renovierung
2021 - Test
`

const l1 = `
./2001 - Skiurlaub Sylvester
./2004 - Portugal
./2000 - England Silke Tobi
./2002 - Surfcamp Frankreich
./2005 - Klettern Isenberg
./2005 - Lanzarote Surfen
./200x/2009 - Andre
./2015 - Andre
./2008 - Irena
./2010 - Andre
./2016 - Andre
./2009 - Irena
./2020 - Upload
./2014 - Klettern Provence
./2021 - Renovierung/Test
./2020 - Wien
./2021 - Baby
./2021 - Test
./2021 - Belgrad

`

const color = {
    fullMatch: "#00a152",
    orange: "#3f51b5",
    blue: "#3f51b5"
}

const performDiff = (probe, gallery) => {

    const diffResponse = {
        markerIndexStart: 0,
        markerIndexEnd: 0,
        markerColor: "",
        message: "",
        score: 0
    }

    if (probe.length === 0) {
        return diffResponse
    }

    // search probe in gallery
    let filteredItems = gallery.filter(item => {
        if (item.name.trim().length === 0) return false
        if (probe === item.name.trim()) {
            item.found = true
            // setMarkerIndexEnd(probe.length)
            diffResponse.markerIndexEnd = probe.length
            diffResponse.markerColor = color.fullMatch
            return true
        }

        return false
    })

    // search if probe sting in part if the string if  the gallery items
    if (filteredItems !== undefined && filteredItems.length > 0) {
        diffResponse.score = 100
        diffResponse.message = "Found item from list 1 in list 2"
        return diffResponse
    }
    filteredItems = gallery.filter(item => {

        if (item.name.trim().length === 0) return false

        const indexOf = item.name.trim().indexOf(probe)

        // if (item.name.trim().includes(probe)) {
        if (indexOf >= 0) {

            diffResponse.markerIndexStart = 0
            diffResponse.markerIndexEnd = probe.length
            diffResponse.markerColor = color.blue

            item.found = true
            return true
        }
        return false
    })

    if (filteredItems !== undefined && filteredItems.length > 0) {
        diffResponse.score = 91
        diffResponse.message = "Found item from list 1 in list 2"
        return diffResponse
    }

    // ----

    filteredItems = gallery.filter(item => {
        if (item.name.trim().length === 0) return false

        const indexOf = probe.indexOf(item.name.trim())
        if (indexOf >= 0) {

            diffResponse.markerIndexStart = indexOf
            diffResponse.markerIndexEnd = indexOf + (item.name.trim().length)
            diffResponse.markerColor = color.orange

            item.found = true
            return true
        }
        return false
    })

    if (filteredItems !== undefined && filteredItems.length > 0) {
        diffResponse.score = 90
        diffResponse.message = "Found item from list 2 in list 1"
        return diffResponse
    }
    return diffResponse
}


export const CompareRow = ({ index, probe, diffResponse }) => {


    const marker = (probe, markerIndexStart, markerIndexEnd, markerColor) => {

        return (
            <>
                <Box component="span" >
                    { probe.slice(0, markerIndexStart) }
                </Box>
                <Box component="span" style={ { background: markerColor } } >
                    { probe.slice(markerIndexStart, markerIndexEnd) }
                </Box>
                <Box component="span" >
                    { probe.slice(markerIndexEnd, probe.length) }
                </Box>
            </>)
    }

    // const diffResponse = performDiff(probe.trim(), watchlist) 
    // console.log( watchlist )

    return (
        <TableRow>
            <TableCell align="right"  > { index }</TableCell>
            <TableCell  > { marker(probe.trim(), diffResponse.markerIndexStart, diffResponse.markerIndexEnd, diffResponse.markerColor) }</TableCell>
            <TableCell  > { diffResponse.score } </TableCell>
        </TableRow>
    )
}

export const CompareLists = ({ }) => {

    const [list1, setList1] = useState(l1);
    const [list2, setList2] = useState(l2);

    const [diff, setDiff] = useState("");
    const [onlyList2, setOnlyList2] = useState("");


    useEffect(() => {
        performDiffHandle()
    }, []); // second parameter avoid frequent loading

    const performDiffHandle = () => {
        setDiff( performDiffHandleInt( list1, list2 ) )
        setOnlyList2( performDiffHandleInt( list2, list1 ) )

    }

    const performDiffHandleInt = ( probelist_str, watchlist_str ) => {

        const watchlist = watchlist_str.split("\n").map((name, index) => {
            return {
                name,
                index,
                found: false
            }
        })

        const firstListArr = probelist_str.split("\n")


        const diffTxt = firstListArr.map((name, index) => {

            const x = performDiff(name.trim(), watchlist)
            if (name.trim().length == 0) return (<></>)

            return (
                <CompareRow key={ index } index={ index } probe={ name } diffResponse={ x } />
            )
        })


        const onlyList2 = watchlist.map((item, index) => {


            if (item.name.trim().length === 0) return (<></>)
            return (
                <>
                    { item.found === false &&
                        <TableRow key={ index }   >
                            <TableCell align="right" > { index }</TableCell>
                            <TableCell  > { item.name }</TableCell>
                            <TableCell  > { }</TableCell>
                        </TableRow>
                    }
                </>)
        })

        // setDiff(diffTxt)
        // setOnlyList2(onlyList2)
        return diffTxt
    }

    return (

        <Grid container justify="center" spacing={ 1 } >
            <Grid item xs={ 3 }   >
                <Box style={ { background: color.blue } } >List 1</Box>
                <MyTextareaAutosize
                    value={ list1 ? list1 : "" }
                    rowsMin={ 10 }
                    // error={ hasError(linkName) }
                    label="Name"
                    size="small"
                    fullWidth
                    variant="outlined"
                    // onKeyPress={ e => checkEnter(e) }
                    onChange={ e => setList1(e.target.value) } />
            </Grid>
            <Grid item xs={ 3 } >
                <Box style={ { background: color.orange } } >List 2</Box>
                <MyTextareaAutosize
                    value={ list2 ? list2 : "" }
                    rowsMin={ 10 }
                    // error={ hasError(linkName) }
                    label="Name"
                    size="small"
                    fullWidth
                    variant="outlined"
                    // onKeyPress={ e => checkEnter(e) }
                    onChange={ e => setList2(e.target.value) } />
            </Grid>
            <Grid item xs={ 3 } >
            <MyCard>
                    <CardContent>
            <Box component="span" style={ { background: color.fullMatch } } >
                    Full 
                </Box>

</CardContent>
</MyCard>
            </Grid>
            <Grid item xs={ 12 } >
                <MyCard>
                    <CardContent>
                        <Grid container justify="space-between" spacing={ 1 } >

                            <Grid item xs={ 12 } >
                                <Button variant="outlined" onClick={ performDiffHandle } >run Diff</Button>
                            </Grid>
                            <Grid item xs={ 5 } >
                                <h2>List</h2>

                                <TableContainer  >
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell align="right">Line</TableCell>
                                                <TableCell>Content</TableCell>
                                                <TableCell>Score</TableCell>

                                            </TableRow>
                                        </TableHead>
                                        { diff }
                                    </Table>
                                </TableContainer>
                            </Grid>
                            <Grid item xs={ 5 } >
                                <TableContainer  >
                                    <h2>Items only found in List 2</h2>
                                    <Table size="small">

                                        <TableHead>
                                            <TableRow>
                                                <TableCell align="right">Line</TableCell>
                                                <TableCell>Content</TableCell>
                                                <TableCell>Score</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        { onlyList2 }
                                    </Table>
                                </TableContainer>
                            </Grid>
                        </Grid>
                    </CardContent>
                </MyCard>
            </Grid>

        </Grid>



    )
}
