import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import React, { useState } from 'react';
import PrintableConveyance from './PrintableConveyance';
import { exportEmployeeConveyanceToPDF, exportMonthlyConveyanceReport } from '@/utils/exportConveyance';
import { getConveyanceDetailsByEmployeeEmail } from '@/libs/conveyance';
import Cookies from 'universal-cookie';


const EmployeeConveyanceDetailsTable = ({ session, getConveyanceData, monthlyEmployeeConveyance, selectedMonth, selectedYear }) => {

    const cookie = new Cookies();

    const [loading, setLoading] = useState(false)
    const [makePaymentDialog, setMakePaymentDialog] = useState(false)
    const [selectedEmployee, setSelectedEmployee] = useState(null)
    const [conveyanceData, setConveyanceData] = useState(null)

    const getEmployeeConveyanceDetails = async (email) => {
        setLoading(true);

        const filterMonth = new Date(selectedMonth).getMonth() + 1;
        const filterYear = new Date(selectedYear).getFullYear();
        // console.log(filterMonth, filterYear);
        // const url = `http://localhost:5000/api/v1/conveyance/${email}?month=${filterMonth}&year=${filterYear}`;

        // fetch(url)
        //     .then(res => res.json())
        //     .then(data => {
        //         // console.log(data.data);
        //         setConveyanceData(data?.data)
        //     })

        const employeeConveyanceDetails = await getConveyanceDetailsByEmployeeEmail(email, filterMonth, filterYear, session?.user.accessToken)
        setConveyanceData(employeeConveyanceDetails)
        setLoading(false)
    }


    const exportConveyanceData = async (rowData) => {
        const filterMonth = new Date(selectedMonth).getMonth() + 1;
        const filterYear = new Date(selectedYear).getFullYear();

        const employeeConveyance = await getConveyanceDetailsByEmployeeEmail(rowData.email, filterMonth, filterYear, session?.user.accessToken)

        //extract the pending conveyances from all conveyances of the month
        const pendingConveyances = conveyanceData?.conveyanceDetails.filter(conveyance => conveyance.paymentStatus !== 'Paid')

        exportEmployeeConveyanceToPDF(rowData, employeeConveyance, pendingConveyances)
    }

    const handleConveyanceBillPayment = () => {
        // console.log(makePaymentDialog);

        const pendingConveyanceIds = []

        for (const conveyance of conveyanceData.conveyanceDetails) {
            if (conveyance.paymentStatus !== "Paid") {
                pendingConveyanceIds.push(conveyance._id);
            }
        }

        fetch(`http://localhost:5000/api/v1/conveyance/makePayment?employeeEmail=${makePaymentDialog?.email}&amount=${makePaymentDialog?.totalAmount}`, {
            method: 'PATCH',
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${session?.user.accessToken}`
            },
            body: JSON.stringify(pendingConveyanceIds)
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                if (data.status == 'Success') {
                    console.log('success');
                    getConveyanceData();
                }
                else {
                    console.log('failed');
                }
            })
        setLoading(false)
        setMakePaymentDialog(null)

    }

    const exportConveyanceReport = (conveyanceData) => {
        conveyanceData.reportMonth = `${selectedMonth.toLocaleString('default', { month: 'long' })}-${selectedYear.getFullYear()}`;
        conveyanceData.generatedBy = session?.user.name;

        exportMonthlyConveyanceReport(conveyanceData)
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
                <Button onClick={() => exportConveyanceData(rowData)} tooltip="Export" tooltipOptions={buttonTooltipOptions} icon="pi pi-file-pdf" rounded text raised severity='info' aria-label="Filter" style={{ color: 'red', width: '35px', height: '35px' }} />
                <Button onClick={() => { getEmployeeConveyanceDetails(rowData.email); setSelectedEmployee(rowData) }} tooltip="Details" tooltipOptions={buttonTooltipOptions} icon="pi pi-list" rounded text raised severity='info' aria-label="Filter" style={{ width: '35px', height: '35px' }} />
                <Button onClick={() => { getEmployeeConveyanceDetails(rowData.email); setMakePaymentDialog(rowData) }} disabled={rowData.pendingAmount == 0} loading={loading} tooltip="Pay" tooltipOptions={buttonTooltipOptions} icon='pi pi-check' rounded text raised severity='success' style={{ width: '35px', height: '35px' }} />
                {/* <Button tooltip="Delete" tooltipOptions={buttonTooltipOptions} icon='pi pi-trash' rounded text raised severity='danger' /> */}
            </div>
        )
    }


    return (
        <div className='test-body'>
            <div className='mt-1 shadow-lg p-2 bg-white rounded-md'>
                <div className='flex items-center gap-x-2 mb-2'>
                    <h3 className='font-light'>EMPLOYEE CONVEYANCE</h3>
                    <Button className='mr-10' type="button" icon="pi pi-file-pdf" visible={monthlyEmployeeConveyance?.employeeData?.length > 0} disabled={monthlyEmployeeConveyance?.employeeData?.length < 1} rounded text severity='danger' onClick={() => exportConveyanceReport(monthlyEmployeeConveyance)} data-pr-tooltip="PDF" />
                </div>
                {
                    monthlyEmployeeConveyance?.employeeData?.length > 0 ?
                        <DataTable value={monthlyEmployeeConveyance?.employeeData} size='small' emptyMessage="No Due Conveyance">
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
            <Dialog visible={selectedEmployee} onHide={() => { setSelectedEmployee(null); }} style={{ width: '70vw' }}>
                <PrintableConveyance selectedEmployee={selectedEmployee} conveyanceData={conveyanceData} />

                {/* <PrintProvider>
                    <Print
                        trigger={() => <Button onClick={handlePrint} icon='pi pi-print' />}
                        content={() => componentRef.current} // Ref to the printable content
                    />
                    <div ref={componentRef}>
                        <PrintableConveyance selectedEmployee={selectedEmployee} conveyanceData={conveyanceData} />
                    </div>
                </PrintProvider> */}

                {
                    // loading ?
                    //     <div>
                    //         <Loading />
                    //     </div>
                    //     :
                    // <div>
                    //     <div className='flex justify-center gap-x-4'>
                    //         <Image src={itblLogo} width={100} height={20} alt='infozillion logo' className='w-28 h-16' />
                    //         <div>
                    //             <h2 className='text-xl font-bold'>Infozillion Teletech BD LTD</h2>
                    //             <p className='underline text-center font-bold'>Conveyance Bill</p>
                    //         </div>
                    //     </div>
                    //     <div className='mt-4 flex flex-col justify-around'>
                    //         <div className='flex justify-around font-semibold'>
                    //             <div>
                    //                 <p>Employee: {selectedEmployee?.name}</p>
                    //                 <p>Date: {new Date().toISOString().split("T")[0]}</p>
                    //             </div>
                    //             <div>
                    //                 <p>Total Bill: {conveyanceData?.totalDueAmount}</p>
                    //                 <p>Total Trips: {conveyanceData?.pendingConveyances}</p>
                    //             </div>
                    //         </div>
                    //     </div>
                    //     <div className='mt-4'>
                    //         <Button onClick={() => window.print()} icon='pi pi-print' className='print-hidden' />
                    //         <DataTable value={conveyanceData?.conveyanceDetails} size='small' emptyMessage="No Due Conveyance">
                    //             {/* <Column body={dateBodyTemplate} header="Date"></Column> */}
                    //             <Column body={detailsTableDateTemplate} header="Date"></Column>
                    //             <Column field='from' header="From"></Column>
                    //             <Column field='destination' header="Destination"></Column>
                    //             <Column field="amount" header="Amount"></Column>
                    //             <Column field="purpose" header="Purpose"></Column>
                    //             {/* <Column field="paymentStatus" header="Payment Status"></Column> */}
                    //         </DataTable>
                    //     </div>
                    // </div>
                }
            </Dialog>

            {/* Make payment dialog  */}
            <Dialog header='Payment Confirmation' visible={makePaymentDialog} onHide={() => { setMakePaymentDialog(null); }} style={{ width: '25vw' }}>

                <div>
                    <p className='font-semibold underline mb-2'>Conveyance Bill</p>
                    <p>Employee: {makePaymentDialog?.name}</p>
                    <p>Amount: {makePaymentDialog?.pendingAmount} BDT</p>
                </div>

                <div className='flex justify-end gap-x-2 mt-8'>
                    <Button onClick={() => setMakePaymentDialog(false)} label='Cancel' className='p-button p-button-sm p-button-danger' />
                    <Button onClick={() => handleConveyanceBillPayment()} disabled={!conveyanceData} loading={loading} label='Confirm' className='p-button p-button-sm p-button-info' />
                </div>
            </Dialog>
        </div >
    );
};

export default EmployeeConveyanceDetailsTable;