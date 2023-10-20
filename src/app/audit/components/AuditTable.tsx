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
import { AuditService } from "@/app/Services";

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
  onUpdate: (data: TimeEntry[]) => void;
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
    // "Tags",
    "User",
    // "Workspace",
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
            const service = new AuditService();
            service
              .generalAuditData(auditData)
              .catch((err) => alert("error"))
              .then((x) =>
                alert("A file directory should have opened with excel file")
              );
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
            {auditData.map((data, key) => {
              const issueDetail = issueDetails.find(
                (x) => x.id === data.assignedIssueId
              );

              return (
                <TableRow
                  key={key}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell align="left">{data.description}</TableCell>
                  <TableCell align="left">
                    {(data.timeEntry.seconds / (60 * 60)).toFixed(2)} hours
                  </TableCell>
                  <TableCell align="left">{data.timeEntry.start}</TableCell>
                  <TableCell align="left">{data.timeEntry.stop}</TableCell>
                  <TableCell align="left">{data.project?.name}</TableCell>
                  {/* <TableCell align="left">
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
                  </TableCell> */}
                  <TableCell align="left">{data.user?.username}</TableCell>
                  {/* <TableCell align="left">{data.workspace?.owner}</TableCell> */}
                  <TableCell align="left" style={{ width: 300 }}>
                    {data.assignedProject && (
                      <EditIcon
                        className={classes.editIcon}
                        onClick={() => {
                          setProjectToEdit(
                            projects.find(
                              (x) => x.id === data.assignedProject.id
                            )
                          );
                          setIssueDetailsToEdit(null);
                          setShowEditDialog(true);
                        }}
                      />
                    )}

                    <CreatableSelectComponent
                      options={projects.map((item) => ({
                        label: item.name,
                        value: item.id.toString(),
                      }))}
                      mode="project"
                      onChange={(id) => {
                        // if (!projects.find((x) => x.id === +id.value)) {
                        refetchProjects();
                        // }
                        props.onUpdate(
                          auditData.map((x) => {
                            if (x === data) {
                              return {
                                ...x,
                                assignedProject: {
                                  id: +id.value,
                                  name: id.label,
                                },
                              };
                            }
                            return x;
                          })
                        );
                      }}
                      value={
                        data.assignedProject
                          ? {
                              label: data.assignedProject.name,
                              value: data.assignedProject.id.toString(),
                            }
                          : null
                      }
                    />
                  </TableCell>
                  <TableCell align="left" style={{ width: 300 }}>
                    {data.assignedIssueId && (
                      <EditIcon
                        className={classes.editIcon}
                        onClick={() => {
                          setIssueDetailsToEdit(issueDetail);
                          setProjectToEdit(null);
                          setShowEditDialog(true);
                        }}
                      />
                    )}

                    <CreatableSelectComponent
                      options={issueDetails.map((item) => ({
                        label: item.issueKey,
                        value: item.id.toString(),
                      }))}
                      mode="issue"
                      onChange={(id) => {
                        // if (!issueDetails.find((x) => x.id === +id.value)) {
                        refetchIssueDetails();
                        // }
                        props.onUpdate(
                          auditData.map((x) => {
                            if (x === data) {
                              return {
                                ...x,
                                assignedIssueId: +id.value,
                              };
                            }
                            return x;
                          })
                        );
                      }}
                      value={
                        issueDetail
                          ? {
                              label: issueDetail.issueKey,
                              value: data.assignedIssueId.toString(),
                            }
                          : null
                      }
                    />
                  </TableCell>
                </TableRow>
              );
            })}
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
