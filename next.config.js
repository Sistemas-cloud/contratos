const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      // Agrega el dominio de tu proyecto Supabase
      // Por ejemplo: 'abcdefgh.supabase.co'
    ],
  },
  // Server Actions están disponibles por defecto en Next.js 14+
  // No es necesario configurar experimental.serverActions
  webpack: (config, { isServer }) => {
    // Corrige resolución del módulo hooks-client-context en el bundle cliente
    // (error conocido en Next.js 14.2 con ciertos entornos)
    config.resolve.alias = {
      ...config.resolve.alias,
      'next/dist/server/future/route-modules/app-page/vendored/contexts/hooks-client-context': path.join(
        __dirname,
        'node_modules/next/dist/shared/lib/hooks-client-context.shared-runtime.js'
      ),
    };
    return config;
  },
};

module.exports = nextConfig;
