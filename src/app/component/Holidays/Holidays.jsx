"use client"
import { Calendar } from 'primereact/calendar';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React from 'react';

const Holidays = ({ holidays }) => {



    return (
        <div className='mt-1 shadow-lg p-2 bg-white rounded-md'>
            <div className='flex justify-between items-center gap-x-2 mb-2'>
                <h3 className='font-light'>HOLIDAYS</h3>
                {/* <div className='w-fit'>
                    <Calendar value={filterYear} onChange={(e) => { setFilterYear(e.value); }} view="year" dateFormat="yy" className='w-fit' />
                </div> */}
            </div>
            <div>
                <DataTable value={holidays} size='small' paginator rows={10} rowsPerPageOptions={[10, 25, 50]} stripedRows tableStyle={{ minWidth: '50rem' }}>
                    <Column field="title" header="Title" style={{ color: 'black', fontSize: '.8rem', fontWeight: 'bold' }}></Column>
                    <Column field="date" header="Date"></Column>
                    <Column field="description" header="Description"></Column>
                    <Column field="status" header="Status"></Column>
                </DataTable>
            </div>
        </div>
    );
};

export default Holidays;