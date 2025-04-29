'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, ChangeEvent } from 'react';
import { FaBell, FaUser, FaGavel, FaSignOutAlt, FaChartBar,FaEdit,FaTrash } from 'react-icons/fa';
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
    const router = useRouter();
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
                    <h1 className="text-lg font-bold font-saysettha">ລະບົບຕິດຕາມວຽກ</h1>
                    <div className="flex items-center space-x-4">
                        <FaBell className="text-lg" />
                        <FaUser className="text-lg" />
                    </div>
                </header>

                {/* Breadcrumb */}
        <div className="bg-gray-100 p-4 text-sm text-gray-600 font-saysettha">
              ໜ້າຫຼັກ / <span className="text-gray-800 font-semibold">ຕິດຕາມລາພັກ</span>
            </div>

                <div className='flex space-x-4 mt-2 p-2 text-black font-bold font-saysettha'>
                    <h3>ລາພັກ</h3>
                </div>

                {/* Filters */}
        <div className="">
          <div className="flex space-x-4 mt-2 p-10 font-saysettha">
            <select className=" block text-gray-700 p-2 border rounded w-1/2 font-saysettha rounded-full">
              <option className='font-saysettha'>ເດືອນ</option>
              <option>ປີ 2019</option>
              <option>ປີ 2020</option>
              <option>ປີ 2021</option>
              <option>ປີ 2022</option>
              <option>ປີ 2023</option>
              <option>ປີ 2024</option>
              <option>ປີ 2025</option>
              <option>ປີ 2026</option>
              <option>ປີ 2027</option>
              <option>ປີ 2028</option>
              <option>ປີ 2029</option>
            </select>
            <select className=" block text-gray-700 p-2 border rounded w-1/2 font-saysettha rounded-full">
              <option className='font-saysettha'>ປີ</option>
              <option>ເດືອນ1</option>
              <option>ເດືອນ2</option>
              <option>ເດືອນ3</option>
              <option>ເດືອນ4</option>
              <option>ເດືອນ5</option>
              <option>ເດືອນ6</option>
              <option>ເດືອນ7</option>
              <option>ເດືອນ8</option>
              <option>ເດືອນ9</option>
              <option>ເດືອນ10</option>
              <option>ເດືອນ11</option>
              <option>ເດືອນ12</option>
            </select>
            <select className=" block text-gray-700 p-2 border rounded w-1/2 font-saysettha rounded-full">
              <option className='font-saysettha'>ລະຫັດພະນັກງານ</option>
              <option>ປີ 2019</option>
              <option>ປີ 2020</option>
              <option>ປີ 2021</option>
              <option>ປີ 2022</option>
              <option>ປີ 2023</option>
              <option>ປີ 2024</option>
              <option>ປີ 2025</option>
              <option>ປີ 2026</option>
              <option>ປີ 2027</option>
              <option>ປີ 2028</option>
              <option>ປີ 2029</option>
            </select>
            <select className=" block text-gray-700 p-2 border rounded w-1/2 font-saysettha rounded-full">
              <option className='font-saysettha'>ປະເພດພະນັກງານ</option>
              <option>ປີ 2019</option>
              <option>ປີ 2020</option>
              <option>ປີ 2021</option>
              <option>ປີ 2022</option>
              <option>ປີ 2023</option>
              <option>ປີ 2024</option>
              <option>ປີ 2025</option>
              <option>ປີ 2026</option>
              <option>ປີ 2027</option>
              <option>ປີ 2028</option>
              <option>ປີ 2029</option>
            </select>
            <select className=" block text-gray-700 p-2 border rounded w-1/2 font-saysettha rounded-full">
              <option className='font-saysettha'>ສະຖານະ</option>
              <option>ປີ 2019</option>
              <option>ປີ 2020</option>
              <option>ປີ 2021</option>
              <option>ປີ 2022</option>
              <option>ປີ 2023</option>
              <option>ປີ 2024</option>
              <option>ປີ 2025</option>
              <option>ປີ 2026</option>
              <option>ປີ 2027</option>
              <option>ປີ 2028</option>
              <option>ປີ 2029</option>
            </select>
          </div>
        </div>

                
                          {/* Task Table */}
                          <div className="mt-6 overflow-x-auto p-5">
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
                                    <FaEdit className="text-yellow-500 cursor-pointer" />
                                    <FaTrash className="text-red-500 cursor-pointer" />
                                  </td>
                                </tr>
                                {/* More rows can be added here */}
                              </tbody>
                            </table>
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
