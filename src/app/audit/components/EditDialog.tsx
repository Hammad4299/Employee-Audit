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
import { MultiCreatableComponent } from "@/app/components/MultiCreatable";
import { IssueDetail, Project } from "@/app/DomainModals";

interface EditDialogProps {
  open: boolean;
  onClose: () => void;
  projects?: Project | null;
  issueDetails?: IssueDetail | null;
}

const EditDialog = (props: EditDialogProps) => {
  const { open, onClose, issueDetails, projects } = props;

  const { updateIssueDetails } = useUpdateIssueDetails();
  const { updateProjects } = useUpdateProjects();

  const [projectData, setProjectData] = useState<Partial<Project>>({
    name: projects?.name || "",
    aliases: [],
  });
  const [issueData, setIssueData] = useState<Partial<IssueDetail>>({
    issueKey: issueDetails?.issueKey || "",
    description: issueDetails?.description || "",
  });

  async function handleProjectUpdate(project: Partial<Project>) {
    console.log("inside updating project");

    let response = await updateProjects(project);
    onClose();
  }

  async function handleIssueDetailsUpdate(issueDetail: IssueDetail) {
    console.log("inside updating issue");

    let response = await updateIssueDetails(issueDetail);
    onClose();
  }

  const formData = () => {
    if (projects) {
      return (
        <>
          <TextField
            style={{ marginBottom: "40px" }}
            autoFocus
            margin="dense"
            id="name"
            label="Project Name"
            type="text"
            fullWidth
            value={projectData.name}
            onChange={(e) =>
              setProjectData({ ...projectData, name: e.target.value })
            }
          />
          <MultiCreatableComponent
            onCreate={(newValue) => {
              setProjectData({
                ...projectData,
                aliases: newValue.map((value) => value.value),
              });
            }}
          />
        </>
      );
    } else if (issueDetails) {
      return (
        <>
          <TextField
            style={{ marginBottom: "40px" }}
            autoFocus
            margin="dense"
            id="name"
            label="Issue Name"
            type="text"
            fullWidth
            value={issueData.issueKey}
            onChange={(e) =>
              setIssueData({ ...issueData, issueKey: e.target.value })
            }
          />
          <TextField
            multiline
            label="Description"
            placeholder="Description"
            value={issueData.description}
            fullWidth
            onChange={(e) =>
              setIssueData({ ...issueData, description: e.target.value })
            }
            autoFocus
            minRows={2}
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
              ? handleProjectUpdate({
                  ...projects,
                  name: projectData.name!,
                  aliases: projectData.aliases!,
                })
              : handleIssueDetailsUpdate({
                  id: issueDetails?.id!,
                  issueKey: issueData.issueKey!,
                  description: issueData.description!,
                });
          }}
        >
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditDialog;
