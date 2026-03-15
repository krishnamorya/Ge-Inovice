/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  images: {
    remotePatterns : [
      {
        protocol: "http",
        hostname: "res.cloudinary.com"
      }
    ]
  }
}

export default nextConfig
