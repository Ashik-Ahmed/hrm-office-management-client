import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";

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

                    console.log(employee);
                    if (employee) {
                        console.log('userdata: ', employee);
                        return employee.data.employee
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
};