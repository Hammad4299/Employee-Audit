import initDatabase from "@/app/Database/DB";
import { MigratorJobContext } from "@/app/Database/migrations/DatabaseClient/Types";
import { DataTypes } from "sequelize";
import { MigrationParams } from "umzug";
// All migrations must provide a `up` and `down` async functions

export const up = async ({ context }: MigrationParams<MigratorJobContext>) => {
  await initDatabase.transaction(async (transaction) => {
    await context.queryInterface?.createTable(
      "issue_detail",
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        issueKey: {
          field: "issue-key",
          type: DataTypes.NUMBER,
        },
      },
      { transaction }
    );
  });
};

export const down = async ({
  context,
}: MigrationParams<MigratorJobContext>) => {
  await initDatabase.transaction(async (transaction) => {
    await context.queryInterface?.dropTable("issue_detail", { transaction });
  });
};
