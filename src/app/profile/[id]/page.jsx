'use client'

import Loading from '@/app/component/Loading/Loading';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import profilePhoto from '../../../../public/images/user.png'
import { Button } from 'primereact/button'
import { getEmployeeById } from '@/libs/employee';

const Profile = ({ params: { id } }) => {

    const [employee, setEmployee] = useState(null)

    const getEmployeeData = async (empId) => {
        const empData = await getEmployeeById(empId);
        console.log(empData);
        return empData;
    }

    useEffect(() => {
        setEmployee(getEmployeeData(id))
    }, [id])


    if (!id) {
        return <Loading />
    }

    return (
        <div>
            <div class="indicator bg-white rounded w-1/3">
                <div className='mx-auto border-4 text-center'>
                    <Image class="mask mask-hexagon indicator-item indicator-center bg-cyan-500 -mt-6 w-40 mx-auto" width='160' height='160' src={employee?.image || profilePhoto} alt='User Photo' />
                </div>
                <div className='mt-0 pl-4 w-full'>
                    <div className='text-left py-4 mt-4'>
                        <div className='flex items-baseline justify-between'>
                            <p className='font-bold w-1/3'>Name</p>
                            <span className='w-2/3'>: {employee?.name}</span>
                        </div>
                        <div className='flex items-baseline justify-between mt-1'>
                            <p className='font-bold w-1/3'>Email</p>
                            <span className='w-2/3'>: {employee?.email || 'N/A'}</span>
                        </div>
                        <div className='flex items-baseline justify-between mt-1'>
                            <p className='font-bold w-1/3'>Role</p>
                            <span className='w-2/3'>: {employee?.role || 'N/A'}</span>
                        </div>
                        <div className='flex items-baseline justify-between mt-1'>
                            <p className='font-bold w-1/3'>Birthday</p>
                            <span className='w-2/3'>: {employee?.birthday?.slice(0, 10) || 'N/A'}</span>
                        </div>
                        <div className='flex items-baseline justify-between mt-1'>
                            <p className='font-bold w-1/3'>Phone</p>
                            <span className='w-2/3'>: {employee?.mobile || 'N/A'}</span>
                        </div>
                        <div className='flex items-baseline justify-between mt-1'>
                            <p className='font-bold w-1/3'>Sex</p>
                            <span className='w-2/3'>: {employee?.sex || 'N/A'}</span>
                        </div>
                        <div className='flex items-baseline justify-between mt-1'>
                            <p className='font-bold w-1/3'>Bio</p>
                            <span className='w-2/3'>: {employee?.bio || 'N/A'}</span>
                        </div>
                        <div className='mt-2'>
                            <p className='link inline text-red-500'>Change Password</p>
                        </div>
                    </div>
                    <div className='text-center my-2'>
                        <Button label='Edit Profile' icon='pi pi-user-edit' className='p-button-info p-button-sm normal-case' />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;