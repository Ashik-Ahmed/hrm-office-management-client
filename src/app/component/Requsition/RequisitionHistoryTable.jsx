'use client'
import React, { useState } from 'react';
import { Column } from 'jspdf-autotable';
import { DataTable } from 'primereact/datatable';
import { AiFillPlusSquare } from 'react-icons/ai';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { useForm } from 'react-hook-form';
import { Dropdown } from 'primereact/dropdown';

const RequisitionHistoryTable = ({ requisitionHistory }) => {

    const [createRequisition, setCreateRequisition] = useState(false)
    const [loading, setLoading] = useState(false)
    const [itemList, setItemList] = useState([])
    const [department, setDepartment] = useState('')

    const { register, control, formState: { errors }, handleSubmit, reset } = useForm();

    const handleAddRequisition = (data) => {

        setItemList([data, ...itemList])
        // reset();
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
            <Dialog header="New Requisition" visible={createRequisition} style={{ width: '80vw' }} onHide={() => { setCreateRequisition(false); setDepartment(''); reset() }}>
                <div>
                    <Dropdown
                        {...register('department')}
                        value={department} onChange={(e) => setDepartment(e.value)} options={['Test 1', 'Test 2', 'Test 2']} placeholder="Department*" className='w-fit mb-2' />
                    {errors.department?.type === 'required' && <span className='text-xs text-red-500' role="alert">{errors.department.message}</span>}
                </div>
                <form onSubmit={handleSubmit(handleAddRequisition)} className='mt-2 flex gap-x-2'>
                    <div className='w-full'>
                        <InputText
                            {...register("category", { required: "Category is required" })}
                            placeholder="Category*" className='w-full' />
                        {errors.category?.type === 'required' && <span className='text-xs text-red-500' role="alert">{errors.category.message}</span>}
                    </div>


                    <div className='w-full'>
                        <InputText
                            {...register("name", { required: "Name is required" })}
                            type='text' placeholder="Name*" className='w-full' />
                        {errors.name?.type === 'required' && <span className='text-xs text-red-500' role="alert">{errors.name.message}</span>}
                    </div>
                    <div className='w-full'>
                        <InputText
                            {...register("model")}
                            type='text' placeholder="Model" className='w-full' />
                        {errors.model?.type === 'required' && <span className='text-xs text-red-500' role="alert">{errors.model.message}</span>}
                    </div>


                    <div className='w-1/2'>
                        <InputText
                            {...register("quantity", { required: "Quantity is required" })}
                            keyfilter='int' placeholder="Quantity*" className='w-full' />
                        {errors.quantity?.type === 'required' && <span className='text-xs text-red-500' role="alert">{errors.quantity.message}</span>}
                    </div>
                    <div className='w-1/2'>
                        <InputText
                            {...register("unitPrice", { required: "Unit price required" })}
                            keyfilter='int' placeholder="Unit price*" className='w-full' />
                        {errors.unitPrice?.type === 'required' && <span className='text-xs text-red-500' role="alert">{errors.unitPrice.message}</span>}
                    </div>


                    <div className='text-right'>
                        <Button type='submit' label="Add" icon='pi pi-plus' severity='info' loading={loading} />
                    </div>
                </form>

                {
                    itemList?.length > 0 ?
                        <div className='mt-4 overflow-y-scroll'>
                            <div>
                                <DataTable value={itemList} size='small' emptyMessage="No Requisition Found" responsiveLayout="scroll" scrollHeight="50vh">

                                    <Column field='category' header="Category"></Column>
                                    <Column field='name' header="Product"></Column>
                                    {/* <Column field="totalApprovedItems" header="#Approved item(s)"></Column> */}
                                    <Column field="model" header="Model"></Column>
                                    <Column field="quantity" header="Quantity"></Column>
                                    <Column field="unitPrice" header="Unit Price"></Column>
                                    {/* <Column body={actionBodyTemplate} header="Action"></Column> */}
                                </DataTable>
                            </div>
                            <div className='mt-2 flex gap-x-2 justify-end'>
                                <Button onClick={() => setItemList([])} label='Clear' severity='danger' />
                                <Button label='Submit' disabled={!department} />
                            </div>
                        </div>
                        :
                        <div className='my-4 text-center'>

                        </div>
                }
            </Dialog >
        </div >
    );
};

export default RequisitionHistoryTable;