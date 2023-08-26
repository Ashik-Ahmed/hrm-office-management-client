'use client'

import { useSession } from 'next-auth/react';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useEffect, useState } from 'react';
import { Dropdown } from 'primereact/dropdown';

const LeaveStatusTable = () => {

    const [leaveStatus, setLeaveStatus] = useState(null)

    const { data: session, status } = useSession();

    const [loading, setLoading] = useState(false)
    const [filterYear, setFilterYear] = useState(new Date().getFullYear())

    // define dropdown years range
    const years = [];
    for (let year = 2021; year <= 2030; year++) {
        years.push({
            value: year,
            label: year,
        });
    }
    // console.log(years);

    const getLeaveStatusData = (employeeId) => {
        setLoading(true)
        console.log("filter year value: ", filterYear);
        const url = `http://localhost:5000/api/v1/employee/leaveStatus/${employeeId}?year=${filterYear}`

        console.log(url);

        fetch(url)
            .then(res => res.json())
            .then(data => {
                setLeaveStatus(data.data)
            })
        setLoading(false)
    }

    useEffect(() => {
        getLeaveStatusData(session?.user._id)
    }, [session, filterYear])


    return (
        <div className='flex gap-x-4'>

            <div className='w-1/2 shadow-lg p-2 bg-white rounded-md'>

                <div className='flex justify-between items-center gap-x-2 mb-2'>
                    <h3 className='font-light'>LEAVE STATUS</h3>
                    <div className='w-fit'>
                        {/* <Calendar value={filterYear} onChange={(e) => { setFilterYear(e.value); }} view="year" dateFormat="yy" className='w-fit' /> */}
                        <Dropdown options={years} onChange={(e) => { setFilterYear(e.value); }} value={filterYear} size='small' className='p-dropdown-sm' />
                    </div>
                </div>
                <DataTable value={leaveStatus} loading={loading} size='small'>
                    <Column field="leaveType" header="Leave Type"></Column>
                    <Column field="total" header="Total"></Column>
                    <Column field="availed" header="Availed"></Column>
                    <Column field="balance" header="Balance"></Column>
                </DataTable>
            </div>
            {/* 
            <div className='bg-white w-1/2 rounded-md shadow-lg p-2'>
                <LeaveStatusGraph leaveStatus={leaveStatus} />
            </div> */}
        </div>
    );
};

export default LeaveStatusTable;