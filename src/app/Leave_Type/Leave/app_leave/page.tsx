'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, ChangeEvent } from 'react';
import { FaBell, FaUser, FaGavel, FaSignOutAlt, FaChartBar } from 'react-icons/fa';
import Img from "/public/img/login.jpeg";

interface AppLeave {
  startDate: string;
  endDate: string;
  leaveDays: string;
  leaveType: string;
}

export default function AddManageTasks() {
  const router = useRouter();
  const [app_leave, setAppLeave] = useState<AppLeave>({
    startDate: '',
    endDate: '',
    leaveDays: '',
    leaveType: '',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
    setAppLeave({ ...app_leave, [e.target.name]: e.target.value });
  };


  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-blue-900 text-white p-4 flex flex-col">
        <div className="flex items-center space-x-2">
          <Image src={Img} alt="#" width={300} height={300} />
        </div>
        <nav className="mt-6 space-y-4 font-saysettha">
          <a href="/admin" className="flex items-center px-4 py-2 rounded bg-blue-800">
            <FaBell className="mr-2" /> ໝ້າຫຼັກ
          </a>
          <a href="/manage_tasks" className="flex items-center px-4 py-2">
            <FaChartBar className="mr-2" /> ການມອບວຽກ
          </a>
          <a href="/department" className="flex items-center px-4 py-2">
            <FaGavel className="mr-2" /> ພະແນກ
          </a>
          <a href="/Division" className="flex items-center px-4 py-2">
            <FaGavel className="mr-2" /> ຂະແໝງ
          </a>
          <a href="/employee" className="flex items-center px-4 py-2">
            <FaGavel className="mr-2" /> ພະນັກງານ
          </a>
          <a href="/position" className="flex items-center px-4 py-2">
            <FaGavel className="mr-2" /> ຕຳແໝ່ງ
          </a>

          <div>
            <a href="#" className="flex items-center px-4 py-2">
              <FaGavel className="mr-2" /> ລາພັກ
            </a>
            <div className="ml-4">
              <a href="/Leave_Type/Leave" className="flex items-center px-4 py-2">
                <FaGavel className="mr-2" /> ຂໍລາພັກ
              </a>
              <a href="/Leave_Type/Approve_leave" className="flex items-center px-4 py-2">
                <FaGavel className="mr-2" /> ອະນຸມັດລາພັກ
              </a>
              <a href="/Leave_Type/Follow_leave" className="flex items-center px-4 py-2">
                <FaGavel className="mr-2" /> ຕິດຕາມລາພັກ
              </a>
            </div>
            <a href="/Attendance_Type/follow_attendance" className="flex items-center px-4 py-2">
              <FaGavel className="mr-2" /> ຕິດຕາມການເຂົ້າອອກວຽກ
            </a>
            <a href="/Attendance_Type/attendance" className="flex items-center px-4 py-2 bg-red-600 text-white rounded">
              <FaSignOutAlt className="mr-2" /> ການເຂົ້າ-ອອກວຽກ
            </a>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col font-saysettha">
        {/* Header */}
        <header className="bg-blue-800 text-white p-4 flex justify-between items-center">
          <h1 className="text-lg font-bold">ລະບົບຕິດຕາມວຽກ</h1>
          <div className="flex items-center space-x-4 mr-20 ... ">
            <FaUser className="text-lg mr-20 ..." />admin
            <FaBell className="text-lg" />
          </div>
        </header>

        {/* Breadcrumb */}
        <div className="bg-gray-100 p-4 text-sm text-gray-600 font-saysettha">
          ໜ້າຫຼັກ / <span className="text-gray-800">ຂໍລາພັກ / </span>
          <span className="text-gray-800 font-semibold">ຂໍລາພັກໃໝ່</span>
        </div>

        {/* Form */}
        <div className="p-6 font-saysettha ">
          <h2 className="text-xl font-bold text-gray-700">ເພີ່ມລາພັກ</h2>
          <div className="grid mt-4" >

            {/* Form Section */}
            <div className='text-xl text-gray-700'>


             
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-700">ວັນເລີ່ມພັກ</label>
                    <input type="date" className="w-full border p-2 rounded mt-1" />
                  </div>
                  <div>
                    <label className="text-sm text-gray-700">ວັນສິ້ນສຸດ</label>
                    <input type="date" className="w-full border p-2 rounded mt-1" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm text-gray-700">ຈຳນວນມື້ພັກ</label>
                    <select className="w-full border p-2 rounded mt-1">
                      <option className='font-saysettha'>ເລືອກ</option>
                      <option>1 ມື້</option>
                      <option>2 ມື້</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm text-gray-700">ປະເພດການພັກ</label>
                    <select className="w-full border p-2 rounded mt-1">
                      <option className='font-saysettha'>ເລືອກ </option>
                      <option>ພັກປ່ວຍ</option>
                      <option>ພັກຮ້ອນ</option>
                    </select>
                  </div>
                </div>

                {/* Buttons */}
                <div className="mt-4 flex  space-x-4 font-saysettha">
                  <button onClick={() => alert('ບັນທຶກສຳເລັດ!')} className="bg-purple-500 text-white px-10 py-2 rounded-full">ບັນທຶກ</button>
                  <button onClick={() => router.push('/Leave_Type/Leave')} className="bg-orange-500 text-white px-10 py-2 rounded-full">ຍົກເລີກ</button>
                </div>   {/* Footer */}
                <a href="/admin"><footer className="bg-gray-200 p-4 text-center text-black mt-20 font-saysettha">ກັບໄປໜ້າ admin</footer></a>
              </div>
            </div>
          </div>
        </div>
      </div>
    
  );
}
