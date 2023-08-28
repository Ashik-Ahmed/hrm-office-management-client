import React from 'react';
import { getServerSession } from 'next-auth';
import { getConveyanceByEmpployeeEmail } from '@/libs/conveyance';
import Conveyance from '../component/Conveyance/Conveyance';


const page = async () => {
    const session = await getServerSession()
    console.log(session);

    const conveyance = await getConveyanceByEmpployeeEmail(session.user.email)

    console.log(conveyance);

    return (
        <div>
            <Conveyance />
        </div>
    );
};

export default page;