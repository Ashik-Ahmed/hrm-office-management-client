"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, DoughnutController } from 'chart.js';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, DoughnutController);

const EmployeeAttendance = () => {
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
        { date: '2024-12-01', status: 'on-time' },
        { date: '2024-12-02', status: 'late' },
        { date: '2024-12-03', status: 'absent' },
        { date: '2024-12-04', status: 'leave' },
    ]);

    const statusColors = {
        'Present': '#10B981',
        'Late': '#F59E0B',
        'Absent': '#EF4444',
        'Leave': '#3B82F6',
        'Holiday': '#F87171',
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
                        '#F87171',  // rose for holiday
                    ],
                    borderColor: [
                        '#10B981',
                        '#F59E0B',
                        '#EF4444',
                        '#3B82F6',
                        '#F87171',
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
                            position: 'bottom',
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

                        return (
                            <div
                                key={day.toString()}
                                className={`
                  p-2 text-center rounded-lg shadow-sm transition-all 
                  ${dayAttendance ? statusColors[dayAttendance.status] : 'bg-gray-100 text-gray-500'}
                  hover:scale-105 cursor-pointer
                `}
                                onClick={() => dayAttendance && setSelectedEmployee(dayAttendance)}
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
        <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-6xl mx-auto flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6">
            {/* Calendar Section */}
            <div className="w-full md:w-1/2">
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

            {/* Doughnut Chart Section */}
            <div className="w-full md:w-1/2 flex flex-col items-center">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Attendance Summary</h3>
                <div className="relative w-full h-64">
                    <canvas ref={chartRef}></canvas>
                </div>
            </div>
        </div>
    );
};

export default EmployeeAttendance;