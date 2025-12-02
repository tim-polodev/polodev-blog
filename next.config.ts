import type {NextConfig} from "next";

const nextConfig: NextConfig = {
    outputFileTracingRoot: __dirname,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'minio.tienhoangdev.com',
                port: '',
                pathname: '/**',
            },
            // Cloudfront distribution
            {
                protocol: 'https',
                hostname: 'd3iy3ktsgwux5n.cloudfront.net',
                port: '',
                pathname: '/**/**',
            },
            {
                protocol: 'http',
                hostname: 'minio.tienhoangdev.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '*',
                pathname: '/**',
            },
            {
                // For placeholder images if needed
                protocol: 'https',
                hostname: 'placeholder.co',
                port: '',
                pathname: '/**',
            }
        ],
    },
};

export default nextConfig;
