'use client'

import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import React, { useState } from 'react';

const Leave = () => {

    const [leaveFormDialog, setLeaveFormDialog] = useState(false)
    const [selectedLeave, setSelectedLeave] = useState(null);
    const [fromDate, setFromDate] = useState(null)
    const [toDate, setToDate] = useState(null)
    const [rejoinDate, setRejoinDate] = useState(null)

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
                <p>Leave History</p>
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
                <Dialog header="Header" visible={leaveFormDialog} onHide={() => setLeaveFormDialog(false)}
                    style={{ width: '50vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }}>
                    <div>
                        <form className='flex flex-col gap-2'>
                            <Dropdown value={selectedLeave} onChange={(e) => setSelectedLeave(e.value)} options={leaves} optionLabel="leave" placeholder="Select Leave Type" className='w-full' />
                            <div className="flex gap-x-4">
                                <span className="p-float-label min-w-1/3">
                                    <Calendar inputId="from_date" value={fromDate} onChange={(e) => setFromDate(e.value)} />
                                    <label htmlFor="from_date">From</label>
                                </span>
                                <span className="p-float-label min-w-1/3">
                                    <Calendar inputId="to_date" value={toDate} onChange={(e) => setToDate(e.value)} />
                                    <label htmlFor="to_date">To</label>
                                </span>
                                <span className="p-float-label min-w-1/3">
                                    <InputText id="total_day" />
                                    <label htmlFor="total_day">Total day</label>
                                </span>
                            </div>
                            <span className="p-float-label">
                                <Calendar inputId="to_date" value={rejoinDate} onChange={(e) => setRejoinDate(e.value)} className='w-full' />
                                <label htmlFor="to_date">Re-joining date</label>
                            </span>
                            <span className="p-float-label min-w-1/3">
                                <InputText id="purpose" className='w-full' />
                                <label htmlFor="purpose">Purpose of Leave</label>
                            </span>

                            <Button label='Submit' />
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