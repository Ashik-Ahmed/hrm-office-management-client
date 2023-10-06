'use client'

import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import userPhoto from '../../../../public/images/user.png'
import Loading from '@/app/component/Loading/Loading';

const UserDetails = async ({ params: { id } }) => {

    const [employee, setEmployee] = useState()

    useEffect(() => {
        const url = `http://localhost:5000/api/v1/employee/${id}`;

        fetch(url)
            .then(res => res.json())
            .then(data => {
                console.log(data)
                setEmployee(data.data)
            })
    }, [id])

    if (!employee) {
        return <Loading />
    }




    return (
        <div>
            <div className="flex gap-x-2 w-full bg-white p-2 my-2 rounded-md shadow-xl">
                <div className='flex items-start gap-x-4 w-3/5 mr-8'>
                    <div className='min-w-[150px] min-h-[150px]  flex justify-center items-center'>
                        <Image src={employee?.image || userPhoto} width={150} height={150} alt='user photo' className='rounded-md shadow-lg border' />
                    </div>
                    <div className='flex flex-col gap-8'>
                        <div>
                            {/* <h3 className='text-xl font-bold'>{viewUserDialog.firstName} {viewUserDialog.lastName}</h3>
                            <p>{viewUserDialog.designation}</p> */}
                            <h3 className='text-xl font-bold'>{employee?.firstName} {employee?.lastName}</h3>
                            <p>{employee?.designation}</p>
                        </div>
                        <div>
                            <h5 className='font-semibold'>About</h5>
                            <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dignissimos a delectus quos vero accusamus consequatur suscipit laudantium consectetur totam adipisci!</p>
                        </div>
                    </div>
                </div>
                <div className='w-2/5 flex flex-col justify-between'>

                    <div>
                        <h5>Highter Education</h5>
                        <p className='font-semibold'>Master in Science</p>
                    </div>
                    <div>
                        <h5>Salary Range</h5>
                        <p className='font-semibold'>$120,000 - 140,000</p>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default UserDetails;