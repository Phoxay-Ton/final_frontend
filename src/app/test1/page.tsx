// "use client";
// import { useState } from "react";

// export default function ModalExample() {
//   const [isOpen, setIsOpen] = useState(false);

//   return (
//     <div className="p-5">
//       <button
//         onClick={() => setIsOpen(true)}
//         className="bg-blue-500 text-white px-4 py-2 rounded"
//       >
//         Open Modal
//       </button>

//       {isOpen && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
//           <div className="bg-white p-5 rounded shadow-lg">
//             <h2 className="text-xl font-bold">Hello, Modal!</h2>
//             <button
//               onClick={() => setIsOpen(false)}
//               className="mt-3 bg-red-500 text-white px-4 py-2 rounded"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
// ຖ້າໃຊ້ Next.js App Router

// import { useRouter } from "next/navigation";

// export default function Home() {
//   const router = useRouter();

//   const goToEmployee = () => {
//     router.push("/employee");
//   };

//   const goToDeparment = () => {
//     router.push("/department");
//   };

//   const goToDivision = () => {
//     router.push("/Division");
//   };

//   const goToPosition = () => {
//     router.push("/position");
//   };

//   return (
//     <div>
//       <h1>Home Page</h1>
//       <button  className="flex items-center px-4 py-2 rounded bg-blue-800" onClick={goToEmployee}>Employee</button>  <br />
//       <button  className="flex items-center px-4 py-2 rounded bg-blue-800" onClick={goToDeparment}>Deparment</button><br />
//       <button  className="flex items-center px-4 py-2 rounded bg-blue-800" onClick={goToDivision}>Division</button><br />
//       <button  className="flex items-center px-4 py-2 rounded bg-blue-800" onClick={goToPosition}>Position</button>
//     </div>
//   );
// }
// import Link from "next/link";

// export default function Navbar() {
//   return (
//     <nav className="bg-gray-100 p-4 rounded-xl flex justify-between items-center shadow-md">
//       {/* Logo */}
//       <div className="text-lg font-bold text-gray-700">ລະບົບ</div>

//       {/* Navigation Links */}
//       <div className="flex gap-4">
//         <Link href="/" className="text-gray-600 hover:text-gray-900">ໜ້າຫຼັກ</Link>
//         <Link href="/about" className="text-gray-600 hover:text-gray-900">ກ່ຽວກັບ</Link>
//         <Link href="/contact" className="text-gray-600 hover:text-gray-900">ຕິດຕໍ່</Link>
//       </div>

//       {/* Login Button */}
//       <button className="bg-gray-700 text-white px-4 py-2 rounded-full hover:bg-gray-900">
//         ເຂົ້າສູ່ລະບົບ
//       </button>
//     </nav>
//   );
// }
// ຂອງແທ້
// 'use client';
// import { useState } from 'react';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// const months = [
//   { value: 1, label: 'January' },
//   { value: 2, label: 'February' },
//   { value: 3, label: 'March' },
//   { value: 4, label: 'April' },
//   { value: 5, label: 'May' },
//   { value: 6, label: 'June' },
//   { value: 7, label: 'July' },
//   { value: 8, label: 'August' },
//   { value: 9, label: 'September' },
//   { value: 10, label: 'October' },
//   { value: 11, label: 'November' },
//   { value: 12, label: 'December' },
// ];

// // ຂໍ້ມູນຕົວຢ່າງ
// const taskData = [
//   { month: 1, year: 2025, completed: 2, pending: 1, cancelled: 0 },
//   { month: 2, year: 2025, completed: 1, pending: 2, cancelled: 0 },
//   { month: 4, year: 2025, completed: 0, pending: 0, cancelled: 0 },
// ];

// export default function Dashboard() {
//   const [selectedMonth, setSelectedMonth] = useState<number>(4);
//   const [selectedYear, setSelectedYear] = useState<number>(2025);

//   const filteredData = taskData.find(
//     (item) => item.month === selectedMonth && item.year === selectedYear
//   ) || { completed: 0, pending: 0, cancelled: 0 };

