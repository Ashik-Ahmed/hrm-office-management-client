'use client'

import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useEffect, useState } from 'react';

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

    return (
        <div>
            <DataTable value={tasks} size='small' emptyMessage="No tasks found" loading={loading}>
                <Column body={startBodyTemplate} header="Started"></Column>
                <Column field='from' header="From"></Column>
                <Column field='destination' header="Destination"></Column>
                <Column field='vehicle' header="Vehicle"></Column>
                <Column field="amount" header="Amount"></Column>
                <Column field="paymentStatus" header="Payment Status"></Column>
                {/* <Column body={actionBodyTemplate} header="Action"></Column> */}
            </DataTable>
        </div>
    );
};

export default TaskTable;