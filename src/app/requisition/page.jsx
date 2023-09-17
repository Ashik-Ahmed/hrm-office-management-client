import { getServerSession, getUser } from 'next-auth/next';
import React from 'react';
import { authOptions } from '@/utils/authOptions';
import RequisitionHistoryTable from '../component/Requsition/RequisitionHistoryTable';


const Requisition = async () => {
    const { user } = await getServerSession(authOptions)
    // console.log('user details:', user);
    let requisitionHistory;

    if (user) {
        console.log(user);
        requisitionHistory = await fetch(`http://localhost:5000/api/v1/requisition/${user._id}`)
            .then(res => res.json())
    }
    console.log(requisitionHistory);

    return (
        <div>
            <RequisitionHistoryTable requisitionHistory={requisitionHistory} />
        </div>
    );
};

export default Requisition;