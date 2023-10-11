'use client'

import { getMonthlyVisitors } from '@/libs/visitor';
import { Calendar } from 'primereact/calendar';
import React, { useEffect, useState } from 'react';

const VisitorRegister = () => {

    const [selectedMonth, setSelectedMonth] = useState(new Date())
    const [selectedYear, setSelectedYear] = useState(new Date())
    const [monthlyVisitors, setMonthlyVisitors] = useState([])

    useEffect(() => {
        const month = new Date(selectedMonth).getMonth() + 1;
        const year = new Date(selectedYear).getFullYear();
        const getMonthlyVisitorData = async () => {
            const visitors = await getMonthlyVisitors(month, year)
            return visitors;
        }

        setMonthlyVisitors(getMonthlyVisitorData);

    }, [selectedMonth, selectedYear])

    return (

        <div>
            <div className='flex gap-x-2'>
                <Calendar onChange={(e) => { setSelectedMonth((e.value)); console.log(e.value); }} value={selectedMonth} view="month" yearNavigator={false} style={{ year: { display: "none" } }} className="p-calendar-hide-year"
                    dateFormat="MM" size='small' />
                <Calendar onChange={(e) => { setSelectedYear(e.value); console.log(e.value); }} value={selectedYear} view="year" dateFormat="yy" size='small' />
                {/* <Dropdown options={years} onChange={(e) => { setFilterYear(e.value); }} value={filterYear} size='small' className='p-dropdown-sm' /> */}
            </div>
        </div>
    );
};

export default VisitorRegister;