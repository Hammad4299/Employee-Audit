const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const nodeExternals = require("webpack-node-externals");

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    dirs: ["."],
  },

  pageExtensions: ["ts", "tsx", "js", "jsx"],
  poweredByHeader: false,
  reactStrictMode: false,
  webpack: (config, options) => {
    
    if (options.nextRuntime === "nodejs") {
      const oldEntry = config.entry;
      // config.entry = () =>
      //   new Promise(async (resolve) => {
      //     resolve({
      //       ...(await oldEntry()),
      //       migrator: "src/app/Database/migrations/DatabaseClient/index.ts",
      //     });
      //   });
      config.externals.push("sqlite3");
      config.externals.push("sequelize");
      // config.plugins.push(
      //   new CopyWebpackPlugin({
      //     patterns: [
      //       {
      //         from: path.resolve(
      //           __dirname,
      //           "./src/app/Database/migrations/migrations"
      //         ),
      //         to: path.resolve(__dirname, ".next/server/migrations"),
      //       },
      //     ],
      //   })
      // );
    }
    
    return config;
  },
};
module.exports = nextConfig;
