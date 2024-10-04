import "./globals.css";
import 'primeicons/primeicons.css';
import "primereact/resources/themes/saga-purple/theme.css";
import "primereact/resources/primereact.min.css";
import { Inter } from "next/font/google";
import { Roboto_Condensed } from "next/font/google";
import NextAuthSessionProvider from "@/utils/sessionProvider";
import { auth } from "@/auth";
import DefaultLayout from "./component/Layout/DefaultLayout";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400",],
});

const robotoCondensed = Roboto_Condensed({
  subsets: ["latin"],
  weight: ["300", "400", "700"], // You can adjust these weights as needed
  variable: '--font-roboto-condensed',
});

export const metadata = {
  title: "Infozillion Teletech BD LTD",
  description: "HR Management Software for Infozillion",
};

export default async function RootLayout({ children }) {

  // const session = await auth();
  // console.log("session from layout file: ", user);

  return (
    <html lang="en">

      <body className={inter.className}>
        <NextAuthSessionProvider>
          {/* <div className='flex'>
            {
              session && <Sidebar session={session} />
            }
            <div className='p-4 bg-gray-100 flex-grow overflow-y-auto'>
              {children}
            </div>
          </div> */}
          <DefaultLayout>{children}</DefaultLayout>
        </NextAuthSessionProvider>
      </body>
    </html>
  );
}