import path from "path";
import { fileURLToPath } from "url";
import { PrismaPlugin } from "@prisma/nextjs-monorepo-workaround-plugin";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@codeless/db"],
  // Trace files from the monorepo root so packages/db's Prisma engine is included.
  outputFileTracingRoot: path.join(__dirname, "../../"),
  // In a pnpm monorepo, the Prisma query-engine .so.node isn't copied next to
  // the serverless bundle by default. This official plugin copies it in.
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.plugins = [...config.plugins, new PrismaPlugin()];
    }
    return config;
  },
};

export default nextConfig;
