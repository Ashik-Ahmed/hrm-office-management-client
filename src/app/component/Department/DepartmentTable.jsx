'use client'
import { getAllDepartments } from '@/libs/department';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Toast } from 'primereact/toast';
import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AiFillPlusSquare } from 'react-icons/ai';

const DepartmentTable = ({ departmentList }) => {

    const toast = useRef()
    const { register, control, formState: { errors }, handleSubmit, reset } = useForm();

    const [departments, setDepartments] = useState(departmentList);
    const [createDepartmentDialog, setCreateDepartmentDialog] = useState(null)
    const [loading, setLoading] = useState(false)

    const handleCreateDepartment = async (data) => {
        console.log(data);
        setLoading(true)
        fetch('http://localhost:5000/api/v1/department', {
            method: "POST",
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(res => res.json())
            .then(async data => {
                if (data.status == "Success") {
                    toast.current.show({ severity: 'success', summary: 'Success', detail: 'Department Created', life: 3000 });
                    const departmentData = await getAllDepartments()
                    setDepartments(departmentData);
                    reset();
                }
                else {
                    toast.current.show({ severity: 'error', summary: 'Failed!', detail: `${data?.error}`, life: 3000 });
                }
                setLoading(false)
                setCreateDepartmentDialog(null)
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
    const actionBodyTemplate = (rowData) => {
        return (
            <div className='flex gap-x-2 items-center'>
                {/* <Button tooltip="Export" tooltipOptions={buttonTooltipOptions} icon="pi pi-file-pdf" rounded text raised severity='info' aria-label="Filter" style={{ color: 'red', width: '35px', height: '35px' }} /> */}
                <Button tooltip="Details" tooltipOptions={buttonTooltipOptions} icon="pi pi-list" rounded text raised severity='info' aria-label="Filter" style={{ width: '35px', height: '35px' }} />
                <Button tooltip="Disable" tooltipOptions={buttonTooltipOptions} icon='pi pi-trash' rounded text raised severity='danger' style={{ width: '35px', height: '35px' }} />
                {/* <Button tooltip="Delete" tooltipOptions={buttonTooltipOptions} icon='pi pi-trash' rounded text raised severity='danger' /> */}
            </div>
        )
    }


    return (
        <div>
            <Toast ref={toast} />
            <div className='mt-1 shadow-lg p-2 bg-white rounded-md'>
                <div className='flex items-center gap-x-2 mb-2'>
                    <h3 className='font-light'>DEPARTMENT LIST</h3>
                    <AiFillPlusSquare onClick={() => setCreateDepartmentDialog(true)} size={20} color='#8C239E' className='cursor-pointer' />
                </div>
                {
                    departments ?
                        <DataTable value={departments?.data} size='small' emptyMessage="No Requisition Found">
                            <Column field='departmentName' header="Department"></Column>
                            <Column field='description' header="Description"></Column>
                            <Column field="employeeCount" header="#Employees"></Column>
                            <Column body={actionBodyTemplate} header="Action"></Column>
                        </DataTable>
                        :
                        <div className='my-4 text-center'>
                            <p className='bg-sky-400 text-white p-2 inline'>No Department Found</p>
                        </div>
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
        </div>
    );
};

export default DepartmentTable;