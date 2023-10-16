import databaseConfig from "@/app/Database/databaseConfig";

function getAbsolutePath(relativePath: string) {
  return `${process.env.PROJECT_ROOT}/${relativePath}`
    .replace(/\/+/g, "/")
    .replace(/\\+/g, "/");
}
export const config = {
  database: databaseConfig,
  getAbsolutePath: getAbsolutePath,
};
export default config;
