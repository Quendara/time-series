import React, { Component, useState, useEffect } from "react";
import { Grid, Paper, Card, CardHeader, CardContent, Button, ButtonGroup, TextField, List, ListItem, Divider, Hidden } from '@material-ui/core';




const Letter = ({ word, letter }) => {


    const words = word.split(" ")

    const isActive = () => {
        const start = new Date;
        const activeStyle = { "color": "#33cc33" };
        let retStyle = { "color": "#203037" };
        

        let hour = 1
        let minute = 0
        let full_hour = false

        hour = start.getHours()
        minute = start.getMinutes() + 1
        hour = hour % 12
        let displhour = hour

        console.log("words : ", words)


        switch (word) {
            case "es": retStyle = activeStyle; break;
            case "ist": retStyle = activeStyle; break;
        }

        if (minute < 3) {
            if (word === "uhr") { retStyle = activeStyle; }
            full_hour = true
        }
        else if (minute < 8) {
            if (word === "fuenf") { retStyle = activeStyle; }
            if (word === "nach") { retStyle = activeStyle; }
        }
        else if (minute < 18) {
            if (word === "zehn") { retStyle = activeStyle; }
            if (word === "nach") { retStyle = activeStyle; }
        }
        else if (minute < 27) {
            if (word === "zwanzig") { retStyle = activeStyle; }
            if (word === "nach") { retStyle = activeStyle; }
        }
        else if (minute < 36) {
            if (word === "halb") { retStyle = activeStyle; }
            displhour = hour + 1
        }
        else if (minute < 43) {
            if (word === "zwanzig") { retStyle = activeStyle; }
            if (word === "vor") { retStyle = activeStyle; }
            displhour = hour + 1
        }
        else if (minute < 48) {
            if (word === "viertel") { retStyle = activeStyle; }
            if (word === "vor") { retStyle = activeStyle; }
            displhour = hour + 1
        }
        else if (minute < 53) {
            if (word === "zehn") { retStyle = activeStyle; }
            if (word === "vor") { retStyle = activeStyle; }
            displhour = hour + 1
        }
        else if (minute < 58) {
            if (word === "fuenf") { retStyle = activeStyle; }
            if (word === "vor") { retStyle = activeStyle; }

            displhour = hour + 1
        }
        else {
            displhour = hour + 1
            if (word === "uhr") { retStyle = activeStyle; }
            full_hour = true
        }

        switch (displhour) {
            case 1:
                if (full_hour) {
                    if (word === "ein_uhr") { retStyle = activeStyle; }
                }
                else {
                    if (word === "eins_uhr") { retStyle = activeStyle; }
                }

                break;
            case 2:
                if (word === "zwei_uhr") { retStyle = activeStyle; }
                // $(".zwei_uhr").addClass("activate")
                break;
            case 3:
                if (word === "drei_uhr") { retStyle = activeStyle; }
                // $(".drei_uhr").addClass("activate")
                break;
            case 4:
                if (word === "vier_uhr") { retStyle = activeStyle; }
                // $(".vier_uhr").addClass("activate")
                break;
            case 5:
                if (words.includes("fuenf_uhr")) { retStyle = activeStyle; }
                // $(".fuenf_uhr").addClass("activate")
                break;
            case 6:
                if (words.includes("sechs_uhr")) { retStyle = activeStyle; }
                // $(".sechs_uhr").addClass("activate")
                break;
            case 7:
                if (words.includes("sieben_uhr")) { retStyle = activeStyle; }
                // $(".sieben_uhr").addClass("activate")
                break;
            case 8:
                if (words.includes("acht_uhr")) { retStyle = activeStyle; }
                // $(".acht_uhr").addClass("activate")
                break;
            case 9:
                if (words.includes("neun_uhr")) { retStyle = activeStyle; }
                // $(".neun_uhr").addClass("activate")
                break;
            case 10:
                if (words.includes("zehn_uhr")) { retStyle = activeStyle; }
                // $(".zehn_uhr").addClass("activate")
                break;
            case 11:
                if (words.includes("elf_uhr")) { retStyle = activeStyle; }
                // $(".elf_uhr").addClass("activate")
                break;
            case 12:
                if (words.includes("zwoelf_uhr")) { retStyle = activeStyle; }
                // $(".zwoelf_uhr").addClass("activate")
                break;
            case 0:
                if (words.includes("zwoelf_uhr")) { retStyle = activeStyle; }
                // $(".zwoelf_uhr").addClass("activate")
                break;

        }


        // console.log( "isActive", retStyle )
        return retStyle;
    }


    return (
        <Grid item className={ "letter" } style={ isActive() } >{ letter }</Grid>
    )

}

