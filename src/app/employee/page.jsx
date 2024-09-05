import React from 'react';
import EmployeeList from '../component/EmployeeTable/EmployeeList';
import { auth } from '@/auth';
import { getAllRoles } from '@/libs/department';

const Users = async () => {

    const { user } = await auth();
    const userRoles = await getAllRoles(user?.accessToken)

    return (
        <div>
            <EmployeeList user={user} userRoles={userRoles?.data} />
        </div>
    );
};

export default Users;