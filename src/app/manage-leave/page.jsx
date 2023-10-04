import React from 'react';
import PendingLeaveTable from '../component/ManageLeave/PendingLeaveTable';
import { getAllLeaves, getAllPendingLeaveApplications } from '@/libs/leaves';
import LeaveTypeTable from '../component/ManageLeave/LeaveTypeTable';

const ManageLeave = async () => {

    const pendingLeaveApplications = await getAllPendingLeaveApplications();

    // get all leaves from DB 
    const availableLeaves = await getAllLeaves()
    // .then(res => res.json())


    return (
        <div>
            <LeaveTypeTable />
            <div className='mt-4 rounded-md shadow-lg'>
                <PendingLeaveTable />
            </div>
        </div>
    );
};

export default ManageLeave;