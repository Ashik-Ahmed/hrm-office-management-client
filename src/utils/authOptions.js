import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";

let userInfo;
export const authOptions = {
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email" },
                password: { label: "Password" },
            },
            async authorize(credentials, req) {
                // Perform database operations
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

                    // const user = Promise.resolve(res.json())

                    const employee = await res.json()

                    if (employee) {
                        console.log('userdata: ', employee);

                        const dbEmployee = employee.data.employee;

                        // const user = {
                        //     id: dbEmployee._id,
                        //     name: dbEmployee.name,
                        //     email: dbEmployee.email,
                        //     employeeId: '25'
                        // }

                        return dbEmployee;
                    }
                    else {
                        return null
                    }
                } catch (error) {
                    console.error(error);
                    return null;
                }
            },
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    debug: false,
    session: {
        strategy: 'jwt',
    },
    jwt: {
        secret: process.env.NEXTAUTH_SECRET
    },
    callbacks: {
        async jwt({ token, user }) {
            // Persist the OAuth access_token and or the user id to the token right after signin
            return { ...token, ...user }
        },

        async session({ session, token }) {

            session.user = {
                _id: token._id,
                name: token.name,
                email: token.email,
                designation: token.designation,
                image: token.image
            }

            return session
        }
    }
};