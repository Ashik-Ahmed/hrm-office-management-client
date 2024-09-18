'use client'

import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AiFillPlusSquare } from 'react-icons/ai';
import EditAndDeleteDialog from './EditAndDeleteDialog';

const LeaveTypeTable = ({ user }) => {


    const { register, formState: { errors }, handleSubmit, reset } = useForm();

    const toast = useRef(null)

    const [loading, setLoading] = useState(false)
    const [leaves, setLeaves] = useState();
    const [createLeaveDialog, setCreateLeaveDialog] = useState(false);
    const [editLeaveDialog, setEditLeaveDialog] = useState(false);
    const [deleteLeaveDialog, setDeleteLeaveDialog] = useState(false)


    const getAllLeaves = () => {
        setLoading(true)
        fetch(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/leave`, {
            cache: "no-cache",
            headers: {
                "Authorization": `Bearer ${user?.accessToken}`
            }
        }).then(res => res.json())
            .then(data => {
                setLeaves(data?.data)
            })
        setLoading(false)
    }

    useEffect(() => {
        getAllLeaves()
    }, [])


    // create a new leave 
    const handleCreateLeave = (data) => {
        data.createdBy = user.name;

        fetch(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/leave`, {
            method: "POST",
            headers: {
                "content-type": "application/json",
                "Authorization": `Bearer ${user?.accessToken}`
            },
            body: JSON.stringify(data)
        })
            .then(res => res.json())
            .then(data => {
                if (data.status == "Success") {
                    reset();
                    getAllLeaves();
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

    const buttonTooltipOptions = {
        position: 'bottom',
        mouseTrack: true,
        mouseTrackTop: 25,
        style: {
            fontSize: '12px',
            /* Add any other custom styles here */
        },
    };

    const leaveTableActionBodyTemplate = (rowData) => {
        return (
            <div className='flex gap-x-2'>
                <Button onClick={() => setEditLeaveDialog(rowData)} tooltip="Edit" tooltipOptions={buttonTooltipOptions} icon='pi pi-file-edit' rounded text raised severity='success' style={{ width: '35px', height: '35px' }} />
                <Button onClick={() => setDeleteLeaveDialog(rowData)} tooltip="Delete" tooltipOptions={buttonTooltipOptions} icon='pi pi-trash' rounded text raised severity='danger' style={{ width: '35px', height: '35px' }} />
            </div>
        )
    }

    return (
        <div>
            <Toast ref={toast} />
            <div className='w-full shadow-lg bg-white p-2 rounded-md'>
                <div className='flex items-center gap-x-2 mb-2'>
                    <h3 className='font-light'>LEAVE TYPES</h3>
                    {/* <Button onClick={() => setAddUserDialog(true)} icon="pi pi-plus" className='p-button p-button-sm p-button-info' /> */}
                    <AiFillPlusSquare onClick={() => setCreateLeaveDialog(true)} size={25} color='#8C239E' className='cursor-pointer' />
                </div>
                <DataTable value={leaves} size='small'>
                    <Column field="leaveType" header="Leave Type"></Column>
                    <Column field="total" header="Days"></Column>
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
                            type='text' placeholder="Description" className='w-full' />
                    </div>

                    <div className='mt-4 text-right'>
                        <Button type='submit' disabled={!user} label="Submit" className="p-button-sm" loading={loading} />
                    </div>
                </form>
            </Dialog>

            <EditAndDeleteDialog editLeaveDialog={editLeaveDialog} setEditLeaveDialog={setEditLeaveDialog} deleteLeaveDialog={deleteLeaveDialog} setDeleteLeaveDialog={setDeleteLeaveDialog} user={user} getAllLeaves={getAllLeaves} />

        </div>
    );
};

export default LeaveTypeTable;