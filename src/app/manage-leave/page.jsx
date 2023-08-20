import React from 'react';
import PendingLeaveTable from '../component/ManageLeave/PendingLeaveTable';
import { getAllPendingLeaveApplications } from '@/libs/leaves';
import LeaveTypeTable from '../component/ManageLeave/LeaveTypeTable';

const ManageLeave = async () => {

    const pendingLeaveApplications = await getAllPendingLeaveApplications()


    return (
        <div>
            <LeaveTypeTable />
            <div className='mt-4 rounded-md shadow-lg'>
                <PendingLeaveTable pendingLeaveApplications={pendingLeaveApplications} />
            </div>
        </div>
    );
};

export default ManageLeave;