/** @format */
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Get the token from cookies instead of localStorage because middleware runs on the edge
  const token = request.cookies.get("token")
  const isLoginPage = request.nextUrl.pathname === "/login"

  // If there's no token and we're not on the login page, redirect to login
  if (!token && !isLoginPage) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // If we have a token and we're on the login page, redirect to home
  if (token && isLoginPage) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
}
