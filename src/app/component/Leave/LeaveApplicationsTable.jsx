'use client'

import { useSession } from 'next-auth/react';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

const LeaveApplicationsTable = ({ leaves }) => {

    const toast = useRef()
    const { data: session, status } = useSession();
    const { register, formState: { errors }, handleSubmit, reset } = useForm();

    const [leaveApplicationHistory, setLeaveApplicationHistory] = useState(null)
    const [leaveStatus, setLeaveStatus] = useState()
    const [leaveFormDialog, setLeaveFormDialog] = useState(false);
    const [selectedLeave, setSelectedLeave] = useState(null);
    const [fromDate, setFromDate] = useState(null)
    const [toDate, setToDate] = useState(null)
    const [totalDay, setTotalDay] = useState(null)
    const [maxToDate, setMaxToDate] = useState()
    const [rejoinDate, setRejoinDate] = useState(null)
    const [loading, setLoading] = useState(false)

    const getLeaveApplications = (employeeId) => {
        setLoading(true)
        console.log(employeeId);
        fetch(`http://localhost:5000/api/v1/employee/leaveApplications/${employeeId}`)
            .then(res => res.json())
            .then(data => {
                console.log(data);
                setLeaveApplicationHistory(data.data)
            })
        setLoading(false)
    }

    const getLeaveStatusData = (employeeId) => {
        fetch(`http://localhost:5000/api/v1/employee/leaveStatus/${employeeId}`)
            .then(res => res.json())
            .then(data => {
                console.log(data.data);
                setLeaveStatus(data.data)
            })
    }

    useEffect(() => {
        getLeaveApplications(session?.user._id);
        getLeaveStatusData(session?.user._id)
    }, [session])

    const leaveApplication = (data) => {
        setLoading(true);
        data.employee = {
            name: session.user.name,
            employeeId: session.user._id
        };
        data.fromDate = fromDate.toLocaleDateString('en-GB').replace(/\//g, '-').split('-').reverse().join('-');
        data.toDate = toDate.toLocaleDateString('en-GB').replace(/\//g, '-').split('-').reverse().join('-');
        data.rejoinDate = rejoinDate.toLocaleDateString('en-GB').replace(/\//g, '-').split('-').reverse().join('-');
        console.log(data);

        fetch('http://localhost:5000/api/v1/leaveApplication', {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                if (data.status == "Success") {
                    resetForm();
                    getLeaveApplications(session.user._id);
                    getLeaveStatusData(session.user._id)
                    toast.current.show({ severity: 'success', summary: 'Success', detail: 'Application Successful', life: 3000 });
                }
                else {
                    toast.current.show({ severity: 'error', summary: 'Failed!', detail: `${data?.error}`, life: 3000 });
                }
            })
    }

    const resetForm = () => {
        setLoading(false)
        setLeaveFormDialog(false);
        setSelectedLeave(null);
        setFromDate(null);
        setToDate(null);
        setRejoinDate(null);
        reset()
    }

    const handleStartDateChange = (e) => {
        const selectedStartDate = e.value;
        const maxEndDate = new Date(selectedStartDate);
        maxEndDate.setDate(selectedStartDate.getDate() + (selectedLeave.balance - 1)); // Maximum 2 days from start date
        setMaxToDate(maxEndDate);
    };

    const fromBodyTemplate = (rowData) => {
        return (
            <div>
                {rowData.fromDate.split("T")[0]}
            </div>
        )
    }

    const toBodyTemplate = (rowData) => {
        return (
            <div>
                {rowData.toDate.split("T")[0]}
            </div>
        )
    }

    const rejoinBodyTemplate = (rowData) => {
        return (
            <div>
                {rowData.rejoinDate.split("T")[0]}
            </div>
        )
    }

    return (
        <div>
            <Toast ref={toast} />
            <Button onClick={() => setLeaveFormDialog(true)} label='Apply for Leave' className='p-button-sm' />
            <Dialog header="Leave Application" visible={leaveFormDialog} onHide={() => { resetForm() }}
                style={{ width: '50vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }}>
                <div>
                    <form onSubmit={handleSubmit(leaveApplication)} className='flex flex-col gap-2'>
                        <div>
                            <Dropdown
                                {...register('leaveType', { required: "Leave type is required" })}
                                value={selectedLeave} onChange={(e) => { setSelectedLeave(e.value); console.log(e.value); }} options={leaveStatus} optionLabel="leaveType" placeholder="Select Leave Type*" className='w-full' />
                            {errors.leaveType?.type === 'required' && <span className='text-xs text-red-500' role="alert">{errors.leaveType.message}</span>}
                        </div>
                        <div className="flex gap-x-4">
                            <div>
                                <Calendar
                                    {...register("fromDate", { required: "From date is required" })} dateFormat="dd-mm-yy" value={fromDate} onSelect={(e) => { setFromDate(e.value); handleStartDateChange(e) }} showIcon placeholder='From date*' />
                                {errors.fromDate?.type === 'required' && <span className='text-xs text-red-500' role="alert">{errors.fromDate.message}</span>}
                            </div>
                            <div>
                                <Calendar
                                    {...register("toDate", { required: "To date is required" })} dateFormat="dd-mm-yy" minDate={fromDate} maxDate={maxToDate}
                                    value={toDate} onSelect={(e) => setToDate(e.value)} showIcon placeholder='To date*' />
                                {errors.toDate?.type === 'required' && <span className='text-xs text-red-500' role="alert">{errors.toDate.message}</span>}
                            </div>
                            <div>
                                <InputText
                                    {...register("totalDay", { required: "Total day is required" })} placeholder={`${(toDate?.getDate() - fromDate?.getDate()) + 1 || "Total day*"}`} />
                                {errors.totalDay?.type === 'required' && <span className='text-xs text-red-500' role="alert">{errors.totalDay.message}</span>}
                            </div>
                        </div>

                        <div>
                            <Calendar
                                {...register("rejoinDate", { required: "Re-joining date is required" })}
                                inputId="rejoin_date" value={rejoinDate} onSelect={(e) => { setRejoinDate(e.value); console.log(e.value); }} dateFormat="dd-mm-yy" showIcon placeholder='Re-joining date*' className='w-full' />
                            {errors.rejoinDate?.type === 'required' && <span className='text-xs text-red-500' role="alert">{errors.rejoinDate.message}</span>}
                        </div>

                        <InputText
                            {...register("purpose")}
                            id="purpose" placeholder='Purpose of leave' className='w-full' />
                        <Button label='Submit' type='submit' loading={loading} />
                    </form>
                </div>
            </Dialog>

            <div className='mt-1 shadow-lg p-2 bg-white rounded-md'>
                <div className='flex items-center gap-x-2 mb-2'>
                    <h3 className='font-light'>LEAVE APPLICATIONS</h3>
                </div>
                <DataTable value={leaveApplicationHistory} loading={loading} size='small' emptyMessage="No previous application">
                    <Column field="leaveType" header="Leave Type"></Column>
                    <Column body={fromBodyTemplate} header="From"></Column>
                    <Column body={toBodyTemplate} header="To"></Column>
                    <Column body={rejoinBodyTemplate} header="Re-joining Date"></Column>
                    <Column field="totalDay" header="Total"></Column>
                    <Column field="currentStatus.status" header="Current Status"></Column>
                </DataTable>
            </div>
        </div>
    );
};

export default LeaveApplicationsTable;