import type {NextConfig} from "next";

const WHITELIST_SOURCES = process.env.NEXT_WHITELIST_SOURCES?.split(",") || [];

const nextConfig: NextConfig = {
    outputFileTracingRoot: __dirname,
    images: {
        remotePatterns: WHITELIST_SOURCES.map(hostname => ({
            protocol: 'https',
            hostname: hostname,
            port: "*",
            pathname: "/**"
        }))
    },
};

export default nextConfig;
