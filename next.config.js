/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://eth-goerli.alchemyapi.io/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
