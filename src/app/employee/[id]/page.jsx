import EmployeeDetails from '@/app/component/EmployeeTable/EmployeeDetails';
import { auth } from '@/auth';
import React from 'react';

const UserDetails = async ({ params: { id } }) => {

    const { user } = await auth();

    return (
        <EmployeeDetails id={id} user={user} />
    );
};

export default UserDetails;