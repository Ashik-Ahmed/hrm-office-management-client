import Image from 'next/image';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import React, { useRef } from 'react';
import { AiFillPlusSquare } from 'react-icons/ai'
import { FiEdit } from 'react-icons/fi';
import { RiDeleteBinLine } from 'react-icons/ri';
import user from '../../../../public/images/user.png'
import { useState } from 'react';
import { FilterMatchMode } from 'primereact/api';
import { MdRemoveRedEye } from 'react-icons/md';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { Controller, useForm } from 'react-hook-form';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';

const EmployeeTable = ({ users, setAddUserDialog, setDeleteUserDialog }) => {

    const toast = useRef(null)
    const router = useRouter()
    const { register, control, formState: { errors }, handleSubmit, reset } = useForm();

    const [editEmployee, setEditEmployee] = useState();
    const [role, setRole] = useState();
    const [joiningDate, setJoiningDate] = useState()
    const [loading, setLoading] = useState(false)

    const userRoles = ['Admin', 'Employee']


    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        firstName: { value: null, matchMode: FilterMatchMode.CONTAINS },
        lastName: { value: null, matchMode: FilterMatchMode.CONTAINS },
        email: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const handleEditEmployee = (data) => {
        console.log(data);
    }


    const fullNameBodyTemplate = (rowData) => {
        return (
            <div className="flex items-center gap-4">
                <div>
                    <Image src={rowData.image || user} height={35} width={35} priority alt='user photo' className='rounded-full' style={{ width: '35px', height: '35px' }} />
                </div>
                <div>
                    <span className='text-md font-semibold'>{rowData.firstName} {rowData.lastName}</span>
                    <p className='text-xs'>{rowData.email}</p>
                </div>
            </div>
        )
    }

    const roleBodyTemplate = (rowData) => {
        return (
            <div>
                <p className={`${rowData.userRole == 'Super Admin' ? 'bg-violet-500' : (rowData.userRole == 'Admin' ? 'bg-sky-500' : (rowData.userRole == 'HR Admin' ? 'bg-blue-500' : (rowData.userRole == 'Accounts' ? 'bg-lime-500' : 'bg-gray-500')))} px-2 rounded-sm text-white text-center w-fit`}>{rowData.userRole}</p>
            </div >
        )
    }
    const buttonTooltipOptions = {
        position: 'bottom',
        mouseTrack: true,
        mouseTrackTop: 25,
        style: {
            fontSize: '12px',
            /* Add any other custom styles here */
        },
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <div className='flex gap-x-2'>
                {/* <MdRemoveRedEye onClick={() => router.push(`/employee/${rowData._id}`)} size={35} color='gray' className='cursor-pointer rounded-full p-2 hover:bg-gray-300' />
                 <FiEdit size={35} color='blue' className='cursor-pointer rounded-full p-2 hover:bg-gray-300' />
                <RiDeleteBinLine onClick={() => setDeleteUserDialog(rowData)} size={35} color='red' className='cursor-pointer rounded-full p-2 hover:bg-gray-300' /> */}

                <Button onClick={() => router.push(`/employee/${rowData._id}`)} tooltip="Details" tooltipOptions={buttonTooltipOptions} icon='pi pi-info' rounded text raised severity='info' style={{ width: '35px', height: '35px' }} />
                <Button onClick={() => setEditEmployee(rowData)} tooltip="Edit" tooltipOptions={buttonTooltipOptions} icon='pi pi-file-edit' rounded text raised severity='success' style={{ width: '35px', height: '35px' }} />
                <Button onClick={() => setDeleteUserDialog(rowData)} tooltip="Delete" tooltipOptions={buttonTooltipOptions} icon='pi pi-trash' rounded text raised severity='danger' style={{ width: '35px', height: '35px' }} />
            </div>
        )
    }



    return (
        <div className="card p-2 bg-white rounded-md shadow-xl">
            <div className='flex justify-between items-center mb-1'>
                <div className='flex items-center gap-x-2'>
                    <h3 className='font-light'>EMPLOYEE LIST</h3>
                    {/* <Button onClick={() => setAddUserDialog(true)} icon="pi pi-plus" className='p-button p-button-sm p-button-info' /> */}
                    <AiFillPlusSquare onClick={() => setAddUserDialog(true)} size={20} color='#8C239E' className='cursor-pointer' />
                </div>
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Search" className='p-inputtext-sm' />
                </span>
            </div>
            <DataTable value={users} loading={loading} size='small'
                filters={filters} filterDisplay="menu" globalFilterFields={['firstName', 'lastName', 'email']} emptyMessage="No Members found."
                tableStyle={{ minWidth: '50rem' }} responsiveLayout="scroll" scrollHeight="85vh">
                {/* <Column body={photoBodyTemplate} header="Name" ></Column> */}
                <Column body={fullNameBodyTemplate} header="Employee" ></Column>
                <Column field="designation" header="Designation" ></Column>
                <Column body={roleBodyTemplate} header="Role" ></Column>
                <Column body={actionBodyTemplate} header="Action" ></Column>
            </DataTable>

            {/* edit user dialog  */}
            <Dialog header="Edit Employee" visible={editEmployee} style={{ width: '50vw' }} onHide={() => { setEditEmployee(false); setJoiningDate(null); setRole(null); reset() }}>

                <form onSubmit={handleSubmit(handleEditEmployee)} className='mt-2'>

                    <div className='w-full'>
                        <Dropdown value={editEmployee?.department} placeholder={editEmployee?.departemnt} disabled className="w-full placeholder-opacity-20" />
                    </div>
                    <div className='mt-2 flex gap-x-4'>
                        <div className="w-full">
                            <InputText placeholder={editEmployee?.employeeId} disabled className='w-full' />
                        </div>
                        <div className='w-full'>
                            {/* <Calendar value={date} onChange={(e) => setDate(e.value)} dateFormat="dd/mm/yy" /> */}

                            {/* <Calendar value={date} onChange={(e) => setDate(e.value)} dateFormat="dd/mm/yy" placeholder='Joining Date' className='w-full' /> */}
                            <Controller
                                name="joiningDate"
                                control={control}
                                rules={{ required: "Joining date is required" }}
                                render={({ field }) => (
                                    <Calendar
                                        value={joiningDate}
                                        onChange={(e) => { setJoiningDate(e.value); field.onChange(e.value) }}
                                        placeholder='Joining date*'
                                        className='w-full'
                                    />
                                )}
                            />
                            {errors.joiningDate?.type === 'required' && <span className='text-xs text-red-500 block' role="alert">{errors.joiningDate.message}</span>}
                        </div>
                    </div>
                    <div className='mt-2 flex gap-x-4'>
                        <div className='w-full'>
                            <InputText
                                {...register("firstName", { required: "First Name is required" })}
                                type='text' placeholder="First Name*" className='w-full' />
                            {errors.firstName?.type === 'required' && <span className='text-xs text-red-500' role="alert">{errors.firstName.message}</span>}
                        </div>
                        <div className='w-full'>
                            <InputText
                                {...register("lastName", { required: "Last Name is required" })}
                                type='text' placeholder="Last Name*" className='w-full' />
                            {errors.lastName?.type === 'required' && <span className='text-xs text-red-500' role="alert">{errors.lastName.message}</span>}
                        </div>
                    </div>
                    <div className='mt-2 flex gap-x-4'>
                        <div className='w-full'>
                            <InputText
                                {...register("email", { required: "Email is required" })}
                                type='email' placeholder="Email*" className='w-full' />
                            {errors.email?.type === 'required' && <span className='text-xs text-red-500' role="alert">{errors.email.message}</span>}
                        </div>
                        <div className='w-full'>
                            <InputText
                                {...register("mobile", { required: "Mobile no. is required" })}
                                type='text' placeholder="Mobile*" className='w-full' />
                            {errors.mobile?.type === 'required' && <span className='text-xs text-red-500' role="alert">{errors.mobile.message}</span>}
                        </div>
                    </div>
                    <div className='mt-2 flex gap-x-4'>
                        <div className='w-full'>
                            <InputText
                                {...register("designation", { required: "Designation is required" })}
                                type='text' placeholder="Designation*" className='w-full' />
                            {errors.designation?.type === 'required' && <span className='text-xs text-red-500' role="alert">{errors.designation.message}</span>}
                        </div>
                        <div className='w-full'>
                            <Dropdown
                                {...register("userRole", { required: "Role is required" })}
                                value={role} onChange={(e) => setRole(e.value)} options={userRoles} placeholder={editEmployee?.userRole} className="w-full placeholder-opacity-20" />
                            {errors.userRole?.type === 'required' && <span className='text-xs text-red-500' role="alert">{errors.userRole.message}</span>}
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

export default EmployeeTable;