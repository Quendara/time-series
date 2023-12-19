import React, { useState } from "react";

import { Grid, Stepper, Step, StepButton, Box, CardHeader, CardContent } from '@mui/material';


import { CsvToolsConfiguration } from '../organisms/CsvToolsConfiguration';
import { CsvTools } from "../organisms/CsvTools";
import { MyCard, MyTextareaAutosize } from "../components/StyledComponents";
import { CsvProvider } from "../context/CsvProvider";

const blue = "#02735E"
const bull: any = <span style={{ "margin": "5px" }}>•</span>;



const data = `Jahr; Ausgaben; Kategorie
2022; 120; Gas
2022; 200; Oil
2022; 100; Coal
2021; 150; Gas
2021; 180; Oil
2021; 100; Coal
`

const staticconfig = `
{
    "groupname": "Jahr",
    "subgroupname": "",
    "sumField": "",
    "seperator": ";",
    "columnWidth": "3",
    "format.primary": "Ausgaben",
    "format.secondaryA": "Kategorie",
    "format.secondaryB": ""
  }`



export const CsvToolsPage = ({ }) => {

    const [inputData, setInputData] = useState(data);
    const [activeStep, setActiveStep] = React.useState(0);
    const [skippedLines, setSkippedLines] = useState<string[]>([]);
    const [headerStringArr, setHeaderStringArr] = useState<string[]>([]);

    const handleStep = (step: number) => () => {
        setActiveStep(step);
    };

    return (
        <CsvProvider>
            <Grid container justifyContent="center" spacing={2} p="20px">
                <Grid item xs={6}   >
                    <Stepper nonLinear activeStep={activeStep}>
                        <Step><StepButton color="inherit" onClick={handleStep(0)}>Data Input</StepButton></Step>
                        <Step><StepButton color="inherit" onClick={handleStep(1)}>Configuration</StepButton></Step>
                        <Step><StepButton color="inherit" onClick={handleStep(2)}>Output</StepButton></Step>
                    </Stepper>
                </Grid>
            </Grid>
            <Grid container justifyContent="flex-start" spacing={1} >

                {activeStep === 0 &&
                    <Grid item xs={12} p={3}  >
                        <MyCard sx={{ margin: "10px" }}>

                            <Box style={{ background: blue, padding: "5px" }} >Config </Box>
                            <CardContent>
                                <MyTextareaAutosize

                                    value={inputData ? inputData : ""}
                                    //rowsMin={20}
                                    onChange={e => setInputData(e.target.value)} />
                            </CardContent>
                        </MyCard>



                    </Grid>
                }
                {activeStep === 1 &&
                    <Grid item xs={12} >
                        <CsvToolsConfiguration
                            header={headerStringArr}
                        
                            
                        />
                        <CsvTools
                            csvInput={inputData}
                            
                            skippedLinesCallback={(x: string[]) => setSkippedLines(x)}
                            headerCallback={(x: string[]) => setHeaderStringArr(x)}
                        />
                    </Grid>
                }
                {activeStep === 2 &&
                    <Grid item xs={12} >
                        <CsvTools
                            csvInput={inputData}
                            
                            skippedLinesCallback={(x: string[]) => setSkippedLines(x)}
                            headerCallback={(x: string[]) => setHeaderStringArr(x)}
                        />
                    </Grid>
                }


            </Grid>
        </CsvProvider>
    )

}