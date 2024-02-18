'use client'

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { RiSettings5Fill } from 'react-icons/ri'
import { FaUser } from 'react-icons/fa'
import { HiMail } from 'react-icons/hi'
import { MdNotifications } from 'react-icons/md'
import Image from 'next/image';
import logo from '../../../../public/images/logo.png'
import './customcss.css'
import { redirect, usePathname, useRouter } from 'next/navigation';
import { Menu } from 'primereact/menu';
import Loading from '../Loading/Loading';
import { signOut } from '@/app/auth';
import { useSession } from 'next-auth/react';


const Sidebar = () => {

    const { data: session, status } = useSession()


    const currentPath = usePathname();
    // console.log(currentPath);

    const router = useRouter()


    const menus = [
        { name: 'Department', link: '/department' },
        { name: 'Employee', link: '/employee' },
        { name: 'Leave', link: '/leave' },
        { name: 'Manage Leave', link: '/manage-leave' },
        { name: 'Conveyance', link: '/conveyance' },
        { name: 'Manage Conveyance', link: '/manage-conveyance' },
        { name: 'Requisition', link: '/requisition' },
        { name: 'Manage Requisition', link: '/manage-requisition' },
        { name: 'Visitor Register', link: '/visitor-register' },
        { name: 'Task Manager', link: '/task-manager' },
        { name: 'A2P Report', link: '/a2p-report' },
        // { name: 'File Management', link: '/file-management' },
        // { name: 'Holidays', link: '/holidays' },
        // { name: 'Events', link: '/events' },
        // { name: 'Payroll', link: '/payroll' },
        // { name: 'Accounts', link: '/accounts' },
        // { name: 'Report', link: '/report' },
    ]

    const menuLeft = useRef(null);

    const items = [
        {
            label: 'Profile',
            icon: 'pi pi-fw pi-user-plus',
            command: () => {
                // router.push(`/profile/${session?.user?._id}`)
            }
        },
        {
            separator: true
        },
        {
            label: 'Logout',
            icon: 'pi pi-fw pi-power-off',
            command: async () => {
                console.log("Logout");
                // cookie.remove('next-auth.session-token')
                // cookie.remove('next-auth.csrf-token')

                // await signOut()
                // await signIn('Credentials', { callbackUrl: '/' })
                // router.push('/api/auth/signin')

                redirect("/api/auth/signout");

            }
        }
    ];


    // if (status === 'loading') {
    //     return <Loading />
    // }
    if (!session) {
        return <></>
    }

    return (

        <div className='sticky top-0 min-w-[300px] h-screen bg-white text-gray-700 '>
            <div className='flex mt-6'>
                <div className='flex flex-col px-4 justify-between'>
                    <ul className='flex flex-col gap-6 mt-2'>
                        {/* <div className='bg-gray-600 hover:bg-gray-500 duration-200 cursor-pointer text-white p-3 -ml-1.5 flex rounded-full'>
                            <i className='pi pi-th-large' style={{ fontSize: '.75rem' }}></i>
                        </div> */}
                        <Image src={logo} alt='logo' width='40' height='40' />
                        <i className='mt-4 pi pi-search cursor-pointer hover:text-sky-400 duration-200' style={{ fontSize: '1.3rem' }}></i>
                        <i className='pi pi-calendar cursor-pointer hover:text-sky-400 duration-200' style={{ fontSize: '1.3rem' }}></i>
                        <i className='pi pi-id-card cursor-pointer hover:text-sky-400 duration-200' style={{ fontSize: '1.3rem' }}></i>
                        <i className='pi pi-comments cursor-pointer hover:text-sky-400 duration-200' style={{ fontSize: '1.3rem' }}></i>
                        <i className='pi pi-folder cursor-pointer hover:text-sky-400 duration-200' style={{ fontSize: '1.3rem' }}></i>
                        <Menu model={items} popup ref={menuLeft} id="popup_menu_left" />
                        <i onClick={(event) => menuLeft.current.toggle(event)} aria-controls="popup_menu_left" aria-haspopup>
                            <FaUser size={20} color='gray' className='cursor-pointer hover:text-sky-400 duration-200' />
                        </i>
                        {/* <i>
                            <Button onClick={(event) => profileButton.current.toggle(event)} aria-controls="popup_menu_left" aria-haspopup text >
                                <FaUser size={20} color='gray' className='cursor-pointer' />
                            </Button>
                        </i> */}
                    </ul>
                    <ul className='flex flex-col gap-6'>
                        {/* <i className='pi pi-comments hover:text-sky-400 duration-200' style={{ fontSize: '1.4rem' }}></i> */}
                        {/* <i className='pi pi-folder hover:text-sky-400 duration-200' style={{ fontSize: '1.4rem' }}></i> */}
                        {/* <div>
                            <span class="relative flex h-3 w-3 float-right -ml-1.5 -mt-1">
                                <span class="custom-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75 -ml-0.5 -mt-0.5"></span>
                                <span class="relative inline-flex rounded-full h-2 w-2 bg-pink-500"></span>
                            </span>
                            <HiMail size={20} color='gray' />
                        </div>
                        <div>
                            <span class="relative flex h-3 w-3 float-right -ml-1.5 -mt-1">
                                <span class="custom-ping animation-duration-600 absolute inline-flex h-full w-full rounded-full bg-gray-400 opacity-75 -ml-0.5 -mt-0.5"></span>
                                <span class="relative inline-flex rounded-full h-2 w-2 bg-gray-500"></span>
                            </span>
                            <MdNotifications size={20} color='gray' />
                        </div> */}
                        {/* <RiSettings5Fill size={20} color='gray' className='cursor-pointer custom-spin' /> */}

                    </ul>
                </div>

                <div className='w-full h-[95vh] overflow-y-scroll scrollbar-none'>
                    <h2 className='text-2xl'>Infozillion</h2>
                    <div className='mt-8 text-sm'>
                        <p className='text-xs' style={{ fontFamily: 'revert' }}>DIRECTORIES</p>
                        <ul className=' mt-4 text-gray-600'>
                            <p className={`py-2 hover:tracking-wider hover:border-r-2 hover:border-r-violet-500  duration-200 cursor-pointer flex gap-x-4`}><i className='pi pi-hourglass'></i> HRMS</p>

                            <Link href='/' style={{ fontFamily: 'revert' }} className={`${currentPath == '/' && 'border-r-2 border-r-violet-500 font-bold'} py-2 hover:tracking-wider hover:border-r-2 hover:border-r-violet-500  duration-200 cursor-pointer flex gap-x-4`}> {currentPath == '/' ? <i className='pi pi-arrow-right scale-75 font-bold' /> : <i className='pi pi-ellipsis-h scale-75 ' />}  Dashboard</Link>
                            {
                                menus.map((menu, index) => {
                                    return (
                                        <Link key={index} href={menu.link} style={{ fontFamily: 'revert' }} className={`${currentPath.includes(menu.link) && 'border-r-2 border-r-violet-500 font-bold'} py-2 hover:tracking-wider hover:border-r-2 hover:border-r-violet-500  duration-200 cursor-pointer flex gap-x-4`}> {currentPath.includes(menu.link) ? <i className='pi pi-arrow-right scale-75 font-bold' /> : <i className='pi pi-ellipsis-h scale-75 ' />}  {menu.name}</Link>
                                    )
                                })
                            }
                            {/* <Link href='/' className='py-2 hover:tracking-wider hover:border-r-2 hover:border-r-violet-500  duration-200 cursor-pointer flex gap-x-4'> <i className='pi pi-ellipsis-h scale-75'></i> Dashboard</Link>
                            <Link href='/users' className='py-2 hover:tracking-wider hover:border-r-2 hover:border-r-violet-500  duration-200 cursor-pointer flex gap-x-4'> <i className='pi pi-ellipsis-h scale-75'></i> Users</Link>
                            <Link href='/department' className='py-2 hover:tracking-wider hover:border-r-2 hover:border-r-violet-500  duration-200 cursor-pointer flex gap-x-4'> <i className='pi pi-ellipsis-h scale-75'></i> Department</Link>
                            <Link href='/employee' className='py-2 hover:tracking-wider hover:border-r-2 hover:border-r-violet-500  duration-200 cursor-pointer flex gap-x-4'> <i className='pi pi-ellipsis-h scale-75'></i> Employee</Link>
                            <Link href='/activities' className='py-2 hover:tracking-wider hover:border-r-2 hover:border-r-violet-500  duration-200 cursor-pointer flex gap-x-4'> <i className='pi pi-ellipsis-h scale-75'></i> Activities</Link>
                            <Link href='/holidays' className='py-2 hover:tracking-wider hover:border-r-2 hover:border-r-violet-500  duration-200 cursor-pointer flex gap-x-4'> <i className='pi pi-ellipsis-h scale-75'></i> Holidays</Link>
                            <Link href='/events' className='py-2 hover:tracking-wider hover:border-r-2 hover:border-r-violet-500  duration-200 cursor-pointer flex gap-x-4'> <i className='pi pi-ellipsis-h scale-75'></i> Events</Link>
                            <Link href='/payroll' className='py-2 hover:tracking-wider hover:border-r-2 hover:border-r-violet-500  duration-200 cursor-pointer flex gap-x-4'> <i className='pi pi-ellipsis-h scale-75'></i> Payroll</Link>
                            <Link href='/accounts' className='py-2 hover:tracking-wider hover:border-r-2 hover:border-r-violet-500  duration-200 cursor-pointer flex gap-x-4'> <i className='pi pi-ellipsis-h scale-75'></i> Accounts</Link>
                            <Link href='/' className='py-2 hover:tracking-wider hover:border-r-2 hover:border-r-violet-500  duration-200 cursor-pointer flex gap-x-4'> <i className='pi pi-ellipsis-h scale-75'></i> Report</Link> */}
                        </ul>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Sidebar;