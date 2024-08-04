import React from 'react';
import ManageConveyance from '../component/ManageConveyance/ManageConveyance';
import { auth } from '@/auth';

const page = async () => {

    const { user } = await auth();

    return (
        <div>
            <ManageConveyance user={user} />
        </div>
    );
};

export default page;