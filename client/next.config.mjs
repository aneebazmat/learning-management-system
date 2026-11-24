/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    domains: [
      "res.cloudinary.com",
      "randomuser.me",
      "images.unsplash.com",
      "lh3.googleusercontent.com",
      "avatars.githubusercontent.com",
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin-allow-popups",
          },
        ],
      },
    ];
  },
  async rewrites() {
    const backendPort = process.env.SERVER_PORT || process.env.EXPRESS_PORT || 5005;
    return [
      {
        source: "/api/v1/:path*",
        destination: `http://127.0.0.1:${backendPort}/api/v1/:path*`,
      },
      {
        source: "/test",
        destination: `http://127.0.0.1:${backendPort}/test`,
      },
    ];
  },
};

export default nextConfig;
