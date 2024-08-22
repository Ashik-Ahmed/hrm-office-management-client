import React from 'react'
import { auth } from '@/auth';
import Layout from './Layout';

const DefaultLayout = async ({ children }) => {
    const session = await auth();
    // console.log("session from default layout: ", session?.user);
    return (
        <Layout user={session?.user}> {children}</Layout >
    )
}

export default DefaultLayout