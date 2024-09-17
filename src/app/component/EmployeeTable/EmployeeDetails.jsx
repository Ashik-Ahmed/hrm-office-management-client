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
import { getAllDepartments, getAllRoles } from '@/libs/department';
import { InputTextarea } from 'primereact/inputtextarea';


const EmployeeDetails = ({ id, user }) => {

    const toast = useRef(null)

    const { register, control, formState: { errors }, handleSubmit, reset } = useForm();

    const [employee, setEmployee] = useState(user)
    const [loading, setLoading] = useState(false)

    const [editUserDialog, setEditUserDialog] = useState(false)
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [department, sertDepartment] = useState([]);
    const [roles, setRoles] = useState([]);
    const [role, setRole] = useState();
    const [image, setImage] = useState();
    const [date, setDate] = useState('');
    const [gender, setGender] = useState();
    const [maritalStatus, setMaritalStatus] = useState();
    const [birthDate, setBirthDate] = useState();
    const [formValues, setFormValues] = useState({});


    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormValues((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));
    };


    const userRoles = ['Admin', 'Employee'];

    const getDepartments = async () => {
        const departments = await getAllDepartments(user?.accessToken)

        sertDepartment(departments?.data)
        // department.push({ departmentName: 'All', })
    }

    const getRoles = async () => {
        const roles = await getAllRoles(user?.accessToken)
        setRoles(roles?.data)
    }


    const getEmployee = async () => {
        setLoading(true)
        const url = `${process.env.API_SERVER_UR}/employee/${id}`;

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
            getRoles();
        }
    }, [id, user])

    const sendResetPasswordEmail = () => {

        const resetPasswordUrl = `${window.location.origin}/auth/reset-password`;
        console.log(resetPasswordUrl);
        fetch(`${process.env.API_SERVER_UR}/employee/send-password-reset-email/${employee.email}`, {
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
        data.userRole = role?._id;

        // Remove empty fields 
        const updatedUserData = Object.entries(data).reduce((acc, [key, value]) => {
            if (value !== "" && value !== undefined && value !== null) {
                acc[key] = value;
            }
            return acc;
        }, {});

        fetch(`${process.env.API_SERVER_UR}/employee/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user?.accessToken}`
            },
            body: JSON.stringify(updatedUserData)
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                if (data.status == 'Success') {
                    getEmployee();
                    setEditUserDialog(false);
                    resetFormData();
                    toast.current.show({ severity: 'success', summary: 'Success', detail: 'Employee updated successfully', life: 3000 });
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
            <div className="md:flex gap-x-2 w-full bg-white p-4 my-2 rounded-md shadow-xl">
                <div className='md:flex items-start gap-x-4 md:w-1/2 rounded-md'>
                    <div className='min-w-[150px] min-h-[150px]  flex justify-center items-center'>
                        <Image src={employee?.image || userPhoto} width={200} height={200} alt='user photo' priority className='rounded-full shadow-lg' style={{ width: '130px', height: '130px' }} />
                    </div>
                    <div className='absolute top-10 right-10 md:hidden'>
                        <Button onClick={() => setEditUserDialog(true)} icon="pi pi-pencil" rounded text raised style={{ width: '35px', height: '35px' }} />
                    </div>
                    <div className='flex flex-col gap-8 w-full shadow-lg md:shadow-none p-2'>
                        <div>
                            {/* <h3 className='text-xl font-bold'>{viewUserDialog.firstName} {viewUserDialog.lastName}</h3>
                            <p>{viewUserDialog.designation}</p> */}
                            <h3 className='text-2xl font-bold text-gray-700'>{employee?.firstName} {employee?.lastName}</h3>
                            <p className='text-gray-500 font-bold text-sm'>{employee?.department}</p>
                            <p className='text-gray-500 text-sm'>{employee?.designation}</p>
                        </div>
                        <div>
                            <p className='text-sm font-bold text-gray-700'>Employee ID: {employee?.employeeId}</p>
                            <p className='text-sm font-bold text-gray-500'>User Role: {employee?.userRole}</p>
                            <p className='text-sm text-gray-500'>Joining Date: {employee?.joiningDate}</p>
                        </div>
                    </div>
                </div>

                <div className="hidden md:block">
                    <Divider layout="vertical" />
                </div>

                <div className='md:w-1/2 flex flex-col justify-between rounded-md shadow-lg md:shadow-none p-2 mt-4 md:mt-0'>
                    <div className='flex flex-col gap-2 font-semibold text-gray-700 text-sm'>
                        <div className='flex'>
                            <span className='w-1/3'>Phone : </span>
                            <span className='w-2/3'>{employee?.mobile}</span>
                        </div>
                        <div className='flex'>
                            <span className='w-1/3'>Email : </span>
                            <span className='w-2/3'>{employee?.email}</span>
                        </div>
                        <div className='flex'>
                            <span className='w-1/3'>Date of Birth : </span>
                            <span className='w-2/3'>{employee?.birthDate?.split('T')[0]}</span>
                        </div>
                        <div className='flex'>
                            <span className='w-1/3'>Gender : </span>
                            <span className='w-2/3'>{employee?.gender}</span>
                        </div>
                        <div className='flex'>
                            <span className='w-1/3'>Blood Group : </span>
                            <span className='w-2/3'>{employee?.bloodGroup}</span>
                        </div>
                        <div className='flex'>
                            <span className='w-1/3'>Address : </span>
                            <span className='w-2/3'>{employee?.address}</span>
                        </div>
                    </div>
                </div>
                <div className='hidden md:block'>
                    <Button onClick={() => setEditUserDialog(true)} icon="pi pi-pencil" rounded text raised style={{ width: '35px', height: '35px' }} />
                </div>
            </div>
            <div>
                <Button onClick={sendResetPasswordEmail} label='Reset Employee Password' size='small' />
            </div>

            {/* Edit Employee Dialog  */}
            <Dialog header="Edit Employee Data" visible={editUserDialog} style={{ width: '50vw' }} onHide={() => { setEditUserDialog(false); resetFormData() }}>

                <form onSubmit={handleSubmit(handleEditEmployee)} className='mt-2'>

                    <div className='w-full'>
                        <label htmlFor="department">Department</label>
                        <Dropdown
                            {...register("department")}
                            id='department' value={selectedDepartment} onChange={(e) => { setSelectedDepartment(e.value); }} options={department} optionLabel='departmentName' showClear placeholder={employee?.department || "Select Department*"} className="w-full placeholder-opacity-20" />
                    </div>
                    <div className='mt-2 flex gap-x-4'>
                        <div className="w-full">
                            <label htmlFor="employeeId">Employee ID</label>
                            <InputText
                                {...register("employeeId")}
                                id='employeeId'
                                keyfilter="int" placeholder={employee?.employeeId || "Employee ID"} className='w-full' />
                        </div>
                        <div className='w-full'>
                            <label htmlFor="joiningDate">Joining Date</label>
                            <Controller
                                id="joiningDate"
                                name="joiningDate"
                                control={control}
                                render={({ field }) => (
                                    <Calendar
                                        value={date}
                                        onChange={(e) => { setDate(e.value); field.onChange(e.value); }}
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
                            <label htmlFor="firstName">First Name</label>
                            <InputText
                                {...register("firstName")}
                                id='firstName' type='text' placeholder={employee?.firstName || "First Name"} className='w-full' />
                        </div>
                        <div className='w-full'>
                            <label htmlFor="lastName">Last Name</label>
                            <InputText
                                {...register("lastName")}
                                id='lastName' type='text' placeholder={employee?.lastName || "Last Name"} className='w-full' />
                        </div>
                    </div>
                    <div className='mt-2 flex gap-x-4'>
                        <div className='w-full'>
                            <label htmlFor="email">Email</label>
                            <InputText
                                {...register("email")}
                                id='email' type='email' placeholder={employee?.email || "Email"} className='w-full' />
                        </div>
                        <div className='w-full'>
                            <label htmlFor="mobile">Mobile</label>
                            <InputText
                                {...register("mobile")}
                                id='mobile' type='text' placeholder={employee?.mobile || "Mobile"} className='w-full' />
                        </div>
                    </div>
                    <div className='mt-2 flex gap-x-4'>
                        <div className='w-full'>
                            <label htmlFor="designation">Designation</label>
                            <InputText
                                {...register("designation")}
                                id='designation' type='text' placeholder={employee?.designation || "Designation"} className='w-full' />
                        </div>
                        <div className='w-full'>
                            <label htmlFor="userRole">Role</label>
                            <Dropdown
                                {...register("userRole")}
                                id='userRole' value={role} onChange={(e) => { setRole(e.value); }} options={roles} optionLabel='roleName' showClear placeholder={employee?.userRole || "Select Role"} className="w-full placeholder-opacity-20" />
                        </div>
                    </div>
                    <div className='mt-2 flex gap-x-4'>
                        <div className='w-full'>
                            <label htmlFor="birthDate">Date of Birth</label>
                            <Controller
                                id="birthDate"
                                name="birthDate"
                                control={control}
                                render={({ field }) => (
                                    <Calendar
                                        value={birthDate}
                                        onChange={(e) => { setBirthDate(e.value); field.onChange(e.value); }}
                                        dateFormat="dd/mm/yy"
                                        placeholder={employee?.birthDate || "Date of birth"}
                                        className='w-full'
                                    />
                                )}
                            />
                        </div>
                        <div className='w-full'>
                            <label htmlFor="gender">Gender</label>
                            <Dropdown
                                {...register("gender")}
                                id='gender' value={gender} onChange={(e) => { setGender(e.value); handleChange }} options={[{ label: 'Male', value: 'Male' }, { label: 'Female', value: 'Female' }]} showClear placeholder={employee?.gender || "Select Gender"} className="w-full placeholder-opacity-20" />
                        </div>
                    </div>
                    <div className='mt-2 flex gap-x-4'>
                        <div className='w-full'>
                            <label htmlFor="bloodGroup">Blood Group</label>
                            <InputText
                                {...register("bloodGroup")}
                                id='bloodGroup' type='text' placeholder={employee?.bloodGroup || "Blood Group"} className='w-full' />
                        </div>
                        <div className='w-full'>
                            <label htmlFor="address">Address</label>
                            <InputTextarea
                                {...register("address")}
                                id='address' type='text' placeholder={employee?.address || "Address"} className='w-full' />
                        </div>
                    </div>
                    <div className='mt-2'>
                        <label htmlFor="photo">Employee Photo</label>
                        <input onChange={handlePhotoChange} id='photo' name='file' type="file" className='w-full border border-violet-600' />
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