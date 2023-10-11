'use client'

import { getMonthlyVisitors } from '@/libs/visitor';
import { FilterMatchMode } from 'primereact/api';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AiFillPlusSquare } from 'react-icons/ai';

const VisitorRegister = () => {

    const toast = useRef()
    const { register, control, formState: { errors }, handleSubmit, reset } = useForm();

    const [selectedMonth, setSelectedMonth] = useState(new Date())
    const [selectedYear, setSelectedYear] = useState(new Date())
    const [monthlyVisitors, setMonthlyVisitors] = useState([])
    const [insertVisitor, setInsertVisitor] = useState(false)
    const [loading, setLoading] = useState(false)

    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { value: null, matchMode: FilterMatchMode.CONTAINS },
        mobile: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };


    const getMonthlyVisitorData = async () => {

        const month = new Date(selectedMonth).getMonth() + 1;
        const year = new Date(selectedYear).getFullYear();
        setLoading(true)
        const visitors = await getMonthlyVisitors(month, year)
        console.log(visitors.data);
        setMonthlyVisitors(visitors.data);
        setLoading(false)
    }

    useEffect(() => {

        getMonthlyVisitorData()

    }, [selectedMonth, selectedYear])

    const handleInsertVisitor = (data) => {
        console.log(data);

        fetch('http://localhost:5000/api/v1/visitor', {
            method: "POST",
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(res => res.json())
            .then(data => {
                if (data.status == 'Success') {
                    console.log("Successfully inserted into DB");
                    getMonthlyVisitorData()
                    setInsertVisitor(false);
                    reset();
                    toast.current.show({ severity: 'success', summary: 'Success', detail: 'Visitor recorded', life: 3000 });
                }
                else {
                    console.log(data);
                    toast.current.show({ severity: 'error', summary: 'Failed!', detail: data.error, life: 3000 });
                }
            })
        setLoading(false)
    }

    const dateBodyTemplate = (rowData => {
        return (
            <div>{rowData.createdAt.split("T")[0]}</div>
        )
    })

    return (
        <div>
            <Toast ref={toast} />
            <div className='flex gap-x-2'>
                <Calendar onChange={(e) => { setSelectedMonth((e.value)); console.log(e.value); }} value={selectedMonth} view="month" yearNavigator={false} style={{ year: { display: "none" } }} className="p-calendar-hide-year"
                    dateFormat="MM" size='small' />
                <Calendar onChange={(e) => { setSelectedYear(e.value); console.log(e.value); }} value={selectedYear} view="year" dateFormat="yy" size='small' />
                {/* <Dropdown options={years} onChange={(e) => { setFilterYear(e.value); }} value={filterYear} size='small' className='p-dropdown-sm' /> */}
            </div>
            <div className='mt-4 shadow-lg p-2 bg-white rounded-md'>
                <div className='flex items-center justify-between mb-1'>
                    <div className='flex items-center gap-x-2 mb-2'>
                        <h3 className='font-light'>VISITOR REGISTER</h3>
                        <AiFillPlusSquare onClick={() => setInsertVisitor(true)} size={20} color='#8C239E' className='cursor-pointer' />
                    </div>
                    <div>

                        <span className="p-input-icon-left">
                            <i className="pi pi-search" />
                            <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Search" className='p-inputtext-sm' />
                        </span>
                    </div>
                </div>
                <DataTable value={monthlyVisitors} size='small' loading={loading} filters={filters} filterDisplay="menu" globalFilterFields={['name', 'mobile']} emptyMessage="No Visitor Found">
                    {/* <Column body={dateBodyTemplate} header="Date"></Column> */}
                    <Column body={dateBodyTemplate} header="Date"></Column>
                    <Column field='name' header="Name"></Column>
                    <Column field='mobile' header="Mobile"></Column>
                    <Column field='company' header="From"></Column>
                    <Column field="purpose" header="Purpose"></Column>
                </DataTable>
            </div>

            {/* insert visitor dialog  */}
            <Dialog header="Add Employee" visible={insertVisitor} style={{ width: '50vw' }} onHide={() => { setInsertVisitor(false); reset() }}>

                <form onSubmit={handleSubmit(handleInsertVisitor)} className='mt-2'>

                    <div className='mt-2 flex gap-x-4'>
                        <div className="w-full">
                            <InputText
                                {...register("name", { required: "Name is required" })}
                                type='text' placeholder="Name*" className='w-full' />
                            {errors.name?.type === 'required' && <span className='text-xs text-red-500' role="alert">{errors.name.message}</span>}
                        </div>
                        <div className='w-full'>
                            <InputText
                                {...register("mobile")}
                                keyfilter='int' type='text' placeholder="Mobile Number" className='w-full' />
                        </div>
                    </div>
                    <div className='mt-2 flex gap-x-4'>
                        <div className='w-full'>
                            <InputText
                                {...register("company")}
                                type='text' placeholder="Company Name" className='w-full' />
                        </div>
                        <div className='w-full'>
                            <InputText
                                {...register("designation")}
                                type='text' placeholder="Designation" className='w-full' />
                        </div>
                    </div>
                    <div className='mt-2 flex gap-x-4'>
                        <div className='w-full'>
                            <InputText
                                {...register("purpose")}
                                type='text' placeholder="Purpose" className='w-full' />
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

export default VisitorRegister;