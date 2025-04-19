import React from 'react';

const page = () => {
    return (
        <div>
            <div className='bg-white rounded p-2'>
                <p className='text-lg font-semibold text-gray-600'>Attendance Details Today</p>
                <div className='mt-4 border grid grid-cols-3'>
                    <div className='p-2 border-r'>
                        <div className='flex items-center gap-2'>
                            <span className='h-4 w-4 rounded-full inline-block bg-green-600'></span>
                            <span>Present</span>
                        </div>
                        <p className='font-semibold ml-6'>250</p>
                    </div>
                    <div className='p-2 border-r'>
                        <div className='flex items-center gap-2'>
                            <span className='h-4 w-4 rounded-full inline-block bg-yellow-600'></span>
                            <span>Late Login</span>
                        </div>
                        <p className='font-semibold ml-6'>250</p>
                    </div>
                    <div className='p-2 border-r'>
                        <div className='flex items-center gap-2'>
                            <span className='h-4 w-4 rounded-full inline-block bg-red-600'></span>
                            <span>Absent</span>
                        </div>
                        <p className='font-semibold ml-6'>250</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default page;