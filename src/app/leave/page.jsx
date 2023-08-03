'use client'

import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

const Leave = () => {

    const [leaveFormDialog, setLeaveFormDialog] = useState(false)
    const [selectedLeave, setSelectedLeave] = useState(null);
    const [fromDate, setFromDate] = useState(null)
    const [toDate, setToDate] = useState(null)
    const [rejoinDate, setRejoinDate] = useState(null)


    const { register, formState: { errors }, handleSubmit, reset } = useForm();

    const leaves = [
        { id: "1", leave: "Casual", total: 10, taken: 3, balance: 5 },
        { id: "2", leave: "Annual", total: 10, taken: 3, balance: 5 },
        { id: "3", leave: "Sick", total: 10, taken: 3, balance: 5 },
        { id: "4", leave: "Emergency", total: 10, taken: 3, balance: 5 },
        { id: "5", leave: "Maternity", total: 10, taken: 3, balance: 5 },
    ]

    const applicationHistory = [
        { id: "1", leaveType: "Casual", applied: "21-04-2023", total: "3", applicationStatus: 'HR Approved' },
        { id: "2", leaveType: "Annual", applied: "21-04-2023", total: "3", applicationStatus: 'HR Approved' },
        { id: "3", leaveType: "Sick", applied: "21-04-2023", total: "3", applicationStatus: 'HR Approved' },
        { id: "4", leaveType: "Emergency", applied: "21-04-2023", total: "3", applicationStatus: 'HR Approved' },
        { id: "5", leaveType: "Maternity", applied: "21-04-2023", total: "3", applicationStatus: 'HR Approved' },
        { id: "6", leaveType: "Maternity", applied: "21-04-2023", total: "3", applicationStatus: 'HR Approved' },
        { id: "7", leaveType: "Maternity", applied: "21-04-2023", total: "3", applicationStatus: 'HR Approved' },
        { id: "8", leaveType: "Maternity", applied: "21-04-2023", total: "3", applicationStatus: 'HR Approved' },
        { id: "9", leaveType: "Maternity", applied: "21-04-2023", total: "3", applicationStatus: 'HR Approved' },
        { id: "10", leaveType: "Maternity", applied: "21-04-2023", total: "3", applicationStatus: 'HR Approved' },
        { id: "11", leaveType: "Maternity", applied: "21-04-2023", total: "3", applicationStatus: 'HR Approved' },
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
        data.fromDate = fromDate.toLocaleDateString('en-GB')
        data.toDate = toDate.toLocaleDateString('en-GB')
        data.rejoinDate = rejoinDate.toLocaleDateString('en-GB')
        console.log(data);
    }
    return (
        <div className='py-2'>
            <div className='w-1/2 shadow-xl'>
                <DataTable value={leaves} header={leaveHistoryTableHeader} size='small'>
                    <Column field="leave" header="Leave Type"></Column>
                    <Column field="total" header="Total"></Column>
                    <Column field="taken" header="Taken"></Column>
                    <Column field="balance" header="Balance"></Column>
                </DataTable>
            </div>

            <div className='mt-4 shadow-xl'>
                <Button onClick={() => setLeaveFormDialog(true)} label='Apply for Leave' className='p-button-sm' />
                <Dialog header="Leave Application" visible={leaveFormDialog} onHide={() => setLeaveFormDialog(false)}
                    style={{ width: '50vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }}>
                    <div>
                        <form onSubmit={handleSubmit(leaveApplication)} className='flex flex-col gap-2'>
                            <div>
                                <Dropdown
                                    {...register('leave_type', { required: "Leave type is required" })}
                                    value={selectedLeave} onChange={(e) => setSelectedLeave(e.value)} options={leaves} optionLabel="leave" placeholder="Select Leave Type" className='w-full' />
                                {errors.leave_type?.type === 'required' && <span className='text-xs text-red-500' role="alert">{errors.leave_type.message}</span>}
                            </div>
                            <div className="flex gap-x-4">
                                <div>
                                    <Calendar
                                        {...register("fromDate", { required: "From date is required" })}
                                        value={fromDate} onSelect={(e) => {
                                            // Manually trigger a change event
                                            setFromDate(e.value);
                                        }} showIcon placeholder='From date' />
                                    {errors.fromDate?.type === 'required' && <span className='text-xs text-red-500' role="alert">{errors.fromDate.message}</span>}
                                </div>
                                <div>
                                    <Calendar
                                        {...register("toDate", { required: "To date is required" })}
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
                                    inputId="rejoin_date" value={rejoinDate} onSelect={(e) => setRejoinDate(e.value)} showIcon placeholder='Re-joining date' className='w-full' />
                                {errors.rejoinDate?.type === 'required' && <span className='text-xs text-red-500' role="alert">{errors.rejoinDate.message}</span>}
                            </div>

                            <InputText
                                {...register("purpose")}
                                id="purpose" placeholder='Purpose of leave' className='w-full' />

                            <Button label='Submit' type='submit' />
                        </form>
                    </div>
                </Dialog>
                <div className='mt-1'>
                    <DataTable value={applicationHistory} header={leaveApplicationTableHeader} size='small'>
                        <Column field="leaveType" header="Leave Type"></Column>
                        <Column field="applied" header="Application Date"></Column>
                        <Column field="total" header="Total"></Column>
                        <Column field="applicationStatus" header="Status"></Column>
                    </DataTable>
                </div>
            </div>
        </div>
    );
};

export default Leave;