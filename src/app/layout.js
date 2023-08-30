
import "./globals.css";
import 'primeicons/primeicons.css';
import "primereact/resources/themes/saga-purple/theme.css";
import "primereact/resources/primereact.min.css";
import { Inter } from "next/font/google";
import NextAuthSessionProvider from "./providers/sessionProvider";
import Sidebar from "./component/Sidebar/Sidebar";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Infozillion Teletech BD LTD",
  description: "HR Management Software for Infozillion",
};

export default async function RootLayout({ children }) {
  const session = await getServerSession()

  if (!session) {
    return redirect(new URL('/api/auth/signin', process.env.BASE_URL))
  }

  return (
    <html lang="en">
      <body className={inter.className}>
        <NextAuthSessionProvider>
          <div className='flex'>
            <Sidebar />
            <div className='p-4 bg-gray-100 flex-grow overflow-y-auto'>
              {children}
            </div>
          </div>
        </NextAuthSessionProvider>
      </body>
    </html>
  );
}