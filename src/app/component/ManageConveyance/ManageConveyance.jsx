'use client'

import React, { useState } from 'react';
import { Calendar } from 'primereact/calendar';
import { MdOutlinePendingActions } from 'react-icons/md';
import { TbReportMoney } from 'react-icons/tb';

const ManageConveyance = () => {


    const [selectedMonth, setSelectedMonth] = useState(new Date())
    const [selectedYear, setSelectedyear] = useState(new Date())
    const [conveyanceData, setConveyanceData] = useState(conveyance)
    const [totalIconColor, setTotalIconColor] = useState('gray')
    const [dueIconColor, setDueIconColor] = useState('gray')

    return (
        <div>
            <div className='flex gap-x-2'>
                <Calendar onChange={(e) => { setSelectedMonth((e.value)); console.log(e.value); }} value={selectedMonth} view="month" yearNavigator={false} style={{ year: { display: "none" } }} className="p-calendar-hide-year"
                    dateFormat="MM" size='small' />
                <Calendar onChange={(e) => { setSelectedyear(e.value); console.log(e.value); }} value={selectedYear} view="year" dateFormat="yy" size='small' />
                {/* <Dropdown options={years} onChange={(e) => { setFilterYear(e.value); }} value={filterYear} size='small' className='p-dropdown-sm' /> */}
            </div>

            <div className='mt-4 flex gap-x-2'>
                <div onMouseEnter={() => setTotalIconColor('white')} onMouseLeave={() => setTotalIconColor('gray')} className="bg-white p-[20px] w-fit rounded-xl shadow-lg flex items-center group hover:bg-violet-400 duration-500">
                    <TbReportMoney size={60} color={totalIconColor} />
                    <div className="flex flex-col justify-center items-center w-[200px] h-[80px] text-center cursor-pointer text-gray-500 group-hover:text-white">
                        <p>Total Amount</p>
                        <p className='text-3xl text-gray-600 group-hover:text-white font-bold'>&#2547; {`${conveyanceData.totalAmount || "00"} `} </p>
                        <p className='text-xs mt-2'>Found <span className='text-sky-500 group-hover:text-yellow-300 text-[15px] font-semibold'>{conveyanceData.totalConveyances}</span> trips in total</p>
                    </div>
                </div>
                <div onMouseEnter={() => setDueIconColor('white')} onMouseLeave={() => setDueIconColor('gray')} className="bg-white p-[20px] w-fit rounded-xl shadow-lg flex items-center group hover:bg-violet-400 duration-500">
                    <MdOutlinePendingActions size={55} color={dueIconColor} />
                    <div className="flex flex-col justify-center items-center w-[200px] h-[80px] text-center cursor-pointer text-gray-500 group-hover:text-white">
                        <p>Due</p>
                        <p className='text-3xl text-gray-600 group-hover:text-white font-bold'>&#2547; {`${conveyanceData.totalDueAmount || "00"}`}</p>
                        <p className='text-xs mt-2'>Payment due for <span className='text-sky-500 group-hover:text-yellow-300 text-[15px] font-semibold'>{conveyanceData.pendingConveyances}</span> trips</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageConveyance;