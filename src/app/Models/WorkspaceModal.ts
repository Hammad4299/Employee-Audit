import { initDatabase } from "../Database/DB";
import { DataTypes } from "sequelize";

export const WorkspaceModal = initDatabase.define("workspaces", {
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
    type: DataTypes.JSONB,
  },
  billRate: {
    type: DataTypes.INTEGER,
    field: "bill_rate",
  },
});

export default WorkspaceModal;
