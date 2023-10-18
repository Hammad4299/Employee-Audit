import { initDatabase } from "../Database/DB";
import { DataTypes } from "sequelize";

export const ProjectModal = initDatabase.define("project", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  billable: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  },
  aliases: {
    type: DataTypes.JSONB,
    allowNull: true,
  },
});

export default ProjectModal;
