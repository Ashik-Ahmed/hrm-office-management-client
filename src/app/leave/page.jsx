import React from 'react';
import LeaveStatusTable from '../component/Leave/LeaveStatusTable';
import LeaveApplicationsTable from '../component/Leave/LeaveApplicationsTable';
import LeaveStatusGraph from '../component/Leave/LeaveStatusGraph';
import { auth } from '@/auth';

const Leave = async () => {

    const { user } = await auth();

    return (
        <div className='w-full'>
            <div className='flex space-x-2 w-full'>
                <LeaveStatusTable user={user} />
                <LeaveStatusGraph user={user} />
            </div>

            <div className='mt-4 shadow-xl'>
                <LeaveApplicationsTable user={user} />
            </div>
        </div>
    );
};

export default Leave;