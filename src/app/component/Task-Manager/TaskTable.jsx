import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useState } from 'react';

const TaskTable = ({ user }) => {

    const [tasks, setTasks] = useState();
    const [query, setQuery] = useState({ currentStatus: 'Open' })
    const [loading, setLoading] = useState(false)
    const [page, setPage] = useState(1)

    useEffect(() => {
        fetch(`http://localhost:5000/api/v1/task/employeeEmail=${user.employeeEmail}?${query}&page=${page}`)
            .then(res => res.json())
            .then(data => {
                console.log(data);
            })
    }, []);

    return (
        <div>
            <DataTable value={conveyanceData.conveyanceDetails} size='small' emptyMessage="No Due Conveyance" loading={loading}>
                <Column body={dateBodyTemplate} header="Date"></Column>
                <Column field='from' header="From"></Column>
                <Column field='destination' header="Destination"></Column>
                <Column field='vehicle' header="Vehicle"></Column>
                <Column field="amount" header="Amount"></Column>
                <Column field="paymentStatus" header="Payment Status"></Column>
                <Column body={actionBodyTemplate} header="Action"></Column>
            </DataTable>
        </div>
    );
};

export default TaskTable;