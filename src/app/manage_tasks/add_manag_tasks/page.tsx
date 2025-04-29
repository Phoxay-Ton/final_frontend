'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, ChangeEvent } from 'react';
import { FaBell, FaUser, FaGavel, FaSignOutAlt, FaChartBar } from 'react-icons/fa';
import Img from "/public/img/login.jpeg";

interface Task {
  title: string;          // ຊື່ວຽກ
  startDate: string;      // ເລີ່ມວັນທີ່
  endDate: string;        // ກຳນົດສົ່ງ
  problem: string;        // ວຽກທີ່ມອບໃຫ້
  details: string;        // ລາຍລະອຽດ
  employeeName: string;   // ຊື່ພະນັກງານ
  divisionName: string;   // ຊື່ຂະແໝງ
}

export default function AddManageTasks() {
  const router = useRouter();
  const [task, setTask] = useState<Task>({
    title: '',
    startDate: '',
    endDate: '',
    problem: '',
    details: '',
    employeeName: '',
    divisionName: '',
  });
  

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTask({ ...task, [e.target.name]: e.target.value });
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
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-blue-800 text-white p-4 flex justify-between items-center">
          <h1 className="text-lg font-bold">ລະບົບຕິດຕາມວຽກ</h1>
          <div className="flex items-center space-x-4">
            <FaBell className="text-lg" />
            <FaUser className="text-lg" />
          </div>
        </header>
        {/* Breadcrumb */}
        <div className="bg-gray-100 p-4 text-sm text-gray-600 font-saysettha">
              ໜ້າຫຼັກ / <span className="text-gray-800 font-semibold">ມອບວຽກ / </span>
              <span className="text-gray-800 font-semibold">ເພີ່ມວຽກໃຫ້ພະນັກງານ</span>
            </div>

        {/* Form */}
        <div className="p-6 font-saysettha">
          <h2 className="text-xl font-bold text-gray-700 text-black bg-yellow-100 p-4">ເພີ່ມວຽກ</h2>
          <div className="grid grid-cols-2 gap-6 mt-4">
            <div className="bg-gray-200 p-6 rounded-md shadow-md text-black ">
            <label className="text-sm text-gray-700">ຊື່ວຽກ</label>
              <input type="text" name="title" className="w-full mb-3 p-2 border rounded-full border-gray-300 "/>
              <div>
                    <label className="text-sm text-gray-700">ເລີ່ມວັນທີ່</label>
                    <input type="date" className="w-full mb-3 p-2 border rounded-full border-gray-300" />
                  </div>
                  <div>
                    <label className="text-sm text-gray-700">ກຳນົດສົ່ງ</label>
                    <input type="date" className="w-full mb-3 p-2 border rounded-full border-gray-300" />
                  </div>
                  <label className="text-sm text-gray-700">ວຽກທີ່ມອບໃຫ້</label>
              <input type="text" name="title" className="w-full mb-3 p-2 border rounded-full border-gray-300 "/>
              <div>
              <label className="text-sm text-gray-700 font-saysettha">ລາຍລະອຽດ</label>
                 <input type="text" name="title" className="w-full mb-3 p-2 border  border-gray-300 h-40 "/>
              </div>
             
            </div>
            <div className="bg-gray-200 p-6 rounded-md shadow-md text-black">
              {/* <label className="block text-gray-700">ຊື່ປະເພດ</label> */}
              <input type="text" name="category" className="w-full mb-10 p-2 border rounded-full border-gray-300" placeholder="ຊື່ພະນັກງານ" />
              <input type="text" name="category" className="w-full p-2 border rounded-full border-gray-300" placeholder="ຊື່ຂະແໜງ" />
            </div>
          </div>
          <div className="mt-4 flex  space-x-4">
            <button onClick={() => alert('ບັນທຶກສຳເລັດ!')} className="bg-purple-500 text-white px-10 py-2 rounded-full">ບັນທຶກ</button>
            <button onClick={() => router.push('/manage_tasks')} className="bg-orange-500 text-white px-10 py-2 rounded-full">ຍົກເລີກ</button>
          </div>
        </div>

       {/* Footer */}
       <a href="/admin">
                <footer className="bg-gray-200 p-4 text-center text-black mt-20 font-saysettha">
                  ກັບໄປໜ້າ admin
                </footer>
              </a>
      </div>
    </div>
  );
}
