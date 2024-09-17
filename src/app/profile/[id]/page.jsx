'use client'

import Loading from '@/app/component/Loading/Loading';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import profilePhoto from '../../../../public/images/user.png'
import { Button } from 'primereact/button'
import { getEmployeeById } from '@/libs/employee';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { getAllDepartments } from '@/libs/department';
import { Controller, useForm } from 'react-hook-form';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { Password } from 'primereact/password';
import UpdateProfile from '@/app/component/Profile/UpdateProfile';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const Profile = ({ params: { id } }) => {

    const { data } = useSession()
    const router = useRouter()
    const toast = useRef()
    const { register, control, formState: { errors }, handleSubmit, reset } = useForm();

    const [employee, setEmployee] = useState(null);
    const [updateForm, setUpdateForm] = useState(false);
    const [department, setDepartment] = useState([]);
    const [changePassword, setChangePassword] = useState(false);
    const [currentPassError, setCurrentPassError] = useState('')
    const [newPassError, setNewPassError] = useState('')


    if (data) {
        // console.log(data.user.name);
        if (data.user._id !== id) {
            router.push('/')
            // console.log(id);
            // console.log(user._id);
        }
    }

    const getEmployeeData = async (empId) => {
        const empData = await getEmployeeById(empId);
        setEmployee(empData)
    }

    const getDepartmentData = async () => {
        const dept = await getAllDepartments();
        console.log(dept);
        setDepartment(dept.data)
    }

    useEffect(() => {
        getEmployeeData(id);
        getDepartmentData();
    }, [id])

    const handleChangePassword = (data) => {
        console.log(data);

        fetch(`${process.env.API_SERVER_UR}/employee/updatePassword/${employee.email}`, {
            method: "PATCH",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(data)
        })
            .then(res => res.json())
            .then((data => {
                if (data.status == "Success") {
                    setChangePassword(false)
                    reset()
                    toast.current.show({ severity: 'success', summary: 'Success', detail: 'Password Updated', life: 3000 });
                }
                else {
                    console.log("Failed to update password");
                    console.log(data.error);
                    toast.current.show({ severity: 'error', summary: 'Failed!', detail: `${data.error}`, life: 3000 });
                }
            }))

    }

    if (!id || !employee || !department) {
        return <Loading />
    }

    return (
        <div className='flex'>
            <Toast ref={toast} />
            <div class="bg-white rounded w-1/3">
                <div className='p-2 mx-auto text-center border-b-4'>
                    <Image class="mx-auto rounded-md w-40 h-40 object-contain" width='120' height='120' src={employee?.image || profilePhoto} alt='User Photo' priority />
                </div>
                <div className='mt-0 pl-4 w-full'>
                    <div className='text-left py-4 mt-4'>
                        <div className='flex items-baseline justify-between'>
                            <p className='font-semibold w-1/3'>Name</p>
                            <span className='w-2/3'>: {employee?.firstName + ' ' + employee?.lastName}</span>
                        </div>
                        <div className='flex items-baseline justify-between mt-1'>
                            <p className='font-semibold w-1/3'>Email</p>
                            <span className='w-2/3'>: {employee?.email || 'N/A'}</span>
                        </div>
                        <div className='flex items-baseline justify-between mt-1'>
                            <p className='font-semibold w-1/3'>Employee Id</p>
                            <span className='w-2/3'>: {employee?.employeeId || 'N/A'}</span>
                        </div>
                        <div className='flex items-baseline justify-between mt-1'>
                            <p className='font-semibold w-1/3'>Department</p>
                            <span className='w-2/3'>: {employee?.department || 'N/A'}</span>
                        </div>
                        <div className='flex items-baseline justify-between mt-1'>
                            <p className='font-semibold w-1/3'>Designation</p>
                            <span className='w-2/3'>: {employee?.designation || 'N/A'}</span>
                        </div>
                        <div className='flex items-baseline justify-between mt-1'>
                            <p className='font-semibold w-1/3'>Role</p>
                            <span className='w-2/3'>: {employee?.userRole || 'N/A'}</span>
                        </div>
                        <div className='flex items-baseline justify-between mt-1'>
                            <p className='font-semibold w-1/3'>Joining date</p>
                            <span className='w-2/3'>: {employee?.joiningDate || 'N/A'}</span>
                        </div>
                        <div className='flex items-baseline justify-between mt-1'>
                            <p className='font-semibold w-1/3'>Phone</p>
                            <span className='w-2/3'>: {employee?.mobile || 'N/A'}</span>
                        </div>
                        <div className='mt-2'>
                            <p onClick={() => setChangePassword(true)} className='cursor-pointer link inline text-red-500'>Change Password</p>
                        </div>
                    </div>
                    <div className='text-center my-2'>
                        <Button onClick={() => setUpdateForm(true)} label='Edit Profile' icon='pi pi-user-edit' className='p-button-info p-button-sm normal-case' />
                    </div>
                </div>
            </div>

            {/* change password */}
            <Dialog header="Change Password" visible={changePassword} onHide={() => {
                setChangePassword(false);
                setCurrentPassError('');
                setNewPassError('');
                reset();
            }} breakpoints={{ '960px': '75vw' }} style={{ width: '25vw' }} >
                <form onSubmit={handleSubmit(handleChangePassword)} className='flex flex-col gap-2 justify-center items-center'>
                    <div className=''>
                        <div className='rounded-md mt-2 '>
                            <div className='flex flex-col'>
                                {/* <Password
                                    {...register('currentPassword', { required: "Current Password is required" })}
                                    toggleMask feedback={false} placeholder='Current Password' /> */}
                                <Controller
                                    name="currentPassword"
                                    control={control}
                                    defaultValue=""
                                    rules={{ required: "Current Password is required" }}
                                    render={({ field }) => (
                                        <Password
                                            {...field}
                                            toggleMask
                                            feedback={false}
                                            placeholder='Current Password'
                                        />
                                    )}
                                />
                                {errors.currentPassword?.type === 'required' && <span className='text-xs text-red-500' role="alert">{errors.currentPassword.message}</span>}
                            </div>

                            {/* <InputText type={currentPassView ? "text" : "password"} name='currentPassword' placeholder='Current Password' className='input  bg-gray-200 text-gray-700 w-full' required />
                                <label onClick={() => setCurrentPassView(!currentPassView)} className='px-2 inline-block'>{currentPassView ? <HiEye /> : <HiEyeOff />}</label> */}
                        </div>
                        {
                            currentPassError &&
                            <div>
                                <p className='text-xs text-red-500 text-left'>Current password is wrong</p>
                            </div>
                        }
                    </div>
                    <div className='rounded-md mt-2'>
                        <div className='flex flex-col'>
                            <Controller
                                name="newPassword"
                                control={control}
                                defaultValue=""
                                rules={{ required: "New Password is required" }}
                                render={({ field }) => (
                                    <Password
                                        {...field}
                                        toggleMask
                                        feedback={false}
                                        placeholder='New Password'
                                    />
                                )}
                            />
                            {/* <Password
                                {...register('newPassword', { required: "New Password is required" })}
                                toggleMask placeholder='New Password' /> */}
                            {errors.newPassword?.type === 'required' && <span className='text-xs text-red-500' role="alert">{errors.newPassword.message}</span>}
                        </div>
                        {/* <InputText type={newPassView ? "text" : "password"} name='newPassword' placeholder='New Password' className='input  bg-gray-200 text-gray-700 w-full' required />
                        <label onClick={() => setNewPassView(!newPassView)} className='px-2 inline-block'>{newPassView ? <HiEye /> : <HiEyeOff />}</label> */}
                    </div>
                    <div className='rounded-md mt-2'>
                        <div className='flex flex-col'>
                            <Controller
                                name="confirmPassword"
                                control={control}
                                defaultValue=""
                                rules={{ required: "Re-enter the new password" }}
                                render={({ field }) => (
                                    <Password
                                        {...field}
                                        toggleMask
                                        feedback={false}
                                        placeholder='Re-type New Password'
                                    />
                                )}
                            />
                            {/* <Password
                                {...register('confirmPassword', { required: "Re-enter the new password" })}
                                toggleMask placeholder='Re-type New Password' /> */}
                            {errors.confirmPassword?.type === 'required' && <span className='text-xs text-red-500' role="alert">{errors.confirmPassword.message}</span>}
                        </div>
                        {/* <InputText type={confirmPassView ? "text" : "password"} name='confirmPassword' placeholder='Confirm New Password' className='input  bg-gray-200 text-gray-700 w-full' required />
                            <label onClick={() => setConfirmPassView(!confirmPassView)} className='px-2 inline-block'>{confirmPassView ? <HiEye /> : <HiEyeOff />}</label> */}
                    </div>
                    <div className='mt-4'>
                        <Button type='submit' label='Submit' className="p-button-info p-button-sm normal-case" />
                    </div>
                </form>
            </Dialog>

            {
                updateForm && <UpdateProfile employee={employee} department={department} getEmployeeData={getEmployeeData} setUpdateForm={setUpdateForm} toast={toast} />
            }
        </div>
    );
};

export default Profile;