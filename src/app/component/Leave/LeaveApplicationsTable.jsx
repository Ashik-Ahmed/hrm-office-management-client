'use client'

import { customDateFormat } from '@/utils/dateformatter';
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

const LeaveApplicationsTable = ({ user }) => {

    const toast = useRef()
    const { register, formState: { errors }, handleSubmit, reset } = useForm();
    // console.log("session: ", session);
    // console.log("user: ", user);

    const [leaveApplicationHistory, setLeaveApplicationHistory] = useState(null)
    const [leaveStatus, setLeaveStatus] = useState()
    const [leaveFormDialog, setLeaveFormDialog] = useState(false);
    const [selectedLeave, setSelectedLeave] = useState(null);
    const [fromDate, setFromDate] = useState(null)
    const [toDate, setToDate] = useState(null)
    const [maxToDate, setMaxToDate] = useState()
    const [rejoinDate, setRejoinDate] = useState(null)
    const [loading, setLoading] = useState(false)
    const [selectedYear, setSelectedYear] = useState(new Date()?.getFullYear())

    // define dropdown years range
    const years = [];
    for (let year = new Date()?.getFullYear() - 5; year <= new Date()?.getFullYear() + 5; year++) {
        years.push({
            value: year,
            label: year,
        });
    }

    const getLeaveApplications = (employeeId) => {
        setLoading(true)
        fetch(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/employee/leaveApplications/${employeeId}?year=${selectedYear}`, {
            headers: {
                'Authorization': `Bearer ${user?.accessToken}`
            }
        })
            .then(res => res.json())
            .then(data => {
                console.log(data.data)
                setLeaveApplicationHistory(data?.data)
            })
        setLoading(false)
    }

    const getLeaveStatusData = (employeeId) => {
        setLoading(true)
        fetch(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/employee/leaveStatus/${employeeId}`, {
            headers: {
                'Authorization': `Bearer ${user?.accessToken}`
            }
        })
            .then(res => res.json())
            .then(data => {
                setLeaveStatus(data?.data)
            })
        setLoading(false)
    }

    useEffect(() => {
        getLeaveApplications(user._id);
        getLeaveStatusData(user._id)
    }, [selectedYear])

    const leaveApplication = (data) => {
        setLoading(true);
        data.employee = {
            name: user.name,
            employeeId: user._id,
            email: user.email
        };
        data.fromDate = fromDate.toLocaleDateString('en-GB').replace(/\//g, '-').split('-').reverse().join('-');
        data.toDate = toDate.toLocaleDateString('en-GB').replace(/\//g, '-').split('-').reverse().join('-');
        data.rejoinDate = rejoinDate.toLocaleDateString('en-GB').replace(/\//g, '-').split('-').reverse().join('-');
        console.log(data);

        fetch(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/leaveApplication`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${user?.accessToken}`
            },
            body: JSON.stringify(data)
        })
            .then(res => res.json())
            .then(data => {
                if (data.status == "Success") {
                    resetForm();
                    getLeaveApplications(user._id);
                    getLeaveStatusData(user._id)
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
                {customDateFormat(rowData.fromDate).split(",")[0]}
            </div>
        )
    }

    const toBodyTemplate = (rowData) => {
        return (
            <div>
                {customDateFormat(rowData.toDate).split(",")[0]}
            </div>
        )
    }

    const rejoinBodyTemplate = (rowData) => {
        return (
            <div>
                {customDateFormat(rowData.rejoinDate).split(",")[0]}
            </div>
        )
    }

    const statusBodyTemplate = (rowData) => {
        return (
            <div>
                <p className={`w-fit p-1 rounded-md text-sm text-white text-center ${rowData?.currentStatus?.status == "Pending" ? "bg-yellow-400" : ((rowData?.currentStatus?.status == "Approved" ? "bg-blue-500" : "bg-red-400"))}`}> {rowData?.currentStatus?.status} {rowData?.currentStatus?.actedDept && `by ${rowData?.currentStatus?.actedDept}`}</p>
            </div>
        )
    }

    return (
        <div>
            <Toast ref={toast} />
            <Button onClick={() => setLeaveFormDialog(true)} label='Apply for Leave' className='p-button-sm' />

            {/* Leave Application Form */}
            <Dialog header="Leave Application" visible={leaveFormDialog} onHide={() => { resetForm() }}
                style={{ width: '50vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }}>
                <div>
                    <form onSubmit={handleSubmit(leaveApplication)} className='flex flex-col gap-2'>
                        <div>
                            <Dropdown
                                {...register('leaveType', { required: "Leave type is required" })}
                                value={selectedLeave} onChange={(e) => { setSelectedLeave(e.value) }} options={leaveStatus} optionLabel="leaveType" placeholder="Select Leave Type*" className='w-full' />
                            {errors.leaveType?.type === 'required' && <span className='text-xs text-red-500' role="alert">{errors.leaveType.message}</span>}
                        </div>
                        <div className="flex gap-x-4">
                            <div>
                                <Calendar
                                    {...register("fromDate", { required: "From date is required" })} dateFormat="dd-mm-yy" value={fromDate} onSelect={(e) => { setFromDate(e.value); handleStartDateChange(e) }} disabled={!selectedLeave} showIcon placeholder='From date*' />
                                {errors.fromDate?.type === 'required' && <span className='text-xs text-red-500' role="alert">{errors?.fromDate?.message}</span>}
                            </div>
                            <div>
                                <Calendar
                                    {...register("toDate", { required: "To date is required" })} dateFormat="dd-mm-yy" minDate={fromDate} maxDate={maxToDate}
                                    value={toDate} onSelect={(e) => setToDate(e.value)} disabled={!selectedLeave} showIcon placeholder='To date*' />
                                {errors.toDate?.type === 'required' && <span className='text-xs text-red-500' role="alert">{errors.toDate?.message}</span>}
                            </div>
                            <div>
                                <InputText
                                    {...register("totalDay", { required: "Total day is required" })} placeholder={`${((toDate?.getTime() - fromDate?.getTime()) / (1000 * 3600 * 24)) + 1 || "Total day*"}`} />
                                {errors.totalDay?.type === 'required' && <span className='text-xs text-red-500' role="alert">{errors.totalDay.message}</span>}
                            </div>
                        </div>

                        <div>
                            <Calendar
                                {...register("rejoinDate", { required: "Re-joining date is required" })}
                                inputId="rejoin_date" value={rejoinDate} onSelect={(e) => { setRejoinDate(e.value) }} dateFormat="dd-mm-yy" disabled={!toDate} minDate={toDate} showIcon placeholder='Re-joining date*' className='w-full' />
                            {errors.rejoinDate?.type === 'required' && <span className='text-xs text-red-500' role="alert">{errors.rejoinDate.message}</span>}
                        </div>

                        <InputText
                            {...register("purpose")}
                            id="purpose" placeholder='Purpose of leave' className='w-full' />

                        <div className='mt-4 text-right'>
                            <Button label='Submit' type='submit' loading={loading} className='p-button-sm' />
                        </div>
                    </form>
                </div>
            </Dialog>

            {/* Leave Application Table */}
            <div className='mt-1 shadow-lg p-2 bg-white rounded-md'>
                <div className='flex justify-between items-center gap-x-2 mb-2'>
                    <h3 className='font-light'>LEAVE APPLICATIONS</h3>
                    <div className='w-fit'>
                        {/* <Calendar value={filterYear} onChange={(e) => { setFilterYear(e.value); }} view="year" dateFormat="yy" className='w-fit' /> */}
                        <Dropdown options={years} onChange={(e) => { setSelectedYear(e.value); }} value={selectedYear} size='small' className='p-dropdown-sm' />
                    </div>
                </div>
                <DataTable value={leaveApplicationHistory} loading={loading} responsiveLayout="scroll" resizableColumns size='small' emptyMessage="No previous application">
                    <Column field="leaveType" header="Leave Type"></Column>
                    <Column body={fromBodyTemplate} header="From"></Column>
                    <Column body={toBodyTemplate} header="To"></Column>
                    <Column body={rejoinBodyTemplate} header="Re-joining Date"></Column>
                    <Column field="totalDay" header="Total"></Column>
                    <Column body={statusBodyTemplate} header="Current Status"></Column>
                </DataTable>
            </div>
        </div>
    );
};

export default LeaveApplicationsTable;