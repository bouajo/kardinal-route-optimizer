/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_FLATFILE_SECRET_KEY: 'sk_2bf550be40f2415b84bd069afbdd7b13',
  },
  // Add webpack configuration to handle browser-only modules
  webpack: (config, { isServer }) => {
    // If it's a server build, ignore client-only packages
    if (isServer) {
      config.externals = [
        ...config.externals,
        '@flatfile/sdk',
        '@flatfile/adapter'
      ];
    } else {
      // Client-side specific configurations
      // Make sure the Flatfile modules are properly handled on the client
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        process: require.resolve('process/browser'),
      };
    }
    
    return config;
  },
  // Configure experimental features
  experimental: {
    appDir: true,
    // Allow unsafe eval for Flatfile adapter
    esmExternals: 'loose',
  },
  // Ensure transpiled modules are properly handled
  transpilePackages: ['@flatfile/adapter', '@flatfile/sdk']
};

module.exports = nextConfig; 