//   const chartData = taskData
//     .filter((item) => item.year === selectedYear)
//     .map((item) => ({
//       month: months[item.month - 1]?.label || '',
//       Completed: item.completed,
//       Pending: item.pending,
//       Cancelled: item.cancelled,
//     }));

//   return (
//     <div className="p-6 bg-gray-100 min-h-screen">
//       <div className="bg-orange-100 p-4 rounded mb-6">
//         <h1 className="text-black font-bold">Dashboard</h1>
//       </div>

//       <div className="flex flex-wrap gap-4 mb-6">
//         <div>
//           <label className="block text-gray-700 mb-1 ">Month</label>
//           <select
//             className="border p-2 rounded w-48 text-black"
//             value={selectedMonth}
//             onChange={(e) => setSelectedMonth(Number(e.target.value))}
//           >
//             {months.map((month) => (
//               <option key={month.value} value={month.value}>
//                 {month.label}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div>
//           <label className="block text-gray-700 mb-1">Year</label>
//           <div className="flex items-center border rounded w-48 p-2 text-black">
//             <button
//               onClick={() => setSelectedYear((y) => y - 1)}
//               className="px-2 font-bold"
//             >
//               -
//             </button>
//             <input
//               type="text"
//               className="w-full text-center focus:outline-none"
//               value={selectedYear}
//               readOnly
//             />
//             <button
//               onClick={() => setSelectedYear((y) => y + 1)}
//               className="px-2 font-bold"
//             >
//               +
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 text-black">
//         <div className="bg-indigo-200 p-4 rounded-lg text-center">
//           <p className="text-lg font-semibold">Total No of Tasks</p>
//           <p className="text-3xl font-bold mt-2">
//             {filteredData.completed + filteredData.pending + filteredData.cancelled}
//           </p>
//         </div>
//         <div className="bg-yellow-200 p-4 rounded-lg text-center">
//           <p className="text-lg font-semibold">No of Pending Tasks</p>
//           <p className="text-3xl font-bold mt-2">{filteredData.pending}</p>
//         </div>
//         <div className="bg-green-200 p-4 rounded-lg text-center">
//           <p className="text-lg font-semibold">No of Completed Tasks</p>
//           <p className="text-3xl font-bold mt-2">{filteredData.completed}</p>
//         </div>
//       </div>
      

//       <div className="bg-white p-6 rounded-lg shadow">
//         <ResponsiveContainer width="100%" height={400}>
//           <BarChart data={chartData}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="month" />
//             <YAxis allowDecimals={false} />
//             <Tooltip />
//             <Legend />
//             <Bar dataKey="Completed" fill="#3B82F6" />
//             <Bar dataKey="Pending" fill="#22C55E" />
//             <Bar dataKey="Cancelled" fill="#F59E0B" />
//           </BarChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// }

// 'use client';
// import { useState } from 'react';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// const months = [
//   { value: 1, label: 'January' },
//   { value: 2, label: 'February' },
//   { value: 3, label: 'March' },
//   { value: 4, label: 'April' },
//   { value: 5, label: 'May' },
//   { value: 6, label: 'June' },
//   { value: 7, label: 'July' },
//   { value: 8, label: 'August' },
//   { value: 9, label: 'September' },
//   { value: 10, label: 'October' },
//   { value: 11, label: 'November' },
//   { value: 12, label: 'December' },
// ];

// // ສ້າງຂໍ້ມູນທຸກເດືອນປີ 2023-2025
// const taskData = Array.from({ length: 3 }, (_, yearIdx) => {
//   const year = 2023 + yearIdx;
//   return months.map((month) => ({
//     month: month.value,
//     year,
//     completed: Math.floor(Math.random() * 10),
//     pending: Math.floor(Math.random() * 5),
//     cancelled: Math.floor(Math.random() * 3),
//   }));
// }).flat();

// export default function Dashboard() {
//   const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
//   const [selectedYear, setSelectedYear] = useState<number | null>(null);

//   const filteredData = taskData.find(
//     (item) => item.month === selectedMonth && item.year === selectedYear
//   ) || { completed: 0, pending: 0, cancelled: 0 };

