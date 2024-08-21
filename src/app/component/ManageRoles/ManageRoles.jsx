"use client"

import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import user from '../../../../public/images/user.png'
import { AvatarGroup } from 'primereact/avatargroup';
import { Avatar } from 'primereact/avatar';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { useForm } from 'react-hook-form';
import { Checkbox } from 'primereact/checkbox';
import { Toast } from 'primereact/toast';
import EditRoleDialog from './EditRoleDialog';

const ManageRoles = ({ user }) => {

    const toast = useRef(null)

    const { register, control, formState: { errors }, handleSubmit, reset } = useForm();


    const [roles, setRoles] = useState([])
    const [pages, setPages] = useState([])
    const [loading, setLoading] = useState(false)
    const [addRoleDialog, setAddRoleDialog] = useState(false)
    const [editRoleDialog, setEditRoleDialog] = useState(false)
    const [selectedPages, setSelectedPages] = useState([]);

    const onPageChange = (e) => {
        let _selectedPages = [...selectedPages];

        if (e.checked)
            _selectedPages.push(e.value.url);
        else
            _selectedPages = _selectedPages.filter(page => page !== e.value.url);

        setSelectedPages(_selectedPages);
    };

    const getRoles = () => {
        setLoading(true)

        fetch(`http://localhost:5000/api/v1/role`, {
            headers: {
                'Authorization': `Bearer ${user?.accessToken}`
            }
        })
            .then(res => res.json())
            .then(data => {
                if (data.status === "Success") {
                    setRoles(data.data)
                }
            })

        setLoading(false)
    }

    const getPages = () => {
        fetch(`http://localhost:5000/api/v1/page`, {
            headers: {
                'Authorization': `Bearer ${user?.accessToken}`
            }
        })
            .then(res => res.json())
            .then(data => {
                if (data.status === "Success") {
                    setPages(data.data)
                    console.log(data.data);
                }
            })
    }

    const handleAddNewRole = (data) => {

        fetch(`http://localhost:5000/api/v1/role`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${user?.accessToken}`,
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                roleName: data?.roleName,
                pageAccess: selectedPages
            })
        })
            .then(res => res.json())
            .then(data => {
                if (data.status === "Success") {
                    getRoles()
                    toast.current.show({ severity: 'success', summary: 'Success', detail: 'Role created', life: 3000 });
                }
                else {
                    toast.current.show({ severity: 'error', summary: 'Failed!', detail: 'Please try again.', life: 3000 });
                }
            })
        setAddRoleDialog(false)
    }

    useEffect(() => {
        getRoles()
        getPages()
    }, []);

    return (
        <div>
            <Toast ref={toast} />
            <div className='flex justify-between items-center mb-4'>
                <p className='text-gray-700 text-xl uppercase font-light'>Manage Roles</p>
                <Button onClick={() => setAddRoleDialog(true)} label='Add Role' icon="pi pi-plus" size='small' />
            </div>
            <div className='flex flex-wrap justify-between gap-4'>
                {
                    roles?.map(role => (
                        <div key={role?._id} className="bg-white p-[10px] w-[335px] h-[150px] rounded-md shadow-xl flex justify-center items-center">
                            <div className="flex flex-col justify-center items-start w-full text-center">
                                <div className='w-full flex justify-between items-center'>
                                    <p className='text-gray-600'>Total {role?.users?.length || 0} users</p>
                                    {
                                        role?.users?.length > 3 ?
                                            <AvatarGroup>
                                                {
                                                    role?.users?.slice(0, 3).map(user => (
                                                        <Avatar key={user?._id} image={user.image ? user?.image : '/images/user.png'} size="small" shape="circle" />
                                                    ))
                                                }
                                                {/* <Avatar image="https://i.ibb.co/6R5w2tB/ashik-ahmed.png" size="large" shape="circle" />
                                                <Avatar image="https://i.ibb.co/6R5w2tB/ashik-ahmed.png" size="large" shape="circle" />
                                                <Avatar image="https://i.ibb.co/6R5w2tB/ashik-ahmed.png" size="large" shape="circle" /> */}
                                                <Avatar label={`+${role?.users?.length - 3}`} size="small" shape="circle" />
                                            </AvatarGroup>
                                            :
                                            <AvatarGroup>
                                                {
                                                    role?.users?.map(user => (
                                                        <Avatar key={user?._id} image={"/images/user.png"} size="small" shape="circle" />
                                                    ))
                                                }
                                            </AvatarGroup>
                                    }
                                </div>
                                <p className='text-gray-700 text-xl font-semibold mt-4 mb-1'>{role.roleName}</p>
                                <Button onClick={() => setEditRoleDialog(role)} label='Edit Role' icon="pi pi-pencil" size='small' severity='info' raised />
                            </div>
                        </div>
                    ))
                }
            </div>

            <Dialog header="Add New Role" visible={addRoleDialog} style={{ width: '50vw' }} onHide={() => { setAddRoleDialog(false); reset(); setSelectedPages([]) }}>

                <form onSubmit={handleSubmit(handleAddNewRole)} className='mt-2'>
                    <div className="w-full">
                        <InputText
                            {...register("roleName", { required: "Role name is required" })}
                            placeholder="Role name*" className='w-full' />
                        {errors.roleName?.type === 'required' && <span className='text-xs text-red-500' role="alert">{errors?.roleName?.message}</span>}
                    </div>

                    <div className="flex flex-col gap-3 mt-8">
                        {pages.map((page) => {
                            return (
                                <div key={page._id} className="flex items-center border-b justify-between">
                                    <label htmlFor={page._id} className="ml-4">
                                        {page?.title}
                                    </label>
                                    <Checkbox inputId={page._id} name="category" value={page} onChange={onPageChange} checked={selectedPages.some((item) => item === page?.url)} />
                                </div>
                            );
                        })}
                    </div>

                    <div className='mt-4 text-right'>
                        <Button type='submit' label="Submit" className="p-button-sm" loading={loading} />
                    </div>
                </form>
            </Dialog>

            <EditRoleDialog user={user} editRoleDialog={editRoleDialog} setEditRoleDialog={setEditRoleDialog} pages={pages} getRoles={getRoles} />

        </div>
    );
};

export default ManageRoles;