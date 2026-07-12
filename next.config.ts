import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The chat API reads markdown from content/ at request time — make sure
  // those files are bundled into the serverless function on Netlify.
  outputFileTracingIncludes: {
    "/api/chat": [
      "./content/about/**/*",
      "./content/chat/**/*",
      "./content/logs/**/*",
    ],
  },
};

export default nextConfig;
