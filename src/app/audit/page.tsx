"use client";
import React, { useEffect, useMemo, useState } from "react";
import AuditFilters from "./components/AuditFilters";
import { makeStyles } from "@mui/styles";
import { CircularProgress, Grid } from "@mui/material";
import { useAudit, useWorkspaces } from "../Hooks/AuditHooks";
import AuditTable from "./components/AuditTable";

const useStyles = makeStyles({
  root: {},
  filtersContainers: {
  },
});

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
  const {
    auditData: serverData,
    loading,
    refetch: refetchAuditData,
  } = useAudit();
  const [auditData, setAuditData] = useState(serverData);
  useEffect(() => {
    setAuditData(serverData);
  }, [serverData]);

  return (
    <Grid container justifyContent={"center"}>
      <Grid className={classes.root} container margin={5} width={"90%"}>
        <Grid className={classes.filtersContainers} item xs={12}>
          <AuditFilters
            workspaces={workspaces || []}
            refetchAuditData={refetchAuditData}
          />
        </Grid>
        {loading && (
          <CircularProgress
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
            }}
          />
        )}
        <Grid item xs={12}>
          <AuditTable auditData={auditData} onUpdateAuditData={setAuditData} />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Page;
