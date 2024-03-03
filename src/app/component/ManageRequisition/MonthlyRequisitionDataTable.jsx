'use client'
import { getMonthlyRequisitionData } from '@/libs/requisition';
import { exportRequisition, exportRequisitionReport } from '@/utils/exportRequisition';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { MdOutlinePendingActions } from 'react-icons/md';
import { TbReportMoney } from 'react-icons/tb';
import Loading from '../Loading/Loading';
import { useSession } from 'next-auth/react';

const MonthlyRequisitionDataTable = ({ user }) => {

    const toast = useRef()
    const isFirstRender = useRef(true);

    const { register, control, formState: { errors }, handleSubmit, reset } = useForm();

    const [monthlyRequisition, setMonthlyRequisition] = useState()
    const [completePurchase, setCompletePurchase] = useState(null)
    const [requisitionDetails, setRequisitionDetails] = useState(null)
    const [calcelRequisitionDialog, setCancelRequisitionDialog] = useState(null)
    const [totalIconColor, setTotalIconColor] = useState('gray')
    const [dueIconColor, setDueIconColor] = useState('gray')
    const [selectedMonth, setSelectedMonth] = useState(new Date())
    const [selectedYear, setSelectedyear] = useState(new Date())
    const [loading, setLoading] = useState(false)

    //get requisition details by id
    const getRequisitionDetails = (requisitionId) => {
        setLoading(true)
        fetch(`http://localhost:5000/api/v1/requisition/${requisitionId}`)
            .then(res => res.json())
            .then(data => {
                setRequisitionDetails(data.data)
                console.log(data.data);
            })
        setLoading(false)
    }

    // COMPLETE PURCHASE
    const handleCompletePurchase = (data) => {
        setLoading(true)
        const requisitionId = completePurchase._id
        console.log(requisitionId, data);
        fetch(`http://localhost:5000/api/v1/requisition/${requisitionId}`, {
            method: "PATCH",
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(res => res.json())
            .then(async data => {
                if (data.status == "Success") {
                    console.log('Successfully updated');
                    const requisitionData = await getMonthlyRequisitionData((selectedMonth.getMonth() + 1), selectedYear.getFullYear())
                    setMonthlyRequisition(requisitionData.data)
                    toast.current.show({ severity: 'success', summary: 'Success', detail: 'Requisition updated', life: 3000 });
                }
                else {
                    console.log("Failed to update");
                    toast.current.show({ severity: 'error', summary: 'Failed!', detail: `${data?.error}`, life: 3000 });
                }
                setCompletePurchase(false)
                setLoading(false)
                reset()
            })
    }

    // CANCEL REQUISITION
    const handleCancelRequisition = (requisitionId) => {
        setLoading(true);
        const url = `http://localhost:5000/api/v1/requisition/cancelRequisition/${requisitionId}`;
        console.log(url);
        fetch(url, {
            method: "PATCH",
            headers: {
                'content-type': 'application/json'
            }
        })
            .then(res => res.json())
            .then(async data => {
                if (data.status == "Success") {
                    console.log('Successfully canceled');
                    const requisitionData = await getMonthlyRequisitionData((selectedMonth.getMonth() + 1), selectedYear.getFullYear())
                    setMonthlyRequisition(requisitionData.data)
                    toast.current.show({ severity: 'success', summary: 'Success', detail: 'Requisition canceled', life: 3000 });
                }
                else {
                    toast.current.show({ severity: 'error', summary: 'Failed!', detail: `${data?.error}`, life: 3000 });
                }
                setCancelRequisitionDialog(false)
                setLoading(false)
                console.log(data);
            })
    }

    const getRequisitions = async () => {
        const data = await getMonthlyRequisitionData((selectedMonth.getMonth() + 1), selectedYear.getFullYear())
        console.log(data);

        setMonthlyRequisition(data.data)
    }

    useEffect(() => {

        getRequisitions()

        // Do not fetch data on first render
        // if (isFirstRender.current) {
        //     isFirstRender.current = false;
        // } else {
        //     console.log('fetching data');
        //     // Fetch data

        //     const getRequisitions = async () => {
        //         const data = await getMonthlyRequisitionData((selectedMonth.getMonth() + 1), selectedYear.getFullYear())
        //         console.log(data);

        //         setMonthlyRequisition(data.data)
        //     }

        //     getRequisitions()
        // }
    }, [selectedMonth, selectedYear])

    const exportToPdf = (monthlyRequisition) => {
        monthlyRequisition.generatedBy = user.name
        monthlyRequisition.reportMonth = `${selectedMonth.toLocaleString('default', { month: 'long' })}-${selectedYear.getFullYear()}`
        console.log(monthlyRequisition);
        exportRequisitionReport(monthlyRequisition)
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


    const statusBodyTemplate = (rowData) => {
        return (
            <div className='w-fit'>
                <p className={`p-1 rounded-md text-white text-center ${rowData.status == "Pending" ? "bg-yellow-400" : (rowData.status == "Completed" ? "bg-green-400" : "bg-red-400")}`}>{rowData.status}</p>
            </div >
        )
    }

    const actionBodyTemplate = (rowData) => {
        return (
            <div className='flex gap-x-2 items-center'>
                <Button onClick={() => setCompletePurchase(rowData)} disabled={rowData.status == "Completed"} tooltip="Comoplete purchase" tooltipOptions={buttonTooltipOptions} icon="pi pi-check" rounded text raised severity='success' aria-label="Filter" style={{ width: '35px', height: '35px' }} />
                <Button onClick={() => getRequisitionDetails(rowData._id)} tooltip="Details" tooltipOptions={buttonTooltipOptions} icon="pi pi-list" rounded text raised severity='info' aria-label="Filter" style={{ width: '35px', height: '35px' }} />
                <Button onClick={() => setCancelRequisitionDialog(rowData)} disabled={rowData.status !== "Pending"} tooltip="Cancel" tooltipOptions={buttonTooltipOptions} icon='pi pi-times' rounded text raised severity='danger' style={{ width: '35px', height: '35px' }} />
                {/* <Button tooltip="Delete" tooltipOptions={buttonTooltipOptions} icon='pi pi-trash' rounded text raised severity='danger' /> */}
            </div>
        )
    }



    return (
        <div>
            <Toast ref={toast} />
            <div className='flex gap-x-2 mb-2'>
                <Calendar onChange={(e) => { setSelectedMonth((e.value)); console.log(e.value.getMonth() + 1); }} value={selectedMonth} view="month" yearNavigator={false} style={{ year: { display: "none" } }} className="p-calendar-hide-year"
                    dateFormat="MM" size='small' />
                <Calendar onChange={(e) => { setSelectedyear(e.value); console.log(e.value); }} value={selectedYear} view="year" dateFormat="yy" size='small' />
                {/* <Dropdown options={years} onChange={(e) => { setFilterYear(e.value); }} value={filterYear} size='small' className='p-dropdown-sm' /> */}
            </div>
            <div className='flex gap-x-2 mb-4'>
                <div onMouseEnter={() => setTotalIconColor('white')} onMouseLeave={() => setTotalIconColor('gray')} className="bg-white p-[20px] w-fit rounded-xl shadow-lg flex items-center group hover:bg-violet-400 duration-500">
                    <TbReportMoney size={60} color={totalIconColor} />
                    <div className="flex flex-col justify-center items-center w-[200px] h-[80px] text-center cursor-pointer text-gray-500 group-hover:text-white">
                        <p>Proposed Amount</p>
                        {
                            loading ? <p>Loading....</p> : <p className='text-3xl text-gray-600 group-hover:text-white font-bold'>&#2547; {`${monthlyRequisition?.totalProposedAmount || "00"} `} </p>
                        }
                        <p className='text-xs mt-2'> <span className='text-sky-500 group-hover:text-yellow-300 text-[15px] font-semibold'>{`${monthlyRequisition?.totalRequisitions || "0"}`}</span> requisitions with <span className='text-sky-500 group-hover:text-yellow-300 text-[15px] font-semibold'>{monthlyRequisition?.totalProposedItems || "0"}</span> items</p>
                    </div>
                </div>
                <div onMouseEnter={() => setDueIconColor('white')} onMouseLeave={() => setDueIconColor('gray')} className="bg-white p-[20px] w-fit rounded-xl shadow-lg flex items-center group hover:bg-violet-400 duration-500">
                    <MdOutlinePendingActions size={55} color={dueIconColor} />
                    <div className="flex flex-col justify-center items-center w-[200px] h-[80px] text-center cursor-pointer text-gray-500 group-hover:text-white">
                        <p>Purchase Amount</p>
                        {
                            loading ? <p>Loading....</p> : <p className='text-3xl text-gray-600 group-hover:text-white font-bold'>&#2547; {`${monthlyRequisition?.totalPurchasedAmount || "00"}`}</p>
                        }
                        <p className='text-xs mt-2'><span className='text-sky-500 group-hover:text-yellow-300 text-[15px] font-semibold'>{monthlyRequisition?.numberOfCompletedRequisition || "0"}</span> requisions with <span className='text-sky-500 group-hover:text-yellow-300 text-[15px] font-semibold'>{`${monthlyRequisition?.totalPurchasedItems || "0"}`}</span> items</p>
                    </div>
                </div>
            </div>
            <div className='mt-1 shadow-lg p-2 bg-white rounded-md'>
                <div className='flex items-center gap-x-2 mb-2'>
                    <h3 className='font-light'>REQUISITION HISTORY</h3>
                    <Button className='mr-10' type="button" icon="pi pi-file-pdf" visible={monthlyRequisition?.requisitions.length > 0} disabled={monthlyRequisition?.requisitions.length < 1} rounded text severity='danger' onClick={() => exportToPdf(monthlyRequisition)} data-pr-tooltip="PDF" />
                </div>
                {
                    monthlyRequisition ?
                        <DataTable value={monthlyRequisition?.requisitions} size='small' removableSort sortMode='multiple' emptyMessage="No Requisition Found">
                            <Column field='createdAt' header="Date" sortable></Column>
                            <Column field='department' header="Department"></Column>
                            <Column field='proposedItems' header="#Proposed item(s)"></Column>
                            {/* <Column field="totalApprovedItems" header="#Approved item(s)"></Column> */}
                            <Column field="proposedAmount" header="Proposed Amount" sortable></Column>
                            {/* <Column field="finalAmount" header="Final Amount"></Column> */}
                            <Column body={statusBodyTemplate} header="Status"></Column>
                            <Column body={actionBodyTemplate} header="Action"></Column>
                        </DataTable>
                        :
                        <div className='my-4 text-center'>
                            <p className='bg-sky-400 text-white p-2 inline'>No Requisition Found</p>
                        </div>
                }
            </div>

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
                                    <td>: {requisitionDetails?.purchasedAmount || "________"}</td>
                                </tr>
                                <tr>
                                    <td>#Purchase items</td>
                                    <td>: {requisitionDetails?.purchasedItems || "________"}</td>
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
            {/* Cancel requisition dialog  */}
            <Dialog header="Cancel Confirmation" visible={calcelRequisitionDialog} onHide={() => setCancelRequisitionDialog(null)} style={{ width: '25vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }}>
                <p className="m-0">
                    Requisition for: {calcelRequisitionDialog?.department || 'N/A'} department
                </p>
                <p className="m-0"> {calcelRequisitionDialog?._id}</p>
                <p>Total amount: {calcelRequisitionDialog?.proposedAmount}</p>
                <p className='font-bold text-red-400 text-center mt-4'>Are you sure to cancel?</p>
                <div className='flex justify-end gap-x-2 mt-8'>
                    <Button onClick={() => setCancelRequisitionDialog(null)} label='Cancel' className='p-button p-button-sm p-button-info' />
                    <Button onClick={() => handleCancelRequisition(calcelRequisitionDialog?._id)} label='Cancel' className='p-button p-button-sm p-button-danger' />
                </div>
            </Dialog>

            {/* Complete purchase dialog  */}
            <Dialog header="Purchase Confirmation" visible={completePurchase} onHide={() => { setCompletePurchase(null); reset(); setLoading(false) }} style={{ width: '25vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }}>
                <form onSubmit={handleSubmit(handleCompletePurchase)} className='mt-2 flex flex-col gap-y-2'>
                    <div className='w-full'>
                        <InputText
                            {...register("purchasedAmount", { required: "Amount is required" })}
                            keyfilter='int' placeholder="Purchase amount*" className='w-full' />
                        {errors.purchasedAmount?.type === 'required' && <span className='text-xs text-red-500' role="alert">{errors.purchasedAmount.message}</span>}
                    </div>


                    <div className='w-full'>
                        <InputText
                            {...register("purchasedItems", { required: "Purchase items count is required" })}
                            keyfilter='int' placeholder="Total items*" className='w-full' />
                        {errors.purchasedItems?.type === 'required' && <span className='text-xs text-red-500' role="alert">{errors.purchasedItems.message}</span>}
                    </div>
                    <Button type='submit' label='Submit' loading={loading} />
                </form>
            </Dialog>
        </div>
    );
};

export default MonthlyRequisitionDataTable;