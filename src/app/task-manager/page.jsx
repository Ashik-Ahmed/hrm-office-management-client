import React from 'react';
import { getAllTasks } from '@/libs/task';
import { getServerSession } from 'next-auth';
import TaskTable from '../component/Task-Manager/TaskTable';

const TaskManager = async () => {

    const { user } = await getServerSession()
    console.log('session data: ', user);

    return (
        <div>
            Task Manager
            <TaskTable user={user} />
        </div>
    );
};

export default TaskManager;