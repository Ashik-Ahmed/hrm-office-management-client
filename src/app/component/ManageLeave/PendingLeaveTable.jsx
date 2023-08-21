"use client"

import { useSession } from 'next-auth/react';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

const PendingLeave = ({ pendingLeaveApplications }) => {

    const { data: session, status } = useSession();

    const toast = useRef()

    const { register, formState: { errors }, handleSubmit, reset } = useForm();

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
                    toast.current.show({ severity: 'success', summary: 'Success', detail: 'Leave approved', life: 3000 });
                }
                else {
                    console.log("Failed to update");
                    toast.current.show({ severity: 'error', summary: 'Failed!', detail: `${data?.error}`, life: 3000 });
                }
                console.log(data);
                setLoading(false)
                setApproveDialog(false)
            })
    }


    const rejectLeaveApplication = (data) => {
        const currentStatus = {
            status: `Rejected by ${session.user.department}`,
            rejectionReason: data.rejectionReason,
            updatedBy: session.user.name
        }

        console.log(currentStatus);

        fetch(`http://localhost:5000/api/v1/leaveApplication/${rejectDialog._id}`, {
            method: "PATCH",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(currentStatus)
        })
            .then(res => res.json())
            .then(data => {
                if (data.data.modifiedCount > 0) {
                    console.log("Successfullu Rejected");
                    fetchPendingLeaveApplications()
                    toast.current.show({ severity: 'success', summary: 'Success', detail: 'Leave rejected', life: 3000 });
                }
                else {
                    console.log("Failed to update");
                    toast.current.show({ severity: 'error', summary: 'Failed!', detail: `${data?.error}`, life: 3000 });
                }

                setRejectDialog(false);
                reset();
            })
    }

    const actionBodyTemplate = (rowData) => {
        return (
            <div className='flex gap-x-2 items-center'>
                {/* <MdRemoveRedEye onClick={() => setDetailsDialog(rowData)} size={35} color='navy' className='cursor-pointer rounded-full p-2 hover:bg-gray-300' />
                <AiOutlineCheckCircle onClick={() => setApproveDialog(rowData)} size={25} color='green' className='rounded-full cursor-pointer' />
                <MdOutlineCancel onClick={() => setRejectDialog(rowData)} disabled size={25} color='red' className='rounded-full cursor-pointer' /> */}
                <Button onClick={() => setDetailsDialog(rowData)} icon="pi pi-info" rounded text raised severity='info' aria-label="Filter" />
                <Button onClick={() => setApproveDialog(rowData)} icon="pi pi-check"
                    disabled={
                        (rowData.currentStatus.status == `Approved by ${session?.user?.department}` || rowData.currentStatus.status == `Rejected by ${session?.user?.department}`) || rowData.currentStatus.status == "Approved by Management"
                    }
                    rounded text raised severity='success' aria-label="Filter" />
                <Button onClick={() => setRejectDialog(rowData)} icon="pi pi-times"
                    disabled={
                        (rowData.currentStatus.status == `Approved by ${session?.user?.department}` || rowData.currentStatus.status == `Rejected by ${session?.user?.department}`) || rowData.currentStatus.status == "Approved by Management"
                    }
                    rounded text raised severity="danger" aria-label="Cancel" />
            </div>
        )
    }

    return (
        <div>
            <Toast ref={toast} />
            <div className='bg-white p-2 rounded-md'>
                <div className='mb-2'>
                    <h3 className='font-light'>PENDING APPLICATIONS</h3>
                </div>
                <DataTable value={pendingApplications} size='small' emptyMessage="No pending applications">
                    <Column field='employee.name' header="Name"></Column>
                    <Column field="leaveType" header="Leave Type"></Column>
                    <Column field="totalDay" header="Total"></Column>
                    <Column field="currentStatus.status" header="Current Status"></Column>
                    <Column body={actionBodyTemplate} header="Action"></Column>
                </DataTable>
            </div>

            {/* Application Details Dialog  */}
            <div>
                <Dialog header="Leave Application Details" visible={detailsDialog} onHide={() => setDetailsDialog(false)}
                    style={{ width: '30vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }}>
                    <div>
                        <p>Employee: {detailsDialog?.employee?.name}</p>
                    </div>
                </Dialog>
            </div>

            {/* Approve Application Dialog  */}
            <div>
                <Dialog header="Approve Application" visible={approveDialog} onHide={() => setApproveDialog(false)}
                    style={{ width: '30vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }}>
                    <div>
                        <p>Employee: {approveDialog?.employee?.name}</p>
                        <p>Leave Type: {approveDialog?.leaveType}</p>
                        <p>Total day: {approveDialog?.totalDay}</p>
                    </div>
                    <div className='flex gap-x-2 justify-end'>
                        <Button onClick={() => approveLeaveApplicationStatus(`Approved by ${session.user.department}`)} disabled={!session} loading={loading} label="Approve" icon="pi pi-check" size='small' />
                    </div>
                </Dialog>
            </div >

            {/* Reject Application Dialog */}
            < div >
                <Dialog header="Confirm Rejection" visible={rejectDialog} onHide={() => { setRejectDialog(false); reset(); }}
                    style={{ width: '30vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }}>

                    <form onSubmit={handleSubmit(rejectLeaveApplication)}>
                        <div className='mb-2'>
                            <p>Employee: {rejectDialog?.employee?.name}</p>
                            <p>Leave Type: {rejectDialog?.leaveType}</p>
                            <p>Total Day: {rejectDialog?.totalDay}</p>
                        </div>

                        <div className='flex flex-col'>
                            <InputText
                                {...register("rejectionReason", { required: "Rejection reason is required" })}
                                placeholder='Specify rejection reason' />
                            {errors.rejectionReason?.type === 'required' && <span className='text-xs text-red-500' role="alert">{errors.rejectionReason.message}</span>}
                        </div>
                        <div className='flex justify-end mt-2'>
                            <Button type='submit' disabled={!session} loading={loading} label="Reject" icon="pi pi-times" severity='danger' size='small' />
                        </div>
                    </form>
                </Dialog>
            </div >
        </div >
    );
};

export default PendingLeave;