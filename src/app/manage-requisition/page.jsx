import { getMonthlyRequisitionData } from '@/libs/requisition';
import { getServerSession } from 'next-auth';
import React from 'react';
import MonthlyRequisitionDataTable from '../component/ManageRequisition/MonthlyRequisitionDataTable';
import { auth } from '../auth';

const page = async () => {

    const session = await auth()

    // const selectedMonth = new Date().getMonth() + 1
    // const selectedYear = new Date().getFullYear()
    // console.log(selectedMonth, selectedYear);
    // const monthlyRequisitionData = await getMonthlyRequisitionData(selectedMonth, selectedYear)

    // console.log(monthlyRequisitionData);

    return (
        <div>
            <MonthlyRequisitionDataTable user={session?.user} />
        </div>
    );
};

export default page;