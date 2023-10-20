"use client";

import React, { useState, useEffect } from "react";

import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { AuditDataFilters } from "../page";
import { Button, Grid } from "@mui/material";
import { makeStyles } from "@mui/styles";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import type { Workspace } from "@/app/DomainModals";

const useStyles = makeStyles({
  root: {},
});

interface AuditFiltersComponentProps {
  workspaces: Workspace[];
  refetchAuditData: (filters: AuditDataFilters) => void;
}

const AuditFilters = (props: AuditFiltersComponentProps) => {
  const { workspaces, refetchAuditData } = props;
  const classes = useStyles();

  const [dateRangeStartingValue, setDateRangeStartingValue] =
    React.useState<Dayjs | null>(null);

  const localStorageFilters = JSON.parse(
    localStorage.getItem("auditFilters") as string
  ) as AuditDataFilters;

  const [auditFilterParams, setAuditFilterParams] = useState<AuditDataFilters>({
    dateRange: {
      startDate: "",
      endDate: "",
    },
    workspaces: [],
  });
  console.log(
    "🚀 ~ file: AuditFilters.tsx:47 ~ AuditFilters ~ auditFilterParams:",
    auditFilterParams
  );

  useEffect(() => {
    if (localStorageFilters) {
      setAuditFilterParams({
        ...auditFilterParams,
        dateRange: {
          ...auditFilterParams.dateRange,
          startDate: localStorageFilters.dateRange.startDate,
          endDate: localStorageFilters.dateRange.endDate,
        },
        workspaces: localStorageFilters.workspaces,
      });
    }
  }, []);

  const isButtonDisabled =
    !auditFilterParams.dateRange.startDate ||
    !auditFilterParams.dateRange.endDate ||
    auditFilterParams.workspaces.length === 0;

  return (
    <Grid container alignItems={"center"} justifyContent={"start"}>
      <Grid item style={{ width: "450px" }} margin={2}>
        <Autocomplete
          multiple
          id="tags-outlined"
          options={workspaces}
          getOptionLabel={(option) => option.owner}
          filterSelectedOptions
          onChange={(e, values) => {
            setAuditFilterParams({
              ...auditFilterParams,
              workspaces: values.map((workspace) => workspace.id!),
            });
          }}
          value={workspaces.filter((workspace) =>
            auditFilterParams.workspaces.includes(workspace.id!)
          )}
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
            value={
              auditFilterParams.dateRange.startDate
                ? dayjs(auditFilterParams.dateRange.startDate)
                : null
            }
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
            value={
              auditFilterParams.dateRange.endDate
                ? dayjs(auditFilterParams.dateRange.endDate)
                : null
            }
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
        <Button
          variant="contained"
          disabled={isButtonDisabled}
          onClick={() => {
            localStorage.setItem(
              "auditFilters",
              JSON.stringify(auditFilterParams)
            );
            refetchAuditData(auditFilterParams);
          }}
        >
          Refetch Audit Data
        </Button>
      </Grid>
    </Grid>
  );
};

export default AuditFilters;
