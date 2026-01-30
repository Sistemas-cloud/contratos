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
};

module.exports = nextConfig;
