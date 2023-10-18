import { umzugMigration } from "./index";

export async function migrateAll() {
  await umzugMigration.up();
}

export async function downAll() {
  await umzugMigration.down({ to: 0 as 0 });
}

export async function downLastExecuted() {
  await umzugMigration.down();
}

/**key including */
export async function downUpToKey(key: string) {
  await umzugMigration.down({ to: key });
}
export async function downSpecified(keys: string[]) {
  await umzugMigration.down({ migrations: keys });
}
