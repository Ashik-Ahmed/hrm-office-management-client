
import "./globals.css";
import 'primeicons/primeicons.css';
import "primereact/resources/themes/saga-purple/theme.css";
import "primereact/resources/primereact.min.css";
import { Inter } from "next/font/google";
import Sidebar from "./component/Sidebar/Sidebar";
import { redirect } from "next/navigation";
import Loading from "./component/Loading/Loading";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Infozillion Teletech BD LTD",
  description: "HR Management Software for Infozillion",
};

export default async function RootLayout({ children }) {

  return (
    <html lang="en">
      <head>
        {/* <link rel="icon" href="../../public/images/logo.png" /> */}
      </head>

      <body className={inter.className}>
        <div className='flex'>
          <Sidebar />
          <div className='p-4 bg-gray-100 flex-grow overflow-y-auto'>
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}