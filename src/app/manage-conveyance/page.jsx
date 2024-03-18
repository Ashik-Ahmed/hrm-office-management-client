import React from 'react';
import ManageConveyance from '../component/ManageConveyance/ManageConveyance';
import { auth } from '../auth';

const page = async () => {

    const session = await auth();

    return (
        <div>
            <ManageConveyance session={session} />
        </div>
    );
};

export default page;