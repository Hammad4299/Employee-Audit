
import databaseConfig from "@/app/Database/databaseConfig";
import { Sequelize } from "sequelize";

export const initDatabase = new Sequelize({
  dialect: "sqlite",
  storage: databaseConfig.database_url,
});
export default initDatabase;


