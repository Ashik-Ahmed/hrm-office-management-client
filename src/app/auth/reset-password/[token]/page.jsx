"use client"

import { useRouter } from 'next/navigation';
import { Toast } from 'primereact/toast';
import React, { useEffect, useRef, useState } from 'react';

const ResetPassword = ({ params: { token } }) => {

    const toast = useRef();
    const router = useRouter();

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isTokenValid, setIsTokenValid] = useState(true);

    const checkToken = async () => {
        fetch(`${process.env.API_SERVER_URL}/employee/check-password-reset-token/${token}`, {
            method: 'GET',
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                if (data.status === 'Success') {
                    setIsTokenValid(true);
                }
                else {
                    setIsTokenValid(false);
                }
            })
    };

    const handleResetPassword = (e) => {
        e.preventDefault();
        // Add your form submission logic here
        console.log('New Password:', newPassword);
        console.log('Confirm Password:', confirmPassword);

        fetch(`${process.env.API_SERVER_URL}/employee/reset-password/${token}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ newPassword, confirmPassword }),
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                if (data.status === 'Success') {
                    toast.current.show({ severity: 'success', summary: 'Success', detail: 'Password reset successful', life: 3000 });
                    router.push('/auth/signin');
                }
                else {
                    alert(data.error);
                    toast.current.show({ severity: 'error', summary: 'Failed', detail: data?.error, life: 3000 });
                }
            })

    };

    useEffect(() => {
        checkToken();
    }, [token]);


    if (!isTokenValid) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                    <div className='text-center'>
                        <i className="pi pi-exclamation-triangle text-red-500" style={{ fontSize: '5rem' }} />
                    </div>
                    <h2 className="text-2xl font-semibold text-center text-gray-800 mt-4">Token Invalid or Expired</h2>
                </div>
            </div>
        )
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Toast ref={toast} />
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Reset Password</h2>
                <form onSubmit={handleResetPassword}>
                    <div className="mb-4">
                        <label htmlFor="new-password" className="block text-gray-700 mb-2">New Password</label>
                        <input
                            type="password"
                            id="new-password"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="confirm-password" className="block text-gray-700 mb-2">Confirm Password</label>
                        <input
                            type="password"
                            id="confirm-password"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
                    >
                        Reset Password
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;