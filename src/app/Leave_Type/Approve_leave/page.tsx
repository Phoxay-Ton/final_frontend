'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, ChangeEvent } from 'react';
import { FaBell, FaUserShield, FaGavel, FaSignOutAlt, FaChartBar } from 'react-icons/fa';
import Img from "/public/img/login.jpeg";

interface Task {
  title: string;
  startDate: string;
  endDate: string;
  category: string;
  problem: string;
  details: string;
}

export default function AddManageTasks() {
  {/* ອອກລະບົບ*/ }
  const router = useRouter();
  const handleSignUp = () => {
    const confirmed = window.confirm("ທ່ານຕ້ອງການອອກລະບົບແທ້ບໍ?");
    if (confirmed) {
      router.push("/login");
    }
  };
  const [task, setTask] = useState<Task>({
    title: '',
    startDate: '',
    endDate: '',
    category: '',
    problem: '',
    details: '',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

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
        {/* Breadcrumb */}
        <div className="bg-gray-100 p-4 text-sm text-gray-600 font-saysettha">
          ໜ້າຫຼັກ / <span className="text-gray-800 font-semibold">ອະນຸມັດລາພັກ</span>
        </div>

        {/* Form */}
        <div className="p-6  ">
          <h2 className="text-xl font-bold text-gray-700 font-saysettha">ອະນຸມັດລາພັກ</h2>
          <div className="grid mt-4" >
            <div className="bg-gray-200 p-20 rounded-md shadow-md ">
              <input type="text" name="title" value={task.title} onChange={handleChange} className="w-full p-2 border rounded-md text-black bg-opacity-50" placeholder="ຊື່ວຽກ" />
              <div className="mt-4 flex  space-x-4">
                <button onClick={() => alert('ບັນທຶກສຳເລັດ!')} className="bg-purple-500 text-white px-6 py-2 rounded-md">ອະນຸມັດລາພັກ</button>
                <button onClick={() => router.push('/department')} className="bg-orange-500 text-white px-6 py-2 rounded-md">ປະຕະເສດ</button>
              </div>
            </div>
            <a href="/admin">
              <footer className="bg-gray-200 p-4 text-center text-black mt-20 font-saysettha">
                ກັບໄປໜ້າ admin
              </footer>
            </a>
          </div> {/* Footer */}

        </div>



      </div>
    </div>
  );
}
