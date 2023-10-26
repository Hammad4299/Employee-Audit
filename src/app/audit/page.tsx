"use client";
import React, { useEffect, useMemo, useState } from "react";
import AuditFilters from "./components/AuditFilters";
import { Edit as EditIcon } from "@mui/icons-material";
import { makeStyles } from "@mui/styles";
import {
  Button,
  CircularProgress,
  Grid,
  IconButton,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tabs,
  TextField,
} from "@mui/material";
import {
  useAudit,
  useCreateIssueDetails,
  useCreateProjects,
  useIssueDetails,
  useProjects,
  useUpdateProjects,
  useWorkspaces,
} from "../Hooks/AuditHooks";
import AuditTable from "./components/AuditTable";
import { IssueDetail, Project } from "@/app/DomainModals";
import EditDialog from "@/app/audit/components/EditDialog";

const useStyles = makeStyles({
  root: {},
  filtersContainers: {},
});

export interface DateRange {
  startDate: string;
  endDate: string;
}

export interface AuditDataFilters {
  dateRange: DateRange;
  workspaces: number[];
}

const Projects = () => {
  const { projects } = useProjects();
  const { createProject } = useCreateProjects();

  const [editProject, setEditProject] = useState<Project>(null);
  const [name, setName] = useState("");
  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <TextField value={name} onChange={(e) => setName(e.target.value)} />
        <Button
          onClick={() => {
            if (name.length) {
              createProject({
                name,
              }).then((x) => setName(""));
            }
          }}
        >
          Create Project
        </Button>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Project</TableCell>
              <TableCell>Alias</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {projects.map((row) => (
              <TableRow
                key={row.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell padding="none" scope="row">
                  {row.id}
                </TableCell>
                <TableCell padding="none" scope="row">
                  {row.name}
                </TableCell>
                <TableCell padding="none" scope="row">
                  {row.aliases?.join(",")}
                </TableCell>
                <TableCell padding="none" scope="row">
                  <IconButton
                    onClick={() => {
                      setEditProject(row);
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {editProject && (
          <EditDialog
            open={true}
            issueDetails={null}
            projects={editProject}
            onClose={() => setEditProject(null)}
          />
        )}
      </Grid>
    </Grid>
  );
};
const Issues = () => {
  const { issues } = useIssueDetails();
  const { createIssue } = useCreateIssueDetails();

  const [editIssue, setEditIssue] = useState<IssueDetail>(null);
  const [name, setName] = useState("");
  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <TextField
          label={"Issue Key"}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Button
          onClick={() => {
            if (name.length) {
              createIssue({
                issueKey: name,
              }).then((x) => setName(""));
            }
          }}
        >
          Create Issue
        </Button>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Issue Key</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {issues.map((row) => (
              <TableRow
                key={row.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell padding="none" scope="row">
                  {row.id}
                </TableCell>
                <TableCell padding="none" scope="row">
                  {row.issueKey}
                </TableCell>
                <TableCell padding="none" scope="row">
                  {row.description}
                </TableCell>
                <TableCell padding="none" scope="row">
                  <IconButton
                    onClick={() => {
                      setEditIssue(row);
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {editIssue && (
          <EditDialog
            open={true}
            issueDetails={editIssue}
            projects={null}
            onClose={() => setEditIssue(null)}
          />
        )}
      </Grid>
    </Grid>
  );
};

const Page = () => {
  const classes = useStyles();

  const { workspaces } = useWorkspaces();
  const [filters, setFilters] = useState<AuditDataFilters>({
    dateRange: {
      startDate: "",
      endDate: "",
    },
    workspaces: [],
  });
  const {
    timeEntries,
    isLoading,
    refetch: refetchAuditData,
  } = useAudit(filters);

  const [auditData, setAuditData] = useState(timeEntries);
  const [tab, setTab] = useState<"time" | "projects" | "issues">("time");
  useEffect(() => {
    setAuditData(timeEntries);
  }, [timeEntries]);

  return (
    <Grid container justifyContent={"center"}>
      <Grid className={classes.root} container margin={5} width={"90%"}>
        <Tabs value={tab} onChange={(a, tab) => setTab(tab)}>
          <Tab label="Time Entries" value={"time"} />
          <Tab label="Projects" value="projects" />
          <Tab label="Issues" value="issues" />
        </Tabs>

        {tab == "time" && (
          <>
            <Grid className={classes.filtersContainers} item xs={12}>
              <AuditFilters
                workspaces={workspaces || []}
                filters={filters}
                onFiltersChange={setFilters}
                onRefetch={() => {
                  refetchAuditData();
                }}
              />
            </Grid>
            {isLoading && (
              <CircularProgress
                style={{
                  position: "fixed",
                  top: "50%",
                  left: "50%",
                }}
              />
            )}{" "}
            <Grid item xs={12}>
              <AuditTable
                auditData={auditData}
                onUpdateAuditData={setAuditData}
              />
            </Grid>
          </>
        )}
        {tab == "issues" && <Issues />}
        {tab == "projects" && <Projects />}
      </Grid>
    </Grid>
  );
};

export default Page;
