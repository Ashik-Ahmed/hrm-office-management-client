"use client"

import Image from 'next/image';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import React, { useEffect, useRef, useState } from 'react';
import Loading from '../Loading/Loading';
import userPhoto from '../../../../public/images/user.png'
import { redirect } from 'next/navigation';

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
            <div className="flex gap-x-2 w-full bg-white p-2 my-2 rounded-md shadow-xl">
                <div className='flex items-start gap-x-4 w-3/5 mr-8'>
                    <div className='min-w-[150px] min-h-[150px]  flex justify-center items-center'>
                        <Image src={employee?.image || userPhoto} width={150} height={150} alt='user photo' priority className='rounded-md shadow-lg border max-w-[200px] max-h-[200px]' />
                    </div>
                    <div className='flex flex-col gap-8'>
                        <div>
                            {/* <h3 className='text-xl font-bold'>{viewUserDialog.firstName} {viewUserDialog.lastName}</h3>
                            <p>{viewUserDialog.designation}</p> */}
                            <h3 className='text-xl font-bold'>{employee?.firstName} {employee?.lastName}</h3>
                            <p>{employee?.designation}</p>
                        </div>
                        <div>
                            <h5 className='font-semibold'>About</h5>
                            <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dignissimos a delectus quos vero accusamus consequatur suscipit laudantium consectetur totam adipisci!</p>
                        </div>
                    </div>
                </div>
                <div className='w-2/5 flex flex-col justify-between'>

                    <div>
                        <h5>Highter Education</h5>
                        <p className='font-semibold'>Master in Science</p>
                    </div>
                    <div>
                        <h5>Salary Range</h5>
                        <p className='font-semibold'>$120,000 - 140,000</p>
                    </div>

                    <div>
                        <Button onClick={sendResetPasswordEmail} label='Reset employee Password' size='small' />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmployeeDetails;