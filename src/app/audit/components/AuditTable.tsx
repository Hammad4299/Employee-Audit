"use client";

import { IssueDetail, Project } from "@/app/DomainModals";
import { TimeEntry } from "@/app/DomainModals/Reports";
import {
  useCreateIssueDetails,
  useCreateProjects,
  useIssueDetails,
  useProjects,
} from "@/app/Hooks/AuditHooks";
import { AuditService } from "@/app/Services";
import { Button, Grid } from "@mui/material";
import Paper from "@mui/material/Paper";
import TableContainer from "@mui/material/TableContainer";
import { makeStyles } from "@mui/styles";
import React, { useMemo, useState } from "react";

import Box from "@mui/material/Box";
import {
  DataGrid,
  GridCellEditStopParams,
  GridColDef,
  GridRowId,
  GridToolbar,
} from "@mui/x-data-grid";
import AuditBulkEditFields from "./AuditBulkEditFields";
import AuditDataFilters, { LocalFilters } from "./AuditDataFilters";

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
  onUpdateAuditData: (data: TimeEntry[]) => void;
}

export interface AuditTableRow {
  id: string;
  description: string;
  duration: string;
  startDate: string;
  endDate: string;
  project: string;
  user: string;
  assignedProject: string;
  assignedIssue: string;
}

enum HeaderNames {
  "ID" = "ID",
  "Description" = "Description",
  "Duration" = "Duration",
  "Start Date" = "Start Date",
  "End Date" = "End Date",
  "Project" = "Project",
  "User" = "User",
  "Assigned Project" = "Assigned Project",
  "Assigned Issue" = "Assigned Issue",
}

