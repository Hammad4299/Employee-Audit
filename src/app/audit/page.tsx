"use client";
import React from "react";
import AuditFilters from "./components/AuditFilters";
import { makeStyles } from "@mui/styles";
import { Grid } from "@mui/material";
import { useAudit, useWorkspaces } from "../Hooks/AuditHooks";
import AuditTable from "./components/AuditTable";
import { Workspace } from "@/app/DomainModals";

const useStyles = makeStyles({
  root: {},
  filtersContainers: {
    marginBottom: "30px",
  },
});

export interface AuditData {
  description: string;
  duration: string;
  start: string;
  end: string;
  project: string;
  tags: string[];
  user?: string;
  workspace?: Workspace;
  assignedProject: Projects;
  assignedIssueDetail: IssueDetails;
}

export interface IssueDetails {
  id?: number;
  name: string;
  description?: string;
}

export interface Projects {
  id?: number;
  name: string;
  tags?: string[];
}

export interface DateRange {
  startDate: string;
  endDate: string;
}

export interface AuditDataFilters {
  dateRange: DateRange;
  workspaces: number[];
}

const Page = () => {
  const classes = useStyles();

  const { data: workspaces } = useWorkspaces();
  const { auditData, refetch: refetchAuditData } = useAudit();

  return (
    <Grid className={classes.root} container margin={10} width={"90%"}>
      <Grid className={classes.filtersContainers} item xs={12}>
        <AuditFilters
          workspaces={workspaces || []}
          refetchAuditData={refetchAuditData}
        />
      </Grid>
      <Grid item xs={12}>
        <AuditTable auditData={auditData} />
      </Grid>
    </Grid>
  );
};

export default Page;
