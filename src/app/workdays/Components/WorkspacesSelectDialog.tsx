import { Workspace } from "@/app/DomainModals";
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  Grid,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import React, { useState } from "react";

interface WorkspacesSelectDialogProps {
  workspaces: Workspace[];
  onClose: () => void;
  onSave: (workspaces: Workspace[]) => void;
}

const useStyles = makeStyles({});

const WorkspacesSelectDialog = (props: WorkspacesSelectDialogProps) => {
  const { workspaces, onClose, onSave } = props;
  const classes = useStyles();

  let workspacesFromLocalStorage: Workspace[];
  if (typeof window !== "undefined") {
    workspacesFromLocalStorage = JSON.parse(
      window && window.localStorage.getItem("workspaces")
    );
  }

  const [selectedWorkspaces, setSelectedWorkspaces] = useState<Workspace[]>(
    workspacesFromLocalStorage || []
  );

  return (
    <Grid container>
      <Dialog open={true} maxWidth={"md"}>
        <DialogTitle id="alert-dialog-title">WORKSPACES SELECTION</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Please check to select the workspaces
            {
              <FormControlLabel
                style={{ marginLeft: "20px" }}
                control={
                  <Checkbox
                    checked={
                      workspaces.length === selectedWorkspaces.length
                        ? true
                        : false
                    }
                    onChange={(e, checked) => {
                      if (checked) {
                        setSelectedWorkspaces(workspaces);
                      } else {
                        setSelectedWorkspaces([]);
                      }
                    }}
                  />
                }
                label="Select All"
              />
            }
          </DialogContentText>
          <Grid container xs={12}>
            <Grid item>
              {workspaces &&
                workspaces.map((workspace) => (
                  <FormControlLabel
                    key={workspace.id}
                    control={
                      <Checkbox
                        checked={
                          selectedWorkspaces.find(
                            (sW) => sW.id === workspace.id
                          )
                            ? true
                            : false
                        }
                        onChange={(e, checked) => {
                          if (checked) {
                            setSelectedWorkspaces([
                              ...selectedWorkspaces,
                              ...workspaces.filter(
                                (x) => x.id === workspace.id
                              ),
                            ]);
                          } else {
                            setSelectedWorkspaces(
                              selectedWorkspaces.filter(
                                (x) => x.id !== workspace.id
                              )
                            );
                          }
                        }}
                        inputProps={{ "aria-label": "controlled" }}
                      />
                    }
                    label={workspace.owner}
                  />
                ))}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Close</Button>
          <Button
            onClick={() => {
              onSave(selectedWorkspaces);
              if (typeof window !== "undefined") {
                window.localStorage.setItem(
                  "workspaces",
                  JSON.stringify(selectedWorkspaces)
                );
              }
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default WorkspacesSelectDialog;
