/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@hirelinks/ui"],
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
      {
        protocol: 'https',
        hostname: 'logo.clearbit.com',
      },
    ],
  },
  // Frontend (Vercel) and backend (DO) are on unrelated domains, so the
  // httpOnly auth cookie is a third-party cookie from the browser's
  // perspective and gets blocked/dropped by Chrome & Safari's third-party
  // cookie policies regardless of SameSite=None. Proxying API calls through
  // this same origin makes every browser request to /api/v1/* same-origin,
  // so the cookie is first-party and survives. Remove this once the API is
  // moved to a subdomain of the same parent domain as the frontend.
  async rewrites() {
    const apiOrigin = process.env.API_PROXY_TARGET;
    if (!apiOrigin) return [];
    return [
      {
        source: '/api/v1/:path*',
        destination: `${apiOrigin}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
