'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, ChangeEvent } from 'react';
import { FaBell, FaUserShield, FaGavel, FaSignOutAlt, FaChartBar } from 'react-icons/fa';
import Img from '/public/img/login.jpeg';
import Link from 'next/link';

interface AddDivision {
  employeeName: string;
}

export default function AddManageDivision() {
  {/* ອອກລະບົບ*/ }
  const router = useRouter();
  const handleSignUp = () => {
    const confirmed = window.confirm("ທ່ານຕ້ອງການອອກລະບົບແທ້ບໍ?");
    if (confirmed) {
      router.push("/login");
    }
  };

  const [addDivision, setAddDivision] = useState<AddDivision>({
    employeeName: '',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAddDivision({ ...addDivision, [e.target.name]: e.target.value });
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
          <div className="flex items-center space-x-4 mr-20">
            <a href="/admin"><div className="inline-flex items-center gap-2 ">
              <FaUserShield className="text-lg" />
              <span className="text-base font-medium">admin</span>
            </div></a>
            <button onClick={handleSignUp} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition" >
              Sign Up
            </button>
          </div>
        </header>

        <div className="bg-gray-100 p-4 text-sm text-gray-600 font-saysettha">
          ໜ້າຫຼັກ / <span className="text-gray-800 ">ຕຳແໜ່ງ / </span>
          <span className="text-gray-800 font-semibold">ເພີ່ມຕຳແໝ່ງ</span>
        </div>

        {/* Form */}
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-700 font-saysettha">ເພີ່ມຕຳແໝ່ງ</h2>
          <div className="grid mt-4">
            <div className="p-20 rounded-md shadow-2xl bg-white ">
              <input
                type="text"
                name="employeeName"
                value={addDivision.employeeName}
                onChange={handleChange}
                className="w-full p-2 border rounded-full text-black border-gray-300"
                placeholder="ຊື່ວຽກ"
              />
              <div className="mt-4 flex space-x-4">
                <button
                  onClick={() => alert('ບັນທຶກສຳເລັດ!')}
                  className="bg-purple-500 text-white px-10 py-2 rounded-full"
                >
                  ບັນທຶກ
                </button>
                <button
                  onClick={() => router.push('/position')}
                  className="bg-orange-500 text-white px-10 py-2 rounded-full"
                >
                  ຍົກເລີກ
                </button>
              </div>
              {/* Footer */}
              <a href="/admin">
                <footer className="bg-gray-200 p-4 text-center text-black mt-20">
                  ກັບໄປໜ້າ admin
                </footer>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}