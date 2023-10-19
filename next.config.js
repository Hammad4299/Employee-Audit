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
  reactStrictMode: true,
  webpack: (config, options) => {
    config.externals.push(
      nodeExternals({
        allowlist: ["sqlite3", "lodash-es"],
      })
    );

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
module.exports = nextConfig;
