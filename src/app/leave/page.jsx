'use client'

import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React from 'react';

const Leave = () => {

    const leaves = [
        { id: "1", leave: "Casual", taken: 3, available: 5 },
        { id: "2", leave: "Annual", taken: 3, available: 5 },
        { id: "3", leave: "Sick", taken: 3, available: 5 },
        { id: "4", leave: "Emergency", taken: 3, available: 5 },
        { id: "5", leave: "Maternity", taken: 3, available: 5 },
    ]

    const leaveHistory = [
        { id: "1", applied: "21-04-2023", total: "3" },
        { id: "2", applied: "21-04-2023", total: "3" },
        { id: "3", applied: "21-04-2023", total: "3" },
        { id: "4", applied: "21-04-2023", total: "3" },
        { id: "5", applied: "21-04-2023", total: "3" }
    ]

    return (
        <div>
            <h2>Leave History</h2>

            <div className='w-1/2 shadow-xl'>
                <DataTable value={leaves} size='small' tableStyle={{ minWidth: '50rem' }}>
                    <Column field="leave" header="Leave"></Column>
                    <Column field="taken" header="Taken"></Column>
                    <Column field="available" header="Available"></Column>
                </DataTable>
            </div>
        </div>
    );
};

export default Leave;