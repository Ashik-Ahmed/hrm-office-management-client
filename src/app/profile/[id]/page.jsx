'use client'

import Loading from '@/app/component/Loading/Loading';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import profilePhoto from '../../../../public/images/user.png'
import { Button } from 'primereact/button'
import { getEmployeeById } from '@/libs/employee';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { getAllDepartments } from '@/libs/department';
import { useForm } from 'react-hook-form';

const Profile = ({ params: { id } }) => {

    const { register, control, formState: { errors }, handleSubmit, reset } = useForm();

    const [employee, setEmployee] = useState(null);
    const [updateForm, setUpdateForm] = useState(false);
    const [department, setDepartment] = useState([])
    const [selectedDepartment, setSelectedDepartment] = useState('')


    const getEmployeeData = async (empId) => {
        const empData = await getEmployeeById(empId);
        setEmployee(empData)
    }

    const getDepartmentData = async () => {
        const dept = await getAllDepartments();
        console.log(dept);
        setDepartment(dept)
    }

    useEffect(() => {
        getEmployeeData(id);
        getDepartmentData();
    }, [id])

    const handleUpdateProfile = (data) => {

        console.log(data);
    }

    if (!id || !employee) {
        return <Loading />
    }

    return (
        <div className='flex'>
            <div class="bg-white rounded w-1/3">
                <div className='p-2 mx-auto text-center'>
                    <Image class="mx-auto rounded-md" width='160' height='160' src={employee?.image || profilePhoto} alt='User Photo' />
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
                            <p className='link inline text-red-500'>Change Password</p>
                        </div>
                    </div>
                    <div className='text-center my-2'>
                        <Button onClick={() => setUpdateForm(true)} label='Edit Profile' icon='pi pi-user-edit' className='p-button-info p-button-sm normal-case' />
                    </div>
                </div>
            </div>

            {
                updateForm &&
                <div className='w-2/3 bg-white rounded m-4 p-4 h-fit'>
                    <p className='text-xl font-bold text-gray-800 inline p-1'>Update Profile</p>

                    <form onSubmit={handleSubmit(handleUpdateProfile)}>
                        <div className='mt-4'>
                            <div className='flex gap-4 justify-between'>
                                <div class="form-control w-full max-w-xs">
                                    <label class="label">
                                        <span class="label-text text-gray-700">First Name</span>
                                    </label>
                                    <InputText
                                        {...register("firstName")}
                                        type="text" placeholder={employee?.firstName || "Type here"} className="w-full max-w-xs  text-gray-700" />
                                </div>
                                <div class="form-control w-full max-w-xs">
                                    <label class="label">
                                        <span class="label-text text-gray-700">Last Name</span>
                                    </label>
                                    <InputText
                                        {...register("lastName")}
                                        type="text" placeholder={employee?.lastName || "Type here"} className="w-full max-w-xs  text-gray-700" />
                                </div>
                            </div>
                            <div className='flex gap-4 justify-between mt-2'>
                                <div class="form-control w-full max-w-xs">
                                    <label class="label">
                                        <span class="label-text text-gray-700">Department</span>
                                    </label>
                                    <Dropdown
                                        {...register("department")}
                                        value={selectedDepartment} onChange={(e) => { setSelectedDepartment(e.value) }} options={department} optionLabel='departmentName' placeholder="Select Department*" className="w-full placeholder-opacity-20" />

                                </div>
                                <div class="form-control w-full max-w-xs">
                                    <label class="label">
                                        <span class="label-text text-gray-700">Designation</span>
                                    </label>
                                    <InputText
                                        {...register("designation")}
                                        type="text" placeholder={employee?.designation || "Type here"} className="w-full max-w-xs  text-gray-700" />
                                </div>
                            </div>
                            <div className='flex gap-4 justify-between mt-2'>
                                <div class="form-control w-full max-w-xs flex flex-col">
                                    <label class="label">
                                        <span class="label-text text-gray-700">Email</span>
                                    </label>
                                    <InputText
                                        {...register("email")}
                                        type="text" placeholder={employee?.email || "Type here"} keyfilter='int' className="w-full max-w-xs  text-gray-700" />
                                </div>

                                <div class="form-control w-full max-w-xs">
                                    <label class="label">
                                        <span class="label-text text-gray-700">Mobile</span>
                                    </label>
                                    <InputText
                                        {...register("mobile")}
                                        type="text" placeholder={employee?.mobile || "Type here"} keyfilter='int' className="w-full max-w-xs  text-gray-700" />
                                </div>
                            </div>
                        </div>
                        <div className='flex justify-end mt-4 gap-x-2'>
                            {/* <button type='submit' className='btn btn-sm bg-primary hover:bg-secondary border-0 my-4'>Update</button> */}
                            <Button label="Cancel" onClick={() => {
                                setUpdateForm(false);
                            }} className="p-button-danger p-button-sm normal-case" />
                            <Button type='submit' label="Submit" className=' p-button-info p-button-sm btn-primary normal-case' />
                        </div>
                    </form>
                </div>
            }
        </div>
    );
};

export default Profile;