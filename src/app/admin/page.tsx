'use client';

import { useState } from 'react';
import Image from 'next/image';
import { FaBell, FaUserShield, FaChartBar, FaGavel, FaSignOutAlt } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Img from '/public/img/login.jpeg';
import { useRouter } from 'next/navigation'
import Link from 'next/link';

const months = [
  { value: 1, label: 'January' },
  { value: 2, label: 'February' },
  { value: 3, label: 'March' },
  { value: 4, label: 'April' },
  { value: 5, label: 'May' },
  { value: 6, label: 'June' },
  { value: 7, label: 'July' },
  { value: 8, label: 'August' },
  { value: 9, label: 'September' },
  { value: 10, label: 'October' },
  { value: 11, label: 'November' },
  { value: 12, label: 'December' },
];

// Example data
const taskData = [
  { month: 1, year: 2025, completed: 2, pending: 1, cancelled: 0 },
  { month: 2, year: 2025, completed: 1, pending: 2, cancelled: 0 },
  { month: 4, year: 2025, completed: 0, pending: 0, cancelled: 0 },
];

export default function Dashboard() {
  const [selectedMonth, setSelectedMonth] = useState<number>(4);
  const [selectedYear, setSelectedYear] = useState<number>(2025);

  const router = useRouter();
  const handleSignUp = () => {
    const confirmed = window.confirm("ທ່ານຕ້ອງການອອກລະບົບແທ້ບໍ?");
    if (confirmed) {
      router.push("/login");
    }
  };

  const filteredData =
    taskData.find((item) => item.month === selectedMonth && item.year === selectedYear) || {
      completed: 0,
      pending: 0,
      cancelled: 0,
    };

  const chartData = taskData
    .filter((item) => item.year === selectedYear)
    .map((item) => ({
      month: months[item.month - 1]?.label || '',
      Completed: item.completed,
      Pending: item.pending,
      Cancelled: item.cancelled,
    }));

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="w-64 bg-blue-900 text-white p-4 flex flex-col">
        <div className="flex items-center space-x-2 ">
          <Image src={Img} alt="#" className="w-[600px] h-auto rounded-lg" />
        </div>
        <nav className="mt-6 space-y-4 font-saysettha">
          <Link href="/admin" className="flex items-center px-4 py-2 text-white-600 hover:scale-110 hover:text-white-800 hover:underline">
            ໝ້າຫຼັກ
          </Link>
          <Link href="/manage_tasks" className="flex items-center px-4 py-2 text-white-600 hover:scale-110 hover:text-white-800 hover:underline">
            ການມອບວຽກ
          </Link>
          <Link href="/department" className="flex items-center px-4 py-2 text-white-600 hover:scale-110 hover:text-white-800 hover:underline">
            ພະແນກ
          </Link>
          <Link href="/Division" className="flex items-center px-4 py-2 text-white-600 hover:scale-110 hover:text-white-800 hover:underline">
            ຂະແໝງ
          </Link>
          <Link href="/employee" className="flex items-center px-4 py-2 text-white-600 hover:scale-110 hover:text-white-800 hover:underline">
            ພະນັກງານ
          </Link>
          <Link href="/position" className="flex items-center px-4 py-2 text-white-600 hover:scale-110 hover:text-white-800 hover:underline">
            ຕຳແໝ່ງ
          </Link>

          <div>
            <span className="flex items-center px-4 py-2 text-white-600 hover:scale-110 hover:text-white-800 hover:underline">
              ລາພັກ
            </span>
            <div className="ml-4">
              <Link href="/Leave_Type/Leave" className="flex items-center px-4 py-2 text-white-600 hover:scale-110 hover:text-white-800 hover:underline">
                ຂໍລາພັກ
              </Link>
              <Link href="/Leave_Type/Approve_leave" className="flex items-center px-4 py-2 text-white-600 hover:scale-110 hover:text-white-800 hover:underline">
                ອະນຸມັດລາພັກ
              </Link>
              <Link href="/Leave_Type/Follow_leave" className="flex items-center px-4 py-2 text-white-600 hover:scale-110 hover:text-white-800 hover:underline">
                ຕິດຕາມລາພັກ
              </Link>
            </div>
            <Link href="/Attendance_Type/follow_attendance" className="flex items-center px-4 py-2 text-white-600 hover:scale-110 hover:text-white-800 hover:underline">
              ຕິດຕາມການເຂົ້າອອກວຽກ
            </Link>
            <Link href="/Attendance_Type/attendance" className="flex items-center px-4 py-2 bg-red-600 text-white hover:scale-110 hover:text-white-800">
              ການເຂົ້າ-ອອກວຽກ
            </Link>
          </div>
        </nav>

      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-blue-800 text-white p-4 flex justify-between items-center">
          <h1 className="text-lg font-bold font-saysettha">ລະບົບຕິດຕາມວຽກ</h1>
          {/*icon*/}
          <div className="flex items-center space-x-4 mr-30">
            <a href="/admin"><div className="inline-flex items-center gap-2 ">
              <FaUserShield className="text-lg" />
              <span className="text-base font-medium">admin</span>
            </div></a>
            {/*sign up*/}
            <button onClick={handleSignUp} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition" >
              Sign Up
            </button>
          </div>
        </header>

        <div className="p-6 bg-gray-100 min-h-screen">
          <div className="bg-orange-100 p-4 rounded mb-6">
            <h1 className="text-black font-bold font-saysettha">ໝ້າຫຼັກ</h1>
          </div>

          <div className="flex flex-wrap gap-4 mb-6">
            <div>
              <label className="block text-gray-700 mb-1">Month</label>
              <select
                className="border p-2 rounded w-48 text-black"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
              >
                {months.map((month) => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Year</label>
              <div className="flex items-center border rounded w-48 p-2 text-black">
                <button onClick={() => setSelectedYear((y) => y - 1)} className="px-2 font-bold">
                  -
                </button>
                <input
                  type="text"
                  className="w-full text-center focus:outline-none"
                  value={selectedYear}
                  readOnly
                />
                <button onClick={() => setSelectedYear((y) => y + 1)} className="px-2 font-bold">
                  +
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 text-black font-saysettha">
            <div className="bg-indigo-200 p-4 rounded-lg text-center">
              <p className="text-lg font-semibold">ຈຳນວນວຽກທັງໝົດ</p>
              <p className="text-3xl font-bold mt-2">
                {filteredData.completed + filteredData.pending + filteredData.cancelled}
              </p>
            </div>
            <div className="bg-yellow-200 p-4 rounded-lg text-center">
              <p className="text-lg font-semibold">ຈຳນວນວຽກທີ່ກຳລັງເຮັດ</p>
              <p className="text-3xl font-bold mt-2">{filteredData.pending}</p>
            </div>
            <div className="bg-green-200 p-4 rounded-lg text-center">
              <p className="text-lg font-semibold">ຈຳນວນວຽກທີ່ສຳເລັດແລ້ວ</p>
              <p className="text-3xl font-bold mt-2">{filteredData.completed}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="Completed" fill="#3B82F6" />
                <Bar dataKey="Pending" fill="#22C55E" />
                <Bar dataKey="Cancelled" fill="#F59E0B" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-gray-200 p-4 text-center text-black">ກັບໄປໜ້າ admin</footer>
      </div>
    </div>
  );
}