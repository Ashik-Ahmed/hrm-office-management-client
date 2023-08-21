import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

const EditAndDeleteDialog = ({ editLeaveDialog, setEditLeaveDialog, deleteLeaveDialog, setDeleteLeaveDialog, getLeaves, session }) => {

    console.log(editLeaveDialog)
    console.log(deleteLeaveDialog)

    const { register, control, formState: { errors }, handleSubmit, reset } = useForm();

    const [loading, setLoading] = useState(false)

    const handleEditLeave = (dataValue) => {
        for (const key in dataValue) {
            if (!dataValue[key]) {
                delete dataValue[key];
            }
            console.log(dataValue)
        }

        const handleDeleteLeave = (data) => {
            console.log(data)
        }

        return (
            <div>
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
                            <Button type='submit' disabled={!session} label="Submit" icon="pi pi-check" className="p-button-sm" loading={loading} />
                        </div>
                    </form>
                </Dialog>

                {/* Delete Leave Dialog  */}
                <Dialog header="Confirm Rejection" visible={deleteLeaveDialog} onHide={() => { setDeleteLeaveDialog(false); reset(); }}
                    style={{ width: '30vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }}>

                    <form onSubmit={handleSubmit(handleDeleteLeave)}>
                        <div className='mb-2'>
                            <p>Employee: {deleteLeaveDialog?.employee?.name}</p>
                            <p>Leave Type: {deleteLeaveDialog?.leaveType}</p>
                            <p>Total Day: {deleteLeaveDialog?.totalDay}</p>
                        </div>
                        <div className='flex justify-end mt-2'>
                            <Button type='submit' disabled={!session} loading={loading} label="Reject" icon="pi pi-times" severity='danger' size='small' />
                        </div>
                    </form>
                </Dialog>
            </div>
        );
    };
};

export default EditAndDeleteDialog;