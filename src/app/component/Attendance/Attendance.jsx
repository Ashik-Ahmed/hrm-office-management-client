"use client"
import { exportEmployeeAttendanceToPDF } from '@/utils/exportAttendance';
import { Calendar } from 'primereact/calendar';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useState } from 'react';
import { AiFillFilePdf } from 'react-icons/ai';
import { MdOutlineWatchLater } from 'react-icons/md';

const Attendance = ({ user }) => {

    const [loading, setLoading] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState(new Date());

    const attendanceData = [
        {
            date: "01 Mar 2025",
            checkIn: "09:00 AM",
            status: "Present",
            checkOut: "07:10 PM",
            break: "30 Min",
            late: "-",
            overtime: "-",
            productionHours: 9.05,
        },
        {
            date: "03 Mar 2025",
            checkIn: "09:00 AM",
            status: "Present",
            checkOut: "08:45 PM",
            break: "25 Min",
            late: "-",
            overtime: "1 Hr",
            productionHours: 9.55,
        },
        {
            date: "05 Mar 2025",
            checkIn: "09:00 AM",
            status: "Absent",
            checkOut: "09:30 PM",
            break: "15 Min",
            late: "-",
            overtime: "40 Min",
            productionHours: 9.10,
        },
        {
            date: "07 Mar 2025",
            checkIn: "09:00 AM",
            status: "Present",
            checkOut: "06:35 PM",
            break: "35 Min",
            late: "-",
            overtime: "-",
            productionHours: 8.20,
        },
        {
            date: "10 Mar 2025",
            checkIn: "09:00 AM",
            status: "Present",
            checkOut: "06:50 PM",
            break: "40 Min",
            late: "15 Min",
            overtime: "25 Min",
            productionHours: 8.40,
        },
        {
            date: "15 Mar 2025",
            checkIn: "09:00 AM",
            status: "Present",
            checkOut: "06:15 PM",
            break: "50 Min",
            late: "-",
            overtime: "45 Min",
            productionHours: 8.55,
        },
        {
            date: "18 Mar 2025",
            checkIn: "09:00 AM",
            status: "Present",
            checkOut: "07:55 PM",
            break: "20 Min",
            late: "-",
            overtime: "30 Min",
            productionHours: 9.25,
        },
        {
            date: "21 Mar 2025",
            checkIn: "09:00 AM",
            status: "Present",
            checkOut: "08:30 PM",
            break: "12 Min",
            late: "-",
            overtime: "50 Min",
            productionHours: 9.35,
        },
        {
            date: "25 Mar 2025",
            checkIn: "09:00 AM",
            status: "Present",
            checkOut: "05:50 PM",
            break: "45 Min",
            late: "10 Min",
            overtime: "-",
            productionHours: 7.40,
        },
        {
            date: "28 Mar 2025",
            checkIn: "09:00 AM",
            status: "Present",
            checkOut: "08:10 PM",
            break: "18 Min",
            late: "-",
            overtime: "40 Min",
            productionHours: 9.45,
        }
    ];

    const exportAttendanceReport = async (data) => {
        const exportAttendance = await exportEmployeeAttendanceToPDF(user, data, selectedMonth.getMonth() + 1, selectedMonth.getFullYear());
    }

    const statusBodyTemplate = (rowData) => {
        return (
            <div className='w-fit'>
                <div className={`flex items-center gap-x-1 px-2 rounded text-sm text-center ${rowData.status == "Present" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
                    <span className={`h-1.5 w-1.5 rounded-full inline-block ${rowData.status == "Present" ? "bg-green-600" : "bg-red-400"}`}></span>
                    <span> {rowData.status}</span>
                </div>
            </div>
        )
    }

    const productionHoursBodyTemplate = (rowData) => {
        return (
            <div className='w-fit'>
                <div className={`flex items-center gap-x-1 px-2 rounded text-sm text-center ${rowData.productionHours >= 8 ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
                    <MdOutlineWatchLater size={12} />
                    <span>{rowData.productionHours} Hrs</span>
                </div>
            </div>
        )
    }

    return (
        <div>
            <div className='mt-1 shadow-lg p-2 bg-white rounded-md'>
                <div className='flex items-center justify-between mb-2'>
                    <div className='flex items-center gap-x-2'>
                        <h3 className='font-light'>ATTENDANCE DATA</h3>
                        {
                            attendanceData?.length > 0 &&
                            <AiFillFilePdf onClick={() => exportAttendanceReport(attendanceData)} size={25} className='cursor-pointer text-red-500' />
                        }
                    </div>
                    <div>
                        <Calendar value={selectedMonth} onChange={(e) => setSelectedMonth(e.value)} view="month" dateFormat="MM yy" />
                    </div>
                </div>
                <DataTable value={attendanceData} size='small' emptyMessage="Not found" loading={loading} paginator rows={30} rowsPerPageOptions={[10, 20, 30, 40]}>
                    <Column field='date' header="Date"></Column>
                    <Column field='checkIn' header="Check In"></Column>
                    <Column body={statusBodyTemplate} header="Status"></Column>
                    <Column field='checkOut' header="Check Out"></Column>
                    <Column field='break' header="Break"></Column>
                    <Column field='late' header="Late"></Column>
                    <Column field='overtime' header="Overtime"></Column>
                    <Column body={productionHoursBodyTemplate} header="Production Hours"></Column>
                </DataTable>
            </div>
        </div>
    );
};

export default Attendance;