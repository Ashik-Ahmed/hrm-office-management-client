"use client"

import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React from 'react';
import { AiOutlineCheckCircle } from 'react-icons/ai';
import { MdOutlineCancel } from 'react-icons/md';

const PendingLeave = ({ pendingLeaveApplications }) => {

    console.log(pendingLeaveApplications);

    const pendignLeaveTableHeader = () => {
        return (
            <div>
                <p>Pending Leave Applications</p>
            </div>
        )
    }

    const actionBodyTemplate = (rowData) => {
        return (
            <div className='flex gap-x-2'>
                <AiOutlineCheckCircle size={25} color='green' className='rounded-full cursor-pointer' />
                <MdOutlineCancel size={25} color='red' className='rounded-full cursor-pointer' />
            </div>
        )
    }

    return (
        <div>
            <DataTable value={pendingLeaveApplications} header={pendignLeaveTableHeader} size='small' emptyMessage="No pending applications">
                <Column field='employee.name' header="Name"></Column>
                <Column field="leaveType" header="Leave Type"></Column>
                <Column field="fromDate" header="From"></Column>
                <Column field="toDate" header="To"></Column>
                <Column field="rejoinDate" header="Re-joining Date"></Column>
                <Column field="totalDay" header="Total"></Column>
                <Column field="currentStatus" header="Current Status"></Column>
                <Column body={actionBodyTemplate} header="Action"></Column>
            </DataTable>
        </div>
    );
};

export default PendingLeave;