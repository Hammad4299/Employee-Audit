import initDatabase from "@/app/Database/DB";
import { MigratorJobContext } from "@/app/Database/migrations/DatabaseClient/Types";
import { DataTypes } from "sequelize";
import { MigrationParams } from "umzug";
// All migrations must provide a `up` and `down` async functions

export const up = async ({ context }: MigrationParams<MigratorJobContext>) => {
  await initDatabase.transaction(async (transaction) => {
    await context.queryInterface?.createTable(
      "projects",
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        name: {
          field: "toggle_id",
          type: DataTypes.STRING,
        },
        billable: {
          field: "owner",
          type: DataTypes.BOOLEAN,
          defaultValue: false,
        },
        aliases: {
          type: DataTypes.JSONB,
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
    await context.queryInterface?.dropTable("project", { transaction });
  });
};
