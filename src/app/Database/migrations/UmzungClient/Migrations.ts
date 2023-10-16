import * as createOrganizationTable from "@/app/Database/migrations/migrations/1697461171249_create_organiztion_table";
export const newMigrations = [
  {
    name: "1645716838298_add_new_cols_to_existing_tables",
    up: createOrganizationTable.up,
    down: createOrganizationTable.down,
  },
];
