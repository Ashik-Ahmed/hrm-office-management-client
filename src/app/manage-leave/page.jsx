import React from 'react';
import PendingLeaveTable from '../component/PendingLeaveTable/PendingLeaveTable';
import { getAllPendingLeaveApplications } from '@/libs/leaves';

const ManageLeave = async () => {

    const pendingLeaveApplications = await getAllPendingLeaveApplications()


    return (
        <div>
            <div className='mt-1 rounded-md shadow-lg'>
                <PendingLeaveTable pendingLeaveApplications={pendingLeaveApplications} />
            </div>
        </div>
    );
};

export default ManageLeave;