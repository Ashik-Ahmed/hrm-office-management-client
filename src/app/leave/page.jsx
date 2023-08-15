'use client'

import { useSession } from 'next-auth/react';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import Loading from '../component/Loading/Loading';
import { Toast } from 'primereact/toast';

const Leave = () => {

    const { data: session, status } = useSession({
        required: true,
    });

    const toast = useRef()
    const [loading, setLoading] = useState()
    const [leaveApplicationHistory, setLeaveApplicationHistory] = useState(null);
    const [leaveFormDialog, setLeaveFormDialog] = useState(false)
    const [selectedLeave, setSelectedLeave] = useState(null);
    const [fromDate, setFromDate] = useState(null)
    const [toDate, setToDate] = useState(null)
    const [rejoinDate, setRejoinDate] = useState(null)


    const { register, formState: { errors }, handleSubmit, reset } = useForm();

    const getLeaveApplications = () => {
        fetch(`http://localhost:5000/api/v1/employee/leaveHistory/${session?.user._id}`)
            .then(res => res.json())
            .then(data => {
                console.log(data);
                setLeaveApplicationHistory(data.data)
            })
    }

    useEffect(() => {
        // const leaveData = getAllLeaveApplications(session?.user?._id);
        getLeaveApplications(session)

    }, [session])

    // const leaveApplications = await getAllLeaveApplications(session?.user?._id)

    const leaves = [
        { id: "1", leave: "Casual", total: 10, taken: 3, balance: 5 },
        { id: "2", leave: "Annual", total: 10, taken: 3, balance: 5 },
        { id: "3", leave: "Sick", total: 10, taken: 3, balance: 5 },
        { id: "4", leave: "Emergency", total: 10, taken: 3, balance: 5 },
        { id: "5", leave: "Maternity", total: 10, taken: 3, balance: 5 },
    ]

    const leaveHistoryTableHeader = () => {
        return (
            <div>
                <p>Leave Status</p>
            </div>
        )
    }

    const leaveApplicationTableHeader = () => {
        return (
            <div>
                <p>Leave Application History</p>
            </div>
        )
    }


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
                    getLeaveApplications()
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


    if (!session) {
        return <Loading />
    }

    return (
        <div className='py-2'>
            <Toast ref={toast} />
            <div className='w-1/2 shadow-lg'>
                <DataTable value={leaves} header={leaveHistoryTableHeader} size='small'>
                    <Column field="leave" header="Leave Type"></Column>
                    <Column field="total" header="Total"></Column>
                    <Column field="taken" header="Taken"></Column>
                    <Column field="balance" header="Balance"></Column>
                </DataTable>
            </div>

            <div className='mt-4 shadow-xl'>
                <Button onClick={() => setLeaveFormDialog(true)} label='Apply for Leave' className='p-button-sm' />
                <Dialog header="Leave Application" visible={leaveFormDialog} onHide={() => { resetForm() }}
                    style={{ width: '50vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }}>
                    <div>
                        <form onSubmit={handleSubmit(leaveApplication)} className='flex flex-col gap-2'>
                            <div>
                                <Dropdown
                                    {...register('leaveType', { required: "Leave type is required" })}
                                    value={selectedLeave} onChange={(e) => setSelectedLeave(e.value)} options={leaves} optionLabel="leave" placeholder="Select Leave Type" className='w-full' />
                                {errors.leaveType?.type === 'required' && <span className='text-xs text-red-500' role="alert">{errors.leaveType.message}</span>}
                            </div>
                            <div className="flex gap-x-4">
                                <div>
                                    <Calendar
                                        {...register("fromDate", { required: "From date is required" })} dateFormat="dd-mm-yy" value={fromDate} onSelect={(e) => { setFromDate(e.value); }} showIcon placeholder='From date' />
                                    {errors.fromDate?.type === 'required' && <span className='text-xs text-red-500' role="alert">{errors.fromDate.message}</span>}
                                </div>
                                <div>
                                    <Calendar
                                        {...register("toDate", { required: "To date is required" })} dateFormat="dd-mm-yy"
                                        value={toDate} onSelect={(e) => setToDate(e.value)} showIcon placeholder='To date' />
                                    {errors.toDate?.type === 'required' && <span className='text-xs text-red-500' role="alert">{errors.toDate.message}</span>}
                                </div>
                                <div>
                                    <InputText
                                        {...register("totalDay", { required: "From date is required" })}
                                        id="totalDay" placeholder='Total day' />
                                    {errors.totalDay?.type === 'required' && <span className='text-xs text-red-500' role="alert">{errors.totalDay.message}</span>}
                                </div>
                            </div>

                            <div>
                                <Calendar
                                    {...register("rejoinDate", { required: "Re-joining date is required" })}
                                    inputId="rejoin_date" value={rejoinDate} onSelect={(e) => { setRejoinDate(e.value); console.log(e.value); }} dateFormat="dd-mm-yy" showIcon placeholder='Re-joining date' className='w-full' />
                                {errors.rejoinDate?.type === 'required' && <span className='text-xs text-red-500' role="alert">{errors.rejoinDate.message}</span>}
                            </div>

                            <InputText
                                {...register("purpose")}
                                id="purpose" placeholder='Purpose of leave' className='w-full' />

                            <Button label='Submit' type='submit' loading={loading} />
                        </form>
                    </div>
                </Dialog>
                <div className='mt-1 shadow-lg'>
                    <DataTable value={leaveApplicationHistory} header={leaveApplicationTableHeader} size='small' emptyMessage="No previous application">
                        <Column field="leaveType" header="Leave Type"></Column>
                        <Column field="fromDate" header="From"></Column>
                        <Column field="toDate" header="To"></Column>
                        <Column field="rejoinDate" header="Re-joining Date"></Column>
                        <Column field="totalDay" header="Total"></Column>
                        <Column field="currentStatus.status" header="Current Status"></Column>
                    </DataTable>
                </div>
            </div>
        </div>
    );
};

export default Leave;