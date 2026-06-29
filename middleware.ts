import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export default withAuth(
  function middleware(req: NextRequest) {
    // Probes automatizados envían Next-Action con ids cortos ("x", "y"). Esta app no usa Server Actions.
    if (req.method === 'POST') {
      const actionId = req.headers.get('Next-Action') ?? ''
      if (actionId.length > 0 && actionId.length <= 4) {
        return new NextResponse(null, { status: 404 })
      }
    }

    return NextResponse.next()
  },
  {
    pages: {
      signIn: '/admin/login',
    },
    callbacks: {
      authorized: ({ token, req }) => {
        if (!req.nextUrl.pathname.startsWith('/admin/dashboard')) {
          return true
        }
        return !!token
      },
    },
  }
)

export const config = {
  matcher: [
    '/admin/dashboard/:path*',
    '/((?!_next/static|_next/image|favicon.ico|images/|templates/).*)',
  ],
}
