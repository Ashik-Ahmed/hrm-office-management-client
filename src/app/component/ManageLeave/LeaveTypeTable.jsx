'use client'

import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useState } from 'react';

const LeaveTypeTable = () => {

    const [leaves, setLeaves] = useState(null);

    const leaveTypeTableHeader = () => {
        return (
            <div>
                <p>Leave Type</p>
            </div>
        )
    }

    return (
        <div>
            <div className='w-full shadow-lg'>
                <DataTable value={leaves} header={leaveTypeTableHeader} size='small'>
                    <Column field="leave" header="Leave Type"></Column>
                    <Column field="total" header="Total"></Column>
                    <Column field="taken" header="Taken"></Column>
                    <Column field="balance" header="Balance"></Column>
                </DataTable>
            </div>
        </div>
    );
};

export default LeaveTypeTable;