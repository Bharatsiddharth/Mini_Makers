import type { NextConfig } from "next";

const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Normalize the API base so "/api" is appended exactly once.
// Handles the following forms:
//   - "http://localhost:8000"       -> "http://localhost:8000"
//   - "http://localhost:8000/"       -> "http://localhost:8000"
//   - "http://localhost:8000/api"    -> "http://localhost:8000"
//   - "http://localhost:8000/api/"   -> "http://localhost:8000"
//   - "https://host.com/api"         -> "https://host.com"
const apiBase = rawApiUrl.replace(/\/+$/, "").replace(/\/api$/i, "");

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${apiBase}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
