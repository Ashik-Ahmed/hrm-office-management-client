'use client'

import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useState } from 'react';
import { AiFillPlusSquare } from 'react-icons/ai';

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
            <div className='w-full shadow-lg bg-white p-2 rounded-md'>
                <div className='flex items-center gap-x-2 mb-2'>
                    <h3 className='font-light'>AVAILABLE LEAVES</h3>
                    {/* <Button onClick={() => setAddUserDialog(true)} icon="pi pi-plus" className='p-button p-button-sm p-button-info' /> */}
                    <AiFillPlusSquare size={20} color='#8C239E' className='cursor-pointer' />
                </div>
                <DataTable value={leaves} size='small'>
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