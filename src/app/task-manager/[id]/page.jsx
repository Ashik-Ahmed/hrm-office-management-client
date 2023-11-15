import Task from '@/app/component/Task-Manager/Task';
import { getTaskById } from '@/libs/task';
import { getServerSession } from 'next-auth';
import React from 'react';

const page = async ({ params: { id } }) => {

    const { user } = await getServerSession()

    return (
        <div>
            <Task taskId={id} user={user} />
        </div>
    );
};

export default page;