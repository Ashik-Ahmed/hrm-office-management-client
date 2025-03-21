"use client"
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { AiFillPlusSquare } from 'react-icons/ai';

const Holidays = ({ holidays }) => {

    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    const [editHolidayDialog, setEditHolidayDialog] = useState(false);
    const [deleteHolidayDialog, setDeleteHolidayDialog] = useState(false);
    const [addHolidayDialog, setAddHolidayDialog] = useState(false);
    const [selectedYear, setSelectedYear] = useState(new Date());

    const handleAddHoliday = (data) => {
        console.log(data);
    }

    const actionBodyTemplate = (rowData) => {
        return (
            <div>
                <div className='flex gap-x-3 items-center'>
                    <Button onClick={() => setEditHolidayDialog(rowData)} icon='pi pi-file-edit' rounded text raised severity='success' style={{ width: '25px', height: '25px' }} />
                    <Button onClick={() => setDeleteHolidayDialog(rowData)} icon='pi pi-trash' rounded text raised severity='danger' style={{ width: '25px', height: '25px' }} />
                </div>
            </div >
        )
    }

    return (
        <div className='mt-1 shadow-lg p-2 bg-white rounded-md'>
            <div className='flex justify-between items-center gap-x-2 mb-2'>
                <div className='flex items-center gap-x-2 mb-2'>
                    <h3 className='font-light'>HOLIDAYS</h3>
                    <AiFillPlusSquare onClick={() => setAddHolidayDialog(true)} size={25} color='#8C239E' className='cursor-pointer' />
                </div>
                <div className=''>
                    <Calendar value={selectedYear} onChange={(e) => { setSelectedYear(e.value); }} view="year" dateFormat="yy" className='w-fit' />
                </div>
            </div>
            <div>
                <DataTable value={holidays} size='small' paginator rows={10} rowsPerPageOptions={[10, 25, 50]} stripedRows removableSort tableStyle={{ minWidth: '50rem' }}>
                    <Column field="title" header="Title" style={{ color: '#808080', fontSize: '.8rem', fontWeight: 'bold' }}></Column>
                    <Column field="date" header="Date" sortable></Column>
                    <Column field="description" header="Description"></Column>
                    <Column body={actionBodyTemplate} header="Action"></Column>
                </DataTable>
            </div>

            {/* add holiday dialog  */}
            <Dialog header="Add Holiday" visible={addHolidayDialog} style={{ width: '25vw' }} onHide={() => { setAddHolidayDialog(false); reset() }}>

                <form onSubmit={handleSubmit(handleAddHoliday)} className='flex flex-col gap-y-2'>
                    <div className='mt-4'>
                        <InputText
                            {...register('title', { required: "Title is required" })}
                            placeholder='Title'
                            className='w-full'
                        />
                        {errors?.title?.type === 'required' && <span className='text-sm text-red-500'>{errors?.title?.message}</span>}
                    </div>
                    <div>
                        <Calendar
                            {...register('date', { required: "Date is required" })}
                            placeholder='Date'
                            className='w-full'
                        />
                        {errors?.date?.type === 'required' && <span className='text-sm text-red-500'>{errors?.date?.message}</span>}
                    </div>
                    <div>
                        <InputText
                            {...register('description')}
                            placeholder='Description'
                            className='w-full'
                        />
                    </div>

                    <div className='mt-2 flex justify-end'>
                        <Button type='submit' label='Submit' className='bg-[#8C239E] text-white' />
                    </div>
                </form>

            </Dialog>
        </div>
    );
};

export default Holidays;