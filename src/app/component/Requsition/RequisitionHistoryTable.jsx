'use client'
import React, { useEffect, useState } from 'react';
import { Column } from 'jspdf-autotable';
import { DataTable } from 'primereact/datatable';
import { AiFillFilePdf, AiFillPlusSquare } from 'react-icons/ai';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { useForm } from 'react-hook-form';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { exportRequisition } from '@/utils/exportRequisition';
import { getUserRequisitionHistory } from '@/libs/requisition';
import { useRef } from 'react';
import { Toast } from 'primereact/toast';
import Loading from '../Loading/Loading';

const RequisitionHistoryTable = ({ user }) => {

    const toast = useRef()
    const isFirstRender = useRef(true);

    const [userRequisitionData, setUserRequisitionData] = useState()
    const [createRequisition, setCreateRequisition] = useState(false)
    const [loading, setLoading] = useState(false)
    const [selectedMonth, setSelectedMonth] = useState(new Date())
    const [selectedYear, setSelectedyear] = useState(new Date())
    const [itemList, setItemList] = useState([])
    const [requisitionDetails, setRequisitionDetails] = useState(null)
    const [deleteRequisitionDialog, setDeleteRequisitionDialog] = useState(null)
    const [department, sertDepartment] = useState([])
    const [selectedDepartment, setSelectedDepartment] = useState(null)

    const { register, control, formState: { errors }, handleSubmit, reset } = useForm();

    const getUserRequisition = async () => {
        setLoading(true)
        const data = await getUserRequisitionHistory(user._id, (selectedMonth.getMonth() + 1), selectedYear.getFullYear(), user?.accessToken)
        console.log(data);

        setUserRequisitionData(data)
        setLoading(false)
    }

    useEffect(() => {

        getUserRequisition()

        const departments = async () => {
            fetch(`http://localhost:5000/api/v1/department?status=Active`, {
                headers: {
                    'Authorization': `Bearer ${user?.accessToken}`
                }
            })
                .then(res => res.json())
                .then(data => {
                    console.log(data.data);
                    sertDepartment(data.data)
                })
        }
        departments()
    }, [selectedMonth, selectedYear])

    // useEffect(() => {
    //     // Do not fetch data on first render
    //     if (isFirstRender.current) {
    //         isFirstRender.current = false;
    //     } else {
    //         console.log('fetching data');
    //         // Fetch data

    //         const getUserRequisition = async () => {
    //             const data = await getUserRequisitionHistory(user._id, (selectedMonth.getMonth() + 1), selectedYear.getFullYear())
    //             console.log(data);

    //             setUserRequisitionData(data)
    //         }

    //         getUserRequisition()
    //     }
    // }, [selectedMonth, selectedYear])

    const handleAddRequisition = (data) => {

        setItemList([data, ...itemList])
        reset();
    }

    const handleSubmitRequisition = () => {
        const requisitionData = {
            submittedBy: user._id,
            department: selectedDepartment.departmentName,
            itemList
        }

        console.log(requisitionData);

        fetch('http://localhost:5000/api/v1/requisition', {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${user?.accessToken}`
            },
            body: JSON.stringify(requisitionData)
        })
            .then(res => res.json())
            .then(async data => {

                if (data.status == "Success") {
                    // setUserRequisitionData(await getUserRequisitionHistory(user._id, (selectedMonth.getMonth() + 1), selectedYear.getFullYear()))
                    getUserRequisition()
                    toast.current.show({ severity: 'success', summary: 'Success', detail: 'Requisition Submitted', life: 3000 });
                }
                else {
                    toast.current.show({ severity: 'error', summary: 'Failed!', detail: `${data?.error}`, life: 3000 });
                }
                console.log(data);
            })
        setItemList([])
        setSelectedDepartment(null)
        setCreateRequisition(null)
    }

    const getRequisitionDetails = (requisitionId) => {
        setLoading(true)
        fetch(`http://localhost:5000/api/v1/requisition/${requisitionId}`, {
            headers: {
                'Authorization': `Bearer ${user?.accessToken}`
            }
        })
            .then(res => res.json())
            .then(data => {
                setRequisitionDetails(data.data)
                console.log(data.data);
            })
        setLoading(false);
    }

    const deleteRequisition = async (requisitionId) => {
        console.log(requisitionId);
        fetch(`http://localhost:5000/api/v1/requisition/${requisitionId}`, {
            method: "Delete",
            headers: {
                'Authorization': `Bearer ${user?.accessToken}`
            }
        })
            .then(res => res.json())
            .then(async data => {
                console.log(data);
                if (data.status == "Success") {
                    console.log("Deleted Successfully");
                    // setUserRequisitionData(await getUserRequisitionHistory(user._id, (selectedMonth.getMonth() + 1), selectedYear.getFullYear()))
                    getUserRequisition()
                    toast.current.show({ severity: 'success', summary: 'Success', detail: 'Requisition deleted', life: 3000 });
                }
                else {
                    console.log("Failed to delete");
                    toast.current.show({ severity: 'error', summary: 'Failed!', detail: `${data?.error}`, life: 3000 });
                }
            })
        setDeleteRequisitionDialog(null)
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
                <p className={`p-1 rounded-md text-sm text-white text-center ${rowData.status == "Pending" ? "bg-yellow-400" : (rowData.status == "Completed" ? "bg-green-400" : "bg-red-400")}`}>{rowData.status}</p>
            </div >
        )
    }


    const actionBodyTemplate = (rowData) => {
        return (
            <div className='flex gap-x-2 items-center'>
                {/* <Button tooltip="Export" tooltipOptions={buttonTooltipOptions} icon="pi pi-file-edit" rounded text raised severity='success' aria-label="Filter" style={{ width: '35px', height: '35px' }} /> */}
                <Button onClick={() => getRequisitionDetails(rowData._id)} tooltip="Details" tooltipOptions={buttonTooltipOptions} icon="pi pi-list" rounded text raised severity='info' aria-label="Filter" style={{ width: '35px', height: '35px' }} />
                <Button onClick={() => setDeleteRequisitionDialog(rowData)} disabled={rowData.status !== "Pending"} tooltip="Delete" tooltipOptions={buttonTooltipOptions} icon='pi pi-trash' rounded text raised severity='danger' style={{ width: '35px', height: '35px' }} />
                {/* <Button tooltip="Delete" tooltipOptions={buttonTooltipOptions} icon='pi pi-trash' rounded text raised severity='danger' /> */}
            </div>
        )
    }

    if (!userRequisitionData) {
        return < Loading />
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
            <div className='mt-1 shadow-lg p-2 bg-white rounded-md'>
                <div className='flex items-center gap-x-2 mb-2'>
                    <h3 className='font-light'>REQUISITION</h3>
                    <AiFillPlusSquare onClick={() => setCreateRequisition(true)} size={25} color='#8C239E' className='cursor-pointer' />
                </div>
                <DataTable value={userRequisitionData?.data} size='small' removableSort sortMode='multiple' emptyMessage="No Requisition Found" loading={loading}>
                    <Column field='createdAt' header="Date" sortable></Column>
                    <Column field='department' header="Department"></Column>
                    <Column field='totalProposedItems' header="#Proposed Qty"></Column>
                    {/* <Column field="totalApprovedItems" header="#Approved item(s)"></Column> */}
                    <Column field="proposedAmount" header="Proposed Amnt" sortable></Column>
                    {/* <Column field="finalAmount" header="Final Amount"></Column> */}
                    <Column body={statusBodyTemplate} header="Status"></Column>
                    <Column body={actionBodyTemplate} header="Action"></Column>
                </DataTable>
            </div>
            {/* Create requisition dialog  */}
            <Dialog header="New Requisition" visible={createRequisition} style={{ width: '80vw' }} onHide={() => { setCreateRequisition(false); setSelectedDepartment(''); reset() }}>
                <div>
                    <Dropdown value={selectedDepartment} onChange={(e) => { setSelectedDepartment(e.value); console.log(e.value); setItemList([]) }} options={department} optionLabel='departmentName' placeholder="Department*" className='w-fit mb-2' />
                </div>
                <form onSubmit={handleSubmit(handleAddRequisition)}>
                    <div className='flex gap-x-2'>
                        <div className='w-full'>
                            <InputText
                                {...register("category", { required: "Category is required" })}
                                disabled={!selectedDepartment} placeholder="Category*" className='w-full' />
                            {errors.category?.type === 'required' && <span className='text-xs text-red-500' role="alert">{errors.category.message}</span>}
                        </div>


                        <div className='w-full'>
                            <InputText
                                {...register("name", { required: "Name is required" })}
                                disabled={!selectedDepartment} type='text' placeholder="Name*" className='w-full' />
                            {errors.name?.type === 'required' && <span className='text-xs text-red-500' role="alert">{errors.name.message}</span>}
                        </div>
                        <div className='w-full'>
                            <InputText
                                {...register("model")}
                                disabled={!selectedDepartment} type='text' placeholder="Model" className='w-full' />
                            {errors.model?.type === 'required' && <span className='text-xs text-red-500' role="alert">{errors.model.message}</span>}
                        </div>


                        <div className='w-1/2'>
                            <InputText
                                {...register("proposedQuantity", { required: "Quantity is required" })}
                                disabled={!selectedDepartment} keyfilter='int' placeholder="Quantity*" className='w-full' />
                            {errors.proposedQuantity?.type === 'required' && <span className='text-xs text-red-500' role="alert">{errors.proposedQuantity.message}</span>}
                        </div>
                        <div className='w-1/2'>
                            <InputText
                                {...register("unitPrice", { required: "Unit price required" })}
                                disabled={!selectedDepartment} keyfilter='int' placeholder="Unit price*" className='w-full' />
                            {errors.unitPrice?.type === 'required' && <span className='text-xs text-red-500' role="alert">{errors.unitPrice.message}</span>}
                        </div>


                        <div className='text-right'>
                            <Button type='submit' label="Add" icon='pi pi-plus' severity='info' loading={loading} disabled={!department} />
                        </div>
                    </div>
                </form>

                {
                    itemList?.length > 0 ?
                        <div className='mt-4 overflow-y-scroll'>
                            <div>
                                <DataTable value={itemList} size='small' emptyMessage="No Requisition Found" responsiveLayout="scroll" scrollHeight="45vh">

                                    <Column field='category' header="Category"></Column>
                                    <Column field='name' header="Product"></Column>
                                    {/* <Column field="totalApprovedItems" header="#Approved item(s)"></Column> */}
                                    <Column field="model" header="Model"></Column>
                                    <Column field="proposedQuantity" header="Quantity"></Column>
                                    <Column field="unitPrice" header="Unit Price"></Column>
                                    {/* <Column body={actionBodyTemplate} header="Action"></Column> */}
                                </DataTable>
                            </div>
                            <div className='mt-2 flex gap-x-2 justify-end'>
                                <Button onClick={() => setItemList([])} label='Clear' severity='danger' />
                                <Button onClick={() => handleSubmitRequisition()} label='Submit' disabled={!department} />
                            </div>
                        </div>
                        :
                        <div className='my-4 text-center'>

                        </div>
                }
            </Dialog >

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
        </div >
    );
};

export default RequisitionHistoryTable;