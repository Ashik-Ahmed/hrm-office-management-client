'use client'

import { useSession } from 'next-auth/react';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useEffect, useState } from 'react';

const LeaveStatusTable = ({ leaves }) => {

    const [leaveStatus, setLeaveStatus] = useState(null)

    const { data: session, status } = useSession();

    const getLeaveStatus = () => {
        fetch(`http://localhost:5000/api/v1/employee/leaveStatus/${session?.user._id}`)
            .then(res => res.json())
            .then(data => {
                setLeaveStatus(data.data)
            })
    }

    useEffect(() => {
        getLeaveStatus()
    }, [session])

    const balanceLeaveBodyTemplate = (rowData) => {
        return (
            <div>
                {rowData.total - rowData.availed}
            </div>
        )
    }


    return (
        <div>

            <div className='w-1/2 shadow-lg p-2 bg-white rounded-md'>

                <div className='flex items-center gap-x-2 mb-2'>
                    <h3 className='font-light'>LEAVE STATUS</h3>
                </div>
                <DataTable value={leaveStatus} size='small'>
                    <Column field="leaveType" header="Leave Type"></Column>
                    <Column field="total" header="Total"></Column>
                    <Column field="availed" header="Availed"></Column>
                    <Column body={balanceLeaveBodyTemplate} header="Balance"></Column>
                </DataTable>
            </div>
        </div>
    );
};

export default LeaveStatusTable;