'use client'

import Link from 'next/link';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dropdown } from 'primereact/dropdown';
import React, { useEffect, useState } from 'react';
import { AiFillPlusSquare } from 'react-icons/ai';

const TaskTable = ({ user }) => {

    const [tasks, setTasks] = useState();
    const [currentStatus, setCurrentStatus] = useState('Open')
    const [loading, setLoading] = useState(false)
    const [page, setPage] = useState(0)

    const getAllTasks = () => {
        setLoading(true)
        const url = `http://localhost:5000/api/v1/task/${user.email}?currentStatus=${currentStatus}&page=${page}`;
        console.log(url);
        fetch(url)
            .then(res => res.json())
            .then(data => {
                console.log(data);
                if (data.status = "Success") {
                    setTasks(data.data)
                }
                else {
                    console.log(data.error);
                }
                setLoading(false)
            })
    }

    useEffect(() => {
        getAllTasks()
    }, [currentStatus, page, user]);

    const startBodyTemplate = (rowData) => {
        return (
            <div>{rowData.createdAt.split("T")[0]}</div>
        )
    }

    const headingBodyTemplate = (rowData) => {
        return (
            <div>
                <Link href={`task-manager/${rowData._id}`} className='hover:underline'>{rowData.heading}</Link>
            </div>
        )
    }

    return (
        <div>
            <div className='mt-1 shadow-md p-2 bg-white rounded-md'>
                <div className='flex justify-between items-center mb-2'>
                    <div className='flex items-center gap-x-2'>
                        <h3 className='font-light'>TASK LIST</h3>
                        <AiFillPlusSquare onClick={() => setCreateDepartmentDialog(true)} size={20} color='#8C239E' className='cursor-pointer' />
                    </div>
                    <div>
                        <Dropdown options={['Open', 'Closed']} onChange={(e) => { setCurrentStatus(e.value); }} value={currentStatus} size='small' className='p-dropdown-sm' />
                    </div>
                </div>
                <DataTable value={tasks} size='small' emptyMessage="No tasks found" loading={loading}>
                    <Column body={headingBodyTemplate} header="Task Title"></Column>
                    <Column body={startBodyTemplate} header="Started"></Column>
                    <Column field='creator' header="Created By"></Column>
                    <Column field='assignee' header="Assignee"></Column>
                    {/* <Column body={actionBodyTemplate} header="Action"></Column> */}
                </DataTable>
            </div>
        </div>
    );
};

export default TaskTable;