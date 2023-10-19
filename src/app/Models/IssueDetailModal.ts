import { IssueDetail } from "@/app/DomainModals";
import { initDatabase } from "../Database/DB";
import { DataTypes, Model } from "sequelize";

interface IssueDetailModal extends IssueDetail, Model {}
export const IssueDetailModal = initDatabase.define<IssueDetailModal>(
  "issue_detail",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    issueKey: {
      field: "issue-key",
      type: DataTypes.STRING,
    },
    description: {
      field: "description",
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: false,
  }
);

export default IssueDetailModal;
