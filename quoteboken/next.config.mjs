/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverComponentsExternalPackages: ['pdf2json', '@google-cloud/translate']
    }
};

export default nextConfig;
