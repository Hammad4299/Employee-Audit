// // import fs from "fs";
import fs from "fs";
// const fs = require("fs");
const args = process.argv;

function createMigration() {
  const name = `${Date.now()}_${args[2]}.ts`;
  fs.copyFile(
    "src/app/Database/migrations/DatabaseClient/MigrationTemplate.ts",
    `src/app/Database/migrations/migrations/${name}`,
    (err) => {
      if (err) {
        throw err;
      }
      console.log(`${name} File created in Jobs/V2`);
    }
  );
}
createMigration();
