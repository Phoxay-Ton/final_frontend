import Image from "next/image";
import { FaBell, FaUser, FaHome, FaEdit, FaTrash, FaPlus, FaSearch, FaChartBar, FaGavel, FaSignOutAlt } from "react-icons/fa";
import Img from "/public/img/login.jpeg";
import { useRouter } from 'next/navigation'



export default function Dashboard() {

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
          <h1 className="text-lg font-bold  font-saysettha">ລະບົບຕິດຕາມວຽກ</h1>
          <div className="flex items-center space-x-4">
            <FaBell className="text-lg" />
            <FaUser className="text-lg" />
          </div>
        </header>



        <div className="mt-6 bg-white p-6 rounded-lg shadow-lg  font-saysettha ">
          {/* Main Content */}
          <main className="flex-1 flex flex-col">

            {/* Breadcrumb */}
            <div className="bg-gray-100 p-4 text-sm text-gray-600">
              ໜ້າຫຼັກ / <span className="text-gray-800 font-semibold">ເຂົາ-ອອກວຽກ</span>
            </div>

            {/* Form */}
            <section className="p-6 bg-white mx-6 rounded shadow">
              <h2 className="text-lg font-semibold mb-4 text-black">ເຂົ້າ-ອອກວຽກ</h2>

              <table className="w-full table-auto border mb-4 text-black ">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="border p-2">ວັນທີ</th>
                    <th className="border p-2">ເວລາເຂົ້າ</th>
                    <th className="border p-2">ເວລາອອກ</th>
                    <th className="border p-2">ສະຖານະ</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border p-2">-</td>
                    <td className="border p-2">-</td>
                    <td className="border p-2">-</td>
                    <td className="border p-2">-</td>
                  </tr>
                  <tr>
                    <td className="border p-2">-</td>
                    <td className="border p-2">-</td>
                    <td className="border p-2">-</td>
                    <td className="border p-2">-</td>
                  </tr>
                  <tr>
                    <td className="border p-2">-</td>
                    <td className="border p-2">-</td>
                    <td className="border p-2">-</td>
                    <td className="border p-2">-</td>
                  </tr>
                </tbody>
              </table>

              <div className="flex items-center p-4">
                <select className=" block text-gray-700 p-2 border rounded w-1/2 font-saysettha">
                  <option>ໝາຍເຫດ</option>
                  <option>ມາຕົງເວລາ</option>
                  <option>ມາຊ້າ</option>
                </select>
              </div>

              
            </section>
          </main>
          <div className="flex justify-center p-4">
                <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 p-5">
                  ກົດເຂົ້າວຽກ
                </button>
                <button className="bg-red-400 text-white px-4 py-2 rounded hover:bg-red-500">
                  ກົດອອກວຽກ
                </button>
              </div>

          {/* Footer */}
          <a href="/admin"><footer className="bg-gray-200 p-4 text-center text-black mt-20 font-saysettha">ກັບໄປໜ້າ admin</footer></a>
        </div>
      </div>
    </div>

  );
}

