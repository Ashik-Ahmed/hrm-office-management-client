import { getServerSession, getUser } from 'next-auth/next';
import React from 'react';
import { authOptions } from '@/utils/authOptions';
import RequisitionHistoryTable from '../component/Requsition/RequisitionHistoryTable';
import Loading from '../component/Loading/Loading';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { AiFillPlusSquare } from 'react-icons/ai';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';


const Requisition = async () => {
    const { user } = await getServerSession(authOptions)
    console.log('user details:', user);


    let requisitionHistory;

    const getRequisitionHistory = async (user) => {
        console.log(user);
        const requisition = await fetch(`http://localhost:5000/api/v1/requisition/${user._id}`)
        // .then(res => res.json())

        requisitionHistory = await requisition.json()

        console.log(requisitionHistory);
    }

    // if (user) {
    //     getRequisitionHistory(user)
    // }

    // if (!requisitionHistory) {
    //     return <Loading />
    // }

    return (
        <div>
            {/* <RequisitionHistoryTable requisitionHistory={requisitionHistory} user={user} /> */}
            <div className='mt-1 shadow-lg p-2 bg-white rounded-md'>
                <div className='flex items-center gap-x-2 mb-2'>
                    <h3 className='font-light'>REQUISITION HISTORY</h3>
                    <AiFillPlusSquare onClick={() => setCreateRequisition(true)} size={20} color='#8C239E' className='cursor-pointer' />
                </div>
                {
                    requisitionHistory?.data?.length > 0 ?
                        <DataTable value={requisitionHistory?.data} size='small' emptyMessage="No Requisition Found">
                            <Column body={dateBodytemplate} header="Date"></Column>
                            <Column field='department' header="Department"></Column>
                            <Column field='totalProposedItems' header="#Proposed item(s)"></Column>
                            {/* <Column field="totalApprovedItems" header="#Approved item(s)"></Column> */}
                            <Column field="proposedAmount" header="Proposed Amount"></Column>
                            <Column field="finalAmount" header="Final Amount"></Column>
                            <Column field="status" header="Status"></Column>
                            <Column body={actionBodyTemplate} header="Action"></Column>
                        </DataTable>
                        :
                        <div className='my-4 text-center'>
                            <p className='bg-sky-400 text-white p-2 inline'>No Requisition Found</p>
                        </div>
                }
            </div>
            {/* add Conveyance dialog  */}
            <Dialog header="New Requisition" visible={createRequisition} style={{ width: '80vw' }} onHide={() => { setCreateRequisition(false); setDepartment(''); reset() }}>
                <div>
                    <Dropdown value={department} onChange={(e) => setDepartment(e.value)} options={['Test 1', 'Test 2', 'Test 2']} placeholder="Department*" className='w-fit mb-2' />
                </div>
                <form onSubmit={handleSubmit(handleAddRequisition)} className='mt-2 flex gap-x-2'>
                    <div className='w-full'>
                        <InputText
                            {...register("category", { required: "Category is required" })}
                            placeholder="Category*" className='w-full' />
                        {errors.category?.type === 'required' && <span className='text-xs text-red-500' role="alert">{errors.category.message}</span>}
                    </div>


                    <div className='w-full'>
                        <InputText
                            {...register("name", { required: "Name is required" })}
                            type='text' placeholder="Name*" className='w-full' />
                        {errors.name?.type === 'required' && <span className='text-xs text-red-500' role="alert">{errors.name.message}</span>}
                    </div>
                    <div className='w-full'>
                        <InputText
                            {...register("model")}
                            type='text' placeholder="Model" className='w-full' />
                        {errors.model?.type === 'required' && <span className='text-xs text-red-500' role="alert">{errors.model.message}</span>}
                    </div>


                    <div className='w-1/2'>
                        <InputText
                            {...register("quantity", { required: "Quantity is required" })}
                            keyfilter='int' placeholder="Quantity*" className='w-full' />
                        {errors.quantity?.type === 'required' && <span className='text-xs text-red-500' role="alert">{errors.quantity.message}</span>}
                    </div>
                    <div className='w-1/2'>
                        <InputText
                            {...register("unitPrice", { required: "Unit price required" })}
                            keyfilter='int' placeholder="Unit price*" className='w-full' />
                        {errors.unitPrice?.type === 'required' && <span className='text-xs text-red-500' role="alert">{errors.unitPrice.message}</span>}
                    </div>


                    <div className='text-right'>
                        <Button type='submit' label="Add" icon='pi pi-plus' severity='info' loading={loading} />
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
                                    <Column field="quantity" header="Quantity"></Column>
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
        </div>
    );
};

export default Requisition;