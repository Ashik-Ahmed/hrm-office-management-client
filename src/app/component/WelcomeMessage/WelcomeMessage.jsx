import React from 'react';

const WelcomeMessage = ({ session }) => {


    return (
        <div>
            <p className='text-fuchsia-700'>
                {
                    session?.user ? <h1 className="text-3xl font-bold">Hello, {session?.user?.name}</h1> : <button onClick={() => signIn('Credentials', { callbackUrl: '/api/auth/signin' })}>Login</button>
                }
            </p>

            <p>Welcome to Infozillion office management system</p>
        </div>
    );
};

export default WelcomeMessage;