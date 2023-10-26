"use client";
import { TimeEntry } from "@/app/DomainModals/Reports";
import { Autocomplete, Grid, TextField } from "@mui/material";
import { uniq, uniqBy } from "lodash";
import { useMemo } from "react";

export interface LocalFilters {
  username: string[];
  projects: string[];
}

interface AuditDataFiltersComponentProps {
  onFiltersChange: (filters: LocalFilters) => void;
  auditData: TimeEntry[];
  filters: LocalFilters;
}

const AuditDataFilters = (props: AuditDataFiltersComponentProps) => {
  const { auditData, onFiltersChange, filters } = props;

  const usernames = uniq(auditData.map((d) => d.user.username));
  const assignedProjects = useMemo(
    () => [
      {
        label: "(no project)",
        id: null,
      },
      ...uniqBy(
        auditData
          .filter((x) => x.assignedProject)
          .map((d) => ({
            label: d.assignedProject.name,
            id: d.assignedProject.id,
          })),
        (x) => x.id
      ),
    ],
    [auditData]
  );

  // useEffect(() => {
  //   onAuditDataUpdate(
  //
  //   );
  // }, [usernameValue, assignedProjectValue]);

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
            onFiltersChange({ ...filters, username: values });
          }}
          value={filters.username}
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
          getOptionLabel={(option) => option.label}
          filterSelectedOptions
          onChange={(e, values) => {
            if (values[values.length - 1]?.id === null) {
              onFiltersChange({ ...filters, projects: [null] });
            } else {
              onFiltersChange({
                ...filters,
                projects: values
                  .filter((x) => x.id !== null)
                  .map((x) => x.id.toString()),
              });
            }
          }}
          value={assignedProjects.filter((x) =>
            filters.projects.includes(x.id && x.id.toString())
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Select Assigned Projects"
              placeholder="assigned projects"
            />
          )}
        />
      </Grid>
    </Grid>
  );
};

export default AuditDataFilters;
