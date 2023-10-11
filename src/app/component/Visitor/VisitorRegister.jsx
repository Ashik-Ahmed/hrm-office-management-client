'use client'

import { getMonthlyVisitors } from '@/libs/visitor';
import { FilterMatchMode } from 'primereact/api';
import { Calendar } from 'primereact/calendar';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import React, { useEffect, useState } from 'react';
import { AiFillPlusSquare } from 'react-icons/ai';

const VisitorRegister = () => {

    const [selectedMonth, setSelectedMonth] = useState(new Date())
    const [selectedYear, setSelectedYear] = useState(new Date())
    const [monthlyVisitors, setMonthlyVisitors] = useState([])
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

    useEffect(() => {
        const month = new Date(selectedMonth).getMonth() + 1;
        const year = new Date(selectedYear).getFullYear();
        const getMonthlyVisitorData = async () => {
            setLoading(true)
            const visitors = await getMonthlyVisitors(month, year)
            console.log(visitors.data);
            setMonthlyVisitors(visitors.data);
            setLoading(false)
        }
        getMonthlyVisitorData()
    }, [selectedMonth, selectedYear])

    const dateBodyTemplate = (rowData => {
        return (
            <div>{rowData.createdAt.split("T")[0]}</div>
        )
    })

    return (

        <div>
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
                        <AiFillPlusSquare size={20} color='#8C239E' className='cursor-pointer' />
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
        </div>
    );
};

export default VisitorRegister;