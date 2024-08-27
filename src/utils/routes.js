export const PUBLIC_ROUTES = [
    '/auth/signin',
    '/auth/forget-password',
    '/auth/reset-password/[token]',
]

export const PROTECTED_ROUTES = [
    '/profile',
    '/employee/[id]',
    '/not-found'
]

export const PROTECTED_SUB_ROUTES = [
    '/checkout',
]

export function doesRoleHaveAccessToURL(user, url) {
    return user?.pageAccess?.some(route => {
        // Replace dynamic segments (e.g., [id]) with a pattern that matches any segment (not including "/")
        // Catch-all dynamic segments like [...id] should match one or more path segments
        const regexPattern = route.url
            .replace(/\[\.\.\..*?\]/g, '(.+?)') // Match one or more path segments for catch-all routes
            .replace(/\[.*?\]/g, '[^/]+')       // Match any value for regular dynamic route parts
            .replace(/\//g, '\\/');             // Escape forward slashes for RegExp

        // Create a RegExp and ensure it matches the entire URL (^...$)
        const regex = new RegExp(`^${regexPattern}$`);

        return regex.test(url); // Test if the constructed regex matches the given URL
    });
}
