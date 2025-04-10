"use client"
import { deleteHoliday, editHoliday, getAllHolidays } from '@/libs/holiday';
import { customDateFormat } from '@/utils/dateformatter';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AiFillPlusSquare } from 'react-icons/ai';

const Holidays = ({ user, holidays }) => {

    const toast = useRef(null);
    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    const [loading, setLoading] = useState(false);
    const [holidayData, setHolidayData] = useState(holidays);
    const [editHolidayDialog, setEditHolidayDialog] = useState(false);
    const [deleteHolidayDialog, setDeleteHolidayDialog] = useState(false);
    const [addHolidayDialog, setAddHolidayDialog] = useState(false);
    const [selectedYear, setSelectedYear] = useState(new Date());


    const getHolidayData = async () => {
        setLoading(true);
        const result = await getAllHolidays(user?.accessToken, selectedYear);

        setHolidayData(result.data);
        setLoading(false);
    }

    useEffect(() => {
        getHolidayData();
    }, [selectedYear]);

    const handleAddHoliday = (data) => {

        data.createdBy = user._id;

        fetch(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/holiday`, {
            method: "POST",
            headers: {
                "content-type": "application/json",
                "Authorization": `Bearer ${user?.accessToken}`
            },
            body: JSON.stringify(data)
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                if (data.status == "Success") {
                    getHolidayData();
                    toast.current.show({ severity: 'success', summary: 'Success', detail: 'Holiday Added', life: 3000 });
                    reset();
                }
                else {
                    toast.current.show({ severity: 'error', summary: 'Failed!', detail: data.error, life: 3000 });
                }
            })
        setAddHolidayDialog(false);
    }

    const handleDeleteHoliday = async () => {
        const deleteHolidayResult = await deleteHoliday(deleteHolidayDialog?._id, user?.accessToken);
        if (deleteHolidayResult.status == "Success") {
            toast.current.show({ severity: 'success', summary: 'Success', detail: 'Holiday Deleted', life: 3000 });
            getHolidayData();
        }
        else {
            toast.current.show({ severity: 'error', summary: 'Failed!', detail: deleteHolidayResult.error, life: 3000 });
        }
        setDeleteHolidayDialog(false);
    }

    const dateBodyTemplate = (rowData) => {
        return (
            <div>
                {customDateFormat(rowData?.date).split(",")[0]}
            </div>
        )
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
            <Toast ref={toast} />
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
                <DataTable value={holidayData} size='small' paginator rows={10} rowsPerPageOptions={[10, 25, 50]} stripedRows removableSort tableStyle={{ minWidth: '50rem' }} loading={loading} emptyMessage="No Holidays Found">
                    <Column field="title" header="Title" style={{ color: '#808080', fontSize: '.8rem', fontWeight: 'bold' }}></Column>
                    <Column body={dateBodyTemplate} header="Date" sortable></Column>
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

            {/* delete holiday dialog  */}
            <Dialog header="Delete Holiday" visible={deleteHolidayDialog} style={{ width: '25vw' }} onHide={() => { setDeleteHolidayDialog(false) }}>
                <div className='flex flex-col mx-auto text-center gap-y-2'>
                    <i className="w-fit mx-auto pi pi-trash text-red-500 border-2 border-red-500 p-2 rounded-full"></i>
                    <p className='text-lg font-semibold'>{deleteHolidayDialog?.title}</p>
                    <p className='text-sm font-semibold'>Date: {customDateFormat(deleteHolidayDialog?.date).split(",")[0]}</p>
                </div>
                <div className='mt-2 flex justify-end'>
                    <Button label='Delete' onClick={() => handleDeleteHoliday(deleteHolidayDialog)} className='bg-[#8C239E] text-white w-fit' />
                </div>
            </Dialog>

            {/* edit holiday dialog  */}
            <Dialog header="Edit Holiday" visible={editHolidayDialog} style={{ width: '25vw' }} onHide={() => { setEditHolidayDialog(false) }}>
                <EditHoliday user={user} editHolidayDialog={editHolidayDialog} setEditHolidayDialog={setEditHolidayDialog} getHolidayData={getHolidayData} toast={toast} />
            </Dialog>
        </div>
    );
};

export default Holidays;


const EditHoliday = ({ user, editHolidayDialog, setEditHolidayDialog, getHolidayData, toast }) => {

    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    const [changedValues, setChangedValues] = useState({});
    const [value, setValue] = useState({});


    // Function to update changed values dynamically
    const handleFieldChange = (field, value) => {
        setChangedValues((prev) => ({
            ...prev,
            [field]: value
        }));
        setValue(field, value); // Update react-hook-form state
    };

    const handleEditHoliday = async () => {

        const result = await editHoliday(editHolidayDialog?._id, changedValues, user?.accessToken);

        if (result.status == "Success") {
            toast.current.show({ severity: 'success', summary: 'Success', detail: 'Holiday Updated', life: 3000 });
            getHolidayData();
            reset();
        }
        else {
            toast.current.show({ severity: 'error', summary: 'Failed!', detail: result.error, life: 3000 });
        }
        setEditHolidayDialog(false);
    }


    return (
        <div>
            <form onSubmit={handleSubmit(handleEditHoliday)} className='flex flex-col gap-y-2'>
                <div className='mt-4'>
                    <InputText
                        {...register('title')}
                        defaultValue={editHolidayDialog?.title}
                        placeholder='Title'
                        className='w-full'
                        onChange={(e) => handleFieldChange('title', e.target.value)}
                    />
                </div>

                <div>
                    <Calendar
                        {...register('date')}
                        value={editHolidayDialog?.date ? new Date(editHolidayDialog?.date) : null}
                        dateFormat="dd/mm/yy"
                        placeholder='Date'
                        disabled
                        className='w-full'
                    />
                </div>

                <div>
                    <InputText
                        {...register('description')}
                        defaultValue={editHolidayDialog?.description}
                        placeholder='Description'
                        className='w-full'
                        onChange={(e) => handleFieldChange('description', e.target.value)}
                    />
                </div>

                <div className='mt-2 flex justify-end'>
                    <Button type='submit' label='Submit' className='bg-[#8C239E] text-white' />
                </div>
            </form>
        </div>
    )
}