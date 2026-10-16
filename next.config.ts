import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER, PHASE_PRODUCTION_BUILD } from "next/constants";
// Validates environment variables at build time.
import "./src/env";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

// Compile MDX/YAML content with Velite before Next.js reads it: once for
// builds, in watch mode for dev. The env flag stops child processes and
// build workers (which reload this file) from starting a second run.
async function buildContent(phase: string) {
  const isDev = phase === PHASE_DEVELOPMENT_SERVER;
  const isBuild = phase === PHASE_PRODUCTION_BUILD;
  if (!(isDev || isBuild) || process.env.VELITE_STARTED) return;
  process.env.VELITE_STARTED = "1";
  const { build } = await import("velite");
  await build({ watch: isDev, clean: !isDev });
}

export default async function config(phase: string): Promise<NextConfig> {
  await buildContent(phase);
  return nextConfig;
}
