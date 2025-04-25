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
"use client";

import React, { useState } from "react";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/airbnb.css";

const DatePicker = () => {
  const [date, setDate] = useState(new Date());

  return (
    <div className="flex flex-col items-center gap-2 bg-yellow-100 p-6 rounded-2xl shadow-md">
      <label className="text-lg font-semibold text-gray-700">
        ເລືອກວັນທີ
      </label>
      <Flatpickr
        value={date}
        onChange={([selectedDate]) => setDate(selectedDate)}
        className="border border-gray-300 rounded-full px-6 py-3 text-base w-72 focus:outline-none focus:ring-2 focus:ring-yellow-500"
        options={{
          dateFormat: "d/m/Y",
          defaultDate: "today",
          locale: "th",
        }}
      />
    </div>
  );
};

export default DatePicker;
