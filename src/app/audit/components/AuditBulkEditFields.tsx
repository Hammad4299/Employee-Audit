import { Button, Grid, TextField, Typography } from "@mui/material";
import React, { useState } from "react";

interface AuditBulkEditFieldsComponentProps {
  onSave: (assignedIssueKey: string, assignedProjectName: string) => void;
}

const AuditBulkEditFields = (props: AuditBulkEditFieldsComponentProps) => {
  const { onSave } = props;

  const [assignedIssueKey, setAssignedIssueKey] = useState<string>("");
  const [assignedProjectName, setAssignedProjectName] = useState<string>("");

  const isButtonDisabled = !assignedIssueKey && !assignedProjectName;

  return (
    <Grid container justifyContent={"flex-end"} alignItems={"center"}>
      <Grid item style={{ width: "300px" }} margin={2}>
        <TextField
          style={{ width: "300px" }}
          id="outlined-basic"
          label="Assigned Project Name"
          variant="outlined"
          value={assignedProjectName}
          onChange={(e) => {
            setAssignedProjectName(e.target.value);
          }}
        />
      </Grid>
      <Grid item style={{ width: "300px" }} margin={2}>
        <TextField
          style={{ width: "300px" }}
          id="outlined-basic"
          label="Assigned Issue Key"
          variant="outlined"
          value={assignedIssueKey}
          onChange={(e) => {
            setAssignedIssueKey(e.target.value);
          }}
        />
      </Grid>
      <Grid item style={{ width: "270px" }} marginLeft={2} textAlign={"end"}>
        <Button
          variant="contained"
          disabled={isButtonDisabled}
          onClick={() => onSave(assignedIssueKey, assignedProjectName)}
        >
          Save Changes
        </Button>
      </Grid>
    </Grid>
  );
};

export default AuditBulkEditFields;
