'use client'

import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';

const Users = () => {

    const [users, setUsers] = useState(null)
    const [loading, setLoading] = useState(false)


    const fetchAllUsers = () => {
        setLoading(true)
        fetch('http://localhost:5000/api/v1/user')
            .then(res => res.json())
            .then(data => {
                setUsers(data.data.users)
                setLoading(false)
            })
    }

    useEffect(() => {
        fetchAllUsers()
    }, [])

    const header = () => {
        return (
            <div>
                <h3>Users</h3>
            </div>
        );
    }

    return (
        <div>
            <div className="card p-4 bg-white rounded-md my-2 shadow-xl">
                <div className='flex justify-between items-center mb-2'>
                    <h3 className='font-light'>USER LIST</h3>
                    <span className="p-input-icon-left">
                        <i className="pi pi-search" />
                        <InputText placeholder="Search" />
                    </span>
                </div>
                <DataTable value={users} loading={loading} paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} tableStyle={{ minWidth: '50rem' }} className='shadow-md'>
                    <Column field="name" header="Name" ></Column>
                    <Column field="email" header="Email" ></Column>
                    <Column field="role" header="Role" ></Column>
                </DataTable>
            </div>
        </div>
    );
};

export default Users;