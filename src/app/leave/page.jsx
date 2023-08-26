import React from 'react';
import LeaveStatusTable from '../component/Leave/LeaveStatusTable';
import LeaveApplicationsTable from '../component/Leave/LeaveApplicationsTable';

const Leave = async () => {

    return (
        <div className='py-2'>
            <LeaveStatusTable />

            <div className='mt-4 shadow-xl'>
                <LeaveApplicationsTable />
            </div>
        </div>
    );
};

export default Leave;