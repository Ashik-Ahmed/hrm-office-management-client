import React from 'react';
import LeaveStatusTable from '../component/Leave/LeaveStatusTable';
import LeaveApplicationsTable from '../component/Leave/LeaveApplicationsTable';
import LeaveStatusGraph from '../component/Leave/LeaveStatusGraph';

const Leave = async () => {

    return (
        <div className='w-full'>
            <div className='flex space-x-2 w-full'>
                <LeaveStatusTable />
                <LeaveStatusGraph />
            </div>

            <div className='mt-4 shadow-xl'>
                <LeaveApplicationsTable />
            </div>
        </div>
    );
};

export default Leave;