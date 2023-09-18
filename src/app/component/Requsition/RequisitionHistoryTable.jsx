'use client'
import React, { useState } from 'react';
import { Column } from 'jspdf-autotable';
import { DataTable } from 'primereact/datatable';
import { AiFillPlusSquare } from 'react-icons/ai';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { useForm } from 'react-hook-form';

const RequisitionHistoryTable = ({ requisitionHistory }) => {

    const [createRequisition, setCreateRequisition] = useState(false)
    const [loading, setLoading] = useState(false)


    const { register, control, formState: { errors }, handleSubmit, reset } = useForm();

    const handleAddRequisition = () => {
        console.log('create Requisition');
    }

    const dateBodytemplate = (rowData) => {
        return (
            <div>
                {rowData.createdAt.split("T")[0]}
            </div>
        )
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

    const actionBodyTemplate = (rowData) => {
        return (
            <div className='flex gap-x-2 items-center'>
                <Button tooltip="Export" tooltipOptions={buttonTooltipOptions} icon="pi pi-file-edit" rounded text raised severity='success' aria-label="Filter" style={{ width: '35px', height: '35px' }} />
                <Button tooltip="Details" tooltipOptions={buttonTooltipOptions} icon="pi pi-list" rounded text raised severity='info' aria-label="Filter" style={{ width: '35px', height: '35px' }} />
                <Button tooltip="Pay" tooltipOptions={buttonTooltipOptions} icon='pi pi-trash' rounded text raised severity='danger' style={{ width: '35px', height: '35px' }} />
                {/* <Button tooltip="Delete" tooltipOptions={buttonTooltipOptions} icon='pi pi-trash' rounded text raised severity='danger' /> */}
            </div>
        )
    }

    return (
        <div>
            <div className='mt-1 shadow-lg p-2 bg-white rounded-md'>
                <div className='flex items-center gap-x-2 mb-2'>
                    <h3 className='font-light'>REQUISITION HISTORY</h3>
                    <AiFillPlusSquare onClick={() => setCreateRequisition(true)} size={20} color='#8C239E' className='cursor-pointer' />
                </div>
                {
                    requisitionHistory?.data?.length > 0 ?
                        <DataTable value={requisitionHistory?.data} size='small' emptyMessage="No Requisition Found">
                            <Column body={dateBodytemplate} header="Date"></Column>
                            <Column field='department' header="Department"></Column>
                            <Column field='totalProposedItems' header="#Proposed item(s)"></Column>
                            {/* <Column field="totalApprovedItems" header="#Approved item(s)"></Column> */}
                            <Column field="proposedAmount" header="Proposed Amount"></Column>
                            <Column field="finalAmount" header="Final Amount"></Column>
                            <Column field="status" header="Status"></Column>
                            <Column body={actionBodyTemplate} header="Action"></Column>
                        </DataTable>
                        :
                        <div className='my-4 text-center'>
                            <p className='bg-sky-400 text-white p-2 inline'>No Requisition Found</p>
                        </div>
                }
            </div>
            {/* add Conveyance dialog  */}
            <Dialog header="New Requisition" visible={createRequisition} style={{ width: '50vw' }} onHide={() => { setCreateRequisition(false); }}>

                <form onSubmit={handleSubmit(handleAddRequisition)} className='mt-2'>
                    <div className='mt-2 flex gap-x-4'>
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

                    <div className='mt-4 text-right'>
                        <Button type='submit' label="Submit" className="p-button-sm" loading={loading} />
                    </div>
                </form>
            </Dialog>
        </div>
    );
};

export default RequisitionHistoryTable;