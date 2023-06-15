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

const EmployeeTable = ({ users, setAddUserDialog, setViewUserDialog, setDeleteUserDialog }) => {

    const [loading, setLoading] = useState(false)

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
                    <Image src={rowData.photo || user} height={35} width={35} priority alt='user photo' />
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

    const actionBodyTemplate = (rowData) => {
        return (
            <div className='flex gap-x-4'>
                <MdRemoveRedEye onClick={() => setViewUserDialog(rowData)} size={18} color='gray' className='cursor-pointer' />
                <FiEdit size={18} color='blue' className='cursor-pointer' />
                <RiDeleteBinLine onClick={() => setDeleteUserDialog(rowData)} size={18} color='red' className='cursor-pointer' />
            </div>
        )
    }



    return (

        <div className="card p-2 bg-white rounded-md my-2 shadow-xl">
            <div className='flex justify-between items-center mb-1'>
                <div className='flex items-center gap-x-2'>
                    <h3 className='font-light'>EMPLOYEE LIST</h3>
                    {/* <Button onClick={() => setAddUserDialog(true)} icon="pi pi-plus" className='p-button p-button-sm p-button-info' /> */}
                    <AiFillPlusSquare onClick={() => setAddUserDialog(true)} size={20} color='gray' className='cursor-pointer' />
                </div>
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Search" />
                </span>
            </div>
            <DataTable value={users} loading={loading}
                filters={filters} filterDisplay="menu" globalFilterFields={['firstName', 'lastName', 'email']} emptyMessage="No Members found."
                tableStyle={{ minWidth: '50rem' }} responsiveLayout="scroll" scrollHeight="86vh">
                {/* <Column body={photoBodyTemplate} header="Name" ></Column> */}
                <Column body={fullNameBodyTemplate} header="Name" ></Column>
                <Column field="designation" header="Designation" ></Column>
                <Column body={roleBodyTemplate} header="Role" ></Column>
                <Column body={actionBodyTemplate} header="Action" ></Column>
            </DataTable>
        </div>
    );
};

export default EmployeeTable;