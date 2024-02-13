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
                // console.log("Hello from auth");
                // Perform database operations
                const { email, password } = credentials;
                console.log(credentials);
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

                    const dbData = await res.json()
                    // console.log(dbData);
                    if (dbData?.status == "Success") {

                        // console.log(dbData);
                        const dbEmployee = dbData.data.employee;

                        // const user = {
                        //     id: dbEmployee._id,
                        //     name: dbEmployee.name,
                        //     email: dbEmployee.email,
                        //     employeeId: '25'
                        // }

                        return dbEmployee;
                    }
                    else {
                        // console.log(dbData);
                        return dbData
                    }
                } catch (error) {
                    // console.error(error);
                    return error;
                }
            },
        }),
    ],
    // pages: {
    //     signIn: '/auth/login',
    //     callbackUrl: '/'
    // },
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
            // console.log("Token with role: ", token);
            return { ...token, ...user }
        },

        async session({ session, token }) {

            session.user = {
                _id: token?._id,
                name: token?.name,
                email: token?.email,
                department: token?.department,
                role: token?.role,
                designation: token?.designation,
                image: token?.image
            }

            return session
        },
    }
};