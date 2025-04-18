'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import logo from '../../../../public/images/logo.png';
import { usePathname } from 'next/navigation';
import { doLogout } from '@/serverActions/authActions';
import { MdMenu, MdClose } from 'react-icons/md';



const Sidebar = ({ user }) => {
    const currentPath = usePathname();
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    if (!user?.pageAccess) {
        return <></>;
    }

    return (
        <>
            {/* Toggle Button */}
            <div
                onClick={() => setSidebarOpen(!isSidebarOpen)}
                className={`fixed top-3 bg-white z-[60] p-2 rounded-full shadow-md cursor-pointer md:hidden transform transition-transform duration-300 ${isSidebarOpen ? 'translate-x-[230px]' : 'translate-x-0'
                    }`}
            >
                {isSidebarOpen ? (
                    <MdClose size={30} />
                ) : (
                    <MdMenu size={30} />
                )}
            </div>

            {/* Sidebar */}
            < div
                className={`fixed top-0 left-0 h-screen w-[250px] bg-white text-gray-700 z-50 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    } transition-transform duration-300 md:translate-x-0 md:static md:min-w-[300px]`
                }
            >
                <Link href="/" className="flex justify-start gap-x-2 items-center p-4">
                    <Image src={logo} alt="logo" width="40" height="40" />
                    <div className="flex flex-col">
                        <h2 className="text-xl font-bold">Infozillion Teletech BD</h2>
                        <p
                            className="text-xs font-bold text-violet-600"
                            style={{ fontFamily: 'revert' }}
                        >
                            HR MANAGEMENT SYSTEM
                        </p>
                    </div>
                </Link>
                <div className="flex">
                    {/* Sidebar Icons */}
                    <div className="md:flex flex-col px-4 justify-between hidden">
                        <ul className="flex flex-col justify-center items-center gap-4">
                            <i
                                className="pi pi-search cursor-pointer p-2 hover:bg-violet-600 hover:text-white duration-200"
                                style={{ fontSize: '1.3rem' }}
                            ></i>
                            <i
                                className="pi pi-calendar cursor-pointer p-2 hover:bg-violet-600 hover:text-white duration-200"
                                style={{ fontSize: '1.3rem' }}
                            ></i>
                            <i
                                className="pi pi-id-card cursor-pointer p-2 hover:bg-violet-600 hover:text-white duration-200"
                                style={{ fontSize: '1.3rem' }}
                            ></i>
                            <i
                                className="pi pi-comments cursor-pointer p-2 hover:bg-violet-600 hover:text-white duration-200"
                                style={{ fontSize: '1.3rem' }}
                            ></i>
                            <i
                                className="pi pi-folder cursor-pointer p-2 hover:bg-violet-600 hover:text-white duration-200"
                                style={{ fontSize: '1.3rem' }}
                            ></i>
                            <Link href={`/profile`}>
                                <i
                                    className={`${currentPath === '/profile' &&
                                        'bg-violet-600 text-white font-bold'
                                        } pi pi-user cursor-pointer p-2 hover:bg-violet-600 hover:text-white hover:font-bold duration-200`}
                                    style={{ fontSize: '1.3rem' }}
                                ></i>
                            </Link>
                            <button onClick={async () => await doLogout()}>
                                <i
                                    className="pi pi-power-off cursor-pointer p-2 hover:bg-red-400 hover:text-white hover:font-bold duration-200"
                                    style={{ fontSize: '1.3rem' }}
                                ></i>
                            </button>
                        </ul>
                    </div>

                    {/* Scrollable Menu */}
                    <div className="w-full px-4 h-[calc(100vh-5rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
                        {/* Static HRMS Section */}
                        <div className="py-2 flex gap-x-4 items-center text-gray-600 sticky top-0 bg-white z-10">
                            <i className="pi pi-hourglass"></i>
                            <span>HRMS</span>
                        </div>

                        {/* Scrollable Menu Items */}
                        <div className="text-sm">
                            <ul className="text-gray-600">
                                {user?.pageAccess?.map((menu, index) => {
                                    return (
                                        <Link
                                            key={index}
                                            href={menu.url}
                                            style={{ fontFamily: 'revert' }}
                                            className={`${currentPath === menu.url &&
                                                'border-r-4 border-r-violet-500 text-violet-500 font-bold'
                                                } py-2 hover:tracking-wider hover:border-r-4 hover:border-r-violet-500 duration-200 cursor-pointer flex gap-x-4`}
                                        >
                                            {currentPath === menu.url ? (
                                                <i className="pi pi-arrow-right scale-90 font-bold" />
                                            ) : (
                                                <i className="pi pi-ellipsis-h scale-75 " />
                                            )}{' '}
                                            {menu.title}
                                        </Link>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>
                </div>
            </div >

            {/* Backdrop */}
            {
                isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                        onClick={() => setSidebarOpen(false)}
                    ></div>
                )
            }
        </>
    );
};

export default Sidebar;