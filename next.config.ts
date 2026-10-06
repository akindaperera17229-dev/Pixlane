import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  allowedDevOrigins: [
    '192.168.79.249',
    '192.168.79.249:3000',
    'localhost:3000',
    '*.loca.lt',
    '*.ngrok-free.app',
    '*.ngrok-free.dev',
    '*.ngrok.io',
    'roping-squall-cricket.ngrok-free.dev',
  ],
};

export default nextConfig;
