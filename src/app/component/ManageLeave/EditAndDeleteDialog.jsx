import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import Cookies from 'universal-cookie';

const EditAndDeleteDialog = ({ editLeaveDialog, setEditLeaveDialog, deleteLeaveDialog, setDeleteLeaveDialog, session, getAllLeaves }) => {

    const cookie = new Cookies();

    const { register, control, formState: { errors, isDirty, isValid }, handleSubmit, reset } = useForm();
    // const { isDirty, isValid } = formState;

    const toast = useRef()

    const [loading, setLoading] = useState(false)

    const handleEditLeave = (updatedLeaveInfo) => {
        setLoading(true)

        // removing empty fields 
        for (const key in updatedLeaveInfo) {
            if (!updatedLeaveInfo[key]) {
                delete updatedLeaveInfo[key];
            }
        }

        fetch(`http://localhost:5000/api/v1/leave/${editLeaveDialog._id}`, {
            method: "PATCH",
            headers: {
                "content-type": "application/json",
                "Authorization": `Bearer  ${cookie.get('TOKEN')}`
            },
            body: JSON.stringify(updatedLeaveInfo)
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                if (data.status == "Success") {
                    getAllLeaves()
                    toast.current.show({ severity: 'success', summary: 'Success', detail: 'Leave updated', life: 3000 });
                }
                else {
                    toast.current.show({ severity: 'error', summary: 'Failed!', detail: `${data?.error}`, life: 3000 });
                }
            })
        reset();
        setLoading(false)
        setEditLeaveDialog(false);
    }

    const handleDeleteLeave = (leaveData) => {
        console.log(leaveData);
        setLoading(true)
        fetch(`http://localhost:5000/api/v1/leave/${leaveData._id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer  ${cookie.get('TOKEN')}`
            }
        })
            .then(res => res.json())
            .then(data => {
                if (data.status == "Success") {
                    getAllLeaves()
                    toast.current.show({ severity: 'success', summary: 'Success', detail: 'Leave deleted', life: 3000 })
                }
                else {
                    toast.current.show({ severity: 'error', summary: 'Failed!', detail: `${data?.error}`, life: 3000 });
                }
            })
        setLoading(false)
        setDeleteLeaveDialog(false)
    }

    return (
        <div>
            <Toast ref={toast} />
            {/* Edit Leave Dialog  */}
            <Dialog header="Edit Leave Details" visible={editLeaveDialog} style={{ width: '50vw' }} onHide={() => { setEditLeaveDialog(false); reset() }} className='bg-red-500'>

                <form onSubmit={handleSubmit(handleEditLeave)} className='mt-2 flex flex-col gap-2'>

                    <div className="w-full">
                        <InputText
                            {...register("leaveType")}
                            type='text' placeholder={editLeaveDialog.leaveType} className='w-full' />
                    </div>
                    <div className='w-full'>
                        <InputText
                            {...register("total")}
                            keyfilter="int" placeholder={editLeaveDialog.total} className='w-full' />
                    </div>
                    <div className='w-full'>
                        <InputText
                            {...register("description")}
                            type='text' placeholder={editLeaveDialog?.description || "N/A"} className='w-full' />
                    </div>

                    <div className='mt-4 text-right'>
                        <Button type='submit' disabled={!session || !isDirty || !isValid} label="Submit" className="p-button-sm" loading={loading} />
                    </div>
                </form>
            </Dialog>

            {/* Delete Leave Dialog  */}
            <Dialog header="Delete Confirmation" visible={deleteLeaveDialog} onHide={() => { setDeleteLeaveDialog(false); reset(); }}
                style={{ width: '30vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }}>

                <div>
                    <div className='mb-2'>
                        <p><span>Leave Type: {deleteLeaveDialog?.leaveType}</span></p>
                        <p><span>Total Days: {deleteLeaveDialog?.total} days</span> </p>
                    </div>
                    <div className='flex justify-end gap-x-2 mt-8'>
                        <Button onClick={() => setDeleteLeaveDialog(false)} label='Cancel' className='p-button p-button-sm p-button-info' />
                        <Button onClick={() => handleDeleteLeave(deleteLeaveDialog)} disabled={!session} loading={loading} label="Delete" severity='danger' size='small' />
                    </div>
                </div>
            </Dialog>
        </div>
    );
};

export default EditAndDeleteDialog;