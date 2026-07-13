import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { withDbRetry, isDbConnectionError } from '@/lib/prisma'

const useSecureCookies =
  process.env.NEXTAUTH_URL?.startsWith('https://') ?? process.env.NODE_ENV === 'production'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const email = credentials.email.trim().toLowerCase()

        try {
          const admin = await withDbRetry((db) =>
            db.admin.findUnique({
              where: { email },
            })
          )

          if (!admin) {
            return null
          }

          const passwordMatch = await bcrypt.compare(credentials.password, admin.password)

          if (!passwordMatch) {
            return null
          }

          return {
            id: admin.id,
            email: admin.email,
            name: admin.nombre,
          }
        } catch (error) {
          console.error('[auth] Error al verificar credenciales:', error)
          if (isDbConnectionError(error)) {
            throw new Error('No se pudo conectar con la base de datos. Inténtalo de nuevo.')
          }
          return null
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 8,
  },
  pages: {
    signIn: '/admin/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  useSecureCookies,
}
