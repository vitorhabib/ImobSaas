/** @type {import('next').NextConfig} */
const nextConfig = {
  ...(process.platform === 'win32' ? {} : { output: 'standalone' }),
  transpilePackages: ['@imob-saas/ui'],
}

module.exports = nextConfig
