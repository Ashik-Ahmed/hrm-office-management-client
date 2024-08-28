"use client"

import Image from 'next/image';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import React, { useEffect, useRef, useState } from 'react';
import Loading from '../Loading/Loading';
import userPhoto from '../../../../public/images/user.png'
import { redirect } from 'next/navigation';
import { Divider } from 'primereact/divider';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { Controller, useForm } from 'react-hook-form';
import { getAllDepartments } from '@/libs/department';
import { InputTextarea } from 'primereact/inputtextarea';

const EmployeeDetails = ({ id, user }) => {

    const toast = useRef(null)

    const { register, control, formState: { errors }, handleSubmit, reset } = useForm();

    const [employee, setEmployee] = useState(user)
    const [loading, setLoading] = useState(false)

    const [editUserDialog, setEditUserDialog] = useState(false)
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [department, sertDepartment] = useState([]);
    const [role, setRole] = useState();
    const [image, setImage] = useState();
    const [date, setDate] = useState('');
    const [gender, setGender] = useState();
    const [maritalStatus, setMaritalStatus] = useState();
    const [birthDate, setBirthDate] = useState();


    const userRoles = ['Admin', 'Employee'];

    const getDepartments = async () => {
        const departments = await getAllDepartments(user?.accessToken)

        sertDepartment(departments?.data)
        // department.push({ departmentName: 'All', })
    }


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
        if (user) {
            getDepartments();
        }
    }, [id, user])

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

    const handlePhotoChange = (event) => {
        setImage(event.target.files[0]);
    };

    const resetFormData = () => {
        reset();
        setDate(null);
        setBirthDate(null);
        setRole(null);
        setGender(null);
        setSelectedDepartment('')
    }

    const handleEditEmployee = (data) => {
        console.log(data);
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
                <Button onClick={() => setEditUserDialog(true)} icon="pi pi-pencil" rounded text raised style={{ width: '35px', height: '35px' }} />
            </div>
            <div>
                <Button onClick={sendResetPasswordEmail} label='Reset Employee Password' size='small' />
            </div>

            {/* Edit Employee Dialog  */}
            <Dialog header="Edit Employee Data" visible={editUserDialog} style={{ width: '50vw' }} onHide={() => { setEditUserDialog(false); resetFormData() }}>

                <form onSubmit={handleSubmit(handleEditEmployee)} className='mt-2'>

                    <div className='w-full'>
                        <Dropdown
                            {...register("department")}
                            value={selectedDepartment} onChange={(e) => { setSelectedDepartment(e.value); console.log(e.value); }} options={department} optionLabel='departmentName' showClear placeholder={employee?.department || "Select Department*"} className="w-full placeholder-opacity-20" />
                    </div>
                    <div className='mt-2 flex gap-x-4'>
                        <div className="w-full">
                            <InputText
                                {...register("employeeId")}
                                keyfilter="int" placeholder={employee?.employeeId || "Employee ID"} className='w-full' />
                        </div>
                        <div className='w-full'>
                            {/* <Calendar value={date} onChange={(e) => setDate(e.value)} dateFormat="dd/mm/yy" /> */}

                            {/* <Calendar value={date} onChange={(e) => setDate(e.value)} dateFormat="dd/mm/yy" placeholder='Joining Date' className='w-full' /> */}
                            <Controller
                                name="joiningDate"
                                control={control}
                                render={({ field }) => (
                                    <Calendar
                                        value={date}
                                        onChange={(e) => { setDate(e.value); field.onChange(e.value) }}
                                        dateFormat="dd/mm/yy"
                                        placeholder={employee?.joiningDate || "Joining Date"}
                                        className='w-full'
                                    />
                                )}
                            />
                        </div>
                    </div>
                    <div className='mt-2 flex gap-x-4'>
                        <div className='w-full'>
                            <InputText
                                {...register("firstName")}
                                type='text' placeholder={employee?.firstName || "First Name"} className='w-full' />
                        </div>
                        <div className='w-full'>
                            <InputText
                                {...register("lastName")}
                                type='text' placeholder={employee?.lastName || "Last Name"} className='w-full' />
                        </div>
                    </div>
                    <div className='mt-2 flex gap-x-4'>
                        <div className='w-full'>
                            <InputText
                                {...register("email")}
                                type='email' placeholder={employee?.email || "Email"} className='w-full' />
                        </div>
                        <div className='w-full'>
                            <InputText
                                {...register("mobile")}
                                type='text' placeholder={employee?.mobile || "Mobile"} className='w-full' />
                        </div>
                    </div>
                    <div className='mt-2 flex gap-x-4'>
                        <div className='w-full'>
                            <InputText
                                {...register("designation")}
                                type='text' placeholder={employee?.designation || "Designation"} className='w-full' />
                        </div>
                        <div className='w-full'>
                            <Dropdown
                                {...register("userRole")}
                                value={role} onChange={(e) => setRole(e.value)} options={userRoles} placeholder={employee?.userRole || "Select Role"} className="w-full placeholder-opacity-20" />
                        </div>
                    </div>
                    <div className='mt-2 flex gap-x-4'>
                        <div className='w-full'>
                            <Calendar
                                value={birthDate}
                                onChange={(e) => { setBirthDate(e.value) }}
                                dateFormat="dd/mm/yy"
                                placeholder={employee?.birthDate || "Date of Birth"}
                                className='w-full'
                            />
                        </div>
                        <div className='w-full'>
                            <Dropdown
                                {...register("gender")}
                                value={gender} onChange={(e) => setGender(e.value)} options={[{ label: 'Male', value: 'Male' }, { label: 'Female', value: 'Female' }]} placeholder={employee?.gender || "Select Gender"} className="w-full placeholder-opacity-20" />
                        </div>
                    </div>
                    <div className='mt-2 flex gap-x-4'>
                        <div className='w-full'>
                            <InputText
                                {...register("bloodGroup")}
                                type='text' placeholder={employee?.bloodGroup || "Blood Group"} className='w-full' />
                        </div>
                        <div className='w-full'>
                            <InputTextarea
                                {...register("address")}
                                type='text' placeholder={employee?.address || "Address"} className='w-full' />
                        </div>
                    </div>
                    <div className='mt-2'>
                        <input onChange={handlePhotoChange} name='file' type="file" className='w-full border border-violet-600' />
                    </div>

                    <div className='mt-4 text-right'>
                        <Button type='submit' label="Submit" className="p-button-sm" loading={loading} />
                    </div>
                </form>
            </Dialog>
        </div>
    );
};

export default EmployeeDetails;