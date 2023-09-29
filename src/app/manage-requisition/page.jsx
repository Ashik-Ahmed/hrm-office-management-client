import { authOptions } from '@/utils/authOptions';
import { getServerSession } from 'next-auth';
import React from 'react';

const page = async () => {

    const { user } = await getServerSession(authOptions)

    const selectedMonth = new Date().getMonth() + 1
    const selectedYear = new Date().getFullYear()
    const requisitionHistory = await getUserRequisitionHistory(user._id, selectedMonth, selectedYear)

    return (
        <div>
            Manage Requisition
        </div>
    );
};

export default page;