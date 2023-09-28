import { getServerSession } from 'next-auth/next';
import React from 'react';
import { authOptions } from '@/utils/authOptions';
import RequisitionHistoryTable from '../component/Requsition/RequisitionHistoryTable';
import { getUserRequisitionHistory } from '@/libs/requisition';


const Requisition = async () => {
    const { user } = await getServerSession(authOptions)

    const selectedMonth = new Date().getMonth() + 1
    const selectedYear = new Date().getFullYear()
    const requisitionHistory = await getUserRequisitionHistory(user._id, selectedMonth, selectedYear)
    console.log('requ history: ', requisitionHistory);

    return (
        <div>
            <RequisitionHistoryTable requisitionHistory={requisitionHistory} user={user} />
        </div >
    );
};

export default Requisition;