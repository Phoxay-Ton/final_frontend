'use client';

import Image from "next/image";
import {
  FaBell,
  FaUserShield,
  FaEdit,
  FaTrash,
  FaPlus,
  FaSignOutAlt,
  FaChartBar,
  FaGavel,
} from "react-icons/fa";
import Img from "/public/img/login.jpeg";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from 'next/link';

export default function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);

    {/* ອອກລະບົບ*/ }
  const router = useRouter();
  const handleSignUp = () => {
    const confirmed = window.confirm("ທ່ານຕ້ອງການອອກລະບົບແທ້ບໍ?");
    if (confirmed) {
      router.push("/login");
    }
  };
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-blue-900 text-white p-4 flex flex-col">
        <div className="flex items-center space-x-2">
          <Image src={Img} alt="Logo" className="w-[600px] h-auto rounded-lg" />
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
          <div className="flex items-center space-x-4 mr-30">
            <a href="/admin">
              <div className="inline-flex items-center gap-2">
                <FaUserShield className="text-lg" />
                <span className="text-base font-medium">admin</span>
              </div>
            </a>
             <button onClick={handleSignUp} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition" >
              Sign Up
            </button>
          </div>
        </header>

        <div className="bg-gray-100 p-4 text-sm text-gray-600 font-saysettha">
          ໜ້າຫຼັກ / <span className="text-gray-800 font-semibold">ພະນັກງານ</span>
        </div>

        <div className="mt-6 bg-white p-6 rounded-lg shadow-lg ">
          <div className="flex justify-between items-center bg-yellow-100 p-6">
            <h3 className="text-xl font-bold text-black  font-saysettha">ພະນັກງານ</h3>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 font-saysettha">
              <a href="/employee/add_employee"><FaPlus /> <span>ເພີ່ມພະນັກງານ</span></a>

            </button>
          </div>


          <div className="mt-6 overflow-x-auto">
            <table className="w-full border-collapse border rounded-lg shadow-md">
              <thead className="bg-gray-200 text-black font-saysettha">
                <tr>
                  <th className="p-3 text-left">ຊື່ພະນັກງານ</th>
                  <th className="p-3 text-left">ອີເມວ</th>
                  <th className="p-3 text-left">ເບີໂທ</th>
                  <th className="p-3 text-left">ຂະແໝງ</th>
                  <th className="p-3 text-left">ຕຳແໝ່ງ</th>
                  <th className="p-3 text-left">ຜູ້ໃຊ້</th>
                  <th className="p-3 text-left">ແກ້ໄຂ</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t text-black">
                  <td className="p-3">Email Management & Communication</td>
                  <td className="p-3">19/03/2024</td>
                  <td className="p-3">21/03/2024</td>
                  <td className="p-3">Secretaries</td>
                  <td className="p-3">Phounphonnakhone</td>
                  <td className="p-3 text-blue-600">To-Do</td>
                  <td className="p-3 flex space-x-2">
                    <FaEdit className="text-yellow-500 cursor-pointer" onClick={() => setIsModalOpen(true)} />
                    <FaTrash className="text-red-500 cursor-pointer" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ">
              <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md font-saysettha">
                <h2 className="text-xl font-bold mb-4 text-black">ແກ້ໄຂຂໍ້ມູນພະນັກງານ</h2>
                <form className="space-y-4">
                  {['ຊື່ພະແນກ','ອີເມວ','ເບີໂທ','ຂະແໜງ','ຕຳແໝ່ງ','ຊື່ຜູ້ໃຊ້'].map(label => (
                    <div key={label}>
                      <label className="block text-black font-medium">{label}</label>
                      <input type="text" className="w-full mt-1 p-2 border border-gray-300 rounded-lg text-black" placeholder={label} />
                    </div>
                  ))}
                  <div className="flex justify-end space-x-2">
                    <button type="button" className="px-4 py-2 bg-gray-400 text-white rounded-lg" onClick={() => setIsModalOpen(false)}>
                      ຍົກເລີກ
                    </button>
                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg">
                      ບັນທຶກ
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Footer */}
          <a href="/admin">
            <footer className="bg-gray-200 p-4 text-center text-black mt-20 font-saysettha">
              ກັບໄປໜ້າ admin
            </footer>
          </a>
        </div>
      </div>
    </div>
  );
}