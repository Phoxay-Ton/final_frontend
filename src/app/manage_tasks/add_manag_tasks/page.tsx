'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, ChangeEvent } from 'react';
import { FaBell, FaUserShield, FaGavel, FaSignOutAlt, FaChartBar } from 'react-icons/fa';
import Img from "/public/img/login.jpeg";
import { useRef } from 'react';
import { FaRegFileAlt } from 'react-icons/fa';

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
  //ສົ່ງເອກະສານ
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  {/* ອອກລະບົບ*/ }
  
  const handleSignUp = () => {
    const confirmed = window.confirm("ທ່ານຕ້ອງການອອກລະບົບແທ້ບໍ?");
    if (confirmed) {
      router.push("/login");
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

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
          <h1 className="text-lg font-bold">ລະບົບຕິດຕາມວຽກ</h1>
          <div className="flex items-center space-x-4 mr-30">
            <a href="/admin"><div className="inline-flex items-center gap-2 ">
              <FaUserShield className="text-lg" />
              <span className="text-base font-medium">admin</span>
            </div></a>
            <button onClick={handleSignUp} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition" >
              Sign Up
            </button>
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
              <input type="text" name="title" className="w-full mb-3 p-2 border rounded-full border-gray-300 " placeholder="ຊື່ວຽກທີ່ຖືກມອບ"/>
              <div>
                <label className="text-sm text-gray-700">ເລີ່ມວັນທີ່</label>
                <input type="date" className="w-full mb-3 p-2 border rounded-full border-gray-300" />
              </div>
              <div>
                <label className="text-sm text-gray-700">ກຳນົດສົ່ງ</label>
                <input type="date" className="w-full mb-3 p-2 border rounded-full border-gray-300" />
              </div>

              <label className="text-sm text-gray-700">ສົ່ງເອກະສານ</label>
              <div className="w-full mb-3 p-2 border rounded-full border-gray-300  bg-white ">
                <button
                  type="button"
                  onClick={handleClick}
                  className="flex items-center gap-2 px-4 py-3 w-full text-left rounded-full bg-[#f5f5f5]  cursor-pointer  bg-white "
                >
                  <FaRegFileAlt className="text-xl" />
                  <span className="text-base">ວາລະຖຶນມອບໃຫ້</span>
                </button>

                {/* Hidden file input (only allow document files) */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      console.log('Selected file:', file.name);
                      // ຈັດການອັບໂຫຼດ file ທີ່ນີ້
                    }
                  }}
                />
              </div>

              <div className="w-full mb-3 p-2  border-gray-300">
                <label className="text-sm text-gray-700">ລາຍລະອຽດ</label>
                <textarea
                  placeholder="ກະລຸນາປ້ອນລາຍລະອຽດ..."
                  className="w-full px-4 py-3 rounded-xl border border-[#cbbec2] bg-white text-[#333] placeholder-[#b49ca4] focus:outline-none focus:ring-2 focus:ring-[#cbbec2] resize-none"
                  rows={4}
                />
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
