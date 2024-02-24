'use client'

import Link from 'next/link';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Toast } from 'primereact/toast';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AiFillPlusSquare } from 'react-icons/ai';
import ReactPaginate from 'react-paginate';

const TaskTable = ({ user, allDepartments }) => {

    const toast = useRef(null)
    const { register, control, formState: { errors }, handleSubmit, reset } = useForm();

    const [tasks, setTasks] = useState();
    const [addtask, setAddTask] = useState(false)
    const [currentStatus, setCurrentStatus] = useState('Open')
    const [loading, setLoading] = useState(false)
    const [page, setPage] = useState(0);
    const [pageCount, setPageCount] = useState(0);
    const [departments, setDepartments] = useState(allDepartments);
    const [employees, setEmployees] = useState([])
    const [selectedDepartment, setSelectedDepartment] = useState();
    const [selectedAssignee, setSelectedAssignee] = useState();

    const getAllTasks = () => {
        setLoading(true)
        const url = `http://localhost:5000/api/v1/task/get-all-task/${user.email}?currentStatus=${currentStatus}&page=${page}`;
        console.log(url);
        fetch(url)
            .then(res => res.json())
            .then(data => {
                console.log(data);
                if (data.status = "Success") {
                    setTasks(data.data?.tasks)
                    setPageCount(data.data?.totalPage)
                }
                else {
                    console.log(data.error);
                }
                setLoading(false)
            })
    }

    const getEmployeeByDepartment = (department) => {
        const url = `http://localhost:5000/api/v1/employee/employee-by-dept?department=${department}`;
        fetch(url)
            .then(res => res.json())
            .then(data => {
                console.log(data);
                if (data.status == "Success") {
                    setEmployees(data.data)
                }
            })
    }

    useEffect(() => {
        getAllTasks()
    }, [currentStatus, page, user]);

    useEffect(() => {
        setEmployees([])
        getEmployeeByDepartment(selectedDepartment?.departmentName)
    }, [selectedDepartment])

    const handlePageChange = (page) => {
        // console.log(page.selected);
        setPage(page.selected);
    }

    const handleAddNewTask = (data) => {
        if (!selectedAssignee) {
            alert('Set Assignee First!');
            return;
        }
        console.log(data);
        const taskData = data;
        taskData.creator = user.email;
        taskData.assignee = selectedAssignee._id;
        // console.log(taskData);

        fetch('http://localhost:5000/api/v1/task', {
            method: "POST",
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(taskData)
        })
            .then(res => res.json())
            .then(data => {
                if (data.status == "Success") {
                    getAllTasks()
                    console.log('New task added successfully');
                    toast.current.show({ severity: 'success', summary: 'Success', detail: 'Task added', life: 3000 });
                }
                else {
                    console.log('Task add Failed');
                    toast.current.show({ severity: 'error', summary: 'Failed!', detail: data.error, life: 3000 });
                }
            })
        setAddTask(false)
    }


    const startBodyTemplate = (rowData) => {
        return (
            <div>{rowData.createdAt.split("T")[0]}</div>
        )
    }

    const headingBodyTemplate = (rowData) => {
        return (
            <div>
                <Link href={`task-manager/${rowData._id}`} className='hover:underline'>{rowData.heading}</Link>
                {/* <p>{rowData.heading}</p> */}
            </div>
        )
    }

    return (
        <div className=''>
            <Toast ref={toast} />
            <div className='mt-1 shadow-md p-2 bg-white rounded-md w-full '>
                <div className='flex justify-between items-center mb-2'>
                    <div className='flex items-center gap-x-2'>
                        <h3 className='font-light'>TASK LIST</h3>
                        <AiFillPlusSquare onClick={() => setAddTask(true)} size={20} color='#8C239E' className='cursor-pointer' />
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
                <div>
                    <ReactPaginate
                        breakLabel="..."
                        nextLabel=">"
                        onPageChange={handlePageChange}
                        pageRangeDisplayed={10}
                        pageCount={pageCount}
                        previousLabel="<"
                        renderOnZeroPageCount={null}
                        pageClassName='p-1 w-10 rounded-sm hover:bg-gray-200'
                        className='flex gap-x-1 items-center justify-center mx-auto text-center mt-2'
                        activeClassName='bg-[#8C239E] text-white'
                        previousClassName='p-1 w-10 hover:bg-gray-200'
                        nextClassName='p-1 w-10 hover:bg-gray-200'
                    />
                </div>

                {/* <div className='flex gap-x-1 mx-auto justify-center items-center'>
                    <span className='pi pi-angle-double-left p-2 border-2'></span>
                    <span className='pi pi-angle-left p-2 border-2'></span>
                    {paginator}
                    <span className='pi pi-angle-right p-2 border-2'></span>
                    <span className='pi pi-angle-double-right p-2 border-2'></span>
                </div> */}
            </div>


            <Dialog header="Add New Task" visible={addtask} style={{ width: '50vw' }} onHide={() => { setAddTask(false); reset(); setSelectedDepartment(''); setSelectedAssignee('') }}>

                <form onSubmit={handleSubmit(handleAddNewTask)} className='mt-2'>
                    <div className='mt-2 flex gap-x-4'>
                        <div>
                            <Dropdown
                                {...register('department', { required: "Department is required" })}
                                value={selectedDepartment} onChange={(e) => { setSelectedDepartment(e.value); setSelectedAssignee('') }} options={departments} optionLabel="departmentName" placeholder="Select Department*" className='w-full' />
                            {errors.department?.type === 'required' && <span className='text-xs text-red-500' role="alert">{errors.department.message}</span>}
                        </div>
                        <div>
                            <Dropdown
                                {...register('assignee', { required: "Assignee is required" })}
                                value={selectedAssignee} onChange={(e) => { setSelectedAssignee(e.value); console.log(e.value._id); }} options={employees} optionLabel="name" placeholder="Select Assignee*" className='w-full' />
                            {errors.assignee?.type === 'required' && <span className='text-xs text-red-500' role="alert">{errors.assignee.message}</span>}
                        </div>
                    </div>
                    <div className='mt-2 flex gap-x-4'>
                        <div className='w-full'>
                            <InputText
                                {...register("heading", { required: "Heading is required" })}
                                type='text' placeholder="Heading*" className='w-full' />
                            {errors.heading?.type === 'required' && <span className='text-xs text-red-500' role="alert">{errors.heading.message}</span>}
                        </div>
                    </div>
                    <div className='mt-2 flex gap-x-4'>
                        <div className='w-full'>
                            <InputTextarea
                                {...register("description", { required: "Description is required" })}
                                type='text' placeholder="Description*" className='w-full' />
                            {errors.description?.type === 'required' && <span className='text-xs text-red-500' role="alert">{errors.description.message}</span>}
                        </div>
                    </div>


                    {/* <div className='mt-2'>
        <input onChange={handlePhotoChange} name='file' type="file" className='w-full border border-violet-600' />
    </div> */}

                    <div className='mt-4 text-right'>
                        <Button type='submit' label="Submit" className="p-button-sm" loading={loading} />
                    </div>
                </form>
            </Dialog>
        </div>
    );
};

export default TaskTable;