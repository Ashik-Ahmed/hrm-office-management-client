"use client"

import Image from 'next/image';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import React, { useEffect, useRef, useState } from 'react';
import Loading from '../Loading/Loading';
import userPhoto from '../../../../public/images/user.png'
import { redirect } from 'next/navigation';
import { Divider } from 'primereact/divider';

const EmployeeDetails = ({ id, user }) => {
    // console.log(user);
    const toast = useRef()
    const [employee, setEmployee] = useState(user)
    const [loading, setLoading] = useState(false)

    const getEmployee = async () => {
        setLoading(true)
        const url = `http://localhost:5000/api/v1/employee/${id}`;

        fetch(url, {
            headers: {
                'Authorization': `Bearer ${user?.accessToken}`
            }
        })
            .then(res => res.json())
            .then(data => {
                console.log(data)
                setEmployee(data.data)

                setLoading(false)
            })
            .catch(error => {
                console.error("Error fetching employee data:", error);
                setLoading(false); // Handle error and stop loading
            });
    }

    useEffect(() => {
        getEmployee()
    }, [id])

    const sendResetPasswordEmail = () => {

        const resetPasswordUrl = `${window.location.origin}/auth/reset-password`;
        console.log(resetPasswordUrl);
        fetch(`http://localhost:5000/api/v1/employee/send-password-reset-email/${employee.email}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user?.accessToken}`
            },
            body: JSON.stringify({ resetPasswordUrl })
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                if (data.status == 'Success') {
                    toast.current.show({ severity: 'success', summary: 'Success', detail: 'Password reset email sent', life: 3000 });
                }
                else {
                    toast.current.show({ severity: 'error', summary: 'Failed!', detail: data.error, life: 3000 });
                }
            })
    }



    if (loading) {
        return <Loading />
    }

    if (!employee) {
        redirect('/not-found')
    }

    return (
        <div>
            <Toast ref={toast} />
            <div className="flex gap-x-2 w-full bg-white p-4 my-2 rounded-md shadow-xl">
                <div className='flex items-start gap-x-4 w-1/2 mr-8'>
                    <div className='min-w-[150px] min-h-[150px]  flex justify-center items-center'>
                        <Image src={employee?.image || userPhoto} width={200} height={200} alt='user photo' priority className='rounded-full shadow-lg' style={{ width: '130px', height: '130px' }} />
                    </div>
                    <div className='flex flex-col gap-8'>
                        <div>
                            {/* <h3 className='text-xl font-bold'>{viewUserDialog.firstName} {viewUserDialog.lastName}</h3>
                            <p>{viewUserDialog.designation}</p> */}
                            <h3 className='text-xl font-bold text-gray-700'>{employee?.firstName} {employee?.lastName}</h3>
                            <p className='text-gray-500 font-bold text-sm'>{employee?.department}</p>
                            <p className='text-gray-500 text-sm'>{employee?.designation}</p>
                        </div>
                        <div>
                            <p className='text-sm font-bold text-gray-700'>Employee ID: {employee?.employeeId}</p>
                            <p className='text-sm text-gray-500'>Joining Date: {employee?.joiningDate}</p>
                        </div>
                    </div>
                </div>
                <Divider layout="vertical" />
                <div className='w-1/2 flex flex-col justify-between'>
                    <div className='flex flex-col gap-2 font-semibold text-gray-700 text-sm'>
                        <div>
                            <span>Phone : </span>
                            <span className='text-purple-700'>{employee?.mobile}</span>
                        </div>
                        <div>
                            <span>Email : </span>
                            <span className='text-purple-700'>{employee?.email}</span>
                        </div>
                        <div>
                            <span>Date of Birth : </span>
                            <span>{employee?.dob}</span>
                        </div>
                        <div>
                            <span>Gender : </span>
                            <span>{employee?.gender}</span>
                        </div>
                        <div>
                            <span>Blood Group : </span>
                            <span>{employee?.bloodGroup}</span>
                        </div>
                        <div>
                            <span>Marital Status : </span>
                            <span>{employee?.maritalStatus}</span>
                        </div>
                        <div>
                            <span>Address : </span>
                            <span>{employee?.address}</span>
                        </div>
                    </div>
                </div>
                <Button icon="pi pi-pencil" rounded text raised style={{ width: '35px', height: '35px' }} />
            </div>
            <div>
                <Button onClick={sendResetPasswordEmail} label='Reset Employee Password' size='small' />
            </div>
        </div>
    );
};

export default EmployeeDetails;