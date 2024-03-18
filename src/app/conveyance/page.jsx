import React from 'react';
import Conveyance from '../component/Conveyance/Conveyance';
import { auth } from '../auth';


const page = async () => {
    const session = await auth()

    return (
        <div>
            <Conveyance session={session} />
        </div>
    );
};

export default page;