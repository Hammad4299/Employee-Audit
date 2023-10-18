import databaseConfig from "@/app/Database/databaseConfig";
import { Sequelize } from "sequelize";

export const initDatabase = new Sequelize({
  dialect: "sqlite",
  storage: databaseConfig.database_url,
});
initDatabase
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });
export default initDatabase;
