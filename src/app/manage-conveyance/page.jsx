import React from 'react';
import ManageConveyance from '../component/ManageConveyance/ManageConveyance';
import { getAllEmployeeMonthlyConveyance } from '@/libs/conveyance';

const page = async () => {

    const monthlyEmployeeConveyanceData = await getAllEmployeeMonthlyConveyance();
    console.log(monthlyEmployeeConveyanceData);

    return (
        <div>
            <ManageConveyance monthlyEmployeeConveyanceData={monthlyEmployeeConveyanceData} />
        </div>
    );
};

export default page;