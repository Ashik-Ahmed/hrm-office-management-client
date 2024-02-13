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
import { Toast } from 'primereact/toast';
import Link from 'next/link';

const EmployeeTable = ({ users, fetchAllUsers, setAddUserDialog, setDeleteUserDialog }) => {

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
        setLoading(true)

        const updatedData = {};

        for (const field in data) {
            if (data[field]) {
                updatedData[field] = data[field]
            }
        }
        console.log(editEmployee._id, updatedData);
        fetch(`http://localhost:5000/api/v1/employee/${editEmployee._id}`, {
            method: "PATCH",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(updatedData)
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                if (data.status == "Success") {
                    toast.current.show({ severity: 'success', summary: 'Success', detail: 'Employee Updated', life: 3000 });
                    fetchAllUsers();
                    setEditEmployee(false);
                    setJoiningDate(null);
                    setRole(null);
                    reset();
                }
                else {
                    toast.current.show({ severity: 'error', summary: 'Failed!', detail: data.error, life: 3000 });
                }
            })
        setLoading(false)
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
        // <div className="card p-2 bg-white rounded-md shadow-xl">
        //     <Toast ref={toast} />
        //     <div className='flex justify-between items-center mb-1'>
        //         <div className='flex items-center gap-x-2'>
        //             <h3 className='font-light'>EMPLOYEE LIST</h3>
        //             {/* <Button onClick={() => setAddUserDialog(true)} icon="pi pi-plus" className='p-button p-button-sm p-button-info' /> */}
        //             <AiFillPlusSquare onClick={() => setAddUserDialog(true)} size={20} color='#8C239E' className='cursor-pointer' />
        //         </div>
        //         <span className="p-input-icon-left">
        //             <i className="pi pi-search" />
        //             <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Search" className='p-inputtext-sm' />
        //         </span>
        //     </div>
        //     <DataTable value={users} loading={loading} size='small'
        //         filters={filters} filterDisplay="menu" globalFilterFields={['firstName', 'lastName', 'email']} emptyMessage="No Members found."
        //         tableStyle={{ minWidth: '50rem' }} responsiveLayout="scroll" scrollHeight="85vh">
        //         {/* <Column body={photoBodyTemplate} header="Name" ></Column> */}
        //         <Column body={fullNameBodyTemplate} header="Employee" ></Column>
        //         <Column field="designation" header="Designation" ></Column>
        //         <Column body={roleBodyTemplate} header="Role" ></Column>
        //         <Column body={actionBodyTemplate} header="Action" ></Column>
        //     </DataTable>

        //     {/* edit user dialog  */}
        //     <Dialog header="Edit Employee" visible={editEmployee} style={{ width: '50vw' }} onHide={() => { setEditEmployee(false); setJoiningDate(null); setRole(null); reset() }}>

        //         <form onSubmit={handleSubmit(handleEditEmployee)} className='mt-2'>

        //             <div className='w-full'>
        //                 <Dropdown value={editEmployee?.department} placeholder={editEmployee?.departemnt} disabled className="w-full placeholder-opacity-20" />
        //             </div>
        //             <div className='mt-2 flex gap-x-4'>
        //                 <div className="w-full">
        //                     <InputText placeholder={editEmployee?.employeeId} disabled className='w-full' />
        //                 </div>
        //                 <div className='w-full'>
        //                     {/* <Calendar value={date} onChange={(e) => setDate(e.value)} dateFormat="dd/mm/yy" /> */}

        //                     {/* <Calendar value={date} onChange={(e) => setDate(e.value)} dateFormat="dd/mm/yy" placeholder='Joining Date' className='w-full' /> */}
        //                     <Controller
        //                         name="joiningDate"
        //                         control={control}
        //                         render={({ field }) => (
        //                             <Calendar
        //                                 value={editEmployee?.joiningDate}
        //                                 onChange={(e) => { setJoiningDate(e.value); field.onChange(e.value) }}
        //                                 placeholder={editEmployee?.joiningDate}
        //                                 className='w-full'
        //                                 disabled
        //                             />
        //                         )}
        //                     />

        //                 </div>
        //             </div>
        //             <div className='mt-2 flex gap-x-4'>
        //                 <div className='w-full'>
        //                     <InputText
        //                         {...register("firstName")}
        //                         type='text' placeholder={editEmployee?.firstName} className='w-full' />
        //                 </div>
        //                 <div className='w-full'>
        //                     <InputText
        //                         {...register("lastName")}
        //                         type='text' placeholder={editEmployee?.lastName} className='w-full' />
        //                 </div>
        //             </div>
        //             <div className='mt-2 flex gap-x-4'>
        //                 <div className='w-full'>
        //                     <InputText
        //                         {...register("email")}
        //                         type='email' placeholder={editEmployee?.email} className='w-full' />
        //                 </div>
        //                 <div className='w-full'>
        //                     <InputText
        //                         {...register("mobile")}
        //                         type='text' placeholder={`${editEmployee?.mobile || 'Mobile Number'}`} className='w-full' />
        //                 </div>
        //             </div>
        //             <div className='mt-2 flex gap-x-4'>
        //                 <div className='w-full'>
        //                     <InputText
        //                         {...register("designation")}
        //                         type='text' placeholder={`${editEmployee?.designation || "Designation"}`} className='w-full' />
        //                 </div>
        //                 <div className='w-full'>
        //                     <Dropdown
        //                         {...register("userRole")}
        //                         value={role} onChange={(e) => setRole(e.value)} options={userRoles} placeholder={editEmployee?.userRole} className="w-full placeholder-opacity-20" />
        //                 </div>
        //             </div>

        //             <div className='mt-4 text-right'>
        //                 <Button type='submit' label="Submit" className="p-button-sm" loading={loading} />
        //             </div>
        //         </form>
        //     </Dialog>
        // </div>
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Employee Dashboard</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {users.map((employee) => (
                    <Link href={`/employee/${employee._id}`} key={employee._id}>

                        <div className="bg-white p-4 rounded-md shadow-md hover:shadow-lg transition duration-300 cursor-pointer h-full">
                            <Image
                                src={employee.image}
                                alt={employee.name}
                                className="w-full h-40 object-contain mb-2 rounded-md"
                                width={200}
                                height={200}
                                priority
                            />
                            <h2 className="text-lg font-semibold mb-2">{employee.name}</h2>
                            <p className="text-sm text-gray-500">{employee.designation}</p>
                            {/* Add other employee information as needed */}
                        </div>

                    </Link>
                ))}
            </div>
        </div>
    );
};

export default EmployeeTable;