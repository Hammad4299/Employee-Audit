import { Project } from "@/app/DomainModals";
import { initDatabase } from "../Database/DB";
import { DataTypes, Model } from "sequelize";
interface ProjectModalType extends Project, Model<Project> {}
export const ProjectModal = initDatabase.define<ProjectModalType>(
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
