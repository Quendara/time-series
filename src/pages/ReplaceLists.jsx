import React, { useState, useEffect } from "react";

import { Box, Button, Grid, CardContent, TableCell, TableRow  } from '@mui/material';
import { MyCard, MyTextareaAutosize } from "../components/StyledComponents"




const doku = `---
Brackets
---
[abc]	Find any character between the brackets
[^abc]	Find any character NOT between the brackets
[0-9]	Find any character between the brackets (any digit)
[^0-9]	Find any character NOT between the brackets (any non-digit)
(x|y)	Find any of the alternatives specified

---
Quantifiers
---
n+	Matches any string that contains at least one n
n*	Matches any string that contains zero or more occurrences of n
n?	Matches any string that contains zero or one occurrences of n

---
Meta characters
---
.	Find a single character, except newline or line terminator
\\w	Find a word character
\\W	Find a non-word character
\\d	Find a digit
\\D	Find a non-digit character
\\s	Find a whitespace character
\\S	Find a non-whitespace character
`

// n{X}	Matches any string that contains a sequence of X n's
// n{X,Y}	Matches any string that contains a sequence of X to Y n's
// n{X,}	Matches any string that contains a sequence of at least X n's

// 
// 
// \b	Find a match at the beginning/end of a word, beginning like this: \bHI, end like this: HI\b
// \B	Find a match, but not at the beginning/end of a word
// \0	Find a NULL character
// \n	Find a new line character
// \f	Find a form feed character
// \r	Find a carriage return character
// \t	Find a tab character
// \v	Find a vertical tab character
// \xxx	Find the character specified by an octal number xxx
// \xdd	Find the character specified by a hexadecimal number dd
// \udddd	Find the Unicode character specified by a hexadecimal number dddd


// TODO ADD Examples
const l1 = `
2000
2001
2002
2004
2005
2005
2008
`

const l2 = `case $1:
    return $1
`

const l3 = `(.*)`

const fullMatch = "#00a152"
const orange = "#ff9100"
const blue = "#2979ff"

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
            diffResponse.markerColor = fullMatch
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
            diffResponse.markerColor = blue

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
            diffResponse.markerColor = orange

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

export const ReplaceLists = ({ }) => {

    const [list1, setList1] = useState(l1);
    const [expression, setExpression] = useState(l2);
    const [regex, setRegex] = useState(l3);

    const [result, setResult] = useState("");


    useEffect(() => {
        performHandle()
    }, []); // second parameter avoid frequent loading

    const performHandle = () => {

        const list = list1.split("\n").map((name, index) => {
            return {
                name,
                index
            }
        })

        // text.replace(/microsoft/i, "W3Schools");

        const replace = (text, regex, replaceBy) => {

            return text.replace(new RegExp(regex, ""), replaceBy)
        }


        const text = list.map((item, index) => {
            if( item.name.length === 0 ) return ""
            return replace(item.name, regex, expression) 
        })


        setResult(text)
    }




    return (

        <Grid container justifyContent="center" spacing={ 1 } >
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

                <Box style={ { background: orange } } >RegEx</Box>

                <MyTextareaAutosize
                    value={ regex ? regex : "" }
                    rowsMin={ 10 }
                    // error={ hasError(linkName) }
                    label="Name"
                    size="small"
                    fullWidth
                    variant="outlined"
                    // onKeyPress={ e => checkEnter(e) }
                    onChange={ e => setRegex(e.target.value) } />

                <Box style={ { background: orange } } >Replace By</Box>
                <MyTextareaAutosize
                    value={ expression ? expression : "" }
                    rowsMin={ 10 }
                    // error={ hasError(linkName) }
                    label="Name"
                    size="small"
                    fullWidth
                    variant="outlined"
                    // onKeyPress={ e => checkEnter(e) }
                    onChange={ e => { setExpression(e.target.value); } } />

            </Grid>
            <Grid item xs={ 6 } >
                <MyCard>
                    <CardContent>
                        <Grid container justifyContent="center" spacing={ 1 } >

                            <Grid item xs={ 12 } >
                                <Button variant="outlined" onClick={ performHandle } >run</Button>
                            </Grid>
                            <Grid item xs={ 12 } >

                                <MyTextareaAutosize
                                    value={ result ? result.join("") : "" }
                                    rowsMin={ 10 }
                                    // error={ hasError(linkName) }
                                    label="Name"
                                    size="small"
                                    fullWidth
                                    variant="outlined"
                                    />

                            </Grid>
                        </Grid>
                    </CardContent>
                </MyCard>
            </Grid>
            <Grid item xs={ 12 } >
                <MyCard>
                    <CardContent>
                <pre>
{doku}

                </pre>
                </CardContent>
                </MyCard>
            </Grid>

        </Grid>



    )
}
