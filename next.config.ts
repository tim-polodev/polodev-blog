import type {NextConfig} from "next";

const WHITELIST_SOURCES = process.env.NEXT_WHITELIST_SOURCES?.split(",").map(s => s.trim()) || [];

const nextConfig: NextConfig = {
    outputFileTracingRoot: __dirname,
    images: {
        remotePatterns: WHITELIST_SOURCES.map(hostname => ({
            protocol: hostname === 'localhost' ? 'http' : 'https',
            hostname: hostname,
            port: "",
            pathname: "/**"
        }))
    },
};

export default nextConfig;
