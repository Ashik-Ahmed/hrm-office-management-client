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

const ManageRoles = ({ user }) => {

    const toast = useRef(null)

    const { register, control, formState: { errors }, handleSubmit, reset } = useForm();


    const [roles, setRoles] = useState([])
    const [pages, setPages] = useState([])
    const [loading, setLoading] = useState(false)
    const [addRoleDialog, setAddRoleDialog] = useState(false)
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
        console.log(data, selectedPages);
    }

    useEffect(() => {
        getRoles()
        getPages()
    }, []);

    return (
        <div>
            <div className='flex justify-between items-center mb-4'>
                <p className='text-gray-700 text-xl uppercase font-light'>Manage Roles</p>
                <Button onClick={() => setAddRoleDialog(true)} label='Add Role' icon="pi pi-plus" size='small' />
            </div>
            <div className='flex flex-wrap gap-4'>
                {
                    roles?.map(role => (
                        <div key={role?._id} className="bg-white p-[10px] w-[335px] h-[150px] rounded-md shadow-xl flex justify-center items-center">
                            <div className="flex flex-col justify-center items-start w-full text-center">
                                <div className='w-full flex justify-between items-center'>
                                    <p className='text-gray-600'>Total {role?.users?.length || 0} users</p>
                                    {
                                        role?.users?.length > 3 ?
                                            <AvatarGroup>
                                                <Avatar image="https://i.ibb.co/6R5w2tB/ashik-ahmed.png" size="large" shape="circle" />
                                                <Avatar image="https://i.ibb.co/6R5w2tB/ashik-ahmed.png" size="large" shape="circle" />
                                                <Avatar image="https://i.ibb.co/6R5w2tB/ashik-ahmed.png" size="large" shape="circle" />
                                                <Avatar label={role?.users?.length - 3} shape="circle" size="large" />
                                            </AvatarGroup>
                                            :
                                            <AvatarGroup>
                                                <Avatar image="https://i.ibb.co/6R5w2tB/ashik-ahmed.png" size="large" shape="circle" />
                                                <Avatar image="https://i.ibb.co/6R5w2tB/ashik-ahmed.png" size="large" shape="circle" />
                                                <Avatar image="https://i.ibb.co/6R5w2tB/ashik-ahmed.png" size="large" shape="circle" />
                                            </AvatarGroup>
                                    }
                                </div>
                                <p className='text-gray-700 text-xl font-semibold mt-4 mb-1'>{role.roleName}</p>
                                <Button label='Edit Role' icon="pi pi-pencil" size='small' severity='info' raised />
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

        </div>
    );
};

export default ManageRoles;