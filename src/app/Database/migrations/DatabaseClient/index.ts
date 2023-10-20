import moment from "moment-timezone";
import { DataTypes } from "sequelize";
import { Umzug } from "umzug";
import DBMigrate from "db-migrate";

const dbmigrate = DBMigrate.getInstance(true, {
  cwd: config.getAbsolutePath(""),
});
import config from "@/app/config/config";
import initDatabase from "@/app/Database/DB";
import { MigratorJobContext } from "@/app/Database/migrations/DatabaseClient/Types";
import newMigrations from "@/app/Database/migrations/DatabaseClient/Migrations";

const MigrationModel = initDatabase.define<any>("SequelizeMeta", {
  name: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  runAt: {
    field: "run_at",
    type: DataTypes.BIGINT,
    allowNull: true,
  },
});

export async function initMigrations() {
  const context: MigratorJobContext = {
    queryInterface: initDatabase.getQueryInterface(),
    dbmigrate: dbmigrate,
    connection: null,
  };

  umzugMigration = new Umzug<MigratorJobContext>({
    migrations: newMigrations,

    // indicates that the migration data should be store in the database
    // itself through sequelize. The default configuration creates a table
    // named `SequelizeMeta`.
    logger: console,
    context: context,
    storage: {
      logMigration: async (data) => {
        await ensureMigrationTable();
        await MigrationModel.create({
          name: data.name,
          runAt: moment().format("x"),
        });
      },
      unlogMigration: async (data) => {
        await ensureMigrationTable();
        await MigrationModel.destroy({
          where: { name: data.name },
        });
      },
      executed: async () => {
        await ensureMigrationTable();
        return (
          await MigrationModel.findAll({
            order: [
              ["runAt", "asc"],
              ["name", "asc"],
            ],
          })
        ).map((x) => x.name);
      },
    },
  });
  umzugMigration.on("migrating", (data) =>
    console.log(`${data.name} migration is about to be executed.`)
  );

  umzugMigration.on("migrated", (data) =>
    console.log(`${data.name} migration has successfully been executed.`)
  );

  umzugMigration.on("reverting", (data) =>
    console.log(`${data.name} migration is about to be reverted.`)
  );
  umzugMigration.on("reverted", (data) =>
    console.log(`${data.name} migration has successfully been reverted.`)
  );
  async function ensureMigrationTable() {
    const tables = await context.queryInterface?.showAllTables();
    if (!tables?.includes("SequelizeMeta")) {
      await context.queryInterface?.createTable("SequelizeMeta", {
        name: {
          type: DataTypes.STRING,
          primaryKey: true,
        },
        runAt: {
          field: "run_at",
          type: DataTypes.BIGINT,
          allowNull: true,
        },
      });
    }
  }
}

/**make sure dependent migration should have greater number so will appear at end in lexicographically  */
export let umzugMigration: Umzug<MigratorJobContext>;
