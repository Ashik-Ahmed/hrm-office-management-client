'use client'

import "./globals.css";
import 'primeicons/primeicons.css';
import "primereact/resources/themes/saga-purple/theme.css";
import "primereact/resources/primereact.min.css";
import { Inter } from "next/font/google";
import NextAuthSessionProvider from "./providers/sessionProvider";
import Sidebar from "./component/Sidebar/Sidebar";
import { useState } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Infozillion Teletech BD LTD",
  description: "HR Management Software for Infozillion",
};

export default function RootLayout({ children }) {

  const [sessionUser, setSessionUser] = useState('')

  return (
    <html lang="en">
      <body className={inter.className}>
        <NextAuthSessionProvider>
          <div className='flex'>
            <Sidebar />
            <div className='px-4 bg-gray-100 flex-grow overflow-y-auto'>
              {children}
            </div>
          </div>
        </NextAuthSessionProvider>
      </body>
    </html>
  );
}