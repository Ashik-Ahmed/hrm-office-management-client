"use client"
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import React, { useState } from 'react';
import { AiFillPlusSquare } from 'react-icons/ai';

const Holidays = ({ holidays }) => {

    const [editHolidayDialog, setEditHolidayDialog] = useState(false);
    const [deleteHolidayDialog, setDeleteHolidayDialog] = useState(false);
    const [addHolidayDialog, setAddHolidayDialog] = useState(false);
    const [selectedYear, setSelectedYear] = useState(new Date());

    const actionBodyTemplate = (rowData) => {
        return (
            <div>
                <div className='flex gap-x-3 items-center'>
                    <Button onClick={() => setEditHolidayDialog(rowData)} icon='pi pi-file-edit' rounded text raised severity='success' style={{ width: '25px', height: '25px' }} />
                    <Button onClick={() => setDeleteHolidayDialog(rowData)} icon='pi pi-trash' rounded text raised severity='danger' style={{ width: '25px', height: '25px' }} />
                </div>
            </div >
        )
    }

    return (
        <div className='mt-1 shadow-lg p-2 bg-white rounded-md'>
            <div className='flex justify-between items-center gap-x-2 mb-2'>
                <div className='flex items-center gap-x-2 mb-2'>
                    <h3 className='font-light'>HOLIDAYS</h3>
                    <AiFillPlusSquare onClick={() => setAddHolidayDialog(true)} size={25} color='#8C239E' className='cursor-pointer' />
                </div>
                <div className=''>
                    <Calendar value={selectedYear} onChange={(e) => { setSelectedYear(e.value); }} view="year" dateFormat="yy" className='w-fit' />
                </div>
            </div>
            <div>
                <DataTable value={holidays} size='small' paginator rows={10} rowsPerPageOptions={[10, 25, 50]} stripedRows tableStyle={{ minWidth: '50rem' }}>
                    <Column field="title" header="Title" style={{ color: 'black', fontSize: '.8rem', fontWeight: 'bold' }}></Column>
                    <Column field="date" header="Date"></Column>
                    <Column field="description" header="Description"></Column>
                    <Column body={actionBodyTemplate} header="Action"></Column>
                </DataTable>
            </div>

            {/* add holiday dialog  */}
            <Dialog header="Add Holiday" visible={addHolidayDialog} style={{ width: '50vw' }} onHide={() => { setAddHolidayDialog(false); setDate(null); reset() }}>

            </Dialog>
        </div>
    );
};

export default Holidays;