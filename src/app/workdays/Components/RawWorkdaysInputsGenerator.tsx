"use client";
import React, { useState } from "react";
import { makeStyles } from "@mui/styles";
import { Button, Grid, TextField } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { RawWorkdaysInputs } from "@/app/Types/WorkDayTypes";

const useStyles = makeStyles({});

interface RawWorkdaysInputsGeneratorProps {
  // inputFields: RawWorkdaysInputs;
  onInputChange: (inputs: RawWorkdaysInputs) => void;
  // onGenerateInput: ()=> void;
}

const RawWorkdaysInputsGenerator = (props: RawWorkdaysInputsGeneratorProps) => {
  const { onInputChange } = props;
  const classes = useStyles();

  // created this state to control the button
  const [rawWorkdaysInputs, setRawWorkdaysInputs] = useState<RawWorkdaysInputs>(
    {
      dateRange: {
        startDate: dayjs().startOf("month").format("YYYY-MM-DD"),
        endDate: dayjs().endOf("month").format("YYYY-MM-DD"),
      },
      defaultMinHours: {
        fullDay: 7.5,
        halfDay: 3.5,
      },
    }
  );

  return (
    <Grid container alignItems={"center"}>
      <Grid item margin={2}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Start Date"
            value={
              rawWorkdaysInputs?.dateRange?.startDate
                ? dayjs(rawWorkdaysInputs.dateRange.startDate)
                : dayjs().startOf("month")
            }
            onChange={(newValue: Dayjs) => {
              // onInputChange({
              //   ...inputFields,
              //   dateRange: {
              //     ...inputFields?.dateRange,
              //     startDate: newValue?.format("YYYY-MM-DD"),
              //   },
              // });
              setRawWorkdaysInputs({
                ...rawWorkdaysInputs,
                dateRange: {
                  ...rawWorkdaysInputs?.dateRange,
                  startDate: newValue?.format("YYYY-MM-DD"),
                },
              });
            }}
            {...({
              renderInput: (params) => <TextField {...params} />,
            } as any)}
          />
        </LocalizationProvider>
      </Grid>
      <Grid item margin={2}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="End Date"
            value={
              rawWorkdaysInputs?.dateRange?.endDate
                ? dayjs(rawWorkdaysInputs.dateRange.endDate)
                : dayjs().endOf("month")
            }
            onChange={(newValue: Dayjs) => {
              // onInputChange({
              //   ...inputFields,
              //   dateRange: {
              //     ...inputFields?.dateRange,
              //     endDate: newValue?.format("YYYY-MM-DD"),
              //   },
              // });
              setRawWorkdaysInputs({
                ...rawWorkdaysInputs,
                dateRange: {
                  ...rawWorkdaysInputs?.dateRange,
                  endDate: newValue?.format("YYYY-MM-DD"),
                },
              });
            }}
            {...({
              renderInput: (params) => <TextField {...params} />,
            } as any)}
          />
        </LocalizationProvider>
      </Grid>
      <Grid item margin={2}>
        <TextField
          id="outlined-basic"
          label="Default Half Day"
          variant="outlined"
          type="number"
          value={rawWorkdaysInputs.defaultMinHours.halfDay}
          onChange={(e) => {
            setRawWorkdaysInputs({
              ...rawWorkdaysInputs,
              defaultMinHours: {
                ...rawWorkdaysInputs.defaultMinHours,
                halfDay: +e.target.value,
              },
            });
          }}
        />
      </Grid>
      <Grid item margin={2}>
        <TextField
          id="outlined-basic"
          label="Default Full Day"
          variant="outlined"
          type="number"
          value={rawWorkdaysInputs.defaultMinHours.fullDay}
          onChange={(e) => {
            setRawWorkdaysInputs({
              ...rawWorkdaysInputs,
              defaultMinHours: {
                ...rawWorkdaysInputs.defaultMinHours,
                fullDay: +e.target.value,
              },
            });
          }}
        />
      </Grid>
      <Grid item>
        <Button
          variant="contained"
          onClick={() => onInputChange(rawWorkdaysInputs)}
        >
          GENERATE RAW TABLE
        </Button>
      </Grid>
    </Grid>
  );
};

export default RawWorkdaysInputsGenerator;
