import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const {
    auth,
    signIn,
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

                    if (data?.status == "Success") {
                        return data.data.employee;
                    }
                    else {
                        return null;
                    }

                } catch (error) {
                    console.log(error);
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
            }
            return token;
        },
        session: async ({ session, token }) => {
            if (session?.user) {
                session.user.role = token.role;
            }
            return session;
        }
    },
    session: {
        strategy: "jwt",
        maxAge: 24 * 60 * 60, // 24 hours
    }
});