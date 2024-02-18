import React from 'react';
import TaskTable from '../component/Task-Manager/TaskTable';
import { getActiveDepartments } from '@/libs/department';
import { auth } from '../auth';

const TaskManager = async () => {

    const { user } = await auth()
    // console.log('session data: ', user);

    const departments = await getActiveDepartments()

    return (
        <div className='h-full'>
            <TaskTable user={user} allDepartments={departments.data} />
        </div>
    );
};

export default TaskManager;