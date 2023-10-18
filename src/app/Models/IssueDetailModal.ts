import { initDatabase } from "../Database/DB";
import { DataTypes } from "sequelize";

export const IssueDetailModal = initDatabase.define("issue_detail", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  issueKey: {
    field: "issue-key",
    type: DataTypes.NUMBER,
  },
});

export default IssueDetailModal;
