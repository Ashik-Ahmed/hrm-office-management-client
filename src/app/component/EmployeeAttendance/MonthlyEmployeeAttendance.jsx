"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, DoughnutController } from 'chart.js';
import { FaCalendar } from 'react-icons/fa6';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, DoughnutController);

const MonthlyEmployeeAttendance = () => {
    const chartRef = useRef(null);
    const chartInstanceRef = useRef(null);

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const yearRange = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);

    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [attendanceData, setAttendanceData] = useState([
        { date: '2025-03-01', status: 'Present' },
        { date: '2025-03-02', status: 'Late' },
        { date: '2025-03-03', status: 'Absent' },
        { date: '2025-03-04', status: 'Leave' },
        { date: '2025-03-05', status: 'Holiday' },
    ]);

    const statusColors = {
        'Present': 'bg-green-500',
        'Late': 'bg-yellow-500',
        'Absent': 'bg-red-500',
        'Leave': 'bg-blue-500',
        'Holiday': 'bg-gray-500',
    };

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
        const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1);
        const lastDayOfMonth = new Date(selectedYear, selectedMonth + 1, 0);
        const startingDay = firstDayOfMonth.getDay();

        const days = [];
        for (let i = 0; i < startingDay; i++) {
            days.push(null);
        }

        for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
            days.push(new Date(selectedYear, selectedMonth, day));
        }

        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        return (
            <div>
                <div className="grid grid-cols-7 mb-4 text-gray-600 font-semibold">
                    {dayNames.map(day => (
                        <div key={day} className="text-center">{day}</div>
                    ))}
                </div>
                <div className="grid grid-cols-7 gap-2">
                    {days.map((day, index) => {
                        if (!day) return <div key={`empty-${index}`} className="p-2"></div>;

                        const formattedDate = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')}`;
                        const dayAttendance = attendanceData.find(a => a.date === formattedDate);
                        // const bgColor = dayAttendance ? statusColors[dayAttendance.status] : '#f3f4f6'; // Default gray

                        return (
                            <div
                                key={day.toString()}
                                className={`
                                    p-2 text-center rounded-lg shadow-sm transition-all hover:scale-105 cursor-pointer
                                    ${dayAttendance ? statusColors[dayAttendance.status] : 'bg-gray-100'}
                                    ${new Date().getDate() === day.getDate() ? "bg-blue-800 text-white" : ""}
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
            <div className="w-full md:w-1/2 flex flex-col bg-white p-6 rounded-xl shadow-xl">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold mb-4">Attendance Summary</h3>
                    <div className='flex gap-x-2 items-center border px-4 rounded-md bg-gray-100 text-gray-600'>
                        <p>{selectedMonth}-{new Date().getFullYear()}</p>
                        <FaCalendar />
                    </div>
                </div>
                <div className="relative w-full h-96 mx-auto">
                    <canvas ref={chartRef} className='w-full mx-auto'></canvas>
                </div>
            </div>

            {/* Calendar Section */}
            <div className="w-full md:w-1/2 bg-white p-6 rounded-xl shadow-xl">
                <h3 className="text-lg font-semibold mb-4">Attendance Status</h3>
                <div className="flex space-x-4 mb-6">
                    <select
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(Number(e.target.value))}
                        className="w-full p-2 border rounded"
                    >
                        {monthNames.map((month, index) => (
                            <option key={month} value={index}>
                                {month}
                            </option>
                        ))}
                    </select>
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
                </div>
                {renderCalendar()}
            </div>
        </div>
    );
};

export default MonthlyEmployeeAttendance;