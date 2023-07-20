'use client'

import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React from 'react';

const Leave = () => {

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
                <DataTable value={applicationHistory} header={leaveApplicationTableHeader} size='small'>
                    <Column field="leaveType" header="Leave Type"></Column>
                    <Column field="applied" header="Application Date"></Column>
                    <Column field="total" header="Total"></Column>
                    <Column field="applicationStatus" header="Status"></Column>
                </DataTable>
            </div>
        </div>
    );
};

export default Leave;