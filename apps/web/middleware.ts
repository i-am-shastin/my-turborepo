import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const accessToken = request.cookies.get('access_token');
    const refreshToken = request.cookies.get('refresh_token');

    if (accessToken) {
        return NextResponse.next();
    }

    if (!accessToken && refreshToken) {
        const url = request.nextUrl.clone();
        url.pathname = '/api/refresh-token';
        return NextResponse.rewrite(url);
    }

    return NextResponse.redirect(new URL('/auth', request.url));
}

export const config = {
    matcher: ['/', '/profile', '/users'],
};
