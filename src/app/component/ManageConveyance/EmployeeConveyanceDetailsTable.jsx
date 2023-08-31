import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React from 'react';

const EmployeeConveyanceDetailsTable = ({ monthlyEmployeeConveyance }) => {

    console.log(monthlyEmployeeConveyance);

    const buttonTooltipOptions = {
        position: 'bottom',
        mouseTrack: true,
        mouseTrackTop: 25,
        style: {
            fontSize: '12px'
            /* Add any other custom styles here */
        },
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <div className='flex gap-x-2 items-center'>
                <Button tooltip="Details" tooltipOptions={buttonTooltipOptions} icon="pi pi-list" rounded text raised severity='info' aria-label="Filter" />
                <Button tooltip="Pay" tooltipOptions={buttonTooltipOptions} icon='pi pi-check' rounded text raised severity='success' />
                {/* <Button tooltip="Delete" tooltipOptions={buttonTooltipOptions} icon='pi pi-trash' rounded text raised severity='danger' /> */}
            </div>
        )
    }

    return (
        <div>
            <div className='mt-1 shadow-lg p-2 bg-white rounded-md'>
                <div className='flex items-center gap-x-2 mb-2'>
                    <h3 className='font-light'>EMPLOYEE CONVEYANCE</h3>
                    {/* <AiFillPlusSquare onClick={() => setAddConveyanceDialog(true)} size={20} color='#8C239E' className='cursor-pointer' /> */}
                </div>
                {
                    monthlyEmployeeConveyance?.length > 0 ?
                        <DataTable value={monthlyEmployeeConveyance} size='small' emptyMessage="No Due Conveyance">
                            {/* <Column body={dateBodyTemplate} header="Date"></Column> */}
                            <Column field='name' header="Name"></Column>
                            <Column field='totalConveyances' header="Total Trips"></Column>
                            <Column field='totalAmount' header="Total Amount"></Column>
                            <Column field="pendingAmount" header="Due Amount"></Column>
                            <Column body={actionBodyTemplate} header="Action"></Column>
                        </DataTable>
                        :
                        <div className='my-4 text-center'>
                            <p className='bg-sky-400 text-white p-2 inline'>No Conveyance Found</p>
                        </div>
                }
            </div>
        </div>
    );
};

export default EmployeeConveyanceDetailsTable;