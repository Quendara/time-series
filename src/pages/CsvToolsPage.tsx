import React, { useState } from "react";

import { Grid, Stepper, Step, StepButton } from '@mui/material';


import { CsvToolsConfiguration } from '../organisms/CsvToolsConfiguration';
import { CsvTools } from "../organisms/CsvTools";


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

    const [inputData, setInputData] = useState( data );
    const [activeStep, setActiveStep] = React.useState(0);
    const [skippedLines, setSkippedLines] = useState<string[]>([]);
    const [headerStringArr, setHeaderStringArr] = useState<string[]>([]);

    const [config, setConfig] = useState<string>(staticconfig);


    const handleStep = (step: number) => () => {
        setActiveStep(step);
    };

    return (
        <Grid container justifyContent="flex-start" spacing={1} >

            <Grid item xs={12}   >
                <Stepper nonLinear activeStep={activeStep}>

                    <Step><StepButton color="inherit" onClick={handleStep(0)}>Data Input</StepButton></Step>
                    <Step><StepButton color="inherit" onClick={handleStep(1)}>Output</StepButton></Step>

                </Stepper>
            </Grid>
            {activeStep === 0 &&
                <Grid item xs={12}   >
                    <Grid container justifyContent="flex-start" spacing={1} >                        



                    </Grid>
                </Grid>
            }
            {activeStep === 1 &&
                <Grid item xs={12} >
                    <CsvToolsConfiguration
                        header={headerStringArr}
                        configuation={config}
                        configCallback={(x : string ) => setConfig(x)}
                    />                    
                    <CsvTools
                        csvInput={inputData}
                        configuation={config}
                        skippedLinesCallback={(x : string[] ) => setSkippedLines(x)}
                        headerCallback={(x : string[] ) => setHeaderStringArr(x)}
                    />

                </Grid>

            }


        </Grid>
    )

}