import React from 'react';
import { getAllLeaves, getAllPendingLeaveApplications } from '@/libs/leaves';
import LeaveTypeTable from '../component/ManageLeave/LeaveTypeTable';
import ManageLeaveApplicationsTable from '../component/ManageLeave/ManageLeaveApplicationsTable';
import { auth } from '@/auth';

const ManageLeave = async () => {

    const { user } = await auth();

    // const pendingLeaveApplications = await getAllPendingLeaveApplications();

    // get all leaves from DB 
    // const availableLeaves = await getAllLeaves()
    // .then(res => res.json())


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