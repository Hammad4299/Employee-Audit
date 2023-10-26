"use client";

import React, { useMemo, useState } from "react";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import { Button, Grid } from "@mui/material";
import { makeStyles } from "@mui/styles";
import {
  useCreateProjects,
  useIssueDetails,
  useProjects,
  useUpdateIssueDetails,
  useUpdateProjects,
  useCreateIssueDetails,
} from "@/app/Hooks/AuditHooks";
import { IssueDetail, Project } from "@/app/DomainModals";
import { TimeEntry } from "@/app/DomainModals/Reports";
import { AuditService } from "@/app/Services";

import Box from "@mui/material/Box";
import {
  DataGrid,
  GridCellEditStopParams,
  GridColDef,
  GridToolbar,
} from "@mui/x-data-grid";
import AuditBulkEditFields from "./AuditBulkEditFields";
import AuditDataFilters from "./AuditDataFilters";

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

  console.log("auditDataFromProps", auditData);
  const { refetch: refetchIssueDetails } = useIssueDetails();
  const { refetch: refetchProjects } = useProjects();
  const { createProjects } = useCreateProjects();
  const { updateProjects } = useUpdateProjects();
  const { updateIssueDetails } = useUpdateIssueDetails();
  const { createIssueDetails } = useCreateIssueDetails();
  const [appliedFiltersData, setAppliedFiltersData] = useState<TimeEntry[]>([]);
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);
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
      field: "assignedIssue",
      headerName: HeaderNames["Assigned Issue"],
      width: 150,
      editable: true,
    },
  ];

  const getAuditDataOnTableMaping = (auditData: TimeEntry[]) => {
    return auditData?.map((data) => {
      return {
        id: String(data?.timeEntry?.seconds + data?.timeEntry?.start),
        description: data?.description,
        duration: (data?.timeEntry.seconds / 3600).toFixed(2),
        startDate: data?.timeEntry.start,
        endDate: data?.timeEntry.stop,
        project: data?.project ? data?.project.name : null,
        user: data?.user ? data?.user.username : null,
        assignedProject: data?.assignedProject
          ? data?.assignedProject.name
          : null,
        assignedIssue:
          data?.assignedIssueKey === undefined ? null : data?.assignedIssueKey,
      };
    });
  };

  const getTableDataOnAuditDataMapping = (
    editedRow: AuditTableRow,
    key,
    value
  ) => {
    return auditData.map((x) => {
      if (
        x.assignedIssueKey == editedRow.assignedIssue &&
        x.assignedProject?.name == editedRow.assignedProject &&
        x.description == editedRow.description &&
        (x.timeEntry.seconds / 3600).toFixed(2) == editedRow.duration &&
        x.project.name == editedRow.project &&
        x.user.username == editedRow.user &&
        x.timeEntry.start == editedRow.startDate &&
        x.timeEntry.stop == editedRow.endDate
      ) {
        if (key === "assignedProject") {
          return {
            ...x,
            assignedProject: { ...x.assignedProject, name: value },
          };
        } else {
          return {
            ...x,
            [key]: value,
          };
        }
      }
      return x;
    });
  };

  let rows = useMemo(() => {
    if (appliedFiltersData.length) {
      return getAuditDataOnTableMaping(appliedFiltersData);
    } else {
      return getAuditDataOnTableMaping(auditData);
    }
  }, [auditData, appliedFiltersData]);

  const tableCellEditHandler = async (
    changedCellValue: string,
    headerName: string,
    editedRow: any
  ) => {
    // handling project create update
    if (headerName === HeaderNames["Assigned Project"]) {
      const response = await createOrUpdateProjects(changedCellValue);

      onUpdateAuditData(
        getTableDataOnAuditDataMapping(
          editedRow,
          "assignedProject",
          changedCellValue
        )
      );
    }
    // handling Issue create update
    if (headerName === HeaderNames["Assigned Issue"]) {
      const response = await createOrUpdateIssueDetails(changedCellValue);

      onUpdateAuditData(
        getTableDataOnAuditDataMapping(
          editedRow,
          "assignedIssueKey",
          changedCellValue
        )
      );
    }
    // handling issue Description update
    if (headerName === HeaderNames["Description"]) {
      const allCurrentIssueDetails = await refetchIssueDetails();
      const changedRow = auditData.find(
        (x) =>
          x.assignedIssueKey == editedRow.assignedIssue &&
          x.assignedProject?.name == editedRow.assignedProject &&
          x.description == editedRow.description &&
          (x.timeEntry.seconds / 3600).toFixed(2) == editedRow.duration &&
          x.project.name == editedRow.project &&
          x.user.username == editedRow.user &&
          x.timeEntry.start == editedRow.startDate &&
          x.timeEntry.stop == editedRow.endDate
      );
      const existing = allCurrentIssueDetails.find((x) => {
        return x.issueKey === changedRow.assignedIssueKey;
      });
      if (existing) {
        let descriptionResponse = await updateIssueDetails({
          ...existing,
          description: changedCellValue,
        });
      }
      onUpdateAuditData(
        getTableDataOnAuditDataMapping(
          editedRow,
          "description",
          changedCellValue
        )
      );
    }
  };

  function rowsSelectionHandler(ids: any[]) {
    setSelectedRowIds(ids);
  }

  async function createOrUpdateProjects(changedCellValue: string) {
    let projectResponse;

    const allCurrentProjects = await refetchProjects();
    const existing = allCurrentProjects.find(
      (d) => d.name === changedCellValue
    );

    if (existing) {
      projectResponse = await updateProjects({
        ...existing,
        name: changedCellValue,
      });
    } else {
      projectResponse = await createProjects({ name: changedCellValue });
    }
    return projectResponse;
  }

  async function createOrUpdateIssueDetails(changedCellValue: string) {
    let issueResponse;

    const allCurrentIssueDetails = await refetchIssueDetails();

    const existing = allCurrentIssueDetails.find(
      (d) => d.issueKey === changedCellValue
    );

    if (existing) {
      issueResponse = await updateIssueDetails({
        ...existing,
        issueKey: changedCellValue,
      });
    } else {
      issueResponse = await createIssueDetails({
        issueKey: changedCellValue,
      });
    }
    return issueResponse;
  }

  async function handleBulkCreateUpdate(assignedIssueKey, assignedProjectName) {
    const filterSelectedRows = rows.filter((r) =>
      selectedRowIds.includes(r.id)
    );
    const filteredRows = auditData.filter((x) =>
      filterSelectedRows.some(
        (row) =>
          x.assignedIssueKey == row.assignedIssue &&
          x.assignedProject?.name == row.assignedProject &&
          x.description == row.description &&
          (x.timeEntry.seconds / 3600).toFixed(2) == row.duration &&
          x.project.name == row.project &&
          x.user.username == row.user &&
          x.timeEntry.start == row.startDate &&
          x.timeEntry.stop == row.endDate
      )
    );

    let projectResponse: Project;
    let issueResponse: IssueDetail;

    if (assignedProjectName) {
      projectResponse = await createOrUpdateProjects(assignedProjectName);
    }
    if (assignedIssueKey) {
      issueResponse = await createOrUpdateIssueDetails(assignedIssueKey);
    }
    for (const row of filteredRows) {
      onUpdateAuditData(
        auditData.map((d) => {
          if (filteredRows.includes(d)) {
            return {
              ...d,
              assignedIssueKey: issueResponse
                ? issueResponse?.issueKey
                : d.assignedIssueKey,
              assignedProject: projectResponse
                ? {
                    ...d.assignedProject,
                    name: projectResponse?.name,
                  }
                : d.assignedProject,
            };
          }
          return d;
        })
      );
    }
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
            onAuditDataUpdate={(auditData) => {
              console.log("filteredData", auditData);
              setAppliedFiltersData(auditData);
            }}
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
                onRowSelectionModelChange={(ids) => rowsSelectionHandler(ids)}
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
                  const { id, ...rest } = params.row;
                  tableCellEditHandler(
                    event.target.value,
                    params.colDef.headerName,
                    rest
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
