'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation'
import { useState, ChangeEvent } from 'react';
import { FaBell, FaUserShield, FaGavel, FaSignOutAlt, FaChartBar } from 'react-icons/fa';
import Img from "/public/img/login.jpeg";

interface AddDivision {
  employeeName: string;
  email: string;
  phone: string;
  division: string;
  position: string;
  username: string;
  password: string;
  role: string;
  status: string;
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
    email: '',
    phone: '',
    division: '',
    position: '',
    username: '',
    password: '',
    role: '',
    status: '',
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
      <div className="flex-1 flex flex-col font-saysettha">
        {/* Header */}
        <header className="bg-blue-800 text-white p-4 flex justify-between items-center">
          <h1 className="text-lg font-bold">ລະບົບຕິດຕາມວຽກ</h1>
          {/*icon*/}
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
        
         <main className="p-6 font-saysettha bg-white m-6 rounded-lg shadow-lg">
          {/* Breadcrumb */}
          <div className="bg-gray-100 p-2 mb-4 text-sm text-gray-600">
            ໜ້າຫຼັກ / <span className="font-semibold text-gray-800">ເຂົ້າ-ອອກວຽກ</span>
          </div>

          {/* Table */}
          <h2 className="text-lg font-bold mb-4 text-black">ເຂົ້າ-ອອກວຽກ</h2>
          <table className="w-full table-auto border text-black mb-4">
            <thead className="bg-gray-200">
              <tr>
                <th className="border p-2">ວັນທີ</th>
                <th className="border p-2">ເວລາເຂົ້າ</th>
                <th className="border p-2">ເວລາອອກ</th>
                <th className="border p-2">ສະຖານະ</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3].map((_, idx) => (
                <tr key={idx}>
                  <td className="border p-2">-</td>
                  <td className="border p-2">-</td>
                  <td className="border p-2">-</td>
                  <td className="border p-2">-</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Dropdown */}
          <div className="mb-4">
            <select className="block w-1/2 p-2 border rounded text-black">
              <option>ໝາຍເຫດ</option>
              <option>ມາຕົງເວລາ</option>
              <option>ມາຊ້າ</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">ກົດເຂົ້າວຽກ</button>
            <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">ກົດອອກວຽກ</button>
          </div>
        </main>
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
