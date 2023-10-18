import initDatabase from "@/app/Database/DB";
import { MigratorJobContext } from "@/app/Database/migrations/DatabaseClient/Types";
import { DataTypes } from "sequelize";
import { MigrationParams } from "umzug";

// All migrations must provide a `up` and `down` async functions

export const up = async ({ context }: MigrationParams<MigratorJobContext>) => {
  await initDatabase.transaction(async (transaction) => {
    await context.queryInterface?.createTable("workspaces", {
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
  });
};

export const down = async ({
  context,
}: MigrationParams<MigratorJobContext>) => {
  await initDatabase.transaction(async (transaction) => {
    await context.queryInterface?.dropTable("workspaces");
  });
};
