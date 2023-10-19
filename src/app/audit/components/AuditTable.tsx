"use client";

import React, { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { AuditData, IssueDetails, Projects } from "../page";

import { Button, Chip } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { CreatableSelectComponent } from "@/app/components/CreatableSelect";
import { useIssueDetails, useProjects } from "@/app/Hooks/AuditHooks";
import EditDialog from "./EditDialog";

const useStyles = makeStyles({
  root: {},
  cursorPointer: {
    cursor: "pointer",
    paddingLeft: "10px",
  },
});

interface AuditTableComponentProps {
  auditData: AuditData[];
}

const AuditTable = (props: AuditTableComponentProps) => {
  const classes = useStyles();
  //   const { auditData } = props;
  const { issueDetails, refetch: refetchIssueDetails } = useIssueDetails();
  const { projects, refetch: refetchProjects } = useProjects();

  const [showEditDialog, setShowEditDialog] = useState<boolean>(false);
  const [projectToEdit, setProjectToEdit] = useState<Projects | null>(null);
  const [issueDetailsToEdit, setIssueDetailsToEdit] =
    useState<IssueDetails | null>(null);

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

  const auditData: AuditData[] = [
    {
      description: "description",
      duration: "10 minutes",
      start: "date",
      end: "date",
      assignedIssueDetail: { id: 2, name: "assIssue" },
      assignedProject: { id: 2, name: "assProject" },
      project: "project",
      tags: ["tag1", "tag2"],
      user: "ahmad",
      workspace: { id: 2, name: "workspace" },
    },
  ];

  return (
    <React.Fragment>
      <TableContainer component={Paper}>
        <Table
          sx={{ minWidth: 650 }}
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
                <TableCell align="left">{data.duration}</TableCell>
                <TableCell align="left">{data.start}</TableCell>
                <TableCell align="left">{data.end}</TableCell>
                <TableCell align="left">{data.project}</TableCell>
                <TableCell align="left">
                  {data?.tags &&
                    data?.tags.map((t, key) => {
                      return (
                        <Chip
                          style={{ padding: "2px", margin: "3px" }}
                          key={key}
                          label={t}
                        />
                      );
                    })}
                </TableCell>
                <TableCell align="left">{data?.user}</TableCell>
                <TableCell align="left">{data.workspace?.name}</TableCell>
                <TableCell align="left">
                  {data.assignedProject?.name}
                  <Button
                    onClick={() => {
                      setProjectToEdit(data.assignedProject);
                      setIssueDetailsToEdit(null);
                      setShowEditDialog(true);
                    }}
                  >
                    Edit
                  </Button>

                  <CreatableSelectComponent
                    projects={projects}
                    forProjects={true}
                    forIssueDetails={false}
                  />
                </TableCell>
                <TableCell align="left">
                  {data.assignedIssueDetail?.name}
                  <Button
                    onClick={() => {
                      setIssueDetailsToEdit(data.assignedIssueDetail);
                      setProjectToEdit(null);
                      setShowEditDialog(true);
                    }}
                  >
                    Edit
                  </Button>

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
