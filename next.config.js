const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ["@supabase/supabase-js", "zod"],
  images: {
    domains: [
      // Agrega el dominio de tu proyecto Supabase
      // Por ejemplo: 'abcdefgh.supabase.co'
    ],
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@babel/runtime": path.dirname(require.resolve("@babel/runtime/package.json")),
    };
    return config;
  },
};

module.exports = nextConfig;
