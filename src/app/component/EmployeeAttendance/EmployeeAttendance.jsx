"use client"

import React, { useState } from 'react';

const EmployeeAttendance = () => {
    const currentYear = new Date().getFullYear();
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [selectedYear, setSelectedYear] = useState(currentYear);
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    const [attendanceData, setAttendanceData] = useState([
        { date: '2024-12-01', status: 'on-time', employeeName: 'John Doe' },
        { date: '2024-12-02', status: 'late', employeeName: 'Jane Smith' },
        { date: '2024-12-03', status: 'absent', employeeName: 'Mike Johnson' },
        { date: '2024-12-04', status: 'leave', employeeName: 'Emily Brown' },
    ]);

    const statusColors = {
        'on-time': 'bg-emerald-500 text-white',
        'late': 'bg-amber-500 text-white',
        'absent': 'bg-rose-500 text-white',
        'leave': 'bg-sky-500 text-white',
        'default': 'bg-gray-200 text-gray-600'
    };

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

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

    const yearRange = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);

    return (
        <div className="bg-white p-6 rounded-2xl shadow-2xl  mx-auto">
            <div className="flex space-x-4 mb-6">
                <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(Number(e.target.value))}
                    className="w-full p-2 border rounded"
                >
                    {monthNames.map((month, index) => (
                        <option key={month} value={index}>{month}</option>
                    ))}
                </select>

                <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                    className="w-full p-2 border rounded"
                >
                    {yearRange.map(year => (
                        <option key={year} value={year}>{year}</option>
                    ))}
                </select>
            </div>

            {renderCalendar()}

            <div className="mt-6 grid grid-cols-2 gap-2">
                {Object.entries(statusColors)
                    .filter(([key]) => key !== 'default')
                    .map(([status, colorClass]) => (
                        <div key={status} className="flex items-center space-x-2">
                            <div className={`w-4 h-4 rounded ${colorClass}`}></div>
                            <span className="capitalize text-sm">{status}</span>
                        </div>
                    ))
                }
            </div>

            {selectedEmployee && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-bold text-gray-800">Employee Details</h3>
                    <p>Name: {selectedEmployee.employeeName}</p>
                    <p>Date: {selectedEmployee.date}</p>
                    <p>Status: {selectedEmployee.status}</p>
                </div>
            )}
        </div>
    );
};

export default EmployeeAttendance;