import { type NextRequest } from 'next/server'
import { proxy } from './proxy' // Import your proxy logic

export async function middleware(request: NextRequest) {
  return await proxy(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/stripe-webhook (EXCLUDE STRIPE)
     * - _next/static
     * - _next/image
     * - favicon.ico
     */
    '/((?!api/stripe-webhook|_next/static|_next/image|favicon.ico).*)',
  ],
}