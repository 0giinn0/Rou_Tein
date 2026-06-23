/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@ticktick/shared", "@ticktick/ui"],
  output: "export",
  distDir: "dist",
};

module.exports = nextConfig;
