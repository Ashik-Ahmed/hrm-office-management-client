"use client";

import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React from 'react';

const page = () => {

    const employees = [
        { id: 1, name: 'John Doe', status: 'Present' },
        { id: 2, name: 'Jane Smith', status: 'Late' },
        { id: 3, name: 'Sam Wilson', status: 'Absent' },
        { id: 4, name: 'Chris Evans', status: 'Present' },
        { id: 5, name: 'Natasha Romanoff', status: 'Late' },
        { id: 6, name: 'Tony Stark', status: 'Absent' },
        { id: 7, name: 'Steve Rogers', status: 'Present' },
        { id: 8, name: 'Thor', status: 'Late' },
        { id: 9, name: 'Natasha Romanoff', status: 'Absent' },
        { id: 10, name: 'Tony Stark', status: 'Present' },
        { id: 11, name: 'Steve Rogers', status: 'Late' },
        { id: 12, name: 'Thor', status: 'Absent' },
        { id: 13, name: 'Natasha Romanoff', status: 'Present' },
        { id: 14, name: 'Tony Stark', status: 'Late' },
        { id: 15, name: 'Steve Rogers', status: 'Absent' },
        { id: 16, name: 'Thor', status: 'Present' },
        { id: 17, name: 'Natasha Romanoff', status: 'Late' },
        { id: 18, name: 'Tony Stark', status: 'Absent' },
        { id: 19, name: 'Steve Rogers', status: 'Present' },
        { id: 20, name: 'Thor', status: 'Late' },
    ];
    const attendanceData = [
        { id: 1, name: 'John Doe', date: '2025-04-20', checkIn: '09:00 AM', checkOut: '05:00 PM' },
        { id: 2, name: 'Jane Smith', date: '2025-04-20', checkIn: '09:00 AM', checkOut: '05:00 PM' },
        { id: 3, name: 'Sam Wilson', date: '2025-04-20', checkIn: '09:00 AM', checkOut: '05:00 PM' },
        { id: 4, name: 'Chris Evans', date: '2025-04-20', checkIn: '09:00 AM', checkOut: '05:00 PM' },
        { id: 5, name: 'Natasha Romanoff', date: '2025-04-20', checkIn: '09:00 AM', checkOut: '05:00 PM' },
        { id: 6, name: 'Tony Stark', date: '2025-04-20', checkIn: '09:00 AM', checkOut: '05:00 PM' },
        { id: 7, name: 'Steve Rogers', date: '2025-04-20', checkIn: '09:00 AM', checkOut: '05:00 PM' },
        { id: 8, name: 'Thor', date: '2025-04-20', checkIn: '09:00 AM', checkOut: '05:00 PM' },
        { id: 9, name: 'Natasha Romanoff', date: '2025-04-20', checkIn: '09:00 AM', checkOut: '05:00 PM' },
        { id: 10, name: 'Tony Stark', date: '2025-04-20', checkIn: '09:00 AM', checkOut: '05:00 PM' },
        { id: 11, name: 'Steve Rogers', date: '2025-04-20', checkIn: '09:00 AM', checkOut: '05:00 PM' },
        { id: 12, name: 'Thor', date: '2025-04-20', checkIn: '09:00 AM', checkOut: '05:00 PM' },
        { id: 13, name: 'Natasha Romanoff', date: '2025-04-20', checkIn: '09:00 AM', checkOut: '05:00 PM' },
        { id: 14, name: 'Tony Stark', date: '2025-04-20', checkIn: '09:00 AM', checkOut: '05:00 PM' },
        { id: 15, name: 'Steve Rogers', date: '2025-04-20', checkIn: '09:00 AM', checkOut: '05:00 PM' },
        { id: 16, name: 'Thor', date: '2025-04-20', checkIn: '09:00 AM', checkOut: '05:00 PM' },
        { id: 17, name: 'Natasha Romanoff', date: '2025-04-20', checkIn: '09:00 AM', checkOut: '05:00 PM' },
        { id: 18, name: 'Tony Stark', date: '2025-04-20', checkIn: '09:00 AM', checkOut: '05:00 PM' },
        { id: 19, name: 'Steve Rogers', date: '2025-04-20', checkIn: '09:00 AM', checkOut: '05:00 PM' },
        { id: 20, name: 'Thor', date: '2025-04-20', checkIn: '09:00 AM', checkOut: '05:00 PM' },
    ];

    return (
        <div>
            <div className='bg-white rounded p-2'>
                <p className='text-lg font-semibold text-gray-600'>Attendance Details Today</p>
                <div className='mt-4 border grid grid-cols-3'>
                    <div className='p-2 border-r'>
                        <div className='flex items-center gap-2'>
                            <span className='h-4 w-4 rounded-full inline-block bg-green-600'></span>
                            <span>Present</span>
                        </div>
                        <p className='font-semibold ml-6'>250</p>
                    </div>
                    <div className='p-2 border-r'>
                        <div className='flex items-center gap-2'>
                            <span className='h-4 w-4 rounded-full inline-block bg-yellow-600'></span>
                            <span>Late Login</span>
                        </div>
                        <p className='font-semibold ml-6'>250</p>
                    </div>
                    <div className='p-2 border-r'>
                        <div className='flex items-center gap-2'>
                            <span className='h-4 w-4 rounded-full inline-block bg-red-600'></span>
                            <span>Absent</span>
                        </div>
                        <p className='font-semibold ml-6'>250</p>
                    </div>
                </div>
            </div>
            <div className='bg-white rounded p-2 mt-4'>
                <p>Attendance Report</p>
                <div className='mt-4'>
                    <DataTable value={attendanceData} className="p-datatable-striped" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} >
                        <Column field="name" header="Name"></Column>
                        <Column field="date" header="Date"></Column>
                        <Column field="checkIn" header="Check In"></Column>
                        <Column field="checkOut" header="Check Out"></Column>
                    </DataTable>
                </div>
            </div>
        </div>
    );
};

export default page;