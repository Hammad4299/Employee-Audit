import CopyWebpackPlugin from "copy-webpack-plugin";
import path, { resolve } from "path";
// import config from "./src/app/config/config";

const __dirname = "C:\\Ahmad Data\\teraception-projects\\employee-audit";

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    dirs: ["."],
  },
  poweredByHeader: false,
  reactStrictMode: true,
  webpack: (config, options) => {
    const oldEntry = config.entry;
    // const entry = (() =>
    //   new Promise(async (resolve) => {
    //     const entry = await oldEntry();

    //     return resolve({
    //       ...entry,
    //       migrator: "src/app/Database/migrations/UmzungClient/index.ts",
    //     });
    //   }))();
    // setTimeout(() => {
    //   console.log(`🚀 ~ entry:`, entry);
    // }, 10000);
    config.entry = () =>
      new Promise(async (resolve) => {
        resolve({
          ...(await oldEntry()),
          // migrator: "src/app/Database/migrations/UmzungClient/Helpers.ts",
        });
      });
    config.plugins.push(
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.resolve(
              __dirname,
              "src/app/Database/migrations/migrations"
            ),
            to: path.resolve(__dirname, ".next/migrations"),
          },
        ],
      })
    );
    return config;
  },
};
export default nextConfig;
