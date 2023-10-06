'use client'

import Loading from '@/app/component/Loading/Loading';
import { getEmployeeById } from '@/libs/employee';
import React from 'react';

const page = async ({ params: { id } }) => {

    const employee = await getEmployeeById(id)

    console.log(employee);

    if (!id) {
        return <Loading />
    }

    return (
        <div>
            Profile Page
        </div>
    );
};

export default page;