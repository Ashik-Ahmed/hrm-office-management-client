import React from 'react';
import { getServerSession } from 'next-auth';
import TaskTable from '../component/Task-Manager/TaskTable';
import { getAllDepartments } from '@/libs/department';

const TaskManager = async () => {

    const { user } = await getServerSession()
    console.log('session data: ', user);

    const departments = await getAllDepartments()

    return (
        <div className='h-full'>
            <TaskTable user={user} allDepartments={departments.data} />
        </div>
    );
};

export default TaskManager;