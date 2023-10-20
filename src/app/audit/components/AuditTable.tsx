"use client";

import React, { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Button, Chip, Grid } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { CreatableSelectComponent } from "@/app/components/CreatableSelect";
import { useIssueDetails, useProjects } from "@/app/Hooks/AuditHooks";
import EditDialog from "./EditDialog";
import EditIcon from "@mui/icons-material/Edit";
import { IssueDetail, Project } from "@/app/DomainModals";
import { TimeEntry } from "@/app/DomainModals/Reports";

const useStyles = makeStyles({
  root: {},
  editIcon: {
    cursor: "pointer",
    paddingLeft: "10px",
    width: "30px",
  },
});

interface AuditTableComponentProps {
  auditData: TimeEntry[];
}

const AuditTable = (props: AuditTableComponentProps) => {
  const classes = useStyles();
  const { auditData } = props;
  const { issueDetails, refetch: refetchIssueDetails } = useIssueDetails();
  const { projects, refetch: refetchProjects } = useProjects();

  const [showEditDialog, setShowEditDialog] = useState<boolean>(false);
  const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);
  const [issueDetailsToEdit, setIssueDetailsToEdit] =
    useState<IssueDetail | null>(null);

  const headCells: string[] = [
    "Description",
    "Duration",
    "Start Date",
    "End Date",
    "Project",
    "Tags",
    "User",
    "Workspace",
    "Assigned Project",
    "Assigned Issue",
  ];

  return (
    <React.Fragment>
      <Grid container justifyContent={"end"} marginBottom={5}>
        <Button
          variant="contained"
          disabled={auditData ? false : true}
          onClick={() => {
            alert("ok boss");
          }}
        >
          Generate Excel
        </Button>
      </Grid>
      <TableContainer component={Paper}>
        <Table
          sx={{ minWidth: 650, minHeight: 200 }}
          style={{ overflowX: "auto" }}
          aria-label="simple table"
        >
          <TableHead>
            <TableRow>
              {headCells.map((cell, key) => (
                <TableCell key={key}>{cell}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {auditData.map((data, key) => (
              <TableRow
                key={key}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell align="left">{data.description}</TableCell>
                <TableCell align="left">
                  {data.timeEntry.seconds / 60}m
                </TableCell>
                <TableCell align="left">{data.timeEntry.start}</TableCell>
                <TableCell align="left">{data.timeEntry.stop}</TableCell>
                <TableCell align="left">{data.project.name}</TableCell>
                <TableCell align="left">
                  {data?.tagIds &&
                    data?.tagIds.map((t, key) => {
                      return (
                        <Chip
                          style={{ padding: "2px", margin: "3px" }}
                          key={key}
                          label={t}
                        />
                      );
                    })}
                </TableCell>
                <TableCell align="left">{data?.user.username}</TableCell>
                {/* <TableCell align="left">{data.workspace?.owner}</TableCell> */}
                <TableCell align="left">
                  {data.assignedProject?.name}
                  <EditIcon
                    className={classes.editIcon}
                    onClick={() => {
                      setProjectToEdit(data.assignedProject);
                      setIssueDetailsToEdit(null);
                      setShowEditDialog(true);
                    }}
                  />

                  <CreatableSelectComponent
                    projects={projects}
                    forProjects={true}
                    forIssueDetails={false}
                  />
                </TableCell>
                <TableCell align="left">
                  {data.assignedIssueDetail?.issueKey}
                  <EditIcon
                    className={classes.editIcon}
                    onClick={() => {
                      setIssueDetailsToEdit(data.assignedIssueDetail);
                      setProjectToEdit(null);
                      setShowEditDialog(true);
                    }}
                  />

                  <CreatableSelectComponent
                    issueDetails={issueDetails}
                    forProjects={false}
                    forIssueDetails={true}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {showEditDialog && (
        <EditDialog
          open={true}
          issueDetails={issueDetailsToEdit}
          projects={projectToEdit}
          onClose={() => setShowEditDialog(false)}
        />
      )}
    </React.Fragment>
  );
};

export default AuditTable;
