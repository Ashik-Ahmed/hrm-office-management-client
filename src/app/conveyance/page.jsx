import React from 'react';
import Conveyance from '../component/Conveyance/Conveyance';
import { getConveyanceByEmployeeEmail } from '@/libs/conveyance';
import { auth } from '../auth';


const page = async () => {
    const session = await auth()
    // console.log(session);

    const conveyance = await getConveyanceByEmployeeEmail(session.user.email)

    // console.log(conveyance);

    return (
        <div>
            <Conveyance session={session} />
        </div>
    );
};

export default page;