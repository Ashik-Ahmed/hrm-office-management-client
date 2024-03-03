import Image from 'next/image';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React from 'react';
import itblLogo from '../../../../public/images/logo.png'
import { exportEmployeeConveyanceToPDF } from '@/utils/exportConveyance';

const PrintableConveyance = ({ selectedEmployee, conveyanceData }) => {
    console.log(selectedEmployee, conveyanceData);

    const detailsTableDateTemplate = (rowData) => {
        return (
            <div>{rowData.date.split("T")[0]}</div>
        )
    }
    return (
        <div>
            <div>
                <div className='flex justify-center gap-x-4'>
                    <Image src={itblLogo} width={100} height={20} alt='infozillion logo' className='w-28 h-16' />
                    <div>
                        <h2 className='text-xl font-bold'>Infozillion Teletech BD LTD</h2>
                        <p className='underline text-center font-bold'>Conveyance Bill</p>
                    </div>
                </div>
                <div className='mt-4 flex flex-col justify-around'>
                    <div className='flex justify-around font-semibold'>
                        <div>
                            <p>Employee: {selectedEmployee?.name}</p>
                            <p>Date: {new Date().toISOString().split("T")[0]}</p>
                        </div>
                        <div>
                            <p>Total Bill: {conveyanceData?.totalAmount}</p>
                            <p>Total Trips: {conveyanceData?.totalConveyances}</p>
                        </div>
                    </div>
                </div>
                <div className='mt-4'>
                    {/* <Button onClick={() => window.print()} icon='pi pi-print' className='print-hidden' /> */}
                    <Button label='Export' onClick={() => exportEmployeeConveyanceToPDF(selectedEmployee, conveyanceData)} icon='pi pi-file-pdf' raised severity='info' className='p-button-sm p-button-glass' />
                    <DataTable value={conveyanceData?.conveyanceDetails} size='small' emptyMessage="No Due Conveyance" className='mt-2'>
                        {/* <Column body={dateBodyTemplate} header="Date"></Column> */}
                        <Column body={detailsTableDateTemplate} header="Date"></Column>
                        <Column field='from' header="From"></Column>
                        <Column field='destination' header="Destination"></Column>
                        <Column field='vehicle' header="Vehicle"></Column>
                        <Column field="amount" header="Amount"></Column>
                        <Column field="paymentStatus" header="Payment"></Column>
                        <Column field="purpose" header="Purpose"></Column>
                        {/* <Column field="paymentStatus" header="Payment Status"></Column> */}
                    </DataTable>
                </div>
            </div>
        </div>
    );
};

export default PrintableConveyance;