export const Clock = () => {

    return (
        <Grid container justifyContent="center" >
        <Card>
            <CardContent style={{"padding":"120px", background: '#102027',}}>                
                <Grid container spacing={4}>
                    <Letter word="es" letter="E"    > </Letter>
                    <Letter word="es" letter="S"    > </Letter>
                    <Letter word="" letter="K"    > </Letter>
                    <Letter word="ist" letter="I"    > </Letter>
                    <Letter word="ist" letter="S"    > </Letter>
                    <Letter word="ist" letter="T"    > </Letter>
                    <Letter word="" letter="A"   > </Letter>
                    <Letter word="fuenf" letter="F"  > </Letter>
                    <Letter word="fuenf" letter="Ü"  > </Letter>
                    <Letter word="fuenf" letter="N"  > </Letter>
                    <Letter word="fuenf" letter="F"    > </Letter>
                </Grid>

                <Grid container  spacing={4} >
                    <Letter word="zehn" letter="Z" ></Letter>
                    <Letter word="zehn" letter="E" ></Letter>
                    <Letter word="zehn" letter="H" ></Letter>
                    <Letter word="zehn" letter="N" ></Letter>
                    <Letter word="zwanzig" letter="Z" ></Letter>
                    <Letter word="zwanzig" letter="W" ></Letter>
                    <Letter word="zwanzig" letter="A" ></Letter>
                    <Letter word="zwanzig" letter="N" ></Letter>
                    <Letter word="zwanzig" letter="Z" ></Letter>
                    <Letter word="zwanzig" letter="I" ></Letter>
                    <Letter word="zwanzig" letter="G" ></Letter>
                </Grid>

                <Grid container  spacing={4} >
                    <Letter word="" letter="D" > </Letter>
                    <Letter word="" letter="R" > </Letter>
                    <Letter word="" letter="E" > </Letter>
                    <Letter word="" letter="I" > </Letter>
                    <Letter word="viertel" letter="V" > </Letter>
                    <Letter word="viertel" letter="I" > </Letter>
                    <Letter word="viertel" letter="E" > </Letter>
                    <Letter word="viertel" letter="R" > </Letter>
                    <Letter word="viertel" letter="T" > </Letter>
                    <Letter word="viertel" letter="E" > </Letter>
                    <Letter word="viertel" letter="L" > </Letter>
                </Grid>

                <Grid container  spacing={4} >
                    <Letter word="vor" letter="V" > </Letter>
                    <Letter word="vor" letter="O" > </Letter>
                    <Letter word="vor" letter="R" > </Letter>
                    <Letter word="" letter="F" > </Letter>
                    <Letter word="" letter="U" > </Letter>
                    <Letter word="" letter="N" > </Letter>
                    <Letter word="" letter="K" > </Letter>
                    <Letter word="nach" letter="N" > </Letter>
                    <Letter word="nach" letter="A" > </Letter>
                    <Letter word="nach" letter="C" > </Letter>
                    <Letter word="nach" letter="H" > </Letter>
                </Grid>
                <Grid container  spacing={4} >
                    <Letter word="halb" letter="H" > </Letter>
                    <Letter word="halb" letter="A" > </Letter>
                    <Letter word="halb" letter="L" > </Letter>
                    <Letter word="halb" letter="B" > </Letter>
                    <Letter word="" letter="A" > </Letter>
                    <Letter word="elf_uhr" letter="E" > </Letter>
                    <Letter word="elf_uhr" letter="L" > </Letter>
                    <Letter word="elf_uhr fuenf_uhr" letter="F" > </Letter>
                    <Letter word="fuenf_uhr" letter="Ü" > </Letter>
                    <Letter word="fuenf_uhr" letter="N" > </Letter>
                    <Letter word="fuenf_uhr" letter="F" > </Letter>
                </Grid>

                <Grid container  spacing={4} >
                    <Letter word="eins_uhr ein_uhr" letter="E" ></Letter>
                    <Letter word="eins_uhr ein_uhr" letter="I" ></Letter>
                    <Letter word="eins_uhr ein_uhr" letter="N" ></Letter>
                    <Letter word="eins_uhr ein_uhr" letter="S" ></Letter>
                    <Letter word="" letter="X" ></Letter>
                    <Letter word="" letter="A" ></Letter>
                    <Letter word="" letter="M" ></Letter>
                    <Letter word="zwei_uhr" letter="Z" ></Letter>
                    <Letter word="zwei_uhr" letter="W" ></Letter>
                    <Letter word="zwei_uhr" letter="E" ></Letter>
                    <Letter word="zwei_uhr" letter="I" ></Letter>
                </Grid>

                <Grid container  spacing={4} >
                    <Letter word="drei_uhr" letter="D" ></Letter>
                    <Letter word="drei_uhr" letter="R" ></Letter>
                    <Letter word="drei_uhr" letter="E" ></Letter>
                    <Letter word="drei_uhr" letter="I" ></Letter>
                    <Letter word="" letter="P" ></Letter>
                    <Letter word="" letter="M" ></Letter>
                    <Letter word="" letter="J" ></Letter>
                    <Letter word="vier_uhr" letter="V" ></Letter>
                    <Letter word="vier_uhr" letter="I" ></Letter>
                    <Letter word="vier_uhr" letter="E" ></Letter>
                    <Letter word="vier_uhr" letter="R" ></Letter>
                </Grid>

                <Grid container  spacing={4} >
                    <Letter word="sechs_uhr" letter="S" ></Letter>
                    <Letter word="sechs_uhr" letter="E" ></Letter>
                    <Letter word="sechs_uhr" letter="C" ></Letter>
                    <Letter word="sechs_uhr" letter="H" ></Letter>
                    <Letter word="sechs_uhr" letter="S" ></Letter>
                    <Letter word="" letter="N" ></Letter>
                    <Letter word="" letter="L" ></Letter>
                    <Letter word="acht_uhr" letter="A" ></Letter>
                    <Letter word="acht_uhr" letter="C" ></Letter>
                    <Letter word="acht_uhr" letter="H" ></Letter>
                    <Letter word="acht_uhr" letter="T"></Letter>
                </Grid>


                <Grid container  spacing={4} >
                    <Letter word="sieben_uhr" letter="S" ></Letter>
                    <Letter word="sieben_uhr" letter="I" ></Letter>
                    <Letter word="sieben_uhr" letter="E" ></Letter>
                    <Letter word="sieben_uhr " letter="B" ></Letter>
                    <Letter word="sieben_uhr " letter="E" ></Letter>
                    <Letter word="sieben_uhr " letter="N" ></Letter>
                    <Letter word="zwoelf_uhr" letter="Z" ></Letter>
                    <Letter word="zwoelf_uhr" letter="W" ></Letter>
                    <Letter word="zwoelf_uhr" letter="Ö" ></Letter>
                    <Letter word="zwoelf_uhr" letter="L" ></Letter>
                    <Letter word="zwoelf_uhr" letter="F" ></Letter>
                </Grid>

                <Grid container  spacing={4} >
                    <Letter word="zehn_uhr" letter="Z" ></Letter>
                    <Letter word="zehn_uhr" letter="E" ></Letter>
                    <Letter word="zehn_uhr" letter="H" ></Letter>
                    <Letter word="zehn_uhr neun_uhr" letter="N" ></Letter>
                    <Letter word="neun_uhr" letter="E" ></Letter>
                    <Letter word="neun_uhr" letter="U" ></Letter>
                    <Letter word="neun_uhr" letter="N" ></Letter>
                    <Letter word="" letter="K" ></Letter>
                    <Letter word="uhr" letter="U" ></Letter>
                    <Letter word="uhr" letter="H" ></Letter>
                    <Letter word="uhr" letter="R" ></Letter>
                </Grid>



            </CardContent>

        </Card>
        </Grid>
    )

}

