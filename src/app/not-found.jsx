"use client";

import React from 'react'
import notFoundImage from '../../public/images/error-page.webp'
import Image from 'next/image';

const notFound = () => {
    return (
        <div className='flex flex-col text-center justify-center items-center bg-white h-[88vh]'>
            <Image src={notFoundImage} alt="Not Found" height={350} width={350} />
            <h2 className='text-2xl font-bold text-boxdark mt-4 lg:mt-8'>Sorry, the page can’t be found</h2>
            <p className='my-2'>The page you were looking for appears to have been moved, deleted or does not exist.</p>
            <div className='my-4 flex justify-center'>
                <button onClick={() => window.location.href = "/"} className="bg-primary rounded-md text-white p-2"> <i className="pi pi-arrow-left"></i> Back to Dashboard </button>
            </div>
        </div>
    )
}

export default notFound;