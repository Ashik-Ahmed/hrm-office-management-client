"use client"

import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

const EditRoleDialog = ({ editRoleDialog, setEditRoleDialog, pages }) => {
    // console.log(editRoleDialog.pageAccess);
    const toast = useRef(null)

    const { register, control, formState: { errors }, handleSubmit, reset } = useForm();

    const [selectedPages, setSelectedPages] = useState([]);

    const onPageChange = (e) => {
        let _selectedPages = [...selectedPages];

        if (e.checked)
            _selectedPages.push(e.value.url);
        else
            _selectedPages = _selectedPages.filter(page => page !== e.value.url);

        setSelectedPages(_selectedPages);
    };

    const handleEditRole = (data) => {

        console.log(selectedPages);
    }

    useEffect(() => {
        if (editRoleDialog?.pageAccess) {
            setSelectedPages([...editRoleDialog.pageAccess]);
        }
    }, [editRoleDialog]);

    return (
        <div>
            <Dialog header="Edit Role" visible={!!editRoleDialog} style={{ width: '50vw' }} onHide={() => { setEditRoleDialog(false); reset(); setSelectedPages([]) }}>
                <div className='text-center'>
                    <h2 className='text-2xl font-semibold'>Role: {editRoleDialog?.roleName}</h2>
                    <p>Set Role Permissions</p>
                </div>
                <form onSubmit={handleSubmit(handleEditRole)} className='mt-2'>
                    <div className="w-full">
                        <InputText
                            {...register("roleName", { required: "Role name is required" })}
                            placeholder="Role name*" className='w-full' />
                        {errors.roleName?.type === 'required' && <span className='text-xs text-red-500' role="alert">{errors?.roleName?.message}</span>}
                    </div>
                    <p className='mt-8 text-xl font-semibold text-gray-500'>Role Permissions</p>
                    <div className="flex flex-col gap-3 mt-4">
                        {pages.map((page) => {
                            return (
                                <div key={page._id} className="flex items-center border-b justify-between">
                                    <label htmlFor={page._id} className="ml-4 font-semibold text-gray-500">
                                        {page?.title}
                                    </label>
                                    <Checkbox inputId={page._id} name="category" value={page} onChange={onPageChange} checked={selectedPages.some((item) => item === page?.url)} className='mr-4' />
                                </div>
                            );
                        })}
                    </div>
                    <div className='mt-4 text-right'>
                        <Button type='submit' label="Submit" className="p-button-sm" />
                    </div>
                </form>
            </Dialog>
        </div>
    );
};

export default EditRoleDialog;