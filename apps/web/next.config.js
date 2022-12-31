// @ts-check
const path = require("path");

/**
 * @type {import('next').NextConfig}
 **/
module.exports = {
  reactStrictMode: true,
  output: "standalone",
  transpilePackages: ["ui", "echarts", "zrender"],
  experimental: {
    outputFileTracingRoot: path.join(__dirname, "../../"),
  },
};
