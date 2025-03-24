"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, DoughnutController } from 'chart.js';
import { FaArrowRightLong, FaCalendar } from 'react-icons/fa6';
import { Calendar } from 'primereact/calendar';
import Link from 'next/link';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, DoughnutController);

const MonthlyEmployeeAttendance = () => {
    const chartRef = useRef(null);
    const chartInstanceRef = useRef(null);

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];


    const [selectedMonth, setSelectedMonth] = useState(new Date());
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    const [attendanceData, setAttendanceData] = useState([
        { date: '2025-03-01', status: 'Present' },
        { date: '2025-03-02', status: 'Late' },
        { date: '2025-03-03', status: 'Absent' },
        { date: '2025-03-04', status: 'Leave' },
        { date: '2025-03-05', status: 'Holiday' },
    ]);

    const statusColors = {
        'Present': 'bg-green-500 text-white',
        'Late': 'bg-yellow-500 text-white',
        'Absent': 'bg-red-500 text-white',
        'Leave': 'bg-blue-500 text-white',
        'Holiday': 'bg-gray-500 text-white',
    };

    // Fixed: Get month from selectedMonth object correctly
    const currentMonth = selectedMonth.getMonth(); // returns 0-11
    const currentYear = selectedYear;

    useEffect(() => {
        if (chartRef && chartRef.current) {
            const ctx = chartRef.current.getContext("2d");

            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
            }

            // Dummy data for the chart
            const data = {
                labels: ['Present', 'Late', 'Absent', 'Leave', 'Holiday'],
                datasets: [{
                    data: [
                        65,
                        15,
                        20,
                        5,
                        4
                    ],
                    backgroundColor: [
                        '#10B981', // green for on-time
                        '#F59E0B', // amber for late
                        '#EF4444', // red for absent
                        '#3B82F6',  // blue for leave
                        '#808080',  // rose for holiday
                    ],
                    borderColor: [
                        '#10B981',
                        '#F59E0B',
                        '#EF4444',
                        '#3B82F6',
                        '#808080',
                    ],
                    borderWidth: 1
                }]
            };

            const config = {
                type: 'doughnut',
                data: data,
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'left',
                        },
                        tooltip: {
                            enabled: true,
                        },
                    },
                },
            };

            chartInstanceRef.current = new ChartJS(ctx, config);
        }
    }, []);

    const renderCalendar = () => {
        const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
        const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
        const startingDay = firstDayOfMonth.getDay();

        const days = [];
        for (let i = 0; i < startingDay; i++) {
            days.push(null);
        }

        // Fixed: Use correct parameters when creating date objects
        for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
            days.push(new Date(currentYear, currentMonth, day));
        }

        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        return (
            <div className=''>
                <div className="grid grid-cols-7 mb-4 text-white font-semibold border bg-violet-600">
                    {dayNames.map(day => (
                        <div key={day} className="text-center border border-white">{day}</div>
                    ))}
                </div>
                <div className="grid grid-cols-7 gap-2">
                    {days.map((day, index) => {
                        if (!day) return <div key={`empty-${index}`} className="p-2"></div>;

                        const formattedDate = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')}`;
                        const dayAttendance = attendanceData.find(a => a.date === formattedDate);
                        const today = new Date();
                        const isToday = today.getDate() === day.getDate() &&
                            today.getMonth() === day.getMonth() &&
                            today.getFullYear() === day.getFullYear();

                        // Check if the day is Friday (5 = Friday)
                        const isFriday = day.getDay() === 5;

                        return (
                            <div
                                key={day.toString()}
                                className={`
                                    p-2 text-center rounded shadow-sm transition-all hover:scale-105 cursor-pointer
                                    ${isToday ? "bg-violet-400 border-2 border-violet-700 text-white animate-pulse" : ""}
                                    ${isFriday ? "bg-gray-500 text-white" :
                                        dayAttendance ? statusColors[dayAttendance.status] : "bg-gray-100"
                                    }
                                `}
                            >
                                {day.getDate()}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <div className="w-full mx-auto flex flex-col md:flex-row md:justify-between space-y-6 md:space-y-0 md:space-x-6">
            {/* Doughnut Chart Section */}
            <div className="w-full md:w-1/2 flex flex-col bg-white mt-4 md:mt-0 p-6 rounded-xl shadow-xl">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold mb-4">Attendance Summary</h3>
                    <div className='flex gap-x-2 items-center border px-4 rounded-md bg-gray-100 text-gray-600'>
                        <p>{monthNames[currentMonth]}-{currentYear}</p>
                        <FaCalendar />
                    </div>
                </div>
                <div className="relative w-full h-96 mx-auto">
                    <canvas ref={chartRef} className='w-full mx-auto'></canvas>
                </div>
            </div>

            {/* Calendar Section */}
            <div className="w-full md:w-1/2 bg-white p-6 rounded-xl shadow-xl">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Attendance Status</h3>
                    <Calendar
                        value={selectedMonth}
                        onChange={(e) => { setSelectedMonth(e.value); setSelectedYear(new Date(e.value).getFullYear()) }}
                        view='month'
                        dateFormat='MM yy'
                    />
                </div>
                {/* <div className="flex space-x-4 mb-6">
                    <Calendar
                        value={selectedMonth}
                        onChange={(e) => { setSelectedMonth(e.value); setSelectedYear(new Date(e.value).getFullYear()) }}
                        view='month'
                        dateFormat='MM yy'
                        className="w-full"
                    />
                    <Calendar
                        value={selectedMonth}
                        onChange={(e) => setSelectedYear(e.value)}
                        view="year"
                        dateFormat="yy"
                        className="w-full"
                    />
                    <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(Number(e.target.value))}
                        className="w-full p-2 border rounded"
                    >
                        {yearRange.map((year) => (
                            <option key={year} value={year}>
                                {year}
                            </option>
                        ))}
                    </select>
                </div> */}
                {renderCalendar()}

                <div className='w-full mt-8'>
                    <Link href="/attendance" className='block w-full bg-violet-600 text-white px-2 py-1 rounded-md'>
                        <span className='w-full flex justify-center items-center mx-auto gap-x-2'>See Details <FaArrowRightLong /></span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default MonthlyEmployeeAttendance;