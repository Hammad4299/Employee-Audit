"use client";

import React, { useState } from "react";
import Chip from "@mui/material/Chip";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { AuditDataFilters, Workspaces } from "../page";
import { Grid } from "@mui/material";
import { makeStyles } from "@mui/styles";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";

const useStyles = makeStyles({
  root: {},
});

interface AuditFiltersComponentProps {
  workspaces: Workspaces[];
}

const AuditFilters = (props: AuditFiltersComponentProps) => {
  const { workspaces } = props;
  const classes = useStyles();

  const [dateRangeStartingValue, setDateRangeStartingValue] =
    React.useState<Dayjs | null>(null);

  const [auditFilterParams, setAuditFilterParams] = useState<AuditDataFilters>({
    dateRange: {
      startDate: "",
      endDate: "",
    },
    workspaces: [],
  });

  return (
    <Grid container alignItems={"center"} justifyContent={"start"}>
      <Grid item xs={3} margin={2}>
        <Autocomplete
          multiple
          id="tags-outlined"
          options={workspaces}
          getOptionLabel={(option) => option.name}
          filterSelectedOptions
          onChange={(e, values) => {
            setAuditFilterParams({
              ...auditFilterParams,
              workspaces: values.map((workspace) => workspace.id),
            });
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Select Workspaces"
              placeholder="workspaces"
            />
          )}
        />
      </Grid>
      <Grid item xs={3} margin={2}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Start Date"
            defaultValue={dateRangeStartingValue}
            onChange={(newValue) => {
              setDateRangeStartingValue(newValue);
              setAuditFilterParams({
                ...auditFilterParams,
                dateRange: {
                  ...auditFilterParams.dateRange,
                  startDate: newValue!?.format("YYYY/MM/DD"),
                },
              });
            }}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
      </Grid>
      <Grid item xs={3} margin={2}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="End Date"
            defaultValue={dateRangeStartingValue}
            onChange={(newValue) => {
              setDateRangeStartingValue(newValue);
              setAuditFilterParams({
                ...auditFilterParams,
                dateRange: {
                  ...auditFilterParams.dateRange,
                  endDate: newValue!?.format("YYYY/MM/DD"),
                },
              });
            }}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
      </Grid>
    </Grid>
  );
};

export default AuditFilters;
