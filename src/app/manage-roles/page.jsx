import React from 'react';
import ManageRoles from '../component/ManageRoles/ManageRoles';
import { auth } from '@/auth';

const ManageRole = async () => {

    const { user } = await auth();

    return (
        <div>
            <ManageRoles user={user} />
        </div>
    );
};

export default ManageRole;