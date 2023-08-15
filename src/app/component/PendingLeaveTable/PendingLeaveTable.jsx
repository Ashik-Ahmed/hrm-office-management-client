"use client"

import { getAllPendingLeaveApplications } from '@/libs/leaves';
import { useSession } from 'next-auth/react';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import React, { useState } from 'react';
import { AiOutlineCheckCircle } from 'react-icons/ai';
import { MdOutlineCancel, MdRemoveRedEye } from 'react-icons/md';

const PendingLeave = ({ pendingLeaveApplications }) => {
    const { data: session, status } = useSession();

    const [loading, setLoading] = useState(false)
    const [pendingApplications, setPendingApplications] = useState(pendingLeaveApplications)
    const [detailsDialog, setDetailsDialog] = useState(null);
    const [approveDialog, setApproveDialog] = useState(null)
    const [rejectDialog, setRejectDialog] = useState(null)

    const fetchPendingLeaveApplications = () => {
        fetch('http://localhost:5000/api/v1/leaveApplication/pendingApplications')
            .then(res => res.json())
            .then(data => {
                setPendingApplications(data.data)
            })
    }

    const approveLeaveApplicationStatus = (status) => {
        setLoading(true)
        const currentStatus = {
            status: status,
            updatedBy: session.user.name
        }

        console.log(currentStatus);

        fetch(`http://localhost:5000/api/v1/leaveApplication/${approveDialog._id}`, {
            method: "PATCH",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(currentStatus)
        })
            .then(res => res.json())
            .then(data => {
                if (data.data.modifiedCount > 0) {
                    console.log("Successfullu Approved");
                    fetchPendingLeaveApplications()
                }
                else {
                    console.log("Failed to update");
                }
                console.log(data);
                setLoading(false)
                setApproveDialog(false)
            })
    }


    const rejectLeaveApplication = (leaveApplication) => {
        console.log("Rejected Application of: ", leaveApplication.employee.name);
    }

    const pendignLeaveTableHeader = () => {
        return (
            <div>
                <p>Pending Leave Applications</p>
            </div>
        )
    }

    const actionBodyTemplate = (rowData) => {
        return (
            <div className='flex gap-x-2 items-center'>
                {/* <MdRemoveRedEye onClick={() => setDetailsDialog(rowData)} size={35} color='navy' className='cursor-pointer rounded-full p-2 hover:bg-gray-300' />
                <AiOutlineCheckCircle onClick={() => setApproveDialog(rowData)} size={25} color='green' className='rounded-full cursor-pointer' />
                <MdOutlineCancel onClick={() => setRejectDialog(rowData)} disabled size={25} color='red' className='rounded-full cursor-pointer' /> */}
                <Button onClick={() => setDetailsDialog(rowData)} icon="pi pi-info" rounded text raised severity='info' aria-label="Filter" />
                <Button onClick={() => setApproveDialog(rowData)} icon="pi pi-check" rounded text raised severity='success' aria-label="Filter" />
                <Button onClick={() => setRejectDialog(rowData)} icon="pi pi-times" rounded text raised severity="danger" aria-label="Cancel" />
            </div>
        )
    }

    return (
        <div>
            <div>
                <DataTable value={pendingApplications} header={pendignLeaveTableHeader} size='small' emptyMessage="No pending applications">
                    <Column field='employee.name' header="Name"></Column>
                    <Column field="leaveType" header="Leave Type"></Column>
                    <Column field="fromDate" header="From"></Column>
                    <Column field="toDate" header="To"></Column>
                    <Column field="totalDay" header="Total"></Column>
                    <Column field="currentStatus.status" header="Current Status"></Column>
                    <Column body={actionBodyTemplate} header="Action"></Column>
                </DataTable>
            </div>

            {/* Application Details Dialog  */}
            <div>
                <Dialog header="Leave Application Details" visible={detailsDialog} onHide={() => setDetailsDialog(false)}
                    style={{ width: '50vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }}>
                    <div>
                        <p>Name: {detailsDialog?.employee?.name}</p>
                    </div>
                </Dialog>
            </div>

            {/* Approve Application Dialog  */}
            <div>
                <Dialog header="Approve Application" visible={approveDialog} onHide={() => setApproveDialog(false)}
                    style={{ width: '30vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }}>
                    <div>
                        <p>Name: {approveDialog?.employee?.name}</p>
                        <p>Leave Type: {approveDialog?.leaveType}</p>
                        <p>Total day: {approveDialog?.totalDay}</p>
                    </div>
                    <div className='flex gap-x-2 justify-end'>
                        <Button onClick={() => approveLeaveApplicationStatus(`Approved by ${session.user.department}`)} disabled={!session} loading={loading} label="Approve" icon="pi pi-check" className='p-button-sm' />
                    </div>
                </Dialog>
            </div >

            {/* Reject Application Dialog */}
            < div >
                <Dialog header="Confirm Rejection" visible={rejectDialog} onHide={() => setRejectDialog(false)}
                    style={{ width: '50vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }}>
                    <div>
                        <p>Name: {rejectDialog?.employee?.name}</p>
                    </div>
                </Dialog>
            </div >
        </div >
    );
};

export default PendingLeave;