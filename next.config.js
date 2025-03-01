/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['lh3.googleusercontent.com'],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  env: {
    NETLIFY: process.env.NETLIFY,
    DATABASE_URL: process.env.DATABASE_URL,
    AUTH_SECRET: process.env.AUTH_SECRET,
    APP_NAME: process.env.APP_NAME || 'EventMaker',
    EMAIL_SERVER_HOST: process.env.EMAIL_SERVER_HOST,
    EMAIL_SERVER_PORT: process.env.EMAIL_SERVER_PORT,
    EMAIL_SERVER_USER: process.env.EMAIL_SERVER_USER,
    EMAIL_SERVER_PASSWORD: process.env.EMAIL_SERVER_PASSWORD,
    EMAIL_FROM: process.env.EMAIL_FROM,
    ENABLE_PUBLIC_REGISTRATION: process.env.ENABLE_PUBLIC_REGISTRATION,
    MAX_EVENTS_PER_USER: process.env.MAX_EVENTS_PER_USER,
    DEFAULT_EVENT_CAPACITY: process.env.DEFAULT_EVENT_CAPACITY,
  },
  // Add better error handling for missing environment variables
  webpack: (config, { isServer }) => {
    // Check for required environment variables during build
    if (isServer) {
      const requiredEnvVars = ['DATABASE_URL', 'AUTH_SECRET'];
      const missingEnvVars = requiredEnvVars.filter(
        (envVar) => !process.env[envVar]
      );
      
      if (missingEnvVars.length > 0) {
        console.warn(
          `Warning: Missing required environment variables: ${missingEnvVars.join(
            ', '
          )}`
        );
      }
    }
    return config;
  },
};

module.exports = nextConfig; 