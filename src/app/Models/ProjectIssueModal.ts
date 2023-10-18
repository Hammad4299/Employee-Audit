import { initDatabase } from "../Database/DB";
import { DataTypes } from "sequelize";

export const ProjectIssueModal = initDatabase.define(
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