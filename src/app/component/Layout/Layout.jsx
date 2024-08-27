"use client";

import React, { useState } from 'react'
import { usePathname } from 'next/navigation';
import Sidebar from '../Sidebar/Sidebar';

const Layout = ({ children, user }) => {
    // console.log("session from client Layout: ", user);
    const [sidebarOpen, setSidebarOpen] = useState(false)

    const pathname = usePathname();

    if (pathname.includes('auth' || 'forget-password' || 'reset-password')) {
        return children
    }

    return (
        <>
            {/* <!-- ===== Page Wrapper Start ===== --> */}
            <div className="flex h-screen bg-gray-100 overflow-hidden">
                {/* <!-- ===== Sidebar Start ===== --> */}
                <Sidebar user={user} />
                {/* <!-- ===== Sidebar End ===== --> */}

                {/* <!-- ===== Content Area Start ===== --> */}
                <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
                    {/* <!-- ===== Main Content Start ===== --> */}
                    <main>
                        <div className="mx-auto max-w-screen-2xl p-2 md:p-2 2xl:p-2">
                            {children}
                        </div>
                    </main>
                    {/* <!-- ===== Main Content End ===== --> */}
                </div>
                {/* <!-- ===== Content Area End ===== --> */}
            </div>
            {/* <!-- ===== Page Wrapper End ===== --> */}
        </>
    )
}

export default Layout