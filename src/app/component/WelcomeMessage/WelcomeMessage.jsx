"use client"
import { signIn, useSession } from 'next-auth/react';
import React from 'react';

const WelcomeMessage = () => {

    const { data: session, status } = useSession();

    return (
        <div>
            {
                session?.user ? <h1 className="text-3xl font-bold">Welcome, {session?.user?.name}</h1> : <button onClick={() => signIn('Credentials', { callbackUrl: '/api/auth/signin/profile' })}>Login</button>
            }
        </div>
    );
};

export default WelcomeMessage;