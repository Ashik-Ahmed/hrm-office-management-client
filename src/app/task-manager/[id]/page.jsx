import Task from '@/app/component/Task-Manager/Task';
import { getTaskById } from '@/libs/task';
import React from 'react';

const page = async ({ params: { id } }) => {

    const task = await getTaskById(id)

    return (
        <div>
            Task id is {id}
            Heading: {task.data.heading}
            <Task />
        </div>
    );
};

export default page;