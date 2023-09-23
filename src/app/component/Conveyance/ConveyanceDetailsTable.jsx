import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import React, { useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { AiFillPlusSquare } from 'react-icons/ai';
import EditConveyanceDialog from './EditConveyanceDialog';

const ConveyanceDetailsTable = ({ conveyanceData, getConveyanceData, session, loading }) => {

    const toast = useRef(null)
    const { register, control, formState: { errors }, handleSubmit, reset } = useForm();

    const [detailsDialog, setDetailsDialog] = useState(false)
    const [editDialog, setEditDialog] = useState(false)
    const [deleteDialog, setDeleteDialog] = useState(false)
    const [addConveyanceDialog, setAddConveyanceDialog] = useState(false)
    const [editConveyanceDialog, setEditConveyanceDialog] = useState(false)
    const [date, setDate] = useState(null);
    const [attachment, setAttachment] = useState(null);

    const handlePhotoChange = (event) => {
        setAttachment(event.target.files[0]);
    };

    const handleAddConveyance = (data) => {

        data.date = data.date.toLocaleDateString('en-GB').replace(/\//g, '-').split('-').reverse().join('-');
        // console.log(data.date);
        const employee = {
            name: session.user.name,
            email: session.user.email
        }
        data.employee = employee;

        fetch('http://localhost:5000/api/v1/conveyance', {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(data)
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                if (data.status == "Success") {
                    console.log("Conveyance created");
                    getConveyanceData()
                    toast.current.show({ severity: 'success', summary: 'Success', detail: 'Conveyance Submitted', life: 3000 });
                }
                else {
                    console.log("Failed");
                    toast.current.show({ severity: 'error', summary: 'Failed!', detail: 'Please try again.', life: 3000 });
                }
            })

        setAddConveyanceDialog(false)
        setDate(null)
        reset();
    }

    const handleDeleteConveyance = () => {
        console.log(deleteDialog);
        fetch(`http://localhost:5000/api/v1/conveyance/${deleteDialog._id}`, {
            method: 'DELETE'
        })
            .then(res => res.json())
            .then(data => {
                if (data.status == 'Success') {
                    console.log('Deleted');
                    getConveyanceData()
                    toast.current.show({ severity: 'success', summary: 'Success', detail: 'Conveyance Deleted', life: 3000 });
                }
                else {
                    console.log(data);
                    toast.current.show({ severity: 'error', summary: 'Failed!', detail: data.error, life: 3000 });
                }
                setDeleteDialog(false)
            })
    }

    const buttonTooltipOptions = {
        position: 'bottom',
        mouseTrack: true,
        mouseTrackTop: 25,
        style: {
            fontSize: '12px'
            /* Add any other custom styles here */
        },
    };


    const dateBodyTemplate = (rowData) => {
        return (
            <div>
                {rowData.date.split("T")[0]}
            </div>
        )
    }

    const actionBodyTemplate = (rowData) => {
        return (
            <div className='flex gap-x-2 items-center'>
                <Button onClick={() => setDetailsDialog(rowData)} tooltip="View" tooltipOptions={buttonTooltipOptions} icon="pi pi-info" rounded text raised severity='info' aria-label="Filter" style={{ width: '35px', height: '35px' }} />
                <Button onClick={() => setEditConveyanceDialog(rowData)} disabled={rowData.paymentStatus !== "Pending"} tooltip="Edit" tooltipOptions={buttonTooltipOptions} icon='pi pi-file-edit' rounded text raised severity='success' style={{ width: '35px', height: '35px' }} />
                <Button onClick={() => setDeleteDialog(rowData)} disabled={rowData.paymentStatus !== "Pending"} tooltip="Delete" tooltipOptions={buttonTooltipOptions} icon='pi pi-trash' rounded text raised severity='danger' style={{ width: '35px', height: '35px' }} />
            </div>
        )
    }

    return (
        <div>
            <Toast ref={toast} />
            <div className='mt-1 shadow-lg p-2 bg-white rounded-md'>
                <div className='flex items-center gap-x-2 mb-2'>
                    <h3 className='font-light'>CONVEYANCE DETAILS</h3>
                    <AiFillPlusSquare onClick={() => setAddConveyanceDialog(true)} size={20} color='#8C239E' className='cursor-pointer' />
                </div>
                {
                    conveyanceData?.conveyanceDetails?.length > 0 ?
                        <DataTable value={conveyanceData.conveyanceDetails} size='small' emptyMessage="No Due Conveyance">
                            <Column body={dateBodyTemplate} header="Date"></Column>
                            <Column field='from' header="From"></Column>
                            <Column field='destination' header="Destination"></Column>
                            <Column field="amount" header="Amount"></Column>
                            <Column field="paymentStatus" header="Payment Status"></Column>
                            <Column body={actionBodyTemplate} header="Action"></Column>
                        </DataTable>
                        :
                        <div className='my-4 text-center'>
                            <p className='bg-sky-400 text-white p-2 inline'>No Conveyance Found</p>
                        </div>
                }
            </div>
            {/* add Conveyance dialog  */}
            <Dialog header="Add Conveyance" visible={addConveyanceDialog} style={{ width: '50vw' }} onHide={() => { setAddConveyanceDialog(false); setDate(null); reset() }}>

                <form onSubmit={handleSubmit(handleAddConveyance)} className='mt-2'>
                    <div className='mt-2 flex gap-x-4'>
                        <div className='w-full'>
                            {/* <Calendar value={date} onChange={(e) => setDate(e.value)} dateFormat="dd/mm/yy" /> */}

                            {/* <Calendar value={date} onChange={(e) => setDate(e.value)} dateFormat="dd/mm/yy" placeholder='Joining Date' className='w-full' /> */}
                            <Controller
                                name="date"
                                control={control}
                                rules={{ required: "Date is required" }}
                                render={({ field }) => (
                                    <Calendar
                                        value={date}
                                        onChange={(e) => { setDate(e.value); field.onChange(e.value) }}
                                        placeholder='Date*'
                                        className='w-full'
                                        dateFormat="dd-mm-yy"
                                    />
                                )}
                            />
                            {errors.date?.type === 'required' && <span className='text-xs text-red-500 block' role="alert">{errors.date.message}</span>}
                        </div>

                        <div className='w-full'>
                            <InputText
                                {...register("amount", { required: "Amount is required" })}
                                keyfilter='int' placeholder="Amount*" className='w-full' />
                            {errors.amount?.type === 'required' && <span className='text-xs text-red-500' role="alert">{errors.amount.message}</span>}
                        </div>
                    </div>
                    <div className='mt-2 flex gap-x-4'>
                        <div className='w-full'>
                            <InputText
                                {...register("from", { required: "From location required" })}
                                type='text' placeholder="From*" className='w-full' />
                            {errors.from?.type === 'required' && <span className='text-xs text-red-500' role="alert">{errors.from.message}</span>}
                        </div>
                        <div className='w-full'>
                            <InputText
                                {...register("destination", { required: "Destination location required" })}
                                type='text' placeholder="Destination*" className='w-full' />
                            {errors.destination?.type === 'required' && <span className='text-xs text-red-500' role="alert">{errors.destination.message}</span>}
                        </div>
                    </div>
                    <div className='mt-2 flex gap-x-4'>
                        <div className='w-full'>
                            <InputText
                                {...register("purpose")}
                                placeholder="Purpose" className='w-full' />
                            {errors.purpose?.type === 'required' && <span className='text-xs text-red-500' role="alert">{errors.purpose.message}</span>}
                        </div>
                        <div className='w-full'>
                            <InputText
                                {...register("partner")}
                                placeholder="Travel Partner" className='w-full' />
                            {errors.partner?.type === 'required' && <span className='text-xs text-red-500' role="alert">{errors.partner.message}</span>}
                        </div>
                    </div>
                    <div className='mt-2'>
                        <input onChange={handlePhotoChange} name='file' type="file" className='w-full border border-violet-600' />
                    </div>

                    <div className='mt-4 text-right'>
                        <Button type='submit' label="Submit" className="p-button-sm" loading={loading} />
                    </div>
                </form>
            </Dialog>

            <EditConveyanceDialog editConveyanceDialog={editConveyanceDialog} setEditConveyanceDialog={setEditConveyanceDialog} />

            {/* Details Dialog  */}
            <Dialog header="Details" visible={detailsDialog} style={{ width: '50vw' }} onHide={() => { setDetailsDialog(false); }}>
                <div>
                    <p className='mb-2'>Date: {detailsDialog?.date?.split("T")[0]}</p>
                    <div className='flex justify-between text-start'>
                        <p className='w-1/2'>From: {detailsDialog.from}</p>
                        <p className='w-1/2 text-start'>Destination: {detailsDialog.destination}</p>
                    </div>
                    <div className='flex justify-between'>
                        <p>Amount: {detailsDialog.amount}</p>
                        <p className='w-1/2 text-start'>Payment: {detailsDialog.paymentStatus}</p>
                    </div>
                    <div className='flex justify-between'>
                        <p>Purpose: {detailsDialog.purpose}</p>
                        <p className='w-1/2 text-start'>Partner: {detailsDialog.partner}</p>
                    </div>
                </div>
            </Dialog>

            {/* Delete Dialog  */}
            <Dialog header="Delete Confirmation" visible={deleteDialog} style={{ width: '25vw' }} onHide={() => { setDeleteDialog(false); }}>
                <p>Date: {deleteDialog.date?.split("T")[0]}</p>
                <p>{deleteDialog.from} to {deleteDialog.destination}</p>
                <p>Amount: {deleteDialog.amount}</p>
                <p className='mt-2 text-center font-bold text-red-500'>Are you sure to delete?</p>
                <div className='flex justify-end gap-x-2 mt-8'>
                    <Button onClick={() => setDeleteDialog(false)} label='Cancel' className='p-button p-button-sm p-button-info' />
                    <Button onClick={handleDeleteConveyance} label='Delete' className='p-button p-button-sm p-button-danger' />
                </div>
            </Dialog>
        </div>
    );
};

export default ConveyanceDetailsTable;