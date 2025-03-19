import { auth } from '@/auth';
import React from 'react';
import Attendance from '../component/Attendance/Attendance';

const page = async () => {
    const user = await auth();
    return (
        <div>
            <Attendance user={user} />
        </div>
    );
};

export default page;