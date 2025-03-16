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
import WelcomeMessage from './component/WelcomeMessage/WelcomeMessage'
import { redirect } from 'next/navigation'
import { auth } from '@/auth';
import MonthlyEmployeeAttendance from './component/EmployeeAttendance/MonthlyEmployeeAttendance'
import DailyEmployeeAttendance from './component/EmployeeAttendance/DailyEmployeeAttendance'
import WeeklyAttendanceChart from './component/EmployeeAttendance/WeeklyAttendanceChart'
import LeaveSummary from './component/EmployeeAttendance/LeaveSummary'

export default async function Home() {

  const session = await auth();
  return (
    <div className="text-gray-700">
      <div className="mb-4">
        <WelcomeMessage session={session} />
      </div>
      {/* <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 w-full my-4">
        <div className="bg-white p-4 md:p-[20px] rounded-xl shadow-xl flex justify-center items-center">
          <Link href="/employee">
            <div className="flex flex-col justify-center items-center group hover:translate-y-1.5 duration-200 text-center cursor-pointer">
              <FiUsers size={40} color="gray" className="group-hover:scale-110 duration-200" />
              <p className="mt-2">Employees</p>
            </div>
          </Link>
        </div>
        <div className="bg-white p-4 md:p-[20px] rounded-xl shadow-xl flex justify-center items-center">
          <div className="flex flex-col justify-center items-center group hover:translate-y-1.5 duration-200 text-center cursor-pointer">
            <AiOutlineLike size={40} color="gray" className="group-hover:scale-110 duration-200" />
            <p className="mt-2">Holidays</p>
          </div>
        </div>
        <div className="bg-white p-4 md:p-[20px] rounded-xl shadow-xl flex justify-center items-center">
          <div className="flex flex-col justify-center items-center group hover:translate-y-1.5 duration-200 text-center cursor-pointer">
            <BiCalendar size={40} color="gray" className="group-hover:scale-110 duration-200" />
            <p className="mt-2">Events</p>
          </div>
        </div>
        <div className="bg-white p-4 md:p-[20px] rounded-xl shadow-xl flex justify-center items-center">
          <div className="flex flex-col justify-center items-center group hover:translate-y-1.5 duration-200 text-center cursor-pointer">
            <BsCreditCard size={40} color="gray" className="group-hover:scale-110 duration-200" />
            <p className="mt-2">Payroll</p>
          </div>
        </div>
        <div className="bg-white p-4 md:p-[20px] rounded-xl shadow-xl flex justify-center items-center">
          <div className="flex flex-col justify-center items-center group hover:translate-y-1.5 duration-200 text-center cursor-pointer">
            <AiOutlineCalculator size={40} color="gray" className="group-hover:scale-110 duration-200" />
            <p className="mt-2">Accounts</p>
          </div>
        </div>
        <div className="bg-white p-4 md:p-[20px] rounded-xl shadow-xl flex justify-center items-center">
          <div className="flex flex-col justify-center items-center group hover:translate-y-1.5 duration-200 text-center cursor-pointer">
            <TbReport size={40} color="gray" className="group-hover:scale-110 duration-200" />
            <p className="mt-2">Reports</p>
          </div>
        </div>
      </div> */}

      <div className='md:flex gap-x-4'>
        <div className='w-full h-full'>
          <DailyEmployeeAttendance />
        </div>
        <div className='w-full h-full'>
          <WeeklyAttendanceChart />
        </div>
        <div className='w-full h-full'>
          <LeaveSummary />
        </div>
      </div>
      <div>
        <MonthlyEmployeeAttendance />
      </div>

      {/* <div className="md:flex gap-x-4 mb-6">
        <div className="md:w-1/2 card bg-white rounded-xl p-2 mb-4 md:mb-0">
          <p className="text-gray-700 uppercase m-2">Revenue Calc.</p>
          <div className="">
            <StackedChart />
          </div>
        </div>
        <div className="md:w-1/4 card bg-white rounded-xl p-2 mb-4 md:mb-0">
          <p className="text-gray-700 uppercase m-2">Revenue</p>
          <div>
            <PieChart />
          </div>
        </div>
        <div className="md:w-1/4 card bg-white rounded-xl p-2">
          <p className="text-gray-700 uppercase m-2">Revenue</p>
          <div>
            <LineChart />
          </div>
        </div>
      </div> */}
    </div >
  );
}