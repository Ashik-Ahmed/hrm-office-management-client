"use client"

import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import React, { useState } from 'react';
import { AiOutlineCheckCircle } from 'react-icons/ai';
import { MdOutlineCancel, MdRemoveRedEye } from 'react-icons/md';

const PendingLeave = ({ pendingLeaveApplications }) => {

    const [leaveDetails, setLeaveDetails] = useState(null);

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
                <MdRemoveRedEye onClick={() => setLeaveDetails(rowData)} size={35} color='gray' className='cursor-pointer rounded-full p-2 hover:bg-gray-300' />
                <AiOutlineCheckCircle size={25} color='green' className='rounded-full cursor-pointer' />
                <MdOutlineCancel size={25} color='red' className='rounded-full cursor-pointer' />
            </div>
        )
    }

    return (
        <div>
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

            <div>
                <Dialog header="Leave Application Details" visible={leaveDetails} onHide={() => setLeaveDetails(false)}
                    style={{ width: '50vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }}>
                    <div>
                        <p>Name: {leaveDetails?.employee?.name}</p>
                    </div>
                </Dialog>
            </div>
        </div>
    );
};

export default PendingLeave;