"use client"

import { useSession } from 'next-auth/react';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

const PendingLeave = () => {

    const { data: session, status } = useSession();

    const toast = useRef()

    const { register, formState: { errors, isDirty, isValid }, handleSubmit, reset } = useForm();

    const [loading, setLoading] = useState(false)
    const [pendingApplications, setPendingApplications] = useState([])
    const [detailsDialog, setDetailsDialog] = useState(null);
    const [approveDialog, setApproveDialog] = useState(null)
    const [rejectDialog, setRejectDialog] = useState(null)

    const fetchPendingLeaveApplications = () => {
        setLoading(true)
        fetch('http://localhost:5000/api/v1/leaveApplication/pendingApplications')
            .then(res => res.json())
            .then(data => {
                setPendingApplications(data.data)
            })
        setLoading(false)
    }

    useEffect(() => {
        fetchPendingLeaveApplications()
    }, [])

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
                {/* <MdRemoveRedEye onClick={() => setDetailsDialog(rowData)} size={35} color='navy' className='cursor-pointer rounded-full p-2 hover:bg-gray-300' />
                <AiOutlineCheckCircle onClick={() => setApproveDialog(rowData)} size={25} color='green' className='rounded-full cursor-pointer' />
                <MdOutlineCancel onClick={() => setRejectDialog(rowData)} disabled size={25} color='red' className='rounded-full cursor-pointer' /> */}
                <Button onClick={() => setDetailsDialog(rowData)} tooltip="View" tooltipOptions={buttonTooltipOptions} icon="pi pi-info" rounded text raised severity='info' aria-label="Filter" style={{ width: '35px', height: '35px' }} />
                <Button onClick={() => setApproveDialog(rowData)} tooltip="Approve" tooltipOptions={buttonTooltipOptions} icon="pi pi-check"
                    disabled={
                        (rowData.currentStatus.status == `Approved by ${session?.user?.department}` || rowData.currentStatus.status == `Rejected by ${session?.user?.department}`) || (rowData.currentStatus.status == "Approved by Management" || rowData.currentStatus.status == "Rejected by Management")
                    }
                    rounded text raised severity='success' aria-label="Filter" style={{ width: '35px', height: '35px' }} />
                <Button onClick={() => setRejectDialog(rowData)} tooltip="Reject" tooltipOptions={buttonTooltipOptions} icon="pi pi-times"
                    disabled={
                        (rowData.currentStatus.status == `Approved by ${session?.user?.department}` || rowData.currentStatus.status == `Rejected by ${session?.user?.department}`) || (rowData.currentStatus.status == "Approved by Management" || rowData.currentStatus.status == "Rejected by Management")
                    }
                    rounded text raised severity="danger" aria-label="Cancel" style={{ width: '35px', height: '35px' }} />
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
                <DataTable value={pendingApplications} size='small' loading={loading}>
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
                        <div className='flex justify-start'>
                            <span className='w-1/3'>Employee : </span>
                            <span>{detailsDialog?.employee?.name}</span>
                        </div>
                        <div className='flex justify-start'>
                            <span className='w-1/3'>Leave Type : </span>
                            <span>{detailsDialog?.leaveType}</span>
                        </div>
                        <div className='flex justify-start'>
                            <span className='w-1/3'>Total : </span>
                            <span>{detailsDialog?.totalDay}</span>
                        </div>
                        <div className='flex justify-start'>
                            <span className='w-1/3'>From : </span>
                            <span>{detailsDialog?.fromDate?.split("T")[0]}</span>
                        </div>
                        <div className='flex justify-start'>
                            <span className='w-1/3'>To : </span>
                            <span>{detailsDialog?.toDate?.split("T")[0]}</span>
                        </div>
                        <div className='flex justify-start'>
                            <span className='w-1/3'>Rejoin Date : </span>
                            <span>{detailsDialog?.rejoinDate?.split("T")[0]}</span>
                        </div>
                        <div className='flex justify-start'>
                            <span className='w-1/3'>Purpose : </span>
                            <span>{detailsDialog?.purpose}</span>
                        </div>
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
                    <div className='flex gap-x-2 justify-end mt-4'>
                        <Button onClick={() => approveLeaveApplicationStatus(`Approved by ${session.user.department}`)} disabled={!session} loading={loading} label="Approve" size='small' className='p-button-sm' />
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
                                placeholder='Specify rejection reason' className='p-inputtext-sm' />
                            {errors.rejectionReason?.type === 'required' && <span className='text-xs text-red-500' role="alert">{errors.rejectionReason.message}</span>}
                        </div>
                        <div className='flex justify-end mt-2'>
                            <Button type='submit' disabled={!session || !isDirty || !isValid} loading={loading} label="Reject" severity='danger' size='small' />
                        </div>
                    </form>
                </Dialog>
            </div >
        </div >
    );
};

export default PendingLeave;