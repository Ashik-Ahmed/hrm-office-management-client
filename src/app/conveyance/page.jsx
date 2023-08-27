import React from 'react';
import { getServerSession } from 'next-auth';
import { getConveyanceByEmpployeeEmail } from '@/libs/conveyance';


const page = async () => {
    const session = await getServerSession()
    console.log(session);

    const conveyance = await getConveyanceByEmpployeeEmail(session.user.email)

    return (
        <div>

        </div>
    );
};

export default page;