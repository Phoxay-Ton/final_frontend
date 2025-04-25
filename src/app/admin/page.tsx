import Image from "next/image";
import { FaBell, FaUser, FaChartBar, FaGavel, FaSignOutAlt } from "react-icons/fa";
import Img from "/public/img/login.jpeg";



export default function Dashboard() {

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-blue-900 text-white p-4 flex flex-col">
        <div className="flex items-center space-x-2">
          <Image src={Img} alt="#" width={300} height={300} />

        </div>
        <nav className="mt-6 space-y-4">
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
              <a href="/Leave_Type/Followໍ_the_leave" className="flex items-center px-4 py-2">
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

        {/* Filters */}
        <div className="font-saysettha">
          <div className="bg-blue-300 p-4 rounded shadow text-center font-bold">
            <div className="text-xl font-bold text-black  font-saysettha">ຈັດການພະນັກງານ</div>
          </div>
          <div className="flex space-x-4 mt-2">
            <select className=" block text-gray-700 p-2 border rounded w-1/2 font-saysettha">
              <option className="font-saysettha">ປີ</option>
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
            <select className=" block text-gray-700 p-2 border rounded w-1/2 font-saysettha">
              <option className="font-saysettha">ເດືອນ</option>
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
          </div>
        </div>

        {/* Stats and Chart */}
        <div className="p-4 grid grid-cols-4 gap-4">
          <div className="bg-blue-300 p-4 rounded shadow text-center font-bold h-60 ">ຈໍານວນວຽກທັງໝົດ</div>
          <div className="bg-green-300 p-4 rounded shadow text-center font-bold h-60 ">ຈໍານວນວຽກທີ່ກຳລັງເຮັດ</div>
          <div className="bg-purple-300 p-4 rounded shadow text-center font-bold h-60 ">ຈໍານວນວຽກທີ່ສຳເລັດແລ້ວ</div>
        </div>
        <div>
          <div className=" p-4 rounded shadow text-center font-bold h-60 mt-4 text-black">ຫວ່າງ</div>
        </div>

        {/* Footer */}
        <footer className="bg-gray-200 p-4 text-center text-black">ກັບໄປໜ້າ admin</footer>
      </div>
    </div>
  );
}
