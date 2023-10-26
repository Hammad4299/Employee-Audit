"use client";
import { TimeEntry } from "@/app/DomainModals/Reports";
import {
  Autocomplete,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
} from "@mui/material";
import { uniq } from "lodash";
import React, { useEffect, useState } from "react";

interface AuditDataFiltersComponentProps {
  onAuditDataUpdate: (auditData: TimeEntry[]) => void;
  auditData: TimeEntry[];
}

const AuditDataFilters = (props: AuditDataFiltersComponentProps) => {
  const { auditData, onAuditDataUpdate } = props;

  const usernames = uniq(auditData.map((d) => d.user.username));
  const assignedProjects = uniq(auditData.map((d) => d.assignedProject.name));

  const [usernameValue, setUsernameValue] = useState<string[]>([]);
  const [assignedProjectValue, setAssignedProjectValue] = useState<string[]>(
    []
  );
  const [assignedProjectEmptyValue, setAssignedProjectEmptyValue] =
    useState<string>(null);

  useEffect(() => {
    returnFilteredData();
  }, [usernameValue, assignedProjectValue, assignedProjectEmptyValue]);

  const returnFilteredData = () => {
    onAuditDataUpdate(
      auditData.filter(
        (d) =>
          usernameValue.includes(d.user.username) ||
          assignedProjectValue.includes(d.assignedProject.name) ||
          (assignedProjectEmptyValue &&
            (assignedProjectEmptyValue === "empty"
              ? d.assignedProject.name === ""
              : assignedProjectEmptyValue === "notempty"
              ? d.assignedProject.name !== ""
              : false))
      )
    );
  };

  return (
    <Grid container alignItems={"center"} justifyContent={"end"}>
      <Grid item style={{ width: "300px" }} margin={2} justifyContent={"end"}>
        <Autocomplete
          multiple
          id="tags-outlined"
          options={usernames}
          getOptionLabel={(option) => option}
          filterSelectedOptions
          onChange={(e, values) => {
            setUsernameValue(values);
          }}
          value={usernameValue}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Select Usernames"
              placeholder="usernames"
            />
          )}
        />
      </Grid>
      <Grid item style={{ width: "300px" }} margin={2}>
        <Autocomplete
          multiple
          id="tags-outlined"
          options={assignedProjects}
          getOptionLabel={(option) => option}
          filterSelectedOptions
          onChange={(e, values) => {
            setAssignedProjectValue(values);
          }}
          value={assignedProjectValue}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Select Assigned Projects"
              placeholder="assigned projects"
            />
          )}
        />
      </Grid>
      <Grid item style={{ width: "300px" }} margin={2}>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">
            Select for empty assign project
          </InputLabel>

          <Select
            style={{ width: "300px" }}
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={assignedProjectEmptyValue}
            label="Select for empty assign project"
            onChange={(e) => {
              console.log(e.target.value);

              setAssignedProjectEmptyValue(e.target.value);
            }}
          >
            <MenuItem value={"empty"}>Empty</MenuItem>
            <MenuItem value={"notempty"}>Not Empty</MenuItem>
            <MenuItem value={"all"}>ALL</MenuItem>
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );
};

export default AuditDataFilters;
