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

    const router = useRouter()

    const [isSidebarOpen, setSidebarOpen] = useState(false)


    const menus = [
        { name: 'Department', link: '/department' },
        { name: 'Employee', link: '/employee' },
        { name: 'Leave', link: '/leave' },
        { name: 'Manage Leave', link: '/manage-leave' },
        { name: 'Conveyance', link: '/conveyance' },
        { name: 'Manage Conveyance', link: '/manage-conveyance' },
        { name: 'Requisition', link: '/requisition' },
        { name: 'Manage Requisition', link: '/manage-requisition' },
        { name: 'Task Manager', link: '/task-manager' },
        { name: 'Visitor Register', link: '/visitor-register' },
        { name: 'Manage Roles', link: '/manage-roles' },
        // { name: 'A2P Report', link: '/a2p-report' },
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
                router.push(`/profile`)
            }
        },
        {
            separator: true
        },
        {
            label: 'Logout',
            icon: 'pi pi-fw pi-power-off',
            command: async () => {
                await doLogout()
                // cookie.remove('next-auth.session-token')
                // cookie.remove('next-auth.csrf-token')

                // await signOut()
                // await signIn('Credentials', { callbackUrl: '/' })
                // router.push('/api/auth/signin')


                // redirect("/api/auth/signout");

            }
        }
    ];

    // if (!session) {
    //     return <></>
    // }

    // if(status === "loading"){
    //     return <></>
    // }

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
                            {/* <div className='bg-gray-600 hover:bg-gray-500 duration-200 cursor-pointer text-white p-3 -ml-1.5 flex rounded-full'>
                            <i className='pi pi-th-large' style={{ fontSize: '.75rem' }}></i>
                        </div> */}
                            <i className='pi pi-search cursor-pointer p-2 hover:bg-violet-600 hover:text-white duration-200' style={{ fontSize: '1.3rem' }}></i>
                            <i className='pi pi-calendar cursor-pointer p-2 hover:bg-violet-600 hover:text-white duration-200' style={{ fontSize: '1.3rem' }}></i>
                            <i className='pi pi-id-card cursor-pointer p-2 hover:bg-violet-600 hover:text-white duration-200' style={{ fontSize: '1.3rem' }}></i>
                            <i className='pi pi-comments cursor-pointer p-2 hover:bg-violet-600 hover:text-white duration-200' style={{ fontSize: '1.3rem' }}></i>
                            <i className='pi pi-folder cursor-pointer p-2 hover:bg-violet-600 hover:text-white duration-200' style={{ fontSize: '1.3rem' }}></i>
                            {/* <Menu model={items} popup ref={menuLeft} id="popup_menu_left" /> */}
                            {/* <i onClick={(event) => menuLeft.current.toggle(event)} aria-controls="popup_menu_left" aria-haspopup>
                            <FaUser size={20} color='gray' className='cursor-pointer hover:text-sky-400 duration-200' />
                        </i> */}
                            <Link href={`/profile`}><i className={`${currentPath === '/profile' && 'bg-violet-600 text-white font-bold'} pi pi-user cursor-pointer p-2 hover:bg-violet-600 hover:text-white  hover:font-bold duration-200`} style={{ fontSize: '1.3rem' }}></i></Link>
                            {/* <Link onClick={() => cookie.remove("TOKEN", { path: "/" })} href="/api/auth/signout"><i className='pi pi-power-off cursor-pointer hover:text-red-400 hover:font-bold duration-200' style={{ fontSize: '1.3rem' }}></i> </Link> */}
                            <button onClick={async () => await doLogout()}><i className='pi pi-power-off cursor-pointer p-2 hover:bg-red-400 hover:text-white  hover:font-bold duration-200' style={{ fontSize: '1.3rem' }}></i> </button>
                            {/* <FaUser size={20} color='gray' className='cursor-pointer hover:text-sky-400 duration-200' /> */}
                            {/* <Link href="/api/auth/signout"><RiLogoutCircleRLine size={20} color='gray' className='cursor-pointer hover:text-sky-400 duration-200' /> </Link> */}


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

                    <div className='w-full px-4 h-[95vh] overflow-y-scroll scrollbar-none'>
                        <div className='text-sm'>
                            <ul className=' text-gray-600'>
                                <p className={`py-2 flex gap-x-4`}><i className='pi pi-hourglass'></i> HRMS</p>

                                {/* <Link href='/' style={{ fontFamily: 'revert' }} className={`${currentPath == '/' && 'border-r-4 border-r-violet-500 text-violet-500 font-bold'} py-2 hover:tracking-wider hover:border-r-4 hover:border-r-violet-500  duration-200 cursor-pointer flex gap-x-4`}> {currentPath == '/' ? <i className='pi pi-arrow-right scale-75 font-bold' /> : <i className='pi pi-ellipsis-h scale-75 ' />}  Dashboard</Link> */}
                                {
                                    user?.pageAccess?.map((menu, index) => {
                                        return (
                                            <Link key={index} href={menu.url} style={{ fontFamily: 'revert' }} className={`${currentPath === (menu.url) && 'border-r-4 border-r-violet-500 text-violet-500 font-bold'} py-2 hover:tracking-wider hover:border-r-4 hover:border-r-violet-500  duration-200 cursor-pointer flex gap-x-4`}> {currentPath === (menu.url) ? <i className='pi pi-arrow-right scale-75 font-bold' /> : <i className='pi pi-ellipsis-h scale-75 ' />}  {menu.title}</Link>
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

            </div >
        </div>
    );
};

export default Sidebar;