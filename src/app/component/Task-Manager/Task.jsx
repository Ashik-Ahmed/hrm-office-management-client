'use client'

import React, { useEffect, useState } from 'react';

const Task = ({ taskId }) => {
    const [task, setTask] = useState()

    const getTask = (id) => {
        const url = `http://localhost:5000/api/v1/task/${id}`;
        fetch(url)
            .then(res => res.json())
            .then(data => {
                if (data.status == "Success") {
                    setTask(data.data)
                }
            })
    }

    useEffect(() => {
        getTask(taskId)
    }, [taskId]);

    return (
        <div>
            <div className='p-2 bg-white rounded-md'>
                <div>
                    <div className='flex items-center justify-between'>
                        <h2 className='font-bold text-xl'>{task?.heading}</h2>
                        <p className={`${task.currentStatus == 'Open' && 'bg-green-500'} px-2 text-white rounded-md`}>{task?.currentStatus}</p>
                    </div>
                    <p className='italic'>{task?.description}</p>
                </div>
                <hr className='my-4' />
                <div className='text-sm'>
                    <p>Created on: <span>{task?.createdAt.split("T")[0]}</span></p>
                    <p>Department: <span>{task?.department}</span></p>
                    <p>Added by: <span>{task?.creator}</span></p>
                    <p>Assignee: <span>{task?.assignee}</span></p>
                </div>
            </div>
        </div>
    );
};

export default Task;