import databaseConfig from "@/app/Database/databaseConfig";

function getAbsolutePath(relativePath: string) {
  return `${process.env.PROJECT_ROOT}/${relativePath}`
    .replace(/\/+/g, "/")
    .replace(/\\+/g, "/");
}
export const config = {
  database: databaseConfig,
  getAbsolutePath: getAbsolutePath,
  toggl: {
    apiToken: process.env.TOGGL_API_TOKEN,
  },
};

export const baseUrl = `http://localhost:3000`

export default config;
