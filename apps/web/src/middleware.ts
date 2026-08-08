import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { AuthService } from './services/auth.service';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const isAuthPage = request.nextUrl.pathname.startsWith('/login');
  const isAdminPage = request.nextUrl.pathname.startsWith('/admin');

  if (isAuthPage && request.nextUrl.searchParams.get('clear') === 'true') {
    // Create a new URL without the 'clear' parameter to avoid loops or ugly URLs, 
    // but just deleting the cookie and continuing is fine too.
    const url = new URL('/login', request.url);
    const response = NextResponse.redirect(url);
    response.cookies.delete('token');
    return response;
  }

  // 1. Unauthenticated users cannot access /admin
  if (!token && isAdminPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 2. Authenticated users cannot access /login
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/login']
};
