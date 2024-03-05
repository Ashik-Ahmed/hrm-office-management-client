import React from 'react';
import VisitorRegister from '../component/Visitor/VisitorRegister';
import { auth } from '../auth';

const page = async () => {
    const user = await auth();
    return (
        <div>
            <VisitorRegister user={user} />
        </div>
    );
};

export default page;