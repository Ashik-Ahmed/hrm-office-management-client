import Link from 'next/link';
import React from 'react';
import { FaArrowRightLong, FaCalendar } from 'react-icons/fa6';

const LeaveSummary = () => {
    return (
        <div>
            <div className="w-full h-full mt-4 md:mt-0 p-6 bg-white rounded-lg">
                <div className='flex items-center justify-between mb-4'>
                    <h3 className='text-lg font-semibold'>Leave Summary</h3>
                    <p className='flex gap-x-2 items-center border px-4 rounded-md bg-gray-100 text-gray-600'>
                        <span className='font-semibold'>{new Date().getFullYear()}</span>
                        <FaCalendar />
                    </p>
                </div>
                <div className=''>
                    <div className='flex'>
                        <div className='w-1/2'>
                            <h5 className='text-gray-600'>Total Leaves</h5>
                            <p className='font-bold'>40</p>
                        </div>
                        <div className='w-1/2'>
                            <h5 className='text-gray-600'>Taken</h5>
                            <p className='font-bold'>18</p>
                        </div>
                    </div>
                    <div className='flex mt-2'>
                        <div className='w-1/2'>
                            <h5 className='text-gray-600'>Absent</h5>
                            <p className='font-bold'>2</p>
                        </div>
                        <div className='w-1/2'>
                            <h5 className='text-gray-600'>Request</h5>
                            <p className='font-bold'>12</p>
                        </div>
                    </div>
                    <div className='w-full mt-4'>
                        <Link href="/leave" className='block w-full bg-violet-600 text-white px-2 py-1 rounded-md'>
                            <span className='w-full flex justify-center items-center mx-auto gap-x-2'>See Details <FaArrowRightLong /></span>
                        </Link>
                    </div>
                </div>
            </div>
            <div className='w-full h-full p-6 bg-yellow-400 rounded-lg mt-4'>
                <h5 className='text-lg font-semibold text-gray-900'>Next Holiday</h5>
                <p>Independence Day, 26 Mar 2025</p>
                <div className='w-full mt-4'>
                    <Link href="/holiday" className='block w-full bg-white text-gray-700 px-2 py-1 rounded-md'>
                        <span className='w-full flex justify-center items-center mx-auto gap-x-2'>See All <FaArrowRightLong /></span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LeaveSummary;