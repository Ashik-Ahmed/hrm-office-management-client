import { getAllPendingLeaveApplications } from '@/libs/leaves';
import React from 'react';
import PendingLeave from '../component/PendingLeave/PendingLeave';

const ManageLeave = async () => {

    const pendingLeaveApplications = await getAllPendingLeaveApplications()


    return (
        <div>
            <div className='mt-1 rounded-md shadow-lg'>
                <PendingLeave pendingLeaveApplications={pendingLeaveApplications} />
            </div>
        </div>
    );
};

export default ManageLeave;