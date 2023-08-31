import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import React, { useState } from 'react';
import itblLogo from '../../../../public/images/logo.png'
import Image from 'next/image';
import Loading from '../Loading/Loading';

const EmployeeConveyanceDetailsTable = ({ monthlyEmployeeConveyance, selectedMonth, selectedYear }) => {

    const [loading, setLoading] = useState(false)
    // const [conveyanceDetailsDialog, setConveyanceDetailsDialog] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null)
    // const [selectedMonth, setSelectedMonth] = useState(new Date())
    // const [selectedYear, setSelectedyear] = useState(new Date())
    const [conveyanceData, setConveyanceData] = useState(null)

    const getEmployeeConveyanceDetails = (email) => {
        setLoading(true);

        const filterMonth = new Date(selectedMonth).getMonth() + 1;
        const filterYear = new Date(selectedYear).getFullYear();
        console.log(filterMonth, filterYear);
        const url = `http://localhost:5000/api/v1/conveyance/${email}?month=${filterMonth}&year=${filterYear}`;

        fetch(url)
            .then(res => res.json())
            .then(data => {
                console.log(data.data);
                setConveyanceData(data?.data)
            })

        setLoading(false)
    }

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
                <Button onClick={() => { getEmployeeConveyanceDetails(rowData.email); setSelectedEmployee(rowData); }} tooltip="Details" tooltipOptions={buttonTooltipOptions} icon="pi pi-list" rounded text raised severity='info' aria-label="Filter" />
                <Button tooltip="Pay" tooltipOptions={buttonTooltipOptions} icon='pi pi-check' rounded text raised severity='success' />
                {/* <Button tooltip="Delete" tooltipOptions={buttonTooltipOptions} icon='pi pi-trash' rounded text raised severity='danger' /> */}
            </div>
        )
    }

    const detailsTableDateTemplate = (rowData) => {
        return (
            <div>{rowData.date.split("T")[0]}</div>
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

            {/* Details Conveyance dialog  */}
            <Dialog header="Conveyance Details" visible={selectedEmployee} style={{ width: '80vw' }} onHide={() => { setSelectedEmployee(false); }}>
                {
                    loading ?
                        <div>
                            <Loading />
                        </div>
                        :
                        <div>
                            <div className='flex justify-center gap-x-4'>
                                <Image src={itblLogo} width={100} height={20} alt='infozillion logo' className='w-28 h-16' />
                                <div>
                                    <h2 className='text-xl font-bold'>Infozillion Teletech BD LTD</h2>
                                    <p className='underline text-center font-bold'>Conveyance Bill</p>
                                </div>
                            </div>
                            <div className='mt-4 flex flex-col justify-around'>
                                <div className='flex justify-around'>
                                    <div>
                                        <p>Employee: {selectedEmployee?.name}</p>
                                        <p>Date: {new Date().toISOString().split("T")[0]}</p>
                                    </div>
                                    <div>
                                        <p>Total Bill: {conveyanceData?.totalDueAmount}</p>
                                        <p>Total Trips: {conveyanceData?.pendingConveyances}</p>
                                    </div>
                                </div>
                            </div>
                            <div className='mt-4'>
                                <DataTable value={conveyanceData?.conveyanceDetails} size='small' emptyMessage="No Due Conveyance">
                                    {/* <Column body={dateBodyTemplate} header="Date"></Column> */}
                                    <Column body={detailsTableDateTemplate} header="Date"></Column>
                                    <Column field='from' header="From"></Column>
                                    <Column field='destination' header="Destination"></Column>
                                    <Column field="amount" header="Amount"></Column>
                                    <Column field="purpose" header="Purpose"></Column>
                                    {/* <Column field="paymentStatus" header="Payment Status"></Column> */}
                                </DataTable>
                            </div>
                        </div>
                }
            </Dialog>
        </div >
    );
};

export default EmployeeConveyanceDetailsTable;