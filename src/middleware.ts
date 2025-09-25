import { withAuth } from "next-auth/middleware"

// More on how NextAuth.js middleware works:
// https://next-auth.js.org/configuration/nextjs#middleware
export default withAuth(
  function middleware(req) {
    // You can insert custom logic here if needed
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
)

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (authentication routes)
     * - api/telegram/save-message (public webhook)
     * - login (the login page)
     */
    '/((?!api/auth|api/telegram/save-message|login).*)',
  ],
}