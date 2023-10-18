import initDatabase from "@/app/Database/DB";
import { MigratorJobContext } from "@/app/Database/migrations/DatabaseClient/Types";
import { MigrationParams } from "umzug";

// All migrations must provide a `up` and `down` async functions

export const up = async ({ context }: MigrationParams<MigratorJobContext>) => {
  await initDatabase.transaction(async (transaction) => {
    await context.queryInterface?.createTable("TABLE_NAME", {});
  });
};

export const down = async ({
  context,
}: MigrationParams<MigratorJobContext>) => {
  await initDatabase.transaction(async (transaction) => {
    await context.queryInterface?.dropTable("TABLE_NAME");
  });
};
