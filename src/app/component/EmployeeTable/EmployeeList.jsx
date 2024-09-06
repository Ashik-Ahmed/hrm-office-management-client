"use client"

import React, { useEffect, useRef, useState } from 'react';
import Loading from '../Loading/Loading';
import { getAllDepartments } from '@/libs/department';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Controller, useForm } from 'react-hook-form';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { AiFillPlusSquare } from 'react-icons/ai';
import userPhoto from '../../../../public/images/user.png'
import Link from 'next/link';
import Image from 'next/image';
import { InputTextarea } from 'primereact/inputtextarea';
import { FaTrashCan } from "react-icons/fa6";


const EmployeeList = ({ user, userRoles }) => {

    const [employees, setEmployees] = useState(null)
    const [loading, setLoading] = useState(false)
    const [addUserDialog, setAddUserDialog] = useState(false)
    const [editUserDialog, setEditUserDialog] = useState(false)
    const [deleteUserDialog, setDeleteUserDialog] = useState(false)
    const [department, sertDepartment] = useState([])
    const [selectedDepartment, setSelectedDepartment] = useState(null)
    const [queryDepartment, setQueryDepartment] = useState('')
    const [date, setDate] = useState('')
    const [birthDate, setBirthDate] = useState()
    const [role, setRole] = useState()
    const [gender, setGender] = useState();
    const [image, setImage] = useState()


    const toast = useRef(null)

    const { register, control, formState: { errors }, handleSubmit, reset } = useForm();


    const getDepartments = async () => {
        const departments = await getAllDepartments(user?.accessToken)

        sertDepartment(departments?.data)
        // department.push({ departmentName: 'All', })
    }

    useEffect(() => {
        if (user) {
            getDepartments();
        }
    }, [user])


    const fetchAllUsers = (queryDepartment) => {
        setLoading(true)
        console.log("Access Token: ", user?.accessToken);
        fetch(`http://localhost:5000/api/v1/employee?department=${queryDepartment?.departmentName || 'All'}`, {
            headers: {
                'Authorization': `Bearer ${user?.accessToken}`
            }
        })
            .then(res => res.json())
            .then(data => {
                setEmployees(data?.data?.employees)
                console.log(data);
                setLoading(false)
            })
    }

    useEffect(() => {
        if (user) {
            fetchAllUsers(queryDepartment)
        }
    }, [user, queryDepartment])


    const handlePhotoChange = (event) => {
        setImage(event.target.files[0]);
    };

    //add user form submission functionality
    const handleAddUser = async (data) => {

        setLoading(true);

        data.userRole = role?._id;

        // Remove empty fields 
        const updatedUserData = Object.entries(data).reduce((acc, [key, value]) => {
            if (value !== "" && value !== undefined && value !== null) {
                acc[key] = value;
            }
            return acc;
        }, {});


        const { photo, ...userData } = updatedUserData;

        try {
            if (image) {
                console.log('inside with image');
                const userPhoto = new FormData()
                userPhoto.append('image', image)

                await fetch('https://api.imgbb.com/1/upload?key=a0bd0c6e9b17f5f8fa7f35d20163bdf3', {
                    method: 'POST',
                    body: userPhoto
                })
                    .then(res => res.json())
                    .then(data => {
                        console.log(data);

                        if (data?.data?.url) {
                            userData.image = data.data.url
                            fetch('http://localhost:5000/api/v1/employee', {
                                method: 'POST',
                                headers: {
                                    'content-type': 'application/json',
                                    'Authorization': `Bearer ${user?.accessToken}`
                                },
                                body: JSON.stringify(userData)
                            })
                                .then(res => res.json())
                                .then(data => {
                                    if (data.status == 'Success') {
                                        console.log(data);
                                        reset();
                                        setRole(null);
                                        setDate(null)
                                        setImage(null)
                                        fetchAllUsers()
                                        setLoading(false)
                                        setAddUserDialog(false)
                                        toast.current.show({ severity: 'success', summary: 'Success', detail: 'Employee profile created', life: 3000 });
                                    }
                                    else {
                                        console.log(data);
                                        reset();
                                        setRole(null);
                                        setDate(null)
                                        setImage(null)
                                        fetchAllUsers()
                                        setLoading(false)
                                        setAddUserDialog(false)
                                        toast.current.show({ severity: 'error', summary: 'Failed!', detail: 'Please try again.', life: 3000 });
                                    }
                                })
                        }
                    })
            }
            else {
                setLoading(true)
                console.log('inside without image');
                fetch('http://localhost:5000/api/v1/employee', {
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json',
                        'Authorization': `Bearer ${user?.accessToken}`
                    },
                    body: JSON.stringify(userData)
                })
                    .then(res => res.json())
                    .then(data => {
                        if (data.status == 'Success') {
                            console.log(data);
                            reset();
                            setRole(null);
                            setDate(null)
                            setImage(null)
                            fetchAllUsers()
                            setLoading(false)
                            setAddUserDialog(false)
                            toast.current.show({ severity: 'success', summary: 'Success', detail: 'Employee profile created', life: 3000 });
                        }
                        else {
                            console.log(data);
                            reset();
                            setRole(null);
                            setDate(null)
                            setImage(null)
                            fetchAllUsers()
                            setLoading(false)
                            setAddUserDialog(false)
                            toast.current.show({ severity: 'error', summary: 'Failed!', detail: `${data?.error}`, life: 3000 });
                        }
                    })
            }


        } catch (error) {
            console.error('Error occurred during image upload:', error);
            reset();
            setRole(null);
            setDate(null)
            setImage(null)
            fetchAllUsers()
            setLoading(false)
            setAddUserDialog(false)
            toast.current.show({ severity: 'error', summary: 'Failed!', detail: 'Photo upload failed', life: 3000 });
        }
    }


    //delete user
    const handleDeleteUser = () => {

        setLoading(true)
        // console.log('user delete', deleteUserDialog.firstName);

        fetch(`http://localhost:5000/api/v1/employee/${deleteUserDialog._id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${user?.accessToken}`
            }
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                if (data.data.deletedCount > 0) {
                    fetchAllUsers()
                    setDeleteUserDialog(false);
                    setLoading(false)
                    toast.current.show({ severity: 'success', summary: 'Success', detail: 'Employee deleted.', life: 3000 });
                }
                else {
                    setDeleteUserDialog(false);
                    setLoading(false);
                    toast.current.show({ severity: 'error', summary: 'Failed!', detail: 'Please try again', life: 3000 });
                }
            })
    }

    if (loading) {
        return <Loading />
    }

    return (
        <div>
            <Toast ref={toast} />

            {/* Employee Data Table  */}
            {/* <EmployeeTable users={employees} fetchAllUsers={fetchAllUsers} setAddUserDialog={setAddUserDialog} setDeleteUserDialog={setDeleteUserDialog} department={department} queryDepartment={queryDepartment} setQueryDepartment={setQueryDepartment} /> */}

            {/* add user dialog  */}
            <Dialog header="Add Employee" visible={addUserDialog} style={{ width: '50vw' }} onHide={() => { setAddUserDialog(false); setDate(null); setRole(null); reset(); setSelectedDepartment('') }}>

                <form onSubmit={handleSubmit(handleAddUser)} className='mt-2'>

                    <div className='w-full'>
                        <label htmlFor="department">Department</label>
                        <Dropdown
                            {...register("department", { required: "Department is required" })}
                            id='department' value={selectedDepartment} onChange={(e) => { setSelectedDepartment(e.value); console.log(e.value); }} options={department} optionLabel='departmentName' showClear placeholder="Select Department*" className="w-full placeholder-opacity-20" />
                        {errors.departemnt?.type === 'required' && <span className='text-xs text-red-500' role="alert">{errors.departemnt.message}</span>}
                    </div>
                    <div className='mt-2 flex gap-x-4'>
                        <div className="w-full">
                            <label htmlFor="employeeId">Employee ID*</label>
                            <InputText
                                {...register("employeeId", { required: "Employee ID is required" })}
                                id='employeeId' keyfilter="int" placeholder="Employee ID*" className='w-full' />
                            {errors.employeeId?.type === 'required' && <span className='text-xs text-red-500' role="alert">{errors.employeeId.message}</span>}
                        </div>
                        <div className='w-full'>
                            <label htmlFor="joiningDate">Joining Date*</label>
                            {/* <Calendar value={date} onChange={(e) => setDate(e.value)} dateFormat="dd/mm/yy" /> */}

                            {/* <Calendar value={date} onChange={(e) => setDate(e.value)} dateFormat="dd/mm/yy" placeholder='Joining Date' className='w-full' /> */}
                            <Controller
                                name="joiningDate"
                                control={control}
                                rules={{ required: "Joining date is required" }}
                                render={({ field }) => (
                                    <Calendar
                                        id='joiningDate'
                                        value={date}
                                        onChange={(e) => { setDate(e.value); field.onChange(e.value) }}
                                        placeholder='Joining date*'
                                        className='w-full'
                                    />
                                )}
                            />
                            {errors.joiningDate?.type === 'required' && <span className='text-xs text-red-500 block' role="alert">{errors.joiningDate.message}</span>}
                        </div>
                    </div>
                    <div className='mt-2 flex gap-x-4'>
                        <div className='w-full'>
                            <label htmlFor="firstName">First Name*</label>
                            <InputText
                                {...register("firstName", { required: "First Name is required" })}
                                id='firstName' type='text' placeholder="First Name*" className='w-full' />
                            {errors.firstName?.type === 'required' && <span className='text-xs text-red-500' role="alert">{errors.firstName.message}</span>}
                        </div>
                        <div className='w-full'>
                            <label htmlFor="lastName">Last Name*</label>
                            <InputText
                                {...register("lastName", { required: "Last Name is required" })}
                                id='lastName' type='text' placeholder="Last Name*" className='w-full' />
                            {errors.lastName?.type === 'required' && <span className='text-xs text-red-500' role="alert">{errors.lastName.message}</span>}
                        </div>
                    </div>
                    <div className='mt-2 flex gap-x-4'>
                        <div className='w-full'>
                            <label htmlFor="email">Email*</label>
                            <InputText
                                {...register("email", { required: "Email is required" })}
                                id='email' type='email' placeholder="Email*" className='w-full' />
                            {errors.email?.type === 'required' && <span className='text-xs text-red-500' role="alert">{errors.email.message}</span>}
                        </div>
                        <div className='w-full'>
                            <label htmlFor="mobile">Mobile*</label>
                            <InputText
                                {...register("mobile", { required: "Mobile no. is required" })}
                                id='mobile' type='text' placeholder="Mobile*" className='w-full' />
                            {errors.mobile?.type === 'required' && <span className='text-xs text-red-500' role="alert">{errors.mobile.message}</span>}
                        </div>
                    </div>
                    <div className='mt-2 flex gap-x-4'>
                        <div className='w-full'>
                            <label htmlFor="designation">Designation*</label>
                            <InputText
                                {...register("designation", { required: "Designation is required" })}
                                id='designation' type='text' placeholder="Designation*" className='w-full' />
                            {errors.designation?.type === 'required' && <span className='text-xs text-red-500' role="alert">{errors.designation.message}</span>}
                        </div>
                        <div className='w-full'>
                            <label htmlFor="userRole">User Role*</label>
                            <Dropdown
                                {...register("userRole", { required: "Role is required" })}
                                id='userRole' value={role} onChange={(e) => setRole(e.value)} options={userRoles} optionLabel='roleName' placeholder="Select User Role*" className="w-full placeholder-opacity-20" />
                            {errors.userRole?.type === 'required' && <span className='text-xs text-red-500' role="alert">{errors.userRole.message}</span>}
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
                                        placeholder={"Date of birth"}
                                        className='w-full'
                                    />
                                )}
                            />
                        </div>
                        <div className='w-full'>
                            <label htmlFor="gender">Gender</label>
                            <Dropdown
                                {...register("gender")}
                                id='gender' value={gender} onChange={(e) => { setGender(e.value); }} options={[{ label: 'Male', value: 'Male' }, { label: 'Female', value: 'Female' }]} showClear placeholder={"Select Gender"} className="w-full placeholder-opacity-20" />
                        </div>
                    </div>
                    <div className='mt-2 flex gap-x-4'>
                        <div className='w-full'>
                            <label htmlFor="bloodGroup">Blood Group</label>
                            <InputText
                                {...register("bloodGroup")}
                                id='bloodGroup' type='text' placeholder={"Blood Group"} className='w-full' />
                        </div>
                        <div className='w-full'>
                            <label htmlFor="address">Address</label>
                            <InputTextarea
                                {...register("address")}
                                id='address' type='text' placeholder={"Address"} className='w-full' />
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



            {/* user delete modal */}
            <Dialog header="Delete Confirmation" visible={deleteUserDialog} onHide={() => setDeleteUserDialog(false)} style={{ width: '25vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }}>

                {
                    loading &&
                    <Loading />
                }

                <p className="m-0">
                    Delete user: {deleteUserDialog.firstName} {deleteUserDialog.lastName} ?
                </p>
                <div className='md:flex justify-end gap-x-2 mt-8'>
                    <Button onClick={() => setDeleteUserDialog(false)} label='Cancel' className='p-button p-button-sm p-button-info' />
                    <Button onClick={handleDeleteUser} label='Delete' className='p-button p-button-sm p-button-danger' />
                </div>
            </Dialog>


            <div className='flex justify-between items-center mb-1 px-2 mx-auto'>
                <div className='flex items-center gap-x-2'>
                    <h3 className='font-light'>EMPLOYEE LIST</h3>
                    {/* <h1 className="text-2xl font-bold mb-4">EMPLOYEE LIST</h1> */}
                    {/* <Button onClick={() => setAddUserDialog(true)} icon="pi pi-plus" className='p-button p-button-sm p-button-info' /> */}
                    <AiFillPlusSquare onClick={() => setAddUserDialog(true)} size={25} color='#8C239E' className='cursor-pointer' />
                </div>
                <div>
                    <Dropdown value={queryDepartment} onChange={(e) => setQueryDepartment(e.value)} showClear options={department} optionLabel='departmentName' placeholder="Department" className="w-full placeholder-opacity-20" />
                </div>
                {/* <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Search" className='p-inputtext-sm' />
                </span> */}
            </div>

            {/* employee table  */}
            <div className="container mx-auto p-2" >
                {
                    loading ?
                        <Loading />
                        :
                        employees?.length > 0 ?
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {
                                    employees?.map((employee) => (
                                        <div key={employee?._id} className="bg-white p-4 rounded-md hover:shadow-violet-400 hover:translate-x-1 hover:-translate-y-1 hover:shadow-xl transition duration-300 h-full">
                                            {
                                                user.role === "Super Admin" && <button className='bg-red-400 hover:bg-red-500 text-white p-1 rounded mb-1' onClick={() => setDeleteUserDialog(employee)}><FaTrashCan /></button>
                                            }
                                            <Link href={`/employee/${employee?._id}`} >
                                                <Image
                                                    src={employee.image || userPhoto}
                                                    alt={employee.name}
                                                    className="w-full h-40 object-contain mb-2 rounded-md"
                                                    width={200}
                                                    height={200}
                                                    priority
                                                />
                                                <h2 className="text-lg font-semibold mb-1">{employee.firstName + " " + employee.lastName}</h2>
                                                <p className="text-sm text-gray-500">{employee.designation}</p>
                                                <p>{employee.department}</p>
                                            </Link >
                                        </div>
                                    ))
                                }
                            </div >
                            :
                            <div className="bg-white p-4 rounded-md h-full mx-auto text-center">
                                <i className="pi pi-exclamation-triangle text-red-500" style={{ fontSize: '3rem' }}></i>
                                <p className='text-2xl text-gray-600'>No Employee Found</p>
                            </div>
                }
            </div >
        </div >
    );
};

export default EmployeeList;