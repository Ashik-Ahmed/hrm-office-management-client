import { NextResponse } from 'next/server'
import { auth } from './app/auth';

export async function middleware(request) {

    const session = await auth();

    console.log("session: ", session);

    const pathname = request.nextUrl.pathname;
    console.log("request url: ", request.url);

    if (!session && !request.nextUrl.pathname.includes('/login')) {
        // redirect("/api/auth/signin");
        console.log("not logged in", request.url);
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // if (!session) {
    //     // redirect("/api/auth/signin");
    //     console.log("not logged in", request.url);
    //     return NextResponse.redirect(new URL('/', request.url));
    // }

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


    if (!session) {
        // const response = NextResponse.next();
        response.cookies.delete('TOKEN', {
            path: '/'
            // You may need to specify the same attributes as when you set the cookie
        });
        return response;
    }

    // Set a cookie on the response
    response.cookies.set('TOKEN', session?.user?.accessToken, {
        path: '/',
        // httpOnly: true,
        // secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 1 // 1 day in seconds
    });

    // Set a new response header `x-hello-from-middleware2`
    // response.headers.set('x-hello-from-middleware2', 'hello')
    return response
}