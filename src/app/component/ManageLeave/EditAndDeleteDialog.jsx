import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

const EditAndDeleteDialog = ({ editLeaveDialog, setEditLeaveDialog, deleteLeaveDialog, getLeaves, session }) => {


    const { register, control, formState: { errors }, handleSubmit, reset } = useForm();

    const [loading, setLoading] = useState(false)

    const handleEditLeave = (dataValue) => {
        console.log('dited')
        console.log(dataValue)
    }

    return (
        <div>
            <div>

                {/* Edit Leave Dialog  */}
                <Dialog header="Edit Leave Details" visible={editLeaveDialog} style={{ width: '50vw' }} onHide={() => { setEditLeaveDialog(false); reset() }}>

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
            </div>
        </div>
    );
};

export default EditAndDeleteDialog;