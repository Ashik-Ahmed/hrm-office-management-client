import React from 'react';
import Conveyance from '../component/Conveyance/Conveyance';
import { auth } from '@/auth';


const page = async () => {
    const { user } = await auth()

    return (
        <div>
            <Conveyance user={user} />
        </div>
    );
};

export default page;