import React from 'react';
import EmployeeList from '../component/EmployeeTable/EmployeeList';
import { auth } from '@/auth';

const Users = async () => {

    const { user } = await auth();

    return (
        <div>
            <EmployeeList user={user} />
        </div>
    );
};

export default Users;