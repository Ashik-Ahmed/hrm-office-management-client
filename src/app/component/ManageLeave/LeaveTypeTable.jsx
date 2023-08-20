'use client'

import { useSession } from 'next-auth/react';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AiFillPlusSquare } from 'react-icons/ai';

const LeaveTypeTable = () => {

    const { register, control, formState: { errors }, handleSubmit, reset } = useForm();
    const { data: session, status } = useSession();

    const toast = useRef(null)

    const [loading, setLoading] = useState(false)
    const [leaves, setLeaves] = useState(null);
    const [createLeaveDialog, setCreateLeaveDialog] = useState(false)

    // get all leaves from DB 
    const fetchLeaves = () => {
        fetch('http://localhost:5000/api/v1/leave')
            .then(res => res.json())
            .then(data => {
                console.log(data)
                setLeaves(data.data)
            })
    }

    useEffect(() => {
        fetchLeaves()
    }, [])

    // create a new leave 
    const handleCreateLeave = (data) => {
        data.createdBy = session.user.name;
        console.log(data);

        fetch('http://localhost:5000/api/v1/leave', {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(data)
        })
            .then(res => res.json())
            .then(data => {
                if (data.status == "Success") {
                    reset();
                    setCreateLeaveDialog(false);
                    toast.current.show({ severity: 'success', summary: 'Success', detail: 'Leave Created', life: 3000 });
                }
                else {
                    reset();
                    toast.current.show({ severity: 'error', summary: 'Failed!', detail: data.error, life: 3000 });
                }
                console.log(data)
            })

    }

    const leaveTableActionBodyTemplate = (rowData) => {
        return (
            <div className='flex gap-x-2'>
                <Button icon='pi pi-file-edit' rounded text raised severity='success' />
                <Button icon='pi pi-trash' rounded text raised severity='danger' />
            </div>
        )
    }

    return (
        <div>
            <Toast ref={toast} />
            <div className='w-full shadow-lg bg-white p-2 rounded-md'>
                <div className='flex items-center gap-x-2 mb-2'>
                    <h3 className='font-light'>AVAILABLE LEAVES</h3>
                    {/* <Button onClick={() => setAddUserDialog(true)} icon="pi pi-plus" className='p-button p-button-sm p-button-info' /> */}
                    <AiFillPlusSquare onClick={() => setCreateLeaveDialog(true)} size={20} color='#8C239E' className='cursor-pointer' />
                </div>
                <DataTable value={leaves} size='small'>
                    <Column field="leaveType" header="Leave Type"></Column>
                    <Column field="total" header="Total"></Column>
                    <Column field="description" header="Description"></Column>
                    <Column body={leaveTableActionBodyTemplate} header="Action"></Column>
                </DataTable>
            </div>
            {/* create leave dialog  */}
            <Dialog header="Create Leave" visible={createLeaveDialog} style={{ width: '50vw' }} onHide={() => { setCreateLeaveDialog(false); reset() }}>

                <form onSubmit={handleSubmit(handleCreateLeave)} className='mt-2 flex flex-col gap-2'>

                    <div className="w-full">
                        <InputText
                            {...register("leaveType", { required: "Leave Type is required" })}
                            type='text' placeholder="Leave Type*" className='w-full' />
                        {errors.leaveType?.type === 'required' && <span className='text-xs text-red-500' role="alert">{errors.leaveType.message}</span>}
                    </div>
                    <div className='w-full'>
                        <InputText
                            {...register("total", { required: "Total allocation value is required" })}
                            keyfilter="int" placeholder="Total allocation*" className='w-full' />
                        {errors.total?.type === 'required' && <span className='text-xs text-red-500' role="alert">{errors.total.message}</span>}
                    </div>
                    <div className='w-full'>
                        <InputText
                            {...register("description")}
                            type='text' placeholder="Description*" className='w-full' />
                    </div>

                    <div className='mt-4 text-right'>
                        <Button type='submit' disabled={!session} label="Submit" icon="pi pi-check" className="p-button-sm" loading={loading} />
                    </div>
                </form>
            </Dialog>
        </div>
    );
};

export default LeaveTypeTable;