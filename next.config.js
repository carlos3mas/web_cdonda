/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Añade aquí dominios remotos autorizados si en el futuro sirves imágenes externas
  },
  experimental: {
    scrollRestoration: true,
  },
}

module.exports = nextConfig

