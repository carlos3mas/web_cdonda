/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 año
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Optimizaciones adicionales
    unoptimized: false,
    loader: 'default',
  },
  compress: true,
  poweredByHeader: false,
  swcMinify: true,
  // Optimizaciones de producción
  reactStrictMode: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  experimental: {
    scrollRestoration: true,
  },
  // Configuración para navegadores modernos (elimina polyfills innecesarios)
  transpilePackages: [],
  async headers() {
    const isDev = process.env.NODE_ENV !== 'production'
    const csp = isDev
      ? "default-src 'self'; img-src 'self' data: blob: https:; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline'; font-src 'self' data:; connect-src 'self' ws: https://www.googletagmanager.com; frame-src 'self' https://www.google.com https://maps.google.com https://www.google.es; child-src 'self' https://www.google.com https://maps.google.com https://www.google.es; frame-ancestors 'self'; base-uri 'self'; form-action 'self'"
      : "default-src 'self'; img-src 'self' data: https:; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline'; font-src 'self' data:; connect-src 'self' https://www.googletagmanager.com; frame-src 'self' https://www.google.com https://maps.google.com https://www.google.es; child-src 'self' https://www.google.com https://maps.google.com https://www.google.es; frame-ancestors 'self'; base-uri 'self'; form-action 'self'"
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'geolocation=(), microphone=(), camera=()' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'Content-Security-Policy', value: csp },
        ],
      },
    ]
  },
}

module.exports = nextConfig

