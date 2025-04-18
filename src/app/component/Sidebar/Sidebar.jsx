'use client'

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import logo from '../../../../public/images/logo.png'
import './customcss.css'
import { redirect, usePathname, useRouter } from 'next/navigation';
import Cookies from 'universal-cookie';
import { useSession } from 'next-auth/react';
import { doLogout } from '@/serverActions/authActions';
import Loading from '../Loading/Loading';
import { AiOutlineMenuFold, AiOutlineMenuUnfold } from "react-icons/ai";




const Sidebar = ({ user }) => {

    const currentPath = usePathname();
    // console.log(currentPath);

    const [isSidebarOpen, setSidebarOpen] = useState(false)


    if (!user?.pageAccess) {
        return <></>
    }

    return (
        <div className='sticky top-0 md:min-w-[300px] h-screen bg-white text-gray-700'>
            {
                isSidebarOpen ?
                    <div onClick={() => setSidebarOpen(!isSidebarOpen)} className={`block md:hidden absolute top-3 -right-3 bg-white`}>
                        <AiOutlineMenuFold size={30} className='p-[1px]' />
                    </div>
                    :
                    <div onClick={() => setSidebarOpen(!isSidebarOpen)} className={`block md:hidden absolute top-3 left-3 bg-white`}>
                        <AiOutlineMenuUnfold size={30} className='p-[1px]' />
                    </div>
            }
            <div className={`md:block  ${isSidebarOpen ? 'block' : 'hidden'}`}>
                <Link href='/' className='flex justify-start gap-x-2 items-center p-4'>
                    <Image src={logo} alt='logo' width='40' height='40' />
                    <div className='flex flex-col'>
                        <h2 className='text-xl font-bold'>Infozillion Teletech BD</h2>
                        <p className='text-xs font-bold text-violet-600' style={{ fontFamily: 'revert' }}>HR MANAGEMENT SYSTEM</p>
                    </div>
                </Link>
                <div className='flex'>
                    <div className='md:flex flex-col px-4 justify-between hidden'>
                        <ul className='flex flex-col justify-center items-center gap-4'>
                            <i className='pi pi-search cursor-pointer p-2 hover:bg-violet-600 hover:text-white duration-200' style={{ fontSize: '1.3rem' }}></i>
                            <i className='pi pi-calendar cursor-pointer p-2 hover:bg-violet-600 hover:text-white duration-200' style={{ fontSize: '1.3rem' }}></i>
                            <i className='pi pi-id-card cursor-pointer p-2 hover:bg-violet-600 hover:text-white duration-200' style={{ fontSize: '1.3rem' }}></i>
                            <i className='pi pi-comments cursor-pointer p-2 hover:bg-violet-600 hover:text-white duration-200' style={{ fontSize: '1.3rem' }}></i>
                            <i className='pi pi-folder cursor-pointer p-2 hover:bg-violet-600 hover:text-white duration-200' style={{ fontSize: '1.3rem' }}></i>
                            <Link href={`/profile`}><i className={`${currentPath === '/profile' && 'bg-violet-600 text-white font-bold'} pi pi-user cursor-pointer p-2 hover:bg-violet-600 hover:text-white  hover:font-bold duration-200`} style={{ fontSize: '1.3rem' }}></i></Link>
                            <button onClick={async () => await doLogout()}><i className='pi pi-power-off cursor-pointer p-2 hover:bg-red-400 hover:text-white  hover:font-bold duration-200' style={{ fontSize: '1.3rem' }}></i> </button>
                        </ul>
                    </div>

                    <div className='w-full px-4 min-h-[95vh] overflow-y-scroll scrollbar-none'>
                        <div className='text-sm'>
                            <ul className='overflow-y-scroll text-gray-600'>
                                <p className={`py-2 flex gap-x-4`}><i className='pi pi-hourglass'></i> HRMS</p>
                                {
                                    user?.pageAccess?.map((menu, index) => {
                                        return (
                                            <Link key={index} href={menu.url} style={{ fontFamily: 'revert' }} className={`${currentPath === (menu.url) && 'border-r-4 border-r-violet-500 text-violet-500 font-bold'} py-2 hover:tracking-wider hover:border-r-4 hover:border-r-violet-500  duration-200 cursor-pointer flex gap-x-4`}> {currentPath === (menu.url) ? <i className='pi pi-arrow-right scale-90 font-bold' /> : <i className='pi pi-ellipsis-h scale-75 ' />}  {menu.title}</Link>
                                        )
                                    })
                                }
                            </ul>
                        </div>
                    </div>
                </div>

            </div >
        </div>
    );
};

export default Sidebar;