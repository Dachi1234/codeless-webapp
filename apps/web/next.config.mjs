import createNextIntlPlugin from "next-intl/plugin";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // three.js ships ESM that Next transpiles fine; keep this explicit for R3F deps.
  transpilePackages: ["three", "@codeless/db"],
  // Keep Prisma external so its query-engine binary is traced into the
  // serverless bundle instead of being webpack-bundled (which drops the engine).
  serverExternalPackages: ["@prisma/client", ".prisma/client"],
  // Trace files from the monorepo root so packages/db's Prisma engine is included.
  outputFileTracingRoot: path.join(__dirname, "../../"),
  experimental: {
    optimizePackageImports: ["framer-motion"],
  },
};

export default withNextIntl(nextConfig);
