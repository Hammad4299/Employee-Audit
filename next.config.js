const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
// import config from "./src/app/config/config";

const __dirname = "C:\\Teraception\\employee-audit";

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    dirs: ["."],
  },
  pageExtensions: ["ts", "tsx", "js", "jsx"],
  poweredByHeader: false,
  reactStrictMode: true,
  webpack: (config, options) => {
    //   const oldEntry = config.entry;
    //   // return merge(config, {
    //   //   entry() {
    //   //     return config.entry().then((entry) => {
    //   //       return Object.assign({}, oldEntry, {
    //   //         migrator: "src/app/Database/migrations/DatabaseClient/index.ts",
    //   //       });
    //   //     });
    //   //   },
    //   // });
    //   // config.entry = async () => {
    //   // const entry = await oldEntry();
    //   // console.log(`🚀 ~ config.entry= ~ entry:1`, entry);
    //   // return {
    //   //   ...(entry ?? {}),
    //   //   ...(entry
    //   //     ? {
    //   //         migrator: path.resolve(
    //   //           __dirname,
    //   //           "src/app/Database/migrations/DatabaseClient/index.ts"
    //   //         ),
    //   //       }
    //   //     : {}),
    //   // };
    //   // if (
    //   //   entry["main.js"] &&
    //   //   !entry["main.js"].includes(
    //   //     path.resolve(
    //   //       __dirname,
    //   //       "src/app/Database/migrations/DatabaseClient/index.ts"
    //   //     )
    //   //   )
    //   // ) {
    //   //   entry["main.js"].unshift(
    //   //     path.resolve(
    //   //       __dirname,
    //   //       "src/app/Database/migrations/DatabaseClient/index.ts"
    //   //     )
    //   //   );
    //   // }
    //   // console.log(`🚀 ~ config.entry= ~ entry:2`, entry);
    //   // return entry;
    //   // };
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
