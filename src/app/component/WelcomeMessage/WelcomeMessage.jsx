import React from 'react';

const WelcomeMessage = ({ session }) => {


    return (
        <div>
            {
                session?.user ? <h1 className="text-3xl font-bold">Welcome, {session?.user?.name}</h1> : <button onClick={() => signIn('Credentials', { callbackUrl: '/api/auth/signin' })}>Login</button>
            }

        </div>
    );
};

export default WelcomeMessage;