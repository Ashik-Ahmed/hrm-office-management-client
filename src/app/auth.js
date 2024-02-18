import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const {
    auth,
    signIn,
    signOut,
    handlers: { GET, POST }
} = NextAuth({
    providers: [
        Credentials({
            name: "credentials",
            async authorize(credentials) {
                const { email, password } = credentials;
                try {
                    const res = await fetch('http://localhost:5000/api/v1/employee/login', {
                        method: 'POST',
                        headers: {
                            'content-type': 'application/json'
                        },
                        body: JSON.stringify({
                            email,
                            password
                        })
                    })
                    const data = await res.json();

                    if (res.ok && data?.status === "Success") {
                        return Promise.resolve(data.data.employee);
                    }
                    else {
                        return Promise.resolve(null);
                    }

                } catch (error) {
                    console.log(error);
                    return Promise.resolve(null);
                }
            }
        })
    ],
    secret: process.env.AUTH_SECRET,
    pages: {
        signIn: "/login",
    },
    callbacks: {
        jwt: async ({ token, user }) => {
            if (user) {
                token.role = user.userRole;
                token._id = user._id;
            }
            return token;
        },
        session: async ({ session, token }) => {
            if (session?.user) {
                session.user.role = token.role;
                session.user._id = token._id;
            }
            return session;
        }
    },
    session: {
        strategy: "jwt",
        maxAge: 24 * 60 * 60, // 24 hours
    }
});