import { NextResponse } from "next/server";
import { auth } from "./auth";
import { doesRoleHaveAccessToURL, PROTECTED_ROUTES, PROTECTED_SUB_ROUTES, PUBLIC_ROUTES } from "./utils/routes";

export async function middleware(request) {

    const isPublicRoute = PUBLIC_ROUTES.some(route => {
        const regexPattern = route
            .replace(/\[.*?\]/g, '[^/]+') // Handle dynamic segments like [token]
            .replace(/\//g, '\\/');       // Escape slashes for the RegExp

        const regex = new RegExp(`^${regexPattern}$`);
        return regex.test(request.nextUrl.pathname);
    });

    if (isPublicRoute) {
        return NextResponse.next();
    }

    // console.log("current path is:", request.nextUrl.pathname);
    const session = await auth();
    // console.log("user from middleware: ", session?.user);
    const isAuthenticated = !!session?.user?.email;
    // const isPublicRoute = (PUBLIC_ROUTES.find((route) => request.nextUrl.pathname.startsWith(route)) && !PROTECTED_SUB_ROUTES.find(route => request.nextUrl.pathname.includes(route)))

    if (!isAuthenticated) {
        return NextResponse.redirect(new URL('/auth/signin', request.nextUrl))
    }
    if (session?.user) {

        // Check if the current URL is a dynamic protected route in `PROTECTED_ROUTES`
        const hasProtectedAccess = PROTECTED_ROUTES.some(route => {
            const regexPattern = route
                .replace(/\[.*?\]/g, '[^/]+') // Handle dynamic segments like [id]
                .replace(/\//g, '\\/');       // Escape slashes for the RegExp

            const regex = new RegExp(`^${regexPattern}$`);
            return regex.test(request.nextUrl.pathname);  // Check if URL matches protected route
        });

        const hasAccess = doesRoleHaveAccessToURL(session?.user, request.nextUrl.pathname);

        if (!hasAccess && !hasProtectedAccess) {
            console.log("hasAccess: ", hasAccess, "PROTECTED_ROUTES: ", hasProtectedAccess);
            // Prevent loop by excluding `/not-found` from further access checks
            if (request.nextUrl.pathname !== '/not-found') {
                return NextResponse.redirect(new URL('/not-found', request.nextUrl));
            }
        }

        // if (!session?.user?.pageAccess.some(page => page.url === request.nextUrl.pathname)) {
        //     return NextResponse.redirect(new URL('/not-found', request.nextUrl))
        // }
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