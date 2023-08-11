import { getAllPendingLeaveApplications } from '@/libs/leaves';
import React from 'react';

const ManageLeave = async () => {

    const leaveApplicationHistory = await getAllPendingLeaveApplications()

    console.log('pending applications', leaveApplicationHistory);

    return (
        <div>
            Manage Leaves
        </div>
    );
};

export default ManageLeave;