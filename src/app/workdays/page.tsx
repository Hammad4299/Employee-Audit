"use client";
import React from "react";
import { Grid } from "@mui/material";
import WorkdaysAuditRawTable from "./Components/WorkdaysAuditRawTable";
import { makeStyles } from "@mui/styles";

interface WorkDaysAuditPageProps {}

const useStyles = makeStyles({
  root: {
    // margin: "40px",
  },
});

const Page = (props: WorkDaysAuditPageProps) => {
  const classes = useStyles();

  return (
    <Grid className={classes.root} justifyContent={"center"} margin={"80px"} width={"90%"} container>
      <Grid item xs={12}>
        <WorkdaysAuditRawTable />
      </Grid>
    </Grid>
  );
};

export default Page;