const AuditTable = (props: AuditTableComponentProps) => {
  const classes = useStyles();

  const { auditData, onUpdateAuditData } = props;

  const { issues: issueDetails } = useIssueDetails();

  const { projects, refetch: refetchProjects } = useProjects();
  const { createProject } = useCreateProjects();

  const { createIssue } = useCreateIssueDetails();
  const [filters, setFilters] = useState<LocalFilters>({
    projects: [],
    username: [],
  });
  const [selectedRowIds, setSelectedRowIds] = useState<GridRowId[]>([]);
  const headCells: GridColDef[] = [
    {
      field: "id",
      headerName: HeaderNames.ID,
      width: 100,
      editable: false,
    },
    {
      field: "description",
      headerName: HeaderNames.Description,
      width: 300,
      editable: true,
    },
    {
      field: "duration",
      headerName: HeaderNames.Duration,
      width: 150,
      editable: false,
    },
    {
      field: "startDate",
      headerName: HeaderNames["Start Date"],
      width: 150,
      editable: false,
    },
    {
      field: "endDate",
      headerName: HeaderNames["End Date"],
      width: 150,
      editable: false,
    },
    {
      field: "project",
      headerName: HeaderNames.Project,
      width: 150,
      editable: false,
    },
    {
      field: "user",
      headerName: HeaderNames.User,
      width: 150,
      editable: false,
    },
    {
      field: "assignedProject",
      headerName: HeaderNames["Assigned Project"],
      width: 150,
      editable: true,
    },
    {
      field: "assignedIssueId",
      headerName: HeaderNames["Assigned Issue"],
      width: 150,
      editable: true,
    },
  ];

  const getAuditDataOnTableMaping = (data: TimeEntry) => {
    return {
      id: data?.id,
      description: data?.description,
      duration: (data?.timeEntry.seconds / 3600).toFixed(2),
      startDate: data?.timeEntry.start,
      endDate: data?.timeEntry.stop,
      project: data?.project ? data?.project.name : null,
      user: data?.user ? data?.user.username : null,
      assignedProject: projects.find((x) => x.id === data?.assignedProject?.id)
        ?.name,
      assignedIssueId: issueDetails.find((x) => x.id === data?.assignedIssueId)
        ?.issueKey,
    };
  };

  const rows = useMemo(() => {
    return auditData
      .filter(
        (d) =>
          (!filters.username.length ||
            filters.username.includes(d.user.username)) &&
          (!filters.projects.length ||
            (filters.projects[0] === null && !d.assignedProject) ||
            filters.projects.includes(d.assignedProject?.id?.toString()))
      )
      .map(getAuditDataOnTableMaping);
  }, [auditData, filters, issueDetails, projects]);

  const tableCellEditHandler = async (
    changedCellValue: string,
    headerName: keyof TimeEntry,
    editedRow: any
  ) => {
    // handling project create update
    if (headerName === "assignedProject") {
      await handleBulkCreateUpdate(null, changedCellValue, [editedRow.id]);
    }
    if (headerName === "assignedIssueId") {
      await handleBulkCreateUpdate(changedCellValue, null, [editedRow.id]);
    }
  };

  async function createOrUpdateProjects(changedCellValue: string) {
    let projectResponse: Project = null;

    const existing = projects.find(
      (d) => d.name.toLowerCase() === changedCellValue.toLowerCase()
    );

    if (existing) {
      projectResponse = existing;
    } else {
      projectResponse = await createProject({ name: changedCellValue });
    }
    return projectResponse;
  }

  async function createOrUpdateIssueDetails(changedCellValue: string) {
    let issueResponse: IssueDetail;

    const existing = issueDetails.find(
      (d) => d.issueKey.toLowerCase() === changedCellValue.toLowerCase()
    );

    if (existing) {
      issueResponse = existing;
    } else {
      issueResponse = await createIssue({
        issueKey: changedCellValue,
      });
    }
    return issueResponse;
  }

  async function handleBulkCreateUpdate(
    assignedIssueKey: string,
    assignedProjectName: string,
    selectedIds: GridRowId[] = selectedRowIds
  ) {
    let projectResponse: Project = null;
    let issueResponse: IssueDetail = null;

    if (assignedProjectName) {
      projectResponse = await createOrUpdateProjects(assignedProjectName);
    }
    if (assignedIssueKey) {
      issueResponse = await createOrUpdateIssueDetails(assignedIssueKey);
    }

    onUpdateAuditData(
      auditData.map((d) => {
        if (selectedIds.includes(d.id)) {
          return {
            ...d,
            assignedIssueId: issueResponse
              ? issueResponse?.id
              : d.assignedIssueId,
            assignedProject: projectResponse
              ? projectResponse
              : d.assignedProject,
          };
        }
        return d;
      })
    );
  }

  return (
    <React.Fragment>
      <Grid
        container
        justifyContent={"end"}
        alignItems={"center"}
        textAlign={"end"}
      >
        <Grid item xs={7}>
          <AuditDataFilters
            auditData={auditData || []}
            filters={filters}
            onFiltersChange={setFilters}
          />
        </Grid>
        <Grid item xs={2}>
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
      </Grid>
      <Grid container>
        <Grid item xs={12} mb={1}>
          {selectedRowIds && selectedRowIds.length >= 1 ? (
            <AuditBulkEditFields
              onSave={(assignedIssueKey, assignedProjectName) =>
                handleBulkCreateUpdate(assignedIssueKey, assignedProjectName)
              }
            />
          ) : null}
        </Grid>
        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Box sx={{ height: 600, width: "100%" }}>
              <DataGrid
                rows={rows}
                columns={headCells}
                disableRowSelectionOnClick={true}
                onRowSelectionModelChange={(ids) => setSelectedRowIds(ids)}
                slots={{
                  toolbar: GridToolbar,
                }}
                density="compact"
                pageSizeOptions={[100, 100, 100]}
                checkboxSelection
                onCellEditStop={(
                  params: GridCellEditStopParams,
                  event: any
                ) => {
                  tableCellEditHandler(
                    event.target.value,
                    params.colDef.field as keyof TimeEntry,
                    params.row
                  );
                }}
              />
            </Box>
          </TableContainer>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default AuditTable;
