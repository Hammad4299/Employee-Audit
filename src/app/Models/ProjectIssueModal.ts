import { initDatabase } from "../Database/DB";
import { DataTypes } from "sequelize";

export const ProjectIssueModal = initDatabase.define("project_issues", {
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
});

export default ProjectIssueModal;
