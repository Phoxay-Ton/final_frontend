//  <main className="p-6 font-saysettha bg-white m-6 rounded-lg shadow-lg">
//           {/* Breadcrumb */}
//           <div className="bg-gray-100 p-2 mb-4 text-sm text-gray-600">
//             ໜ້າຫຼັກ / <span className="font-semibold text-gray-800">ເຂົ້າ-ອອກວຽກ</span>
//           </div>

//           {/* Table */}
//           <h2 className="text-lg font-bold mb-4">ເຂົ້າ-ອອກວຽກ</h2>
//           <table className="w-full table-auto border text-black mb-4">
//             <thead className="bg-gray-200">
//               <tr>
//                 <th className="border p-2">ວັນທີ</th>
//                 <th className="border p-2">ເວລາເຂົ້າ</th>
//                 <th className="border p-2">ເວລາອອກ</th>
//                 <th className="border p-2">ສະຖານະ</th>
//               </tr>
//             </thead>
//             <tbody>
//               {[1, 2, 3].map((_, idx) => (
//                 <tr key={idx}>
//                   <td className="border p-2">-</td>
//                   <td className="border p-2">-</td>
//                   <td className="border p-2">-</td>
//                   <td className="border p-2">-</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//           {/* Dropdown */}
//           <div className="mb-4">
//             <select className="block w-1/2 p-2 border rounded">
//               <option>ໝາຍເຫດ</option>
//               <option>ມາຕົງເວລາ</option>
//               <option>ມາຊ້າ</option>
//             </select>
//           </div>

//           {/* Buttons */}
//           <div className="flex gap-4">
//             <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">ກົດເຂົ້າວຽກ</button>
//             <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">ກົດອອກວຽກ</button>
//           </div>
//         </main>