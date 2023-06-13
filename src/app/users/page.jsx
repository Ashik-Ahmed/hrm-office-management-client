'use client'

import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { useForm } from 'react-hook-form';


const Users = () => {

    const [users, setUsers] = useState(null)
    const [loading, setLoading] = useState(false)
    const [addUserDialog, setAddUserDialog] = useState(false)
    const [role, setRole] = useState()

    const { register, formState: { errors }, handleSubmit } = useForm();
    const [data, setData] = useState("");

    const userRole = ["Super Admin", "Admin", "Employee"]


    const fetchAllUsers = () => {
        setLoading(true)
        fetch('http://localhost:5000/api/v1/user')
            .then(res => res.json())
            .then(data => {
                setUsers(data.data.users)
                setLoading(false)
            })
    }

    useEffect(() => {
        fetchAllUsers()
    }, [])

    const handleAddUser = (data) => {
        console.log("Add user");
        console.log(data);
    }

    return (
        <div className='my-4'>
            <Button onClick={() => setAddUserDialog(true)} label="Add User" icon="pi pi-plus" className='p-button p-button-sm p-button-info' />

            <div className="card p-4 bg-white rounded-md my-2 shadow-xl">
                <div className='flex justify-between items-center mb-2'>
                    <h3 className='font-light'>USER LIST</h3>
                    <span className="p-input-icon-left">
                        <i className="pi pi-search" />
                        <InputText placeholder="Search" />
                    </span>
                </div>
                <DataTable value={users} loading={loading} paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} tableStyle={{ minWidth: '50rem' }}>
                    <Column field="name" header="Name" ></Column>
                    <Column field="email" header="Email" ></Column>
                    <Column field="role" header="Role" ></Column>
                </DataTable>
            </div>

            <Dialog header="Add User" visible={addUserDialog} style={{ width: '50vw' }} onHide={() => setAddUserDialog(false)}>
                <form onSubmit={handleSubmit(handleAddUser)} className='mt-2'>
                    <InputText
                        {...register("employeeId", { required: "Employee ID is required" })}
                        placeholder="Employee ID*" className='w-full' />
                    {errors.employeeId?.type === 'required' && <span className='text-xs text-red-500' role="alert">{errors.employeeId.message}</span>}
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
                    <div className='mt-2'>
                        <Dropdown
                            {...register("userRole", { required: "User role is required" })}
                            value={role} onChange={(e) => setRole(e.value)} options={userRole} placeholder="Select Role Type" className="w-full md:w-14rem" />
                        {errors.userRole?.type === 'required' && <span className='text-xs text-red-500' role="alert">{errors.userRole.message}</span>}
                    </div>

                    <div className='mt-4 text-right'>
                        <Button type='submit' label="Submit" icon="pi pi-check" autoFocus className="p-button-info p-button-sm" />
                    </div>
                </form>
            </Dialog>
        </div>
    );
};

export default Users;