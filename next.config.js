/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static optimization
  output: 'standalone',
  
  // Optimize images
  images: {
    domains: ['localhost'],
    unoptimized: false,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    formats: ['image/webp'],
  },
  
  // Enable compression
  compress: true,
  
  // Optimize production builds
  swcMinify: true,
  
  // Reduce bundle size
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['react', 'react-dom', 'next'],
    outputFileTracingRoot: process.cwd(),
    outputFileTracingExcludes: {
      '*': [
        // Exclude development files
        '**/.git/**',
        '**/.next/**',
        '**/node_modules/**',
        '**/.env*',
        '**/README.md',
        '**/package-lock.json',
        '**/yarn.lock',
        '**/pnpm-lock.yaml',
        // Exclude test files
        '**/*.test.*',
        '**/*.spec.*',
        '**/__tests__/**',
        '**/test/**',
        '**/tests/**',
        // Exclude documentation
        '**/docs/**',
        '**/documentation/**',
        // Exclude development tools
        '**/.vscode/**',
        '**/.idea/**',
        '**/.github/**',
        // Exclude large media files
        '**/public/videos/**',
        '**/public/audio/**',
        // Exclude source maps in production
        '**/*.map',
      ],
    },
    outputFileTracingIncludes: {
      '*': [
        // Include only necessary files
        '**/app/**',
        '**/components/**',
        '**/lib/**',
        '**/styles/**',
        '**/public/images/**',
        '**/next.config.js',
        '**/package.json',
      ],
    },
  },
  
  // Configure webpack
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        minSize: 20000,
        maxSize: 244000,
        cacheGroups: {
          default: false,
          vendors: false,
          framework: {
            chunks: 'all',
            name: 'framework',
            test: /[\\/]node_modules[\\/](react|react-dom|next)[\\/]/,
            priority: 40,
            enforce: true,
          },
          lib: {
            test: /[\\/]node_modules[\\/]/,
            chunks: 'all',
            name: 'lib',
            priority: 30,
            minChunks: 2,
            reuseExistingChunk: true,
          },
          commons: {
            name: 'commons',
            minChunks: 2,
            priority: 20,
          },
          shared: {
            name: (module, chunks) => {
              return `shared-${chunks.map(c => c.name).join('-')}`;
            },
            priority: 10,
            minChunks: 2,
            reuseExistingChunk: true,
          },
        },
      };
    }
    return config;
  },
}

module.exports = nextConfig 