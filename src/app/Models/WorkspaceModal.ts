import { Workspace } from "@/app/DomainModals";
import { initDatabase } from "../Database/DB";
import { DataTypes, Model } from "sequelize";

interface WorkspaceModalType extends Workspace, Model<Workspace> {}
export const WorkspaceModal = initDatabase.define<WorkspaceModalType>(
  "workspace",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    toggleId: {
      field: "toggle_id",
      type: DataTypes.INTEGER,
    },
    owner: {
      field: "owner",
      type: DataTypes.STRING,
    },
    billRate: {
      type: DataTypes.INTEGER,
      field: "bill_rate",
    },
  },
  {
    timestamps: false,
  }
);

export default WorkspaceModal;
