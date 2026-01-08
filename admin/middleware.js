import { NextResponse } from 'next/server';

export function middleware(request) {
  // For client-side auth, we'll handle redirects in the components
  // This middleware can be used for server-side auth checks if needed
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/forgot-password']
};

