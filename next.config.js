/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['localhost', 'i.ibb.co'],
    },
    experimental: {
        serverActions: true,
    },
}

module.exports = nextConfig
