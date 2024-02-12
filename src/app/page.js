"use client";
// import { useSession } from "next-auth/react";
import { FiUsers } from 'react-icons/fi'
import { AiOutlineLike, AiOutlineCalculator } from 'react-icons/ai'
import { BiCalendar } from 'react-icons/bi'
import { BsCreditCard } from 'react-icons/bs'
import { TbReport } from 'react-icons/tb'
import StackedChart from "./component/Charts/StackedChart";
import PieChart from "./component/Charts/PieChart";
import LineChart from "./component/Charts/LineChart";
import Link from "next/link";
import { signIn, useSession } from 'next-auth/react'
import WelcomeMessage from './component/WelcomeMessage/WelcomeMessage'
import Loading from './component/Loading/Loading'
// import Loading from "./component/Loading/Loading";

export default async function Home() {
  const { data: session, status } = useSession({
    // required: true,
    // onUnauthenticated() {
    //   signIn('Credentials', { callbackUrl: '/dashboard' })
    // }
  });

  // if (status === "loading") {
  //   return <Loading />
  // }

  if (!session) {
    return <></>
  }

  // const session = await getServerSession()
  // console.log("session user: ", session?.user);


  // if (!session) {
  //   return redirect(new URL('/api/auth/signin', process.env.BASE_URL))
  //   // signIn(undefined, { callbackUrl: process.env.BASE_URL + '/profile' })
  //   // return signIn('Credentials', { callbackUrl: '/dashboard' })

  // }

  return (
    <div className="text-gray-700">
      <div className="">
        <WelcomeMessage />
        <p className="text-sm">Measure How Fast You’re Growing Monthly Recurring Revenue. Learn More</p>
      </div>
      <div className="flex gap-4 w-full my-8">
        <div className="bg-white p-[20px] rounded-xl shadow-xl w-full flex justify-center items-center">
          <Link href='/employee'>
            <div className="flex flex-col justify-center items-center group hover:translate-y-1.5 duration-200 w-[100px] h-[80px] text-center cursor-pointer">
              <FiUsers size={40} color="gray" className="group-hover:scale-110 duration-200" />
              <p>Employees</p>
            </div>
          </Link>
        </div>
        <div className="bg-white p-[20px] rounded-xl  shadow-xl w-full flex justify-center items-center">
          <div className="flex flex-col justify-center items-center group hover:translate-y-1.5 duration-200 w-[100px] h-[80px] text-center cursor-pointer">
            <AiOutlineLike size={40} color="gray" className="group-hover:scale-110 duration-200" />
            <p>Holidays</p>
          </div>
        </div>
        <div className="bg-white p-[20px] rounded-xl  shadow-xl w-full flex justify-center items-center">
          <div className="flex flex-col justify-center items-center group hover:translate-y-1.5 duration-200 w-[100px] h-[80px] text-center cursor-pointer">
            <BiCalendar size={40} color="gray" className="group-hover:scale-110 duration-200" />
            <p>Events</p>
          </div>
        </div>
        <div className="bg-white p-[20px] rounded-xl  shadow-xl w-full flex justify-center items-center">
          <div className="flex flex-col justify-center items-center group hover:translate-y-1.5 duration-200 w-[100px] h-[80px] text-center cursor-pointer">
            <BsCreditCard size={40} color="gray" className="group-hover:scale-110 duration-200" />
            <p>Payroll</p>
          </div>
        </div>
        <div className="bg-white p-[20px] rounded-xl  shadow-xl w-full flex justify-center items-center">
          <div className="flex flex-col justify-center items-center group hover:translate-y-1.5 duration-200 w-[100px] h-[80px] text-center cursor-pointer">
            <AiOutlineCalculator size={40} color="gray" className="group-hover:scale-110 duration-200" />
            <p>Accounts</p>
          </div>
        </div>
        <div className="bg-white p-[20px] rounded-xl  shadow-xl w-full flex justify-center items-center">
          <div className="flex flex-col justify-center items-center group hover:translate-y-1.5 duration-200 w-[100px] h-[80px] text-center cursor-pointer">
            <TbReport size={40} color="gray" className="group-hover:scale-110 duration-200" />
            <p>Reports</p>
          </div>
        </div>
      </div>
      <div className="flex gap-x-4 mb-6">
        <div className="w-1/2 card bg-white rounded-xl p-2">
          <p className="text-gray-700 uppercase m-2">Revenue Calc.</p>
          <div className="">
            <StackedChart />
          </div>
        </div>
        <div className="w-1/4 card bg-white rounded-xl p-2">
          <p className="text-gray-700 uppercase m-2">Revenue</p>
          <div>
            <PieChart />
          </div>
        </div>
        <div className="w-1/4 card bg-white rounded-xl p-2">
          <p className="text-gray-700 uppercase m-2">Revenue</p>
          <div>
            <LineChart />
          </div>
        </div>
      </div>
    </div >
  );
}