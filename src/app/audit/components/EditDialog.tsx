import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import {
  useUpdateIssueDetails,
  useUpdateProjects,
} from "@/app/Hooks/AuditHooks";
import { IssueDetails, Projects } from "../page";

interface EditDialogProps {
  open: boolean;
  onClose: () => void;
  projects?: Projects | null;
  issueDetails?: IssueDetails | null;
}

const EditDialog = (props: EditDialogProps) => {
  const { open, onClose, issueDetails, projects } = props;

  const { updateIssueDetails } = useUpdateIssueDetails();
  const { updateProjects } = useUpdateProjects();

  const [projectData, setProjectData] = useState<string>(projects?.name || "");
  const [issueData, setIssueData] = useState<{
    name: string;
    description: string;
  }>({
    name: issueDetails?.name || "",
    description: issueDetails?.description || "",
  });

  async function handleProjectUpdate(project: Projects) {
    console.log("inside updating project");

    let response = await updateProjects(project);
    onClose();
  }

  async function handleIssueDetailsUpdate(issueDetails: IssueDetails) {
    console.log("inside updating issue");

    let response = await updateIssueDetails(issueDetails);
    onClose();
  }

  const formData = () => {
    if (projects) {
      return (
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Project Name"
          type="text"
          fullWidth
          variant="standard"
          value={projectData}
          onChange={(e) => setProjectData(e.target.value)}
        />
      );
    } else if (issueDetails) {
      return (
        <>
          <TextField
            style={{ margin: "10px" }}
            autoFocus
            margin="dense"
            id="name"
            label="Issue Name"
            type="text"
            variant="standard"
            value={issueData.name}
            onChange={(e) =>
              setIssueData({ ...issueData, name: e.target.value })
            }
          />
          <TextField
            style={{ margin: "10px" }}
            autoFocus
            margin="dense"
            id="name"
            label="Issue Description"
            type="text"
            variant="standard"
            value={issueData.description}
            onChange={(e) =>
              setIssueData({ ...issueData, description: e.target.value })
            }
          />
        </>
      );
    } else {
      return (
        <>
          There is no data coming for edit props either for projects or for
          issueDetails
        </>
      );
    }
  };

  return (
    <Dialog open={open}>
      <DialogTitle>{projects ? "Edit Project" : "Edit Issue"}</DialogTitle>
      <DialogContent>
        <DialogContentText></DialogContentText>
        {formData()}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={() => {
            projects
              ? handleProjectUpdate({ ...projects, name: projectData })
              : handleIssueDetailsUpdate({ ...issueDetails, ...issueData });
          }}
        >
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditDialog;
