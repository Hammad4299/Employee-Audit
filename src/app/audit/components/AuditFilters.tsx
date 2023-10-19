"use client";

import React, { useState } from "react";
import Chip from "@mui/material/Chip";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { AuditDataFilters, Workspaces } from "../page";
import { Button, Grid } from "@mui/material";
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
  refetchAuditData: (filters: AuditDataFilters)=> void;
}

const AuditFilters = (props: AuditFiltersComponentProps) => {
  const { workspaces, refetchAuditData } = props;
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

  const isButtonDisabled = (
    !auditFilterParams.dateRange.startDate ||
    !auditFilterParams.dateRange.endDate ||
    auditFilterParams.workspaces.length === 0
  );

  return (
    <Grid container alignItems={"center"} justifyContent={"start"}>
      <Grid item style={{ width: "450px" }} margin={2}>
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
      <Grid item margin={2}>
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
      <Grid item margin={2}>
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
      <Grid item>
        <Button variant="contained" disabled={isButtonDisabled} onClick={()=> refetchAuditData(auditFilterParams)}>
          Send
        </Button>
      </Grid>
    </Grid>
  );
};

export default AuditFilters;
