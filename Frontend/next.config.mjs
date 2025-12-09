/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Enable static file serving for 3D models
  output: 'standalone',
  // Configure webpack to handle 3D model files
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(glb|gltf)$/,
      type: 'asset/resource',
      generator: {
        filename: 'static/chunks/[path][name][ext]',
      },
    });
    return config;
  },
  // Increase body parser size limit for large files
  experimental: {
    serverActions: {
      bodySizeLimit: '200mb',
    },
  },
  // Allow serving static files from public folder
  async headers() {
    return [
      {
        source: '/3d-models/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'Content-Type',
            value: 'model/gltf-binary',
          },
        ],
      },
    ];
  },
}

export default nextConfig
