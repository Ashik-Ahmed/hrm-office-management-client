import React from 'react';
import DepartmentTable from '../component/Department/DepartmentTable';
import { auth } from '@/auth';

const page = async () => {

    const { user } = await auth();


    return (
        <div>
            <DepartmentTable accessToken={user?.accessToken} />
        </div>
    );
};

export default page;