import { withAuth } from "next-auth/middleware"

// Más información sobre cómo funciona el middleware de NextAuth.js:
// https://next-auth.js.org/configuration/nextjs#middleware
export default withAuth(
  function middleware() {
    // Puedes insertar lógica personalizada aquí si es necesario
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
     * Coincidir con todas las rutas de solicitud excepto las que comienzan con:
     * - api/auth (rutas de autenticación)
     * - api/telegram/save-message (webhook público)
     * - login (la página de inicio de sesión)
     */
    '/((?!api/auth|api/telegram/save-message|login).*)',
  ],
}