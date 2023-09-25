import { getServerSession } from 'next-auth/next';
import React from 'react';
import { authOptions } from '@/utils/authOptions';
import RequisitionHistoryTable from '../component/Requsition/RequisitionHistoryTable';


const Requisition = async () => {
    const { user } = await getServerSession(authOptions)


    const getRequisitionHistory = async (userId) => {
        const data = await fetch(`http://localhost:5000/api/v1/employee/requisition/${userId}`)
        const requisitions = await data.json()

        return requisitions;
    }
    const requisitionHistory = await getRequisitionHistory(user._id)
    console.log('requ history: ', requisitionHistory);

    return (
        <div>
            <RequisitionHistoryTable requisitionHistory={requisitionHistory} user={user} />
        </div >
    );
};

export default Requisition;