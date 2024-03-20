import { NextResponse } from 'next/server'
import { auth } from './app/auth';

export async function middleware(request) {

    const session = await auth();
    // Clone the request headers and set a new header `x-hello-from-middleware1`
    const requestHeaders = new Headers(request.headers)
    // requestHeaders.set('x-hello-from-middleware1', 'hello')

    // You can also set request headers in NextResponse.rewrite
    const response = NextResponse.next({
        request: {
            // New request headers
            headers: requestHeaders,
        },
    })

    // Set a cookie on the response
    response.cookies.set('TOKEN', session?.user?.accessToken, {
        path: '/',
        httpOnly: true,
        // secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 1 // 1 day in seconds
    });
    // Set a new response header `x-hello-from-middleware2`
    // response.headers.set('x-hello-from-middleware2', 'hello')
    return response
}