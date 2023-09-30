import { getMonthlyRequisitionData } from '@/libs/requisition';
import { authOptions } from '@/utils/authOptions';
import { getServerSession } from 'next-auth';
import React from 'react';
import MonthlyRequisitionDataTable from '../component/ManageRequisition/MonthlyRequisitionDataTable';

const page = async () => {

    const { user } = await getServerSession(authOptions)

    const selectedMonth = new Date().getMonth() + 1
    const selectedYear = new Date().getFullYear()
    console.log(selectedMonth, selectedYear);
    const monthlyRequisitionData = await getMonthlyRequisitionData(selectedMonth, selectedYear)

    console.log(monthlyRequisitionData);

    return (
        <div>
            <MonthlyRequisitionDataTable monthlyRequisitionData={monthlyRequisitionData} />
        </div>
    );
};

export default page;