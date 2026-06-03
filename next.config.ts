import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {

  compiler: {
    // Keep production logs only when debugging auth/session issues.
    removeConsole:
      process.env.AUTH_DEBUG === "1" ||
      process.env.AUTH_DEBUG === "true" ||
      process.env.NEXT_PUBLIC_AUTH_DEBUG === "1" ||
      process.env.NEXT_PUBLIC_AUTH_DEBUG === "true"
        ? false
        : true,
  },

  /* config options here */
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // This allows all domains - you should restrict this in production
      },
    ],
  },
  // Configure for larger file uploads
  // Turbopack requires an absolute path; "." triggers a warning on the server.
  turbopack: {
    root: path.resolve(process.cwd()),
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Exclude TypeORM and related packages from client-side bundle
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        url: false,
        zlib: false,
        http: false,
        https: false,
        assert: false,
        os: false,
        path: false,
        "react-native-sqlite-storage": false,
        "@sap/hana-client": false,
        mysql: false,
      };

      // Exclude TypeORM from client bundle
      config.externals = config.externals || [];
      config.externals.push({
        typeorm: "commonjs typeorm",
        mysql2: "commonjs mysql2",
        bcryptjs: "commonjs bcryptjs",
        jsonwebtoken: "commonjs jsonwebtoken",
      });
    }

    return config;
  },
  serverExternalPackages: ["typeorm", "mysql2", "bcryptjs", "jsonwebtoken"],
};

export default nextConfig;
