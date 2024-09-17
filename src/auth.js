import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";


export const {
    handlers: { GET, POST },
    auth,
    signIn,
    signOut
} = NextAuth({
    session: {
        strategy: "jwt"
    },
    providers: [
        CredentialsProvider({
            async authorize(credentials) {
                // try {
                //     const user = getUserByEmail(credentials?.email);
                //     if (user) {
                //         const isPasswordMatch = user.password === credentials.password;
                //         if (isPasswordMatch) {
                //             return user
                //         }
                //         else {
                //             throw new Error("Wrong password")
                //         }
                //     }
                //     else {
                //         throw new Error("User not found")
                //     }
                // } catch (error) {
                //     throw new Error(error)
                // }

                const { email, password } = credentials;
                // console.log("Inside authorize: ", email, password);
                try {
                    const res = await fetch(`${process.env.API_SERVER_UR}/employee/login`, {
                        method: 'POST',
                        headers: {
                            'content-type': 'application/json'
                        },
                        body: JSON.stringify({
                            email: credentials?.email,
                            password: credentials?.password
                        })
                    })
                    const data = await res.json();
                    // console.log("login api response: ", data);
                    if (data?.status == "Success") {
                        // return data.data.employee;
                        // console.log("db employee: ", data?.data);
                        const employee = data?.data?.employee;
                        return {
                            ...employee,
                            role: employee.userRole || '', // ensure it's a plain object
                            user_id: employee._id || '',
                            photo: employee.image || '',
                            department: employee.department || '',
                            pageAccess: employee.pageAccess || [],
                            accessToken: employee.accessToken || ''
                        };
                    }
                    else {
                        // console.log("Throwing new error: ", data);
                        throw new Error(data?.error || 'Login failed'); //send the error
                    }
                } catch (error) {
                    // console.log("login api error is: ", error);
                    throw new Error(error.message || 'Internal Server Error');
                }
            }
        })
    ],
    secret: process.env.AUTH_SECRET,
    // pages: {
    //     signIn: "/login",
    // },
    trustProxy: true,
    callbacks: {
        jwt: async ({ token, user }) => {
            // console.log("inside jwt user: ", user);
            // console.log("inside jwt token: ", token);
            if (user) {
                token.role = user.role || '';
                token._id = user.user_id || '';
                token.photo = user.photo || '';
                token.department = user.department || '';
                token.pageAccess = user.pageAccess || [];
                token.accessToken = user.accessToken || '';
            }
            return token;
        },
        session: async ({ session, token }) => {
            // console.log("user is: ", session?.user);
            // console.log("token is: ", token);
            if (session?.user) {
                session.user.role = token.role || '';
                session.user._id = token._id || '';
                session.user.photo = token.photo || '';
                session.user.department = token.department || '';
                session.user.pageAccess = token.pageAccess || [];
                session.user.accessToken = token.accessToken || '';
            }
            // console.log("session is: ", session);
            return session;
        }
    },
    session: {
        strategy: "jwt",
        maxAge: 8 * 60 * 60, // 8 hours
    }
})