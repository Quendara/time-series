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

const l1 = `
1000
1001
1002
1003

1010a
1011a
1020
1020
1030
1031
`

const l2 = `
1000
1001
1002
1003
1010
1011
1020b
1020b
xx 1030
1031 cc
`

// const l2 = `
// 2000 - England Silke Tobi
// 2001 - Skiurlaub Sylvester
// 2002 - Surfcamp Frankreich
// 2004 - Portugal
// 2005 - Klettern Isenberg
// 2005 - Lanzarote Surfen
// 2008 - Irena
// 2009 - Andre
// 2009 - Irena
// 2009 - San Francisco
// 2010 - Andre
// 2010 - Klettern Freyr
// 2011 - Klettern Schweiz
// 2011 - Tannheimer Tal
// 2012 - Andre
// 2012 - Irena
// 2013 - Juri
// 2014 - Andre
// 2014 - Klettern Provence
// 2015 - Andre
// 2016 - Andre
// 2017 - Andre
// 2018 - California
// 2018 - Den Haag
// 2018 - Familie
// 2018 - Madeira
// 2018 - Nord pas de Calais
// 2018 - Serbien
// 2018 - Skiurlaub
// 2018 - Tokio
// 2019 - Berlin
// 2019 - Familie
// 2019 - Hamburg
// 2019 - Italien
// 2019 - Kroatien
// 2019 - Prag
// 2019 - Sizilien
// 2020 - Familie
// 2020 - Griechenland
// 2020 - Porto
// 2020 - Schule
// 2020 - Test
// 2020 - Upload
// 2020 - Wien
// 2021 - Baby
// 2021 - Belgrad
// 2021 - Familie
// 2021 - Renovierung
// 2021 - Test
// `

// const l1 = `
// ./2010 - Klettern Freyr
// ./2009 - Irena
// ./2020 - Familie
// ./2020 - Familie/iPhone von Irena
// ./2020 - Familie/iPhone von Irena/Zuletzt
// ./2020 - Wien
// ./Bis1978
// ./Bis1978/19xx_CCC
// ./Bis1978/19xx Musikertreff ElDorado
// ./Bis1978/1977 - Oktoberfest-Köln
// ./Bis1978/1977 Chiemsee
// ./Bis1978/1971 Party Gerd
// ./Bis1978/1961 Wattenscheid
// ./Bis1978/1972 - Richard Gaby
// ./Bis1978/1966
// ./Bis1978/1977 Wendelstein
// ./Bis1978/19XX_CC
// ./Bis1978/1966 Zell Am Ziller
// ./Bis1978/1967 Opa
// ./Bis1978/1977 München
// ./Bis1978/1977-1982 Haddorf
// ./Bis1978/19xx
// ./Bis1978/1968 Schwarzwald
// ./Bis1978/1969 Lockner
// ./Bis1978/1968 Kirstin
// ./Bis1978/1964 Opa Andre
// ./Bis1978/1975 Fete MPI
// ./Bis1978/1969 Kirstin
// ./Bis1978/1967 Einschulung Frank
// 2009 - Andre
// ./2020 - Griechenland
// ./2005 - Klettern Isenberg
// ./Eigene Aufnahmen
// `

const fullMatch = "#00a152"
const orange = "#ff9100"
const blue = "#2979ff"


export const CompareRow = ({ index, probe, watchlist }) => {


    // const [markerIndexStart, setMarkerIndexStart] = useState(0);
    // const [markerIndexEnd, setMarkerIndexEnd] = useState(0);




    const performDiff = (probe, gallery) => {

        const diffResponse = {
            markerIndexStart: 0,
            markerIndexEnd: 0,
            markerColor:  "",
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
                diffResponse.markerColor = fullMatch
                return true
            }

            return false
        })

        // search if probe sting in part if the string if  the gallery items
        if (filteredItems !== undefined && filteredItems.length > 0) 
        { 
            diffResponse.score = 100
            diffResponse.message = "Found item from list 1 in list 2"
            return diffResponse
        } 
        filteredItems = gallery.filter(item => {

            if (item.name.trim().length === 0) return false

            const indexOf = item.name.trim().indexOf( probe )

            // if (item.name.trim().includes(probe)) {
            if ( indexOf >= 0) { 
                
                diffResponse.markerIndexStart = 0
                diffResponse.markerIndexEnd = probe.length      
                diffResponse.markerColor =   blue

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

            const indexOf = probe.indexOf( item.name.trim() )
            if ( indexOf >= 0) {

                diffResponse.markerIndexStart = indexOf
                diffResponse.markerIndexEnd = indexOf+ ( item.name.trim().length   )
                diffResponse.markerColor =  orange

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

    const diffResponse = performDiff(probe.trim(), watchlist) 

    return (
        <TableRow>
            <TableCell align="right"  > { index }</TableCell>
            
            <TableCell  > { marker( probe, diffResponse.markerIndexStart, diffResponse.markerIndexEnd, diffResponse.markerColor) }</TableCell>
            {/* <TableCell  > { diffResponse.markerIndexStart } </TableCell>
            <TableCell  > { diffResponse.markerIndexEnd } </TableCell> */}
        </TableRow>
    )


}

export const CompareLists = ({ }) => {

    const [list1, setList1] = useState(l1);
    const [list2, setList2] = useState(l2);

    const [diff, setDiff] = useState("");
    const [onlyList2, setOnlyList2] = useState("");


    useEffect(() => {
        performDiff()
    }, []); // second parameter avoid frequent loading

    const performDiff = () => {



        list2.split("\n")

        // let diffTxt = ""

        const watchlist = list2.split("\n").map((name, index) => {

            return {
                name,
                index,
                found: false
            }
        })

        const firstListArr = list1.split("\n")

        const diffTxt = firstListArr.map((name, index) => {

            return (
                <CompareRow index={ index } probe={ name } watchlist={ watchlist } />
            )
        })


        const onlyList2 = watchlist.map((item, index) => {

            return (
                <>
                    { item.found === false &&
                        <TableRow>
                            <TableCell align="right" > { index }</TableCell>
                            <TableCell  > { item.name }</TableCell>
                            <TableCell  > </TableCell>
                        </TableRow>
                    }
                </>)
        })


        setDiff(diffTxt)

        setOnlyList2(onlyList2)
    }

    return (

        <Grid container justify="center" spacing={ 1 } >
            <Grid item xs={ 3 }   >
            <Box style={ { background: blue } } >List 1</Box>
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
                <Box style={ { background: orange } } >List 1</Box>
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
            <Grid item xs={ 6 } >
                <MyCard>
                    <CardContent>
                        <Grid container justify="center" spacing={ 1 } >

                            <Grid item xs={ 12 } >
                                <Button variant="outlined" onClick={ performDiff } >run Diff</Button>
                            </Grid>
                            <Grid item xs={ 12 } >

                                <TableContainer  >
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell align="right">Line</TableCell>
                                                <TableCell>Content</TableCell>
                                                <TableCell>Comment</TableCell>

                                            </TableRow>
                                        </TableHead>
                                        { diff }


                                        <TableHead>
                                            <TableRow>
                                                <TableCell></TableCell>
                                                <TableCell><h2>Items only found in List 2</h2></TableCell>
                                                <TableCell></TableCell>

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
