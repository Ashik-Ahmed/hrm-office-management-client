import React from 'react';
import Holidays from '../component/Holidays/Holidays';
import { auth } from '@/auth';
import { getAllHolidays } from '@/libs/holiday';

const page = async () => {
    const { user } = await auth();

    const holidays = await getAllHolidays(user?.accessToken);

    return (
        <div>
            <Holidays user={user} holidays={holidays} />
        </div>
    );
};

export default page;