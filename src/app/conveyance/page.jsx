import React from 'react';
import { getServerSession } from 'next-auth';
import Conveyance from '../component/Conveyance/Conveyance';
import { getConveyanceByEmployeeEmail } from '@/libs/conveyance';


const page = async () => {
    const session = await getServerSession()
    console.log(session);

    const conveyance = await getConveyanceByEmployeeEmail(session.user.email)

    console.log(conveyance);

    return (
        <div>
            <Conveyance session={session} />
        </div>
    );
};

export default page;