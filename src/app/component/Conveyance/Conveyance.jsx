'use client'

import { getConveyanceByEmployeeEmail } from '@/libs/conveyance';
import { Calendar } from 'primereact/calendar';
import React, { useEffect, useRef, useState } from 'react';

const Conveyance = ({ conveyance, session }) => {

    const isFirstRender = useRef(true);
    const [filterMonth, setFilterMonth] = useState(new Date())
    const [filterYear, setFilterYear] = useState(new Date())
    const [conveyanceData, setConveyanceData] = useState(conveyance)

    const getConveyanceData = () => {
        console.log("fetching data");
        const url = `http://localhost:5000/api/v1/conveyance/${session.user.email}?month=${filterMonth}&year=${filterYear}`;

        fetch(url)
            .then(res => res.json())
            .then(data => {
                console.log(data);
                setConveyanceData(data?.data)
            })
    }

    useEffect(() => {
        // Do not fetch data on first render
        if (isFirstRender.current) {
            isFirstRender.current = false;
        } else {
            // Fetch data
            getConveyanceData()
        }
    }, [filterMonth, filterYear])

    return (
        <div>
            <div className='flex gap-x-2'>
                <Calendar onChange={(e) => { setFilterMonth(e.value); console.log(e.value); }} value={filterMonth} view="month" dateFormat="MM" size='small' className='p-dropdown-sm' />
                <Calendar onChange={(e) => { setFilterYear(e.value); console.log(e.value); }} value={filterYear} view="year" dateFormat="yy" size='small' className='p-dropdown-sm' />
                {/* <Dropdown options={years} onChange={(e) => { setFilterYear(e.value); }} value={filterYear} size='small' className='p-dropdown-sm' /> */}
            </div>
        </div>
    );
};

export default Conveyance;