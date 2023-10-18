"use client";

import React from "react";
import AuditFilters from "./components/AuditFilters";
import { makeStyles } from "@mui/styles";
import { Grid } from "@mui/material";
import { useAudit } from "../Hooks/AuditHooks";

const useStyles = makeStyles({
  root: {
    margin: "30px",
  },
});

export interface AuditData {
  description: string;
  duration: string;
  start: string;
  end: string;
  project: null | string;
  tags: string[];
  user?: string;
  workspace?: Workspaces;
  assignedProject: Projects | null;
  assignedIssueDetail: IssueDetailKey | null;
}

export interface IssueDetailKey {
  id: number;
  name: string;
}

export interface Projects {
  id: number;
  name: string;
}

export interface Workspaces {
  id: number;
  name: string;
}

export interface DateRange {
  startDate: string;
  endDate: string;
}

export interface AuditDataFilters {
  dateRange: DateRange;
  workspaces: number[];
}

const workspacesFromHook: Workspaces[] = [
  {
    id: 1,
    name: "workspace1",
  },
  {
    id: 2,
    name: "workspace2",
  },
  {
    id: 3,
    name: "workspace3",
  },
];

const Page = () => {
  const classes = useStyles();

  const {auditData, refetch} = useAudit()

  return (
    <Grid className={classes.root} container>
      <Grid item xs={12}>
        <AuditFilters workspaces={workspacesFromHook} />
      </Grid>
    </Grid>
  );
};

export default Page;
