import { MigratorJobContext } from "@/app/Database/migrations/DatabaseClient/Types";
import * as createProjectTable from "@/app/Database/migrations/migrations/1697461171249_create_project_table";
import { MigrationParams } from "umzug";

export const newMigrations: Array<{
  name: string;
  up: ({ context }: MigrationParams<MigratorJobContext>) => Promise<void>;
  down: ({ context }: MigrationParams<MigratorJobContext>) => Promise<void>;
}> = [
  {
    name: "1645716838298_add_new_cols_to_existing_tables",
    up: createProjectTable.up,
    down: createProjectTable.down,
  },
];
export default newMigrations;
