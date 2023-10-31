import React from 'react';
import { getServerSession } from 'next-auth';
import TaskTable from '../component/Task-Manager/TaskTable';

const TaskManager = async () => {

    const { user } = await getServerSession()
    console.log('session data: ', user);

    return (
        <div className='h-full'>
            <TaskTable user={user} />
        </div>
    );
};

export default TaskManager;