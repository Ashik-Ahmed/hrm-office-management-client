"use client"
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React from 'react';
import { AiFillFilePdf } from 'react-icons/ai';

const Attendance = () => {

    const attendanceData = [
        {
            date: "01 Mar 2025",
            checkIn: "09:00 AM",
            status: "Present",
            checkOut: "07:10 PM",
            break: "30 Min",
            late: "-",
            overtime: "-",
            productionHours: "9.05 Hrs",
        },
        {
            date: "03 Mar 2025",
            checkIn: "09:00 AM",
            status: "Present",
            checkOut: "08:45 PM",
            break: "25 Min",
            late: "-",
            overtime: "1 Hr",
            productionHours: "9.55 Hrs",
        },
        {
            date: "05 Mar 2025",
            checkIn: "09:00 AM",
            status: "Absent",
            checkOut: "09:30 PM",
            break: "15 Min",
            late: "-",
            overtime: "40 Min",
            productionHours: "9.10 Hrs",
        },
        {
            date: "07 Mar 2025",
            checkIn: "09:00 AM",
            status: "Present",
            checkOut: "06:35 PM",
            break: "35 Min",
            late: "-",
            overtime: "-",
            productionHours: "8.20 Hrs",
        },
        {
            date: "10 Mar 2025",
            checkIn: "09:00 AM",
            status: "Present",
            checkOut: "06:50 PM",
            break: "40 Min",
            late: "15 Min",
            overtime: "25 Min",
            productionHours: "8.40 Hrs",
        },
        {
            date: "15 Mar 2025",
            checkIn: "09:00 AM",
            status: "Present",
            checkOut: "06:15 PM",
            break: "50 Min",
            late: "-",
            overtime: "45 Min",
            productionHours: "8.55 Hrs",
        },
        {
            date: "18 Mar 2025",
            checkIn: "09:00 AM",
            status: "Present",
            checkOut: "07:55 PM",
            break: "20 Min",
            late: "-",
            overtime: "30 Min",
            productionHours: "9.25 Hrs",
        },
        {
            date: "21 Mar 2025",
            checkIn: "09:00 AM",
            status: "Present",
            checkOut: "08:30 PM",
            break: "12 Min",
            late: "-",
            overtime: "50 Min",
            productionHours: "9.35 Hrs",
        },
        {
            date: "25 Mar 2025",
            checkIn: "09:00 AM",
            status: "Present",
            checkOut: "05:50 PM",
            break: "45 Min",
            late: "10 Min",
            overtime: "-",
            productionHours: "7.40 Hrs",
        },
        {
            date: "28 Mar 2025",
            checkIn: "09:00 AM",
            status: "Present",
            checkOut: "08:10 PM",
            break: "18 Min",
            late: "-",
            overtime: "40 Min",
            productionHours: "9.45 Hrs",
        }
    ];


    return (
        <div>
            <div className='mt-1 shadow-lg p-2 bg-white rounded-md'>
                <div className='flex items-center gap-x-2 mb-2'>
                    <h3 className='font-light'>CONVEYANCE REPORT</h3>
                    {/* {
                        monthlyEmployeeConveyance?.employeeData?.length > 0 &&
                        <AiFillFilePdf onClick={() => exportConveyanceReport(monthlyEmployeeConveyance)} size={25} className='cursor-pointer text-red-500' />
                    } */}
                </div>
                <DataTable value={attendanceData} size='small' emptyMessage="No Conveyance found" loading={loading} >
                    {/* <Column body={dateBodyTemplate} header="Date"></Column> */}
                    <Column field='date' header="Date"></Column>
                    <Column field='checkIn' header="Check In"></Column>
                    <Column field='status' header="Status"></Column>
                    <Column field='checkOut' header="Check Out"></Column>
                    <Column field='break' header="Break"></Column>
                    <Column field='late' header="Late"></Column>
                    <Column field='overtime' header="Overtime"></Column>
                    <Column field='productionHours' header="Production Hours"></Column>
                </DataTable>
            </div>
        </div>
    );
};

export default Attendance;