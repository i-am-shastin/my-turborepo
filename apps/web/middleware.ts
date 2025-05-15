import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
    const accessToken = request.cookies.get('access_token');
    const refreshToken = request.cookies.get('refresh_token');

    if (accessToken) {
        return NextResponse.next();
    }

    if (!accessToken && refreshToken) {
        const refreshResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
            method: 'POST',
            headers: {
                Cookie: `refresh_token=${refreshToken.value}`,
            },
        });

        if (!refreshResponse.ok) {
            return NextResponse.redirect(new URL('/auth', request.url));
        }

        const response = NextResponse.next();
        refreshResponse.headers.getSetCookie().forEach((cookie) => {
            response.headers.append('Set-Cookie', cookie);
        });
        return response;
    }

    return NextResponse.redirect(new URL('/auth', request.url));
}

export const config = {
    matcher: ['/', '/profile', '/users'],
};
