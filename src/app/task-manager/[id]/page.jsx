import Task from '@/app/component/Task-Manager/Task';
import { getTaskById } from '@/libs/task';
import React from 'react';

const page = async ({ params: { id } }) => {


    return (
        <div>
            <Task taskId={id} />
        </div>
    );
};

export default page;