import { umzug } from "./index";

export async function migrateAll() {
  await umzug.up();
}

export async function downAll() {
  await umzug.down({ to: 0 as 0 });
}

export async function downLastExecuted() {
  await umzug.down();
}

/**key including */
export async function downUpToKey(key: string) {
  await umzug.down({ to: key });
}
export async function downSpecified(keys: string[]) {
  await umzug.down({ migrations: keys });
}
