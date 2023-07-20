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

    const leaveHistory = [
        { id: "1", applied: "21-04-2023", total: "3" },
        { id: "2", applied: "21-04-2023", total: "3" },
        { id: "3", applied: "21-04-2023", total: "3" },
        { id: "4", applied: "21-04-2023", total: "3" },
        { id: "5", applied: "21-04-2023", total: "3" }
    ]

    const leaveHistoryTableHeader = () => {
        return (
            <div>
                <p>Leave History</p>
            </div>
        )
    }

    return (
        <div>
            <div className='w-1/2 shadow-xl'>
                <DataTable value={leaves} header={leaveHistoryTableHeader} size='small' >
                    <Column field="leave" header="Leave Type"></Column>
                    <Column field="total" header="Total"></Column>
                    <Column field="taken" header="Taken"></Column>
                    <Column field="balance" header="Balance"></Column>
                </DataTable>
            </div>
        </div>
    );
};

export default Leave;