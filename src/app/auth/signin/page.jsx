import React from 'react'
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import LoginForm from '@/app/component/LoginForm/LoginForm';

const Signin = async () => {
    const session = await auth();
    if (session?.user) redirect('/')
    return (
        <>
            {
                // session?.user ? redirect('/') : <LoginForm />
                <LoginForm />
            }
        </>
    )
}

export default Signin