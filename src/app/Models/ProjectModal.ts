import { Project } from "@/app/DomainModals";
import { initDatabase } from "../Database/DB";
import { DataTypes, Model } from "sequelize";
interface ProjectModal extends Project, Model {}
export const ProjectModal = initDatabase.define<ProjectModal>(
  "project",
  {
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
  },
  {
    timestamps: false,
  }
);

export default ProjectModal;
