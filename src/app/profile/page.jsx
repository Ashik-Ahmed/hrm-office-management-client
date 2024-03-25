import React from 'react';
import Profile from '../component/Profile/Profile';
import { auth } from '../auth';
import { getEmployeeById } from '@/libs/employee';
import { getAllDepartments } from '@/libs/department';

const ProfilePage = async () => {

    const session = await auth()
    // console.log(session);
    const user = await getEmployeeById(session?.user?._id, session?.user?.accessToken);
    const departments = await getAllDepartments(session?.user?.accessToken);

    return (
        <div>
            <Profile user={user} departments={departments?.data} accessToken={session?.user?.accessToken} />
        </div>
    )
};

export default ProfilePage;