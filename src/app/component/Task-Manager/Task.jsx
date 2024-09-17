'use client'

import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Loading from '../Loading/Loading';
import { Dialog } from 'primereact/dialog';
import { customDateFormat } from '@/utils/dateformatter';

const Task = ({ taskId, user }) => {
    console.log(user);
    const { register, control, formState: { errors }, handleSubmit, reset } = useForm();

    const [task, setTask] = useState()
    const [addUpdate, setAddUpdate] = useState(false)
    const [closeTaskDialog, setCloseTaskDialog] = useState(false)

    const getTask = (id) => {
        const url = `${process.env.API_SERVER_UR}/task/${id}`;
        fetch(url, {
            headers: {
                'Authorization': `Bearer ${user.accessToken}`
            }
        })
            .then(res => res.json())
            .then(data => {
                if (data.status == "Success") {
                    setTask(data.data)
                    console.log(data);
                }
            })
    }

    useEffect(() => {
        getTask(taskId)
    }, [taskId]);

    const handleCloseTask = () => {
        fetch(`${process.env.API_SERVER_UR}/task/${taskId}`, {
            method: "PATCH",
            headers: {
                "content-type": "application/json",
                'Authorization': `Bearer ${user.accessToken}`
            },
            body: JSON.stringify({ currentStatus: 'Closed' })
        })
            .then(res => res.json())
            .then(data => {
                // console.log(data);
                if (data.status == "Success") {
                    getTask(taskId);
                    setCloseTaskDialog(false)
                }
            })
    }

    const submitUpdate = (data) => {
        data.updatedBy = user.name
        const updates = data
        console.log(updates);

        fetch(`${process.env.API_SERVER_UR}/task/${taskId}`, {
            method: "PATCH",
            headers: {
                "content-type": "application/json",
                'Authorization': `Bearer ${user.accessToken}`
            },
            body: JSON.stringify(updates)
        })
            .then(res => res.json())
            .then(data => {
                // console.log(data);
                if (data.status == "Success") {
                    getTask(taskId);
                    reset();
                    setAddUpdate(false)
                }
            })
    }

    if (!task) {
        return <Loading />
    }

    return (
        <div>
            <div className='p-2 bg-white rounded-md'>
                <div>
                    <div className='flex items-center justify-between'>
                        <h2 className='font-bold text-xl'>{task?.heading}</h2>
                        <p className={`${task?.currentStatus == 'Open' ? 'bg-green-500' : 'bg-red-400'} px-2 text-white rounded-md`}>{task?.currentStatus}</p>
                    </div>
                    <p className='italic'>{task?.description}</p>
                </div>
                <hr className='my-4' />
                <div className='text-sm'>
                    <p>Created on: <span>{customDateFormat(task?.createdAt)}</span></p>
                    <p>Department: <span>{task?.department}</span></p>
                    <p>Added by: <span>{task?.creator}</span></p>
                    <p>Assignee: <span>{task?.assignee}</span></p>
                </div>
            </div>
            <div className='mt-4 p-2 w-full bg-white rounded-md'>
                {
                    task?.updates.length > 0 ?

                        task.updates.map((update) => {
                            return (
                                <div key={update._id} className='mt-2 border border-1 shadow-md'>
                                    <div className='flex gap-x-2'>
                                        <div className='p-2 border-r-2 text-xs bg-violet-100 w-40'>
                                            <p>{update.updatedBy}</p>
                                            <p>{customDateFormat(update.updateTimestamp).split(",")[0]}</p>
                                            <p>{customDateFormat(update.updateTimestamp).split(",")[1]}</p>
                                        </div>
                                        <p className='p-2 w-full'>{update.updateMessage}</p>
                                    </div>
                                </div>
                            )
                        })

                        :
                        <div className='text-center'>
                            <p className='text-xl mb-2'>No updates yet</p>
                        </div>
                }
                {
                    (task?.currentStatus == "Open" && !addUpdate) &&

                    <div className='my-2 flex gap-x-2 w-full justify-end'>
                        <Button onClick={() => setAddUpdate(true)} label='Add Update' className='p-button-sm'></Button>
                        <Button onClick={() => setCloseTaskDialog(true)} label='Close Task' severity='danger' className='p-button-sm'></Button>
                    </div>
                }
                {
                    addUpdate &&
                    <div className='my-2'>
                        <form onSubmit={handleSubmit(submitUpdate)}>
                            <InputTextarea
                                {...register("updateMessage", { required: "Required" })}
                                type='text' placeholder="Write down updates here..." className='w-full' />
                            {errors.updateMessage?.type === 'required' && <span className='text-xs text-red-500' role="alert">{errors.updateMessage.message}</span>}
                            <div className='flex justify-end gap-x-2'>
                                <Button onClick={() => { setAddUpdate(false); reset() }} label='Cancel' severity='danger' className='p-button-sm'></Button>
                                <Button type='submit' label='Submit' severity='success' className='p-button-sm'></Button>
                            </div>
                        </form>
                    </div>
                }
            </div>

            <Dialog header="Close Task" visible={closeTaskDialog} onHide={() => setCloseTaskDialog(false)} style={{ width: '25vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }}>

                <p className="m-0">
                    Are you sure?
                </p>
                <div className='flex justify-end gap-x-2 mt-8'>
                    <Button onClick={() => handleCloseTask()} label='Yes' className='p-button p-button-sm p-button-danger' />
                    <Button onClick={() => setCloseTaskDialog(false)} label='No' className='p-button p-button-sm p-button-info' />
                </div>
            </Dialog>
        </div>
    );
};

export default Task;