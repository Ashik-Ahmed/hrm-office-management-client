'use client'

import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React from 'react';

const LeaveHistoryTable = ({ leaves }) => {


    return (
        <div>

            <div className='w-1/2 shadow-lg p-2 bg-white rounded-md'>

                <div className='flex items-center gap-x-2 mb-2'>
                    <h3 className='font-light'>LEAVE HISTORY</h3>
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

export default LeaveHistoryTable;