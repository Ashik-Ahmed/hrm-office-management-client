import React from 'react';
import LeaveStatusTable from '../component/Leave/LeaveStatusTable';
import LeaveApplicationsTable from '../component/Leave/LeaveApplicationsTable';
import { getAllLeaveApplicationsByEmployeeId } from '@/libs/leaves';

const Leave = async () => {

    // const leaveApplicationHistory = await fetch(`http://localhost:5000/api/v1/employee/leaveHistory/6489c44663e37faff1ffd270`).then(res => res.json())

    // const leaveApplications = await getAllLeaveApplicationsByEmployeeId(employeeId)

    const getLeaveApplications = async (employeeId) => {
        const allLeaveAppications = await getAllLeaveApplicationsByEmployeeId(employeeId);

        console.log(allLeaveAppications);
    }

    const leaves = [
        { id: "1", leave: "Casual", total: 10, taken: 3, balance: 5 },
        { id: "2", leave: "Annual", total: 10, taken: 3, balance: 5 },
        { id: "3", leave: "Sick", total: 10, taken: 3, balance: 5 },
        { id: "4", leave: "Emergency", total: 10, taken: 3, balance: 5 },
        { id: "5", leave: "Maternity", total: 10, taken: 3, balance: 5 },
    ]

    return (
        <div className='py-2'>
            <LeaveStatusTable leaves={leaves} />

            <div className='mt-4 shadow-xl'>
                <LeaveApplicationsTable leaves={leaves} />
            </div>
        </div>
    );
};

export default Leave;