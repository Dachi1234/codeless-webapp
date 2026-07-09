import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@codeless/db"],
  // Keep Prisma external so its query-engine binary is traced into the
  // serverless bundle instead of being webpack-bundled (which drops the engine).
  serverExternalPackages: ["@prisma/client", ".prisma/client"],
  // Trace files from the monorepo root so packages/db's Prisma engine is included.
  outputFileTracingRoot: path.join(__dirname, "../../"),
};

export default nextConfig;
