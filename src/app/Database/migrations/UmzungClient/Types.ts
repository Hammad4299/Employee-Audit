import { Knex } from "knex";
import { QueryInterface } from "sequelize";

export interface MigratorJobContext {
  connection: Knex | null;
  dbmigrate: any;
  queryInterface?: QueryInterface;
}
export interface MigrationRunner {
  version: string;
  up: (context: MigratorJobContext) => Promise<void>;
  down: (context: MigratorJobContext) => Promise<void>;
}
