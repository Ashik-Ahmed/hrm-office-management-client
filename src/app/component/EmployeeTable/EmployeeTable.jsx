import Image from 'next/image';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import React from 'react';
import { AiFillPlusSquare } from 'react-icons/ai'
import { FiEdit } from 'react-icons/fi';
import { RiDeleteBinLine } from 'react-icons/ri';
import user from '../../../../public/images/user.png'
import { useState } from 'react';
import { FilterMatchMode } from 'primereact/api';
import { MdRemoveRedEye } from 'react-icons/md';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';

const EmployeeTable = ({ users, setAddUserDialog, setViewUserDialog, setDeleteUserDialog }) => {

    const [loading, setLoading] = useState(false)

    const router = useRouter()

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
                <Button tooltip="Edit" tooltipOptions={buttonTooltipOptions} icon='pi pi-file-edit' rounded text raised severity='success' style={{ width: '35px', height: '35px' }} />
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
        </div>
    );
};

export default EmployeeTable;