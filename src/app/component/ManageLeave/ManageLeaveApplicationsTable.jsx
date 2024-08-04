"use client"

import { useSession } from 'next-auth/react';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

const ManageLeaveApplicationsTable = ({ user }) => {

    console.log(user);

    const { data: session, status } = useSession();

    const toast = useRef()

    const { register, formState: { errors, isDirty, isValid }, handleSubmit, reset } = useForm();

    const [loading, setLoading] = useState(false)
    const [leaveApplications, setLeaveApplications] = useState([])
    const [detailsDialog, setDetailsDialog] = useState(null);
    const [approveDialog, setApproveDialog] = useState(null)
    const [rejectDialog, setRejectDialog] = useState(null);
    const [currentStatus, setCurrentStatus] = useState(null)
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())

    // define dropdown years range
    const years = [];
    for (let year = new Date().getFullYear() - 5; year <= new Date().getFullYear() + 5; year++) {
        years.push({
            value: year,
            label: year,
        });
    }

    const fetchLeaveApplications = () => {
        setLoading(true)
        fetch(`http://localhost:5000/api/v1/leaveApplication?year=${selectedYear}&status=${currentStatus || ''}`, {
            headers: {
                "Authorization": `Bearer ${user?.accessToken}`
            }
        })
            .then(res => res.json())
            .then(data => {
                setLeaveApplications(data.data)
                console.log(data.data);
            })
        setLoading(false)
    }

    useEffect(() => {
        fetchLeaveApplications()
    }, [selectedYear, currentStatus])

    const approveLeaveApplicationStatus = (status) => {
        setLoading(true)
        const currentStatus = {
            status: status,
            updatedBy: user.name
        }

        console.log(currentStatus);

        fetch(`http://localhost:5000/api/v1/leaveApplication/${approveDialog._id}`, {
            method: "PATCH",
            headers: {
                "content-type": "application/json",
                "Authorization": `Bearer ${user?.accessToken}`
            },
            body: JSON.stringify(currentStatus)
        })
            .then(res => res.json())
            .then(data => {
                if (data.data.modifiedCount > 0) {
                    console.log("Successfullu Approved");
                    fetchLeaveApplications()
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
            status: `Rejected by ${user.department}`,
            rejectionReason: data.rejectionReason,
            updatedBy: user.name
        }

        console.log(currentStatus);

        fetch(`http://localhost:5000/api/v1/leaveApplication/${rejectDialog._id}`, {
            method: "PATCH",
            headers: {
                "content-type": "application/json",
                "Authorization": `Bearer ${user?.accessToken}`
            },
            body: JSON.stringify(currentStatus)
        })
            .then(res => res.json())
            .then(data => {
                if (data.data?.modifiedCount > 0) {
                    console.log("Successfullu Rejected");
                    fetchLeaveApplications()
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

    const appliedOnBodyTemplate = (rowData) => {
        return (
            <div>
                {rowData?.createdAt.split("T")[0]}
            </div>
        )
    }

    const statusBodyTemplate = (rowData) => {
        return (
            <div>
                <p className={`w-fit p-1 rounded-md text-sm text-white text-center ${rowData?.currentStatus?.status == "Pending" ? "bg-yellow-400" : (rowData?.currentStatus?.status == "Approved by HR" ? "bg-green-400" : (rowData?.currentStatus?.status == "Approved by Management" ? "bg-blue-500" : "bg-red-400"))}`}> {rowData?.currentStatus?.status}</p>
            </div>
        )
    }

    const actionBodyTemplate = (rowData) => {
        return (
            <div className='flex gap-x-2 items-center'>
                {/* <MdRemoveRedEye onClick={() => setDetailsDialog(rowData)} size={35} color='navy' className='cursor-pointer rounded-full p-2 hover:bg-gray-300' />
                <AiOutlineCheckCircle onClick={() => setApproveDialog(rowData)} size={25} color='green' className='rounded-full cursor-pointer' />
                <MdOutlineCancel onClick={() => setRejectDialog(rowData)} disabled size={25} color='red' className='rounded-full cursor-pointer' /> */}
                <Button onClick={() => setDetailsDialog(rowData)} tooltip="View" tooltipOptions={buttonTooltipOptions} icon="pi pi-info" rounded text raised severity='info' aria-label="Filter" style={{ width: '35px', height: '35px' }} />
                <Button onClick={() => setApproveDialog(rowData)} tooltip="Approve" tooltipOptions={buttonTooltipOptions} icon="pi pi-check"
                    disabled={
                        (rowData.currentStatus.status == `Approved by ${user?.department}` || rowData.currentStatus.status == `Rejected by ${user?.department}`) || (rowData.currentStatus.status == "Approved by Management" || rowData.currentStatus.status == "Rejected by Management") || (rowData.currentStatus.status == "Rejected by Human Resource")
                    }
                    rounded text raised severity='success' aria-label="Filter" style={{ width: '35px', height: '35px' }} />
                <Button onClick={() => setRejectDialog(rowData)} tooltip="Reject" tooltipOptions={buttonTooltipOptions} icon="pi pi-times"
                    disabled={
                        (rowData.currentStatus.status == `Approved by ${user?.department}` || rowData.currentStatus.status == `Rejected by ${user?.department}`) || (rowData.currentStatus.status == "Approved by Management" || rowData.currentStatus.status == "Rejected by Management") || (rowData.currentStatus.status == "Rejected by Human Resource")
                    }
                    rounded text raised severity="danger" aria-label="Cancel" style={{ width: '35px', height: '35px' }} />
            </div>
        )
    }

    return (
        <div>
            <Toast ref={toast} />
            <div className='bg-white p-2 rounded-md'>
                <div className='flex justify-between items-center gap-x-2 mb-2'>
                    <h3 className='font-light'>LEAVE APPLICATIONS</h3>
                    <div className='flex gap-2'>
                        <div className='w-fit'>
                            {/* <Calendar value={filterYear} onChange={(e) => { setFilterYear(e.value); }} view="year" dateFormat="yy" className='w-fit' /> */}
                            <Dropdown options={["All", "Pending", "Approved", "Rejected"]} onChange={(e) => { setCurrentStatus(e.value); }} placeholder='Current Status' value={currentStatus} size='small' className='p-dropdown-sm' />
                        </div>
                        <div className='w-fit'>
                            {/* <Calendar value={filterYear} onChange={(e) => { setFilterYear(e.value); }} view="year" dateFormat="yy" className='w-fit' /> */}
                            <Dropdown options={years} onChange={(e) => { setSelectedYear(e.value); }} value={selectedYear} size='small' className='p-dropdown-sm' />
                        </div>
                    </div>
                </div>
                <DataTable value={leaveApplications} size='small' removableSort sortMode="multiple" loading={loading}>
                    <Column field="createdAt" body={appliedOnBodyTemplate} header="Applied on" sortable></Column>
                    <Column field='employee.name' header="Name" sortable></Column>
                    <Column field="leaveType" header="Leave Type"></Column>
                    <Column field="totalDay" header="Total"></Column>
                    <Column body={statusBodyTemplate} header="Current Status"></Column>
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
                            <span className='w-1/3'>Total Day: </span>
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
                            <span className='w-1/3'>Re-joining : </span>
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
                    <div className='flex justify-center my-2'>
                        <i className="pi pi-check-circle text-green-500" style={{ fontSize: '3rem' }}></i>
                    </div>
                    <div>
                        <p>Employee: {approveDialog?.employee?.name}</p>
                        <p>Leave Type: {approveDialog?.leaveType}</p>
                        <p>Total Day: {approveDialog?.totalDay}</p>
                    </div>
                    <div className='flex gap-x-2 justify-end mt-4'>
                        <Button onClick={() => approveLeaveApplicationStatus(`Approved by ${user?.department}`)} disabled={!user} loading={loading} label="Approve" size='small' className='p-button-sm' />
                    </div>
                </Dialog>
            </div >

            {/* Reject Application Dialog */}
            < div >
                <Dialog header="Confirm Rejection" visible={rejectDialog} onHide={() => { setRejectDialog(false); reset(); }}
                    style={{ width: '30vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }}>
                    <div className='flex justify-center my-2'>
                        <i className="pi pi-exclamation-circle text-red-500" style={{ fontSize: '3rem' }}></i>
                    </div>
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
                            <Button type='submit' disabled={!user || !isDirty || !isValid} loading={loading} label="Reject" severity='danger' size='small' />
                        </div>
                    </form>
                </Dialog>
            </div >
        </div >
    );
};

export default ManageLeaveApplicationsTable;