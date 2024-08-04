import { NextResponse } from "next/server";
import { auth } from "./auth";
import { PROTECTED_SUB_ROUTES, PUBLIC_ROUTES } from "./utils/routes";

export async function middleware(request) {
    // console.log("current path is:", request.nextUrl.pathname);
    const session = await auth();
    // console.log("session from middleware: ", session);
    const isAuthenticated = !!session?.user?.email;
    const isPublicRoute = (PUBLIC_ROUTES.find((route) => request.nextUrl.pathname.startsWith(route)) && !PROTECTED_SUB_ROUTES.find(route => request.nextUrl.pathname.includes(route)))
    // console.log("isAuthenticated: ", isAuthenticated, "isPublicRoute: ", isPublicRoute);
    if (!isPublicRoute && !isAuthenticated) {
        console.log("redirecting to signin");
        return NextResponse.redirect(new URL('/auth/signin', request.nextUrl))
    }

    // Set custom header with pathname
    const response = NextResponse.next();

    if (isAuthenticated) {
        response.cookies.set('session', JSON.stringify(session), {
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production',
        });
    }

    response.headers.set('x-pathname', request.nextUrl.pathname);
    return response;
}

export const config = {
    matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"]
}