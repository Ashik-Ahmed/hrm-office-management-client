'use client'

import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Toast } from 'primereact/toast';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AiFillPlusSquare } from 'react-icons/ai';
import Loading from '../Loading/Loading';
import Cookies from 'universal-cookie';
import { getAllDepartments } from '@/libs/department';

const DepartmentTable = ({ accessToken }) => {

    const toast = useRef()
    const { register, control, formState: { errors }, handleSubmit, reset } = useForm();

    const [departments, setDepartments] = useState();
    const [createDepartmentDialog, setCreateDepartmentDialog] = useState(null)
    const [loading, setLoading] = useState(false)
    const [disableDialog, setDisableDialog] = useState(null);
    const [enableDialog, setEnableDialog] = useState(false)

    const getDepartmentData = async () => {
        setLoading(true)
        const depts = await getAllDepartments(accessToken);
        setDepartments(depts);
        setLoading(false)
    }

    useEffect(() => {
        getDepartmentData()
    }, [])

    const handleCreateDepartment = async (data) => {
        setLoading(true)
        fetch(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/department`, {
            method: "POST",
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify(data)
        })
            .then(res => res.json())
            .then(async data => {
                if (data.status == "Success") {
                    toast.current.show({ severity: 'success', summary: 'Success', detail: 'Department Created', life: 3000 });
                    await getDepartmentData();
                    // const departmentData = await getDepartmentData();
                    // setDepartments(departmentData);
                    reset();
                }
                else {
                    toast.current.show({ severity: 'error', summary: 'Failed!', detail: `${data?.error}`, life: 3000 });
                    setLoading(false)
                }
                setCreateDepartmentDialog(null)
            })
    }

    const handleUpdateDepartment = (deptId, updatedData) => {
        setLoading(true)

        fetch(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/department/${deptId}`, {
            method: "PATCH",
            headers: {
                "content-type": "application/json",
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify(updatedData)
        })
            .then(res => res.json())
            .then(data => {
                if (data.status == "Success") {
                    console.log("updated Successfully");
                    getDepartmentData()
                    toast.current.show({ severity: 'success', summary: 'Success', detail: 'Department updated', life: 3000 });
                    setDisableDialog(false);
                    setEnableDialog(false)
                }
                else {
                    console.log("Failed");
                    toast.current.show({ severity: 'error', summary: 'Failed!', detail: `${data?.error}`, life: 3000 });
                }
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
                {/* <Button tooltip="Export" tooltipOptions={buttonTooltipOptions} icon="pi pi-file-pdf" rounded text raised severity='info' aria-label="Filter" style={{ color: 'red', width: '35px', height: '35px' }} /> */}
                <Button onClick={() => setEnableDialog(rowData)} tooltip="Active" tooltipOptions={buttonTooltipOptions} icon='pi pi-check' disabled={rowData.status == "Active"} rounded text raised severity='info' style={{ width: '35px', height: '35px' }} />
                <Button onClick={() => setDisableDialog(rowData)} tooltip="Disable" tooltipOptions={buttonTooltipOptions} icon="pi pi-times" disabled={rowData.status == "Inactive"} rounded text raised severity='danger' aria-label="Filter" style={{ width: '35px', height: '35px' }} />
                {/* <Button tooltip="Delete" tooltipOptions={buttonTooltipOptions} icon='pi pi-trash' rounded text raised severity='danger' /> */}
            </div>
        )
    }

    // if (!departments) {
    //     return <Loading />
    // }


    return (
        <div>
            <Toast ref={toast} />
            <div className='mt-1 shadow-lg p-2 bg-white rounded-md'>
                <div className='flex items-center gap-x-2 mb-2'>
                    <h3 className='font-light'>DEPARTMENT LIST</h3>
                    <AiFillPlusSquare onClick={() => setCreateDepartmentDialog(true)} size={25} color='#8C239E' className='cursor-pointer' />
                </div>
                {
                    // departments ?
                    <DataTable value={departments?.data} size='small' emptyMessage="No Department Found" loading={loading}>
                        <Column field='departmentName' header="Department"></Column>
                        <Column field="employeeCount" header="#Employees"></Column>
                        <Column field='status' header="Status"></Column>
                        <Column field='description' header="Description"></Column>
                        <Column body={actionBodyTemplate} header="Action"></Column>
                    </DataTable>
                    // :
                    // <div className='my-4 text-center'>
                    //     <p className='bg-sky-400 text-white p-2 inline'>No Department Found</p>
                    // </div>
                }
            </div>

            {/* create department dialog  */}
            <Dialog header="Create new department" visible={createDepartmentDialog} style={{ width: '50vw' }} onHide={() => { setCreateDepartmentDialog(false); reset() }}>

                <form onSubmit={handleSubmit(handleCreateDepartment)} className='mt-2'>
                    <div className='mt-2 flex flex-col gap-y-4'>
                        <div className='w-full'>
                            <InputText
                                {...register("departmentName", { required: "Name is required" })}
                                type='text' placeholder="Department name*" className='w-full' />
                            {errors.departmentName?.type === 'required' && <span className='text-xs text-red-500' role="alert">{errors.departmentName.message}</span>}
                        </div>
                        <div className='w-full'>
                            <InputTextarea
                                {...register("description", { required: "Description location required" })}
                                type='text' placeholder="Description*" className='w-full' />
                            {errors.description?.type === 'required' && <span className='text-xs text-red-500' role="alert">{errors.description.message}</span>}
                        </div>
                    </div>

                    <div className='mt-4 text-right'>
                        <Button type='submit' label="Submit" className="p-button-sm" loading={loading} />
                    </div>
                </form>
            </Dialog>

            {/* disable department dialog  */}
            <div>
                <Dialog header="Disable Confirmation" visible={disableDialog} onHide={() => setDisableDialog(false)}
                    style={{ width: '30vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }}>
                    <div className='text-center'>
                        <p className='font-semibold mb-2'>Department: {disableDialog?.departmentName}</p>
                        <p className='text-red-400 font-semibold'>Are you sure to disable?</p>
                    </div>
                    <div className='flex gap-x-2 justify-end mt-4'>
                        <Button onClick={() => handleUpdateDepartment(disableDialog._id, { status: "Inactive" })} loading={loading} label="Disable" size='small' className='p-button-sm' />
                    </div>
                </Dialog>
            </div >


            {/* enable department dialog  */}
            <div>
                <Dialog header="Enable Department" visible={enableDialog} onHide={() => setEnableDialog(false)}
                    style={{ width: '30vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }}>
                    <div className='text-center'>
                        <p className='font-semibold mb-2'>Department: {enableDialog?.departmentName}</p>
                        <p className='text-red-400 font-semibold'>Are you sure to enable?</p>
                    </div>
                    <div className='flex gap-x-2 justify-end mt-4'>
                        <Button onClick={() => handleUpdateDepartment(enableDialog._id, { status: "Active" })} loading={loading} label="Enable" size='small' className='p-button-sm' />
                    </div>
                </Dialog>
            </div >
        </div>
    );
};

export default DepartmentTable;