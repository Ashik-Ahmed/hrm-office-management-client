import React from 'react';
import RunningTasks from '../component/Task-Manager/RunningTasks';
import CompletedTasks from '../component/Task-Manager/CompletedTasks';
import { getAllTasks } from '@/libs/task';
import { getServerSession } from 'next-auth';

const TaskManager = async () => {

    const session = await getServerSession()
    console.log('session data: ', session);
    const tasks = await getAllTasks()

    return (
        <div>
            Task Manager
            <RunningTasks />
            <CompletedTasks />
        </div>
    );
};

export default TaskManager;