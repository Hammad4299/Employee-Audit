import { ProjectIssue } from "@/app/DomainModals";
import { initDatabase } from "../Database/DB";
import { DataTypes, Model } from "sequelize";

interface ProjectIssueModal extends ProjectIssue, Model {}
export const ProjectIssueModal = initDatabase.define<ProjectIssueModal>(
  "project_issue",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    issueKey: {
      field: "issue-key",
      type: DataTypes.NUMBER,
    },
    projectId: {
      field: "project_id",
      type: DataTypes.NUMBER,
    },
  },
  {
    timestamps: false,
  }
);

export default ProjectIssueModal;
