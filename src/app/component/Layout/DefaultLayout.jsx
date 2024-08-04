import React from 'react'
import { auth } from '@/auth';
import Layout from './Layout';

const DefaultLayout = async ({ children }) => {
    const session = await auth();
    // console.log("session from default layout: ", session);
    return (
        <Layout session={session}> {children}</Layout >
    )
}

export default DefaultLayout