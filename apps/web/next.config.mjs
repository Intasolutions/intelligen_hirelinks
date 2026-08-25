/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@hirelinks/ui"],
  // isomorphic-dompurify pulls in jsdom for its server-side path, which
  // has an ESM-only transitive dependency (@exodus/bytes) that webpack
  // can't resolve as CommonJS when Next tries to bundle it into the server
  // component graph. Marking it external tells Next to require() it at
  // runtime via Node instead of bundling it, which is what actually
  // resolves the ESM import correctly.
  experimental: {
    serverComponentsExternalPackages: ["isomorphic-dompurify"],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;
