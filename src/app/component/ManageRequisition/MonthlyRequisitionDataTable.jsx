'use client'
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import React, { useState } from 'react';
import { MdOutlinePendingActions } from 'react-icons/md';
import { TbReportMoney } from 'react-icons/tb';

const MonthlyRequisitionDataTable = ({ monthlyRequisitionData }) => {

    const [monthlyRequisition, setMonthlyRequisition] = useState(monthlyRequisitionData?.data)
    const [requisitionDetails, setRequisitionDetails] = useState(null)
    const [deleteRequisitionDialog, setDeleteRequisitionDialog] = useState(null)
    const [totalIconColor, setTotalIconColor] = useState('gray')
    const [dueIconColor, setDueIconColor] = useState('gray')

    const getRequisitionDetails = (requisitionId) => {
        setLoading(true)
        fetch(`http://localhost:5000/api/v1/requisition/${requisitionId}`)
            .then(res => res.json())
            .then(data => {
                setRequisitionDetails(data.data)
                console.log(data.data);
            })
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

    const dateBodytemplate = (rowData) => {
        return (
            <div>
                {rowData.createdAt.split("T")[0]}
            </div>
        )
    }

    const actionBodyTemplate = (rowData) => {
        return (
            <div className='flex gap-x-2 items-center'>
                <Button tooltip="Export" tooltipOptions={buttonTooltipOptions} icon="pi pi-file-edit" rounded text raised severity='success' aria-label="Filter" style={{ width: '35px', height: '35px' }} />
                <Button onClick={() => getRequisitionDetails(rowData._id)} tooltip="Details" tooltipOptions={buttonTooltipOptions} icon="pi pi-list" rounded text raised severity='info' aria-label="Filter" style={{ width: '35px', height: '35px' }} />
                <Button onClick={() => setDeleteRequisitionDialog(rowData)} tooltip="Delete" tooltipOptions={buttonTooltipOptions} icon='pi pi-trash' rounded text raised severity='danger' style={{ width: '35px', height: '35px' }} />
                {/* <Button tooltip="Delete" tooltipOptions={buttonTooltipOptions} icon='pi pi-trash' rounded text raised severity='danger' /> */}
            </div>
        )
    }

    return (
        <div>
            <div className='flex gap-x-2 mb-4'>
                <div onMouseEnter={() => setTotalIconColor('white')} onMouseLeave={() => setTotalIconColor('gray')} className="bg-white p-[20px] w-fit rounded-xl shadow-lg flex items-center group hover:bg-violet-400 duration-500">
                    <TbReportMoney size={60} color={totalIconColor} />
                    <div className="flex flex-col justify-center items-center w-[200px] h-[80px] text-center cursor-pointer text-gray-500 group-hover:text-white">
                        <p>Total Amount</p>
                        <p className='text-3xl text-gray-600 group-hover:text-white font-bold'>&#2547; {`${monthlyRequisition?.totalProposedAmount || "00"} `} </p>
                        <p className='text-xs mt-2'>Found <span className='text-sky-500 group-hover:text-yellow-300 text-[15px] font-semibold'>{`${"0"}`}</span> trips in total</p>
                    </div>
                </div>
                <div onMouseEnter={() => setDueIconColor('white')} onMouseLeave={() => setDueIconColor('gray')} className="bg-white p-[20px] w-fit rounded-xl shadow-lg flex items-center group hover:bg-violet-400 duration-500">
                    <MdOutlinePendingActions size={55} color={dueIconColor} />
                    <div className="flex flex-col justify-center items-center w-[200px] h-[80px] text-center cursor-pointer text-gray-500 group-hover:text-white">
                        <p>Due Bill</p>
                        <p className='text-3xl text-gray-600 group-hover:text-white font-bold'>&#2547; {`${monthlyRequisition.totalProposedAmount || "00"}`}</p>
                        <p className='text-xs mt-2'>Payment due for <span className='text-sky-500 group-hover:text-yellow-300 text-[15px] font-semibold'>{`${monthlyRequisition.totalProposedAmount || "0"}`}</span> trips</p>
                    </div>
                </div>
            </div>

            <DataTable value={monthlyRequisition?.requisitions} size='small' emptyMessage="No Requisition Found">
                <Column body={dateBodytemplate} header="Date"></Column>
                <Column field='department' header="Department"></Column>
                <Column field='totalProposedItems' header="#Proposed item(s)"></Column>
                {/* <Column field="totalApprovedItems" header="#Approved item(s)"></Column> */}
                <Column field="proposedAmount" header="Proposed Amount"></Column>
                {/* <Column field="finalAmount" header="Final Amount"></Column> */}
                <Column field="status" header="Status"></Column>
                <Column body={actionBodyTemplate} header="Action"></Column>
            </DataTable>

            {/* Details requisition dialog  */}
            <Dialog visible={requisitionDetails} onHide={() => { setRequisitionDetails(null); }} style={{ width: '70vw' }}>
                <div>
                    <div className='flex justify-center gap-x-4'>
                        {/* <Image src={itblLogo} width={100} height={20} alt='infozillion logo' className='w-28 h-16' /> */}
                        <div>
                            <h2 className='text-xl font-bold'>Infozillion Teletech BD LTD</h2>
                            <p className='underline text-center font-bold'>Requisition</p>
                        </div>
                    </div>
                    <div className='mt-4 flex flex-col justify-around'>
                        <div className='flex justify-around font-semibold'>
                            <table>
                                <tr>
                                    <td>Submitted by</td>
                                    <td>: {requisitionDetails?.submittedBy.name}</td>
                                </tr>
                                <tr>
                                    <td>Designation</td>
                                    <td>: {requisitionDetails?.submittedBy.designation}</td>
                                </tr>
                                <tr>
                                    <td>Date</td>
                                    <td>: {requisitionDetails?.createdAt.split("T")[0]}</td>
                                </tr>
                                <tr>
                                    <td>Department</td>
                                    <td>: {requisitionDetails?.department}</td>
                                </tr>
                            </table>

                            <table>
                                <tr>
                                    <td>Proposed amount</td>
                                    <td>: {requisitionDetails?.proposedAmount}</td>
                                </tr>
                                <tr>
                                    <td>#Proposed items</td>
                                    <td>: {requisitionDetails?.totalProposedItems}</td>
                                </tr>
                                <tr>
                                    <td>Purchase amount</td>
                                    <td>: {requisitionDetails?.finalAmount || "________"}</td>
                                </tr>
                                <tr>
                                    <td>#Purchase items</td>
                                    <td>: {requisitionDetails?.totalApprovedItems || "________"}</td>
                                </tr>
                            </table>
                        </div>
                    </div>
                    <div className='mt-4'>
                        <Button label='Export' onClick={() => exportRequisition(requisitionDetails)} icon='pi pi-file-pdf' raised severity='info' className='p-button-sm p-button-glass' />
                        <DataTable value={requisitionDetails?.itemList} size='small' emptyMessage="No Due Conveyance" className='mt-2'>
                            {/* <Column body={detailsTableDateTemplate} header="Date"></Column> */}
                            {/* <Column field='category' header="Category"></Column> */}
                            <Column field='name' header="Product"></Column>
                            <Column field='model' header="Details"></Column>
                            <Column field="proposedQuantity" header="#Proposed Qty"></Column>
                            {/* <Column field="approvedQuantity" header="#Purchase Qty"></Column> */}
                            <Column field="unitPrice" header="Unit Price"></Column>
                            {/* <Column field="buyingPrice" header="Buying Price"></Column> */}
                            <Column field='total' header="Total"></Column>
                        </DataTable>
                    </div>
                </div>
            </Dialog >
            {/* Delete requisition dialog  */}
            <Dialog header="Delete Confirmation" visible={deleteRequisitionDialog} onHide={() => setDeleteRequisitionDialog(null)} style={{ width: '25vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }}>
                <p className="m-0">
                    Requisition for: {deleteRequisitionDialog?.department || 'N/A'} department
                </p>
                <p>Total amount: {deleteRequisitionDialog?.proposedAmount}</p>
                <p className='font-bold text-red-400 text-center mt-4'>Are you sure to delete?</p>
                <div className='flex justify-end gap-x-2 mt-8'>
                    <Button onClick={() => setDeleteRequisitionDialog(null)} label='Cancel' className='p-button p-button-sm p-button-info' />
                    <Button onClick={() => deleteRequisition(deleteRequisitionDialog._id)} label='Delete' className='p-button p-button-sm p-button-danger' />
                </div>
            </Dialog>

        </div>
    );
};

export default MonthlyRequisitionDataTable;