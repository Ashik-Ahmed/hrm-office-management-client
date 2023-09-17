'use client'
import React from 'react';
import { Column } from 'jspdf-autotable';
import { DataTable } from 'primereact/datatable';
import { AiFillPlusSquare } from 'react-icons/ai';
import { Button } from 'primereact/button';

const RequisitionHistoryTable = ({ requisitionHistory }) => {

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
                <Button tooltip="Export" tooltipOptions={buttonTooltipOptions} icon="pi pi-file-pdf" rounded text raised severity='info' aria-label="Filter" style={{ color: 'red', width: '35px', height: '35px' }} />
                <Button tooltip="Details" tooltipOptions={buttonTooltipOptions} icon="pi pi-list" rounded text raised severity='info' aria-label="Filter" style={{ width: '35px', height: '35px' }} />
                <Button tooltip="Pay" tooltipOptions={buttonTooltipOptions} icon='pi pi-trash' rounded text raised severity='danger' style={{ width: '35px', height: '35px' }} />
                {/* <Button tooltip="Delete" tooltipOptions={buttonTooltipOptions} icon='pi pi-trash' rounded text raised severity='danger' /> */}
            </div>
        )
    }

    return (
        <div className='mt-1 shadow-lg p-2 bg-white rounded-md'>
            <div className='flex items-center gap-x-2 mb-2'>
                <h3 className='font-light'>REQUISITION HISTORY</h3>
                <AiFillPlusSquare size={20} color='#8C239E' className='cursor-pointer' />
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
    );
};

export default RequisitionHistoryTable;