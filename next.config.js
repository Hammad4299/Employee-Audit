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
    console.log(
      "entry"
      // await config.entry(),
      // options.isServer,
      // options.nextRuntime
    );
    if (options.nextRuntime === "nodejs") {
      config.externals.push("sqlite3");
      config.externals.push("sequelize");
    }
    console.log(
      "entry after",

      options.isServer,
      options.nextRuntime
    );
    return config;
  },
};
module.exports = nextConfig;
