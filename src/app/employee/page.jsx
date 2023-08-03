'use client'

import React, { useEffect, useRef, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { Controller, useForm } from 'react-hook-form';
import { Calendar } from 'primereact/calendar';
import { Toast } from 'primereact/toast';
import Loading from '../component/Loading/Loading';
import EmployeeTable from '../component/EmployeeTable/EmployeeTable';





const Users = () => {

    const [employees, setEmployees] = useState(null)
    const [loading, setLoading] = useState(false)
    const [addUserDialog, setAddUserDialog] = useState(false)
    const [viewUserDialog, setViewUserDialog] = useState(false)
    const [editUserDialog, setEditUserDialog] = useState(false)
    const [deleteUserDialog, setDeleteUserDialog] = useState(false)
    const [date, setDate] = useState('')
    const [role, setRole] = useState()
    const [image, setImage] = useState()


    const toast = useRef(null)

    const { register, control, formState: { errors }, handleSubmit, reset } = useForm();

    const departemnt = ['Management', 'Regulatory Affairs', 'System Engineer (MNP)', 'Tech Support (MNP)', 'NOC (A2P)', 'System Support (A2P)', 'Human Resource', 'Accounts', 'Office Assistant']


    const fetchAllUsers = () => {
        setLoading(true)
        fetch('http://localhost:5000/api/v1/employee')
            .then(res => res.json())
            .then(data => {
                setEmployees(data.data.employees)
                setLoading(false)
            })
    }

    useEffect(() => {
        fetchAllUsers()
    }, [])

    if (!employees) {
        return <Loading />
    }

    const handlePhotoChange = (event) => {
        setImage(event.target.files[0]);
    };

    //add user form submission functionality
    const handleAddUser = async (data) => {

        setLoading(true);

        data.joiningDate = date?.toLocaleDateString("en-GB");
        console.log(data);

        const { photo, ...userData } = data;

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

                        if (data.data.url) {
                            userData.photo = data.data.url
                            fetch('http://localhost:5000/api/v1/employee', {
                                method: 'POST',
                                headers: {
                                    'content-type': 'application/json'
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
                        'content-type': 'application/json'
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
            method: 'DELETE'
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

    return (
        <div className='my-2'>
            <Toast ref={toast} />

            {/* Employee Data Table  */}
            <EmployeeTable users={employees} setAddUserDialog={setAddUserDialog} setViewUserDialog={setViewUserDialog} setDeleteUserDialog={setDeleteUserDialog} />

            {/* add user dialog  */}
            <Dialog header="Add Employee" visible={addUserDialog} style={{ width: '50vw' }} onHide={() => { setAddUserDialog(false); setDate(null); setRole(null); reset() }}>

                <form onSubmit={handleSubmit(handleAddUser)} className='mt-2'>
                    <div className='mt-2 flex gap-x-4'>
                        <div className="w-full">
                            <InputText
                                {...register("employeeId", { required: "Employee ID is required" })}
                                keyfilter="int" placeholder="Employee ID*" className='w-full' />
                            {errors.employeeId?.type === 'required' && <span className='text-xs text-red-500' role="alert">{errors.employeeId.message}</span>}
                        </div>
                        <div className='w-full'>
                            {/* <Calendar value={date} onChange={(e) => setDate(e.value)} dateFormat="dd/mm/yy" /> */}

                            {/* <Calendar value={date} onChange={(e) => setDate(e.value)} dateFormat="dd/mm/yy" placeholder='Joining Date' className='w-full' /> */}
                            <Controller
                                name="joiningDate"
                                control={control}
                                rules={{ required: "Joining date is required" }}
                                render={({ field }) => (
                                    <Calendar
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
                            <InputText
                                {...register("firstName", { required: "First Name is required" })}
                                type='text' placeholder="First Name*" className='w-full' />
                            {errors.firstName?.type === 'required' && <span className='text-xs text-red-500' role="alert">{errors.firstName.message}</span>}
                        </div>
                        <div className='w-full'>
                            <InputText
                                {...register("lastName", { required: "Last Name is required" })}
                                type='text' placeholder="Last Name*" className='w-full' />
                            {errors.lastName?.type === 'required' && <span className='text-xs text-red-500' role="alert">{errors.lastName.message}</span>}
                        </div>
                    </div>
                    <div className='mt-2 flex gap-x-4'>
                        <div className='w-full'>
                            <InputText
                                {...register("email", { required: "Email is required" })}
                                type='email' placeholder="Email*" className='w-full' />
                            {errors.email?.type === 'required' && <span className='text-xs text-red-500' role="alert">{errors.email.message}</span>}
                        </div>
                        <div className='w-full'>
                            <InputText
                                {...register("mobile", { required: "Mobile no. is required" })}
                                type='text' placeholder="Mobile*" className='w-full' />
                            {errors.mobile?.type === 'required' && <span className='text-xs text-red-500' role="alert">{errors.mobile.message}</span>}
                        </div>
                    </div>
                    <div className='mt-2 flex gap-x-4'>
                        <div className='w-full'>
                            <InputText
                                {...register("designation", { required: "Designation is required" })}
                                type='text' placeholder="Designation*" className='w-full' />
                            {errors.designation?.type === 'required' && <span className='text-xs text-red-500' role="alert">{errors.designation.message}</span>}
                        </div>
                        <div className='w-full'>
                            <Dropdown
                                {...register("departemnt", { required: "Department is required" })}
                                value={role} onChange={(e) => setRole(e.value)} options={departemnt} placeholder="Select Department*" className="w-full placeholder-opacity-20" />
                            {errors.departemnt?.type === 'required' && <span className='text-xs text-red-500' role="alert">{errors.departemnt.message}</span>}
                        </div>
                    </div>
                    <div className='mt-2'>
                        <input onChange={handlePhotoChange} name='file' type="file" className='w-full border border-violet-600' />
                    </div>

                    <div className='mt-4 text-right'>
                        <Button type='submit' label="Submit" icon="pi pi-check" className="p-button-sm" loading={loading} />
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
                    Do you want to delete this user?
                </p>
                <div className='flex justify-center gap-x-2 mt-8'>
                    <Button onClick={() => setDeleteUserDialog(false)} label='No' className='p-button p-button-sm p-button-info' />
                    <Button onClick={handleDeleteUser} label='Yes' className='p-button p-button-sm p-button-danger' />
                </div>
            </Dialog>
        </div>
    );
};

export default Users;