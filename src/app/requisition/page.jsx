
import React from 'react';
import RequisitionHistoryTable from '../component/Requsition/RequisitionHistoryTable';
import { auth } from '@/auth';

const Requisition = async () => {
    const { user } = await auth();
    // console.log(user);

    // const selectedMonth = new Date().getMonth() + 1
    // const selectedYear = new Date().getFullYear()
    // const requisitionHistory = await getUserRequisitionHistory(user._id, selectedMonth, selectedYear)

    return (
        <div>
            <RequisitionHistoryTable user={user} />
        </div >
    );
};

export default Requisition;