//   const chartData = selectedYear
//     ? taskData
//         .filter((item) => item.year === selectedYear)
//         .map((item) => ({
//           month: months[item.month - 1]?.label || '',
//           Completed: item.completed,
//           Pending: item.pending,
//           Cancelled: item.cancelled,
//         }))
//     : [];

//   return (
//     <div className="p-6 bg-gray-100 min-h-screen">
//       <div className="bg-orange-100 p-4 rounded mb-6">
//         <h1 className="text-2xl font-bold">Dashboard</h1>
//       </div>

//       <div className="flex flex-wrap gap-4 mb-6">
//         <div>
//           <label className="block text-gray-700 mb-1">Month</label>
//           <select
//             className="border p-2 rounded w-48"
//             value={selectedMonth ?? ''}
//             onChange={(e) =>
//               setSelectedMonth(e.target.value ? Number(e.target.value) : null)
//             }
//           >
//             <option value="">Select Month</option>
//             {months.map((month) => (
//               <option key={month.value} value={month.value}>
//                 {month.label}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div>
//           <label className="block text-gray-700 mb-1">Year</label>
//           <select
//             className="border p-2 rounded w-48"
//             value={selectedYear ?? ''}
//             onChange={(e) =>
//               setSelectedYear(e.target.value ? Number(e.target.value) : null)
//             }
//           >
//             <option value="">Select Year</option>
//             {[2023, 2024, 2025].map((year) => (
//               <option key={year} value={year}>
//                 {year}
//               </option>
//             ))}
//           </select>
//         </div>
//       </div>

//       {selectedMonth && selectedYear ? (
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
//           <div className="bg-indigo-200 p-4 rounded-lg text-center">
//             <p className="text-lg font-semibold">Total No of Tasks</p>
//             <p className="text-3xl font-bold mt-2">
//               {filteredData.completed + filteredData.pending + filteredData.cancelled}
//             </p>
//           </div>
//           <div className="bg-yellow-200 p-4 rounded-lg text-center">
//             <p className="text-lg font-semibold">No of Pending Tasks</p>
//             <p className="text-3xl font-bold mt-2">{filteredData.pending}</p>
//           </div>
//           <div className="bg-green-200 p-4 rounded-lg text-center">
//             <p className="text-lg font-semibold">No of Completed Tasks</p>
//             <p className="text-3xl font-bold mt-2">{filteredData.completed}</p>
//           </div>
//           <div className="bg-red-200 p-4 rounded-lg text-center">
//             <p className="text-lg font-semibold">No of Cancelled Tasks</p>
//             <p className="text-3xl font-bold mt-2">{filteredData.cancelled}</p>
//           </div>
//         </div>
//       ) : (
//         <p className="text-center text-gray-600 mb-8">Please select Month and Year to view data.</p>
//       )}

//       {selectedYear && (
//         <div className="bg-white p-6 rounded-lg shadow">
//           <ResponsiveContainer width="100%" height={400}>
//             <BarChart data={chartData}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="month" />
//               <YAxis allowDecimals={false} />
//               <Tooltip />
//               <Legend />
//               <Bar dataKey="Completed" fill="#3B82F6" />
//               <Bar dataKey="Pending" fill="#22C55E" />
//               <Bar dataKey="Cancelled" fill="#F59E0B" />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>
//       )}
//     </div>
//   );
// }
'use client';

import { useState, ChangeEvent } from 'react';

export default function UploadFile() {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return alert("ກະລຸນາເລືອກໄຟລ໌ກ່ອນ!");

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        alert('ສົ່ງໄຟລ໌ສຳເລັດ!');
      } else {
        alert('ມີບັນຫາໃນການສົ່ງໄຟລ໌');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('ມີບັນຫາໃນການສົ່ງໄຟລ໌');
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4 mt-10">
      <input
        type="file"
        accept=".pdf"
        onChange={handleFileChange}
        className="p-2 border rounded"
      />
      <button
        onClick={handleUpload}
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        ອັບໂຫລດໄຟລ໌
      </button>
    </div>
  );
}
