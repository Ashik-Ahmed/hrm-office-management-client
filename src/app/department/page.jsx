import { getAllDepartments } from '@/libs/department';
import React from 'react';
import DepartmentTable from '../component/Department/DepartmentTable';

const page = async () => {

    const departmentList = await getAllDepartments();

    return (
        <div>
            <DepartmentTable departmentList={departmentList} />
        </div>
    );
};

export default page;