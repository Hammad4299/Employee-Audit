"use client";
import React, { useEffect, useState } from "react";
import AuditFilters from "./components/AuditFilters";
import { makeStyles } from "@mui/styles";
import { Grid } from "@mui/material";
import { useAudit, useWorkspaces } from "../Hooks/AuditHooks";
import AuditTable from "./components/AuditTable";

const useStyles = makeStyles({
  root: {},
  filtersContainers: {
    marginBottom: "30px",
  },
});

// export interface AuditData {
//   description: string;
//   duration: string;
//   start: string;
//   end: string;
//   project: string;
//   tags: string[];
//   user?: string;
//   workspace?: Workspace;
//   assignedProject: Project;
//   assignedIssueDetail: IssueDetail;
// }

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
  const { auditData: serverData, refetch: refetchAuditData } = useAudit();
  const [auditData, setAuditData] = useState(serverData);
  useEffect(() => {
    setAuditData(serverData);
  }, [serverData]);

  return (
    <Grid className={classes.root} container margin={10} width={"90%"}>
      <Grid className={classes.filtersContainers} item xs={12}>
        <AuditFilters
          workspaces={workspaces || []}
          refetchAuditData={refetchAuditData}
        />
      </Grid>
      <Grid item xs={12}>
        <AuditTable auditData={auditData} onUpdate={setAuditData} />
      </Grid>
    </Grid>
  );
};

export default Page;
