import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Harici placeholder URL'leri ve dinamik görsel bağlantıları için
    // tüm HTTPS domainlerine izin ver (yoksa next/image 400 döner).
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
