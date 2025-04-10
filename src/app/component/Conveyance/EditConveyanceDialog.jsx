'use client'

import { customDateFormat } from '@/utils/dateformatter';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import React, { useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

const EditConveyanceDialog = ({ editConveyanceDialog, setEditConveyanceDialog, getConveyanceData, user }) => {

    const toast = useRef(null)

    const [loading, setLoading] = useState(false)
    const [date, setDate] = useState(null);


    const { register, control, formState: { errors }, handleSubmit, reset } = useForm();

    const handleEditConveyance = (data) => {
        setLoading(true)
        console.log("form Data: ", data);

        const updatedData = {};
        updatedData.date = data?.date?.toLocaleDateString('en-GB').replace(/\//g, '-').split('-').reverse().join('-');

        for (const property in data) {
            if (data[property] !== "") {
                updatedData[property] = data[property];
            }
        }
        console.log("updatedData", updatedData);
        fetch(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/conveyance/${editConveyanceDialog._id}`, {
            method: 'PATCH',
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${user?.accessToken}`
            },
            body: JSON.stringify(updatedData)
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                if (data.status == 'Success') {
                    getConveyanceData()
                    toast.current.show({ severity: 'success', summary: 'Success', detail: 'Conveyance Updated', life: 3000 });
                }
                else {
                    toast.current.show({ severity: 'error', summary: 'Failed!', detail: 'Please try again', life: 3000 });
                }
            })
        setLoading(false)
        reset()
        setEditConveyanceDialog(false)
    }

    return (
        <div>
            <Toast ref={toast} />
            {/* Edit Conveyance dialog  */}
            <Dialog header="Edit Conveyance" visible={editConveyanceDialog} style={{ width: '50vw' }} onHide={() => { setEditConveyanceDialog(false); reset() }}>

                <form onSubmit={handleSubmit(handleEditConveyance)} className='mt-2'>
                    <div className='mt-2 flex gap-x-4'>
                        <div className='w-full'>
                            {/* <Calendar
                                value={editConveyanceDialog?.date}
                                placeholder={editConveyanceDialog?.date?.split("T")[0] || 'Date'}
                                className='w-full'
                                dateFormat="yy-mm-dd"
                            /> */}
                            <Controller
                                name="date"
                                control={control}
                                render={({ field }) => (
                                    <Calendar
                                        value={editConveyanceDialog?.date}
                                        onChange={(e) => { setDate(e.value); field.onChange(e.value) }}
                                        placeholder={editConveyanceDialog?.date ? (customDateFormat(editConveyanceDialog?.date)?.split(",")[0]) : 'Date'}
                                        className='w-full'
                                        dateFormat="yy-mm-dd"
                                    />
                                )}
                            />
                        </div>
                        <div className='w-full'>
                            <InputText
                                {...register("amount")}
                                keyfilter='int' placeholder={`${editConveyanceDialog?.amount || 'Amount*'}`} className='w-full' />
                        </div>
                    </div>
                    <div className='mt-2 flex gap-x-4'>
                        <div className='w-full'>
                            <InputText
                                {...register("from")}
                                type='text' placeholder={`${editConveyanceDialog?.from || "From*"}`} className='w-full' />
                        </div>
                        <div className='w-full'>
                            <InputText
                                {...register("destination")}
                                type='text' placeholder={`${editConveyanceDialog?.destination || "Destination*"}`} className='w-full' />
                        </div>
                    </div>
                    <div className='mt-2 flex gap-x-4'>
                        <div className='w-full'>
                            <InputText
                                {...register("purpose")}
                                placeholder={`${editConveyanceDialog?.purpose || "Purpose"}`} className='w-full' />
                        </div>
                        <div className='w-full'>
                            <InputText
                                {...register("vehicle")}
                                placeholder={`${editConveyanceDialog?.vehicle || "Vehicle Type"}`} className='w-full' />
                        </div>
                    </div>
                    <div className='mt-2 flex gap-x-4'>
                        <div className='w-full'>
                            <InputText
                                {...register("partner")}
                                placeholder={`${editConveyanceDialog?.partner || "Travel Partner"}`} className='w-full' />
                        </div>
                        <div className='w-full'>
                            <InputText
                                {...register("note")}
                                placeholder={`${editConveyanceDialog?.note || "Note"}`} className='w-full' />
                        </div>
                    </div>
                    {/* <div className='mt-2'>
        <input onChange={handlePhotoChange} name='file' type="file" className='w-full border border-violet-600' />
    </div> */}

                    <div className='mt-4 text-right'>
                        <Button type='submit' label="Submit" className="p-button-sm" loading={loading} />
                    </div>
                </form>
            </Dialog>
        </div>
    );
};

export default EditConveyanceDialog;