import type { NextConfig } from "next";
import os from "os";

// Dynamically retrieve all non-internal IPv4 addresses from network interfaces
function getLocalNetworkIPs(): string[] {
  const interfaces = os.networkInterfaces();
  const ips: string[] = [];
  for (const name of Object.keys(interfaces)) {
    const netList = interfaces[name];
    if (netList) {
      for (const net of netList) {
        // We look for IPv4 and skip internal loopbacks like 127.0.0.1
        if (net.family === 'IPv4' && !net.internal) {
          ips.push(net.address);
        }
      }
    }
  }
  return ips;
}

const localIPs = getLocalNetworkIPs();
const devPorts = [3000, 3001, 3002]; // Allow common dev ports

const allowedDevOrigins = [
  "localhost",
  "127.0.0.1",
  ...localIPs,
  ...localIPs.flatMap(ip => devPorts.map(port => `${ip}:${port}`)),
];

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins,
};

export default nextConfig;
