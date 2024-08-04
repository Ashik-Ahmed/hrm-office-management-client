import Task from '@/app/component/Task-Manager/Task';
import { auth } from '@/auth';
import React from 'react';

const page = async ({ params: { id } }) => {

    const { user } = await auth();

    return (
        <div>
            <Task taskId={id} user={user} />
        </div>
    );
};

export default page;