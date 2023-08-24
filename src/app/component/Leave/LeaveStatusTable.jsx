'use client'

import { getLeaveStatus } from '@/libs/leaves';
import { useSession } from 'next-auth/react';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useEffect, useState } from 'react';

const LeaveStatusTable = () => {

    const [leaveStatus, setLeaveStatus] = useState(null)

    const { data: session, status } = useSession();

    const [loading, setLoading] = useState(false)

    const getLeaveStatusData = (employeeId) => {
        setLoading(true)
        fetch(`http://localhost:5000/api/v1/employee/leaveStatus/${employeeId}`)
            .then(res => res.json())
            .then(data => {
                setLeaveStatus(data.data)
            })
        setLoading(false)
    }

    useEffect(() => {
        getLeaveStatusData(session?.user._id)
    }, [session])


    return (
        <div>

            <div className='w-1/2 shadow-lg p-2 bg-white rounded-md'>

                <div className='flex items-center gap-x-2 mb-2'>
                    <h3 className='font-light'>LEAVE STATUS</h3>
                </div>
                <DataTable value={leaveStatus} loading={loading} size='small'>
                    <Column field="leaveType" header="Leave Type"></Column>
                    <Column field="total" header="Total"></Column>
                    <Column field="availed" header="Availed"></Column>
                    <Column field="balance" header="Balance"></Column>
                </DataTable>
            </div>
        </div>
    );
};

export default LeaveStatusTable;