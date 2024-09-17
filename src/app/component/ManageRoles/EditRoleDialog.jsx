"use client"

import Image from 'next/image';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

const EditRoleDialog = ({ user, editRoleDialog, setEditRoleDialog, pages, getRoles }) => {
    // console.log(editRoleDialog.pageAccess);
    const toast = useRef(null)

    const { register, control, formState: { errors }, handleSubmit, reset } = useForm();

    const [selectedPages, setSelectedPages] = useState([]);

    const onPageChange = (e) => {
        let _selectedPages = [...selectedPages];

        if (e.checked)
            _selectedPages.push(e.value._id);
        else
            _selectedPages = _selectedPages.filter(page => page !== e.value._id);

        setSelectedPages(_selectedPages);
    };

    const handleEditRole = (data) => {

        console.log("Role ID: ", editRoleDialog?._id, "Role Name: ", data?.roleName, "selectedPages: ", selectedPages);

        let updatedRoleData;
        if (data.roleName) {
            updatedRoleData = {
                roleName: data?.roleName,
                pageAccess: selectedPages
            }
        }
        else {
            updatedRoleData = {
                pageAccess: selectedPages
            }
        }

        fetch(`${process.env.API_SERVER_UR}/role/${editRoleDialog?._id}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${user?.accessToken}`,
                'content-type': 'application/json'
            },
            body: JSON.stringify(updatedRoleData)
        })
            .then(res => res.json())
            .then(data => {
                if (data.status === "Success") {
                    toast.current.show({ severity: 'success', summary: 'Success', detail: 'Role updated', life: 3000 });
                    getRoles();
                    reset();
                }
                else {
                    toast.current.show({ severity: 'error', summary: 'Failed!', detail: data.error, life: 3000 });
                }
            })

        setEditRoleDialog(false);
    }

    useEffect(() => {
        if (editRoleDialog?.pageAccess) {
            setSelectedPages([...editRoleDialog.pageAccess]);
        }
    }, [editRoleDialog]);

    const userNameTemplate = (rowData) => {
        return (
            <div className='flex items-center space-x-2'>
                <Image src={rowData.image || '/images/user.png'} height={35} width={35} priority alt='user photo' className='rounded-full' style={{ width: '35px', height: '35px' }} />
                <span className='text-md'>{rowData.firstName} {rowData.lastName}</span>
            </div>
        )
    }

    return (
        <div>
            <Toast ref={toast} />
            <Dialog header="Edit Role" visible={!!editRoleDialog} style={{ width: '50vw' }} onHide={() => { setEditRoleDialog(false); reset(); setSelectedPages([]) }}>
                <div className='text-center'>
                    <h2 className='text-2xl font-semibold'>Role: {editRoleDialog?.roleName}</h2>
                    <p>Edit Role Permissions</p>
                </div>
                <form onSubmit={handleSubmit(handleEditRole)} className='mt-2'>
                    <div className="w-full">
                        <InputText
                            {...register("roleName")}
                            placeholder={editRoleDialog?.roleName || "Role name"} className='w-full' />
                    </div>
                    <p className='mt-8 text-xl font-semibold text-gray-500'>Role Permissions</p>
                    <div className="flex flex-col gap-3 mt-4">
                        {pages.map((page) => {
                            return (
                                <div key={page._id} className="flex items-center border-b justify-between">
                                    <label htmlFor={page._id} className="ml-4 font-semibold text-gray-500">
                                        {page?.title} <span className='text-gray-400 text-xs ml-2'>{`(${page?.url})`}</span>
                                    </label>
                                    <Checkbox inputId={page._id} name="category" value={page} onChange={onPageChange} checked={selectedPages.some((item) => item === page?._id)} className='mr-4' />
                                </div>
                            );
                        })}
                    </div>
                    <div className='mt-4 text-right'>
                        <Button type='submit' label="Submit" className="p-button-sm" />
                    </div>
                </form>

                <div className='mt-12'>
                    <p className='text-xl font-light uppercase'>User List</p>
                    <DataTable value={editRoleDialog?.users} size='small' responsiveLayout="scroll" className='mt-4 border shadow-md'>
                        <Column body={userNameTemplate} header="Name" />
                        <Column field="department" header="Department" />
                    </DataTable>
                </div>
            </Dialog>
        </div>
    );
};

export default EditRoleDialog;