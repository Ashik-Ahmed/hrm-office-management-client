import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Cookies from "universal-cookie";
import { serialize } from 'cookie';


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

                    if (data?.status == "Success") {
                        // return data.data.employee;
                        console.log("db employee: ", data?.data?.employee.accessToken);
                        const employee = data?.data?.employee;
                        return employee;
                    }
                    else {
                        return null;
                    }

                } catch (error) {
                    // console.log(error);
                    return error;
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
            // console.log("inside jwt user: ", user);
            // console.log("inside jwt token: ", token);
            if (user) {
                token.role = user.userRole;
                token._id = user._id;
                token.department = user.department
                token.accessToken = user.accessToken
            }
            return token;
        },
        session: async ({ session, token }) => {
            // console.log("user is: ", session?.user);
            // console.log("token is: ", token);
            if (session?.user) {
                session.user.role = token.role;
                session.user._id = token._id;
                session.user.department = token.department
                session.user.accessToken = token.accessToken
            }
            // console.log("session is: ", session);
            return session;
        }
    },
    session: {
        strategy: "jwt",
        maxAge: 24 * 60 * 60, // 24 hours
    }
});