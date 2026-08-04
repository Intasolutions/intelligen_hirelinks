import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { AuthService } from './services/auth.service';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const isAuthPage = request.nextUrl.pathname.startsWith('/login');
  const isAdminPage = request.nextUrl.pathname.startsWith('/admin');

  // 1. Unauthenticated users cannot access /admin
  if (!token && isAdminPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 2. Authenticated users cannot access /login
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  // Next.js middleware runs on edge, meaning we cannot make fetch calls to standard node.js APIs 
  // easily if they rely on node-specific fetch. But we can let the Layout verify the session on the server.
  // We strictly check cookie presence here. The layout will verify its validity.

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/login']
};
