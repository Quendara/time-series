import React, { useState } from "react"
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';

import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { Stack, TextField, Typography } from "@mui/material";

import 'dayjs/locale/de';
import dayjs, { Dayjs } from "dayjs";


interface Props {
  handleDateChange?: (newDate: string) => void

}

export const Calendar = (props: Props) => {

  const [date, setDate] = useState<Dayjs | null>(dayjs(new Date()));

  function getWeekNumber(date: Date): number {
    // Kopiere das Datum, um die Originaldaten nicht zu ändern
    const copiedDate = new Date(date.getTime());

    // Stelle sicher, dass der Wochentag Sonntag (0) ist, nicht Montag (1)
    copiedDate.setHours(0, 0, 0, 0);
    copiedDate.setDate(copiedDate.getDate() + 4 - (copiedDate.getDay() || 7));

    // Erste Woche des Jahres enthält den 4. Januar
    const yearStart = new Date(copiedDate.getFullYear(), 0, 4);

    // Berechne die Woche basierend auf der Differenz zwischen dem aktuellen Datum und dem 4. Januar
    const weekNumber = Math.ceil(((copiedDate.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);

    return weekNumber;
  }

  const handleDateChange = (value: Dayjs | null) => {
    setDate(value);
    if (props?.handleDateChange) {
      props?.handleDateChange(value?.toString() ? value?.format("YYYY-MM-DD") : "")
    }
  };

  return (<Stack direction={"row"} spacing={4}>

    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={"de"}>
      <DesktopDatePicker
        label={"Date"}
        // dayOfWeekFormatter={ (day) => day.charAt(0).toUpperCase() }
        displayWeekNumber={true}
        format={"YYYY-MM-DD"}
        value={date}
        onChange={handleDateChange}
      // renderInput={(params: any) => <TextField fullWidth  {...params} />}
      />
    </LocalizationProvider>
  </Stack>
  )


}