"use client"

import React from 'react';
import './loading.css'
import { ProgressSpinner } from 'primereact/progressspinner';

const Loading = () => {
    return (
        // <div class="wrapper">
        //     <div class="circle"></div>
        //     <div class="circle"></div>
        //     <div class="circle"></div>
        //     <div class="shadow"></div>
        //     <div class="shadow"></div>
        //     <div class="shadow"></div>
        // </div>
        <div className='relative top-0 left-0 w-full h-full flex justify-center items-center z-50 bg-gray-400 bg-opacity-70'>
            <ProgressSpinner />
        </div>
    );
};

export default Loading;