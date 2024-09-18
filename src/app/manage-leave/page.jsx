import React from 'react';
import { getAllPendingLeaveApplications } from '@/libs/leaves';
import LeaveTypeTable from '../component/ManageLeave/LeaveTypeTable';
import ManageLeaveApplicationsTable from '../component/ManageLeave/ManageLeaveApplicationsTable';
import { auth } from '@/auth';

const ManageLeave = async () => {

    const { user } = await auth();

    // const pendingLeaveApplications = await getAllPendingLeaveApplications();


    return (
        <div>
            <LeaveTypeTable user={user} />
            <div className='mt-4 rounded-md shadow-lg'>
                <ManageLeaveApplicationsTable user={user} />
            </div>
        </div>
    );
};

export default ManageLeave;