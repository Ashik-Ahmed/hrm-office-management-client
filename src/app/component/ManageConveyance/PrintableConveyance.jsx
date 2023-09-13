import Image from 'next/image';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React from 'react';
import itblLogo from '../../../../public/images/logo.png'

const PrintableConveyance = ({ selectedEmployee, conveyanceData }) => {
    console.log(selectedEmployee, conveyanceData);
    const cols = [
        { field: 'date', header: 'Date' },
        { field: 'from', header: 'From' },
        { field: 'destination', header: 'Destination' },
        { field: 'amount', header: 'Amount' },
        { field: 'purpose', header: 'Purpose' },
    ]

    const exportColumns = cols.map(col => ({ title: col.header, dataKey: col.field }))

    // extract only the date value from dateTime 
    const customizedConveyanceDetails = conveyanceData?.conveyanceDetails.map(conveyance => {
        const customizedDate = conveyance.date.split("T")[0]
        return {
            ...conveyance,
            date: customizedDate
        }
    })

    const exportPdf = () => {
        console.log(customizedConveyanceDetails);
        import('jspdf').then(jsPDF => {
            import('jspdf-autotable').then(() => {
                const doc = new jsPDF.default(0, 2);

                // Header
                doc.setFontSize(15);
                doc.setTextColor(10);
                doc.text(`Infozillion Teletech BD LTD.`, 102, 22);
                doc.setFontSize(12);
                doc.text(`Conveyance Bill`, 130, 32);

                doc.setFontSize(11);
                doc.text(`Employee: ${selectedEmployee.name}`, 40, 45);
                doc.text(`Total Bill: ${conveyanceData.totalDueAmount}`, 210, 45);
                doc.text(`Date: ${new Date().toISOString().split("T")[0]}`, 40, 55);
                doc.text(`Total trips: ${conveyanceData.pendingConveyances}`, 210, 55);



                doc.autoTable(exportColumns, customizedConveyanceDetails, {
                    startY: 70,

                    didDrawPage: function (data) {

                        // Footer
                        var str = "Page " + doc.internal.getNumberOfPages();

                        doc.setFontSize(10);

                        // jsPDF 1.4+ uses getWidth, <1.4 uses .width
                        var pageSize = doc.internal.pageSize;
                        var pageHeight = pageSize.height
                            ? pageSize.height
                            : pageSize.getHeight();
                        doc.text(str, data.settings.margin.left, pageHeight - 10);
                    }
                });
                doc.save('conveyance-details.pdf');
            })
        })
    }



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
                            <p>Total Bill: {conveyanceData?.totalDueAmount}</p>
                            <p>Total Trips: {conveyanceData?.pendingConveyances}</p>
                        </div>
                    </div>
                </div>
                <div className='mt-4'>
                    {/* <Button onClick={() => window.print()} icon='pi pi-print' className='print-hidden' /> */}
                    <Button onClick={exportPdf} icon='pi pi-print' className='print-hidden' />
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
        </div>
    );
};

export default PrintableConveyance;