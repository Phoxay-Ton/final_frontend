'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { FaBell, FaUserShield, FaChartBar, FaGavel, FaSignOutAlt } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';

import Modal from "@/src/components/Modal";
import NotificationModal from "@/src/components/NotificationModal";
import Header from "@/src/components/Header";
import Sidebar from "@/src/components/Sidebar";
import Breadcrumb from "@/src/components/Breadcrumb";

const months = [
  { value: 1, label: 'ມັງກອນ' },
  { value: 2, label: 'ກຸມພາ' },
  { value: 3, label: 'ມີນາ' },
  { value: 4, label: 'ເມສາ' },
  { value: 5, label: 'ພຶດສະພາ' },
  { value: 6, label: 'ມິຖຸນາ' },
  { value: 7, label: 'ກໍລະກົດ' },
  { value: 8, label: 'ສິງຫາ' },
  { value: 9, label: 'ກັນຍາ' },
  { value: 10, label: 'ຕຸລາ' },
  { value: 11, label: 'ພະຈິກ' },
  { value: 12, label: 'ທັນວາ' },
];

interface ManageTaskDetail {
  Detail_ID: number;
  Task_ID: number;
  Start_Date: string;
  End_date: string;
  Status: string;
}

interface Task {
  Task_ID: number;
  Task_name: string;
  Description: string;
  Attachment: string | null;
  Employee_ID: number | null;
  Division_ID: number;
  employee: any;
  division: {
    Division_Name: string;
  };
  manage_tasks_details: ManageTaskDetail[];
}

interface AggregatedTaskData {
  month: number;
  year: number;
  completed: number;
  pending: number;
  started: number;
}

const IDLE_TIMEOUT_SECONDS = 300;
const CHECK_INTERVAL_SECONDS = 5;

const TASK_API_BASE_URL = 'http://localhost:8080/api/v1/Task';

export default function Dashboard() {
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);

  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [notificationTitle, setNotificationTitle] = useState("");
  const [notificationMessage, setNotificationMessage] = useState('');

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);

  const [allTaskData, setAllTaskData] = useState<Task[]>([]);
  const [aggregatedTaskData, setAggregatedTaskData] = useState<AggregatedTaskData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isLocked, setIsLocked] = useState(false);
  const lastActivityTime = useRef(Date.now());
  const lockCheckIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const router = useRouter();

  const showNotification = useCallback((title: string, message: string) => {
    setNotificationTitle(title);
    setNotificationMessage(message);
    setShowNotificationModal(true);
  }, []);

  // Updated getUserRoleFromToken with Base64Url handling and more robust checks
  const getUserRoleFromToken = useCallback((token: string): 'Admin' | 'User' | null => {
    if (!token || typeof token !== 'string') {
      console.error("Invalid token provided to getUserRoleFromToken.");
      return null;
    }

    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        console.error("Token does not have 3 parts (header.payload.signature). Invalid JWT format.");
        return null;
      }

      let payloadBase64 = parts[1];

      // Normalize Base64Url to standard Base64
      // Replace URL-safe characters and add padding back if necessary
      payloadBase64 = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
      while (payloadBase64.length % 4) { // Add padding if needed
        payloadBase64 += '=';
      }

      const decodedPayload = JSON.parse(atob(payloadBase64));

      if (decodedPayload && typeof decodedPayload === 'object' && 'role' in decodedPayload) {
        if (decodedPayload.role === 'admin') { // Make sure 'admin' matches your backend's role string
          return 'Admin';
        }
      }
      return 'User'; // Default to 'User' if role is not 'admin' or not found
    } catch (e) {
      console.error("Error decoding token or parsing payload:", e);
      return null;
    }
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    const currentToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    if (!currentToken) {
      setError("No authentication token found.");
      setLoading(false);
      showNotification("ຜິດພາດ", "ບໍ່ມີການເຂົ້າສູ່ລະບົບ. ກະລຸນາເຂົ້າສູ່ລະບົບໃໝ່.");
      router.push("/login");
      return;
    }

    const userRole = getUserRoleFromToken(currentToken);

    if (!userRole) {
      setError("User role could not be determined. Please re-login.");
      setLoading(false);
      showNotification("ຜິດພາດ", "ບໍ່ສາມາດລະບຸບົດບາດຂອງຜູ້ໃຊ້ໄດ້. ກະລຸນາເຂົ້າສູ່ລະບົບໃໝ່.");
      router.push("/login");
      return;
    }

    let apiEndpoint = '';
    if (userRole === 'Admin') {
      apiEndpoint = `${TASK_API_BASE_URL}/all-admin`;
    } else {
      apiEndpoint = `${TASK_API_BASE_URL}/all-user`;
    }
    console.log('Fetching tasks from API endpoint:', apiEndpoint);

    try {
      const response = await axios.get(apiEndpoint, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentToken}`,
        },
      });

      const result = response.data;
      console.log('API Response:', result);

      if (result && Array.isArray(result.data)) {
        setAllTaskData(result.data);

        const aggregated: { [key: string]: AggregatedTaskData } = {};

        result.data.forEach((task: Task) => {
          if (task.manage_tasks_details && task.manage_tasks_details.length > 0) {
            const latestDetail = task.manage_tasks_details[task.manage_tasks_details.length - 1];
            const startDate = new Date(latestDetail.Start_Date);
            const month = startDate.getMonth() + 1;
            const year = startDate.getFullYear();
            const key = `${year}-${month}`;

            if (!aggregated[key]) {
              aggregated[key] = { month, year, completed: 0, pending: 0, started: 0 };
            }

            switch (latestDetail.Status) {
              case 'ສຳເລັດແລ້ວ':
                aggregated[key].completed++;
                break;
              case 'ກຳລັງດຳເນີນການ':
                aggregated[key].pending++;
                break;
              case 'ເລີ່ມວຽກ':
                aggregated[key].started++;
                break;
              default:
                console.warn('Unknown or unhandled status encountered:', latestDetail.Status, 'for Task ID:', task.Task_ID);
                break;
            }
          } else {
            console.warn('Task has no manage_tasks_details:', task.Task_ID);
          }
        });

        const finalAggregatedData = Object.values(aggregated);
        console.log('Final Aggregated Data:', finalAggregatedData);
        setAggregatedTaskData(finalAggregatedData);

      } else {
        setError('Invalid data structure received from the API.');
        console.error('Invalid API response structure:', result);
        showNotification("ຜິດພາດ", "ໂຄງສ້າງຂໍ້ມູນບໍ່ຖືກຕ້ອງຈາກເຊີບເວີ.");
      }

    } catch (err) {
      if (axios.isAxiosError(err)) {
        const errorMessage = err.response?.data?.message || err.message;
        setError(`Failed to fetch tasks: ${errorMessage}`);
        console.error('API error during fetching tasks:', err.response?.data || err.message);
        showNotification("ຜິດພາດ", `ບໍ່ສາມາດໂຫຼດຂໍ້ມູນວຽກໄດ້: ${err.response?.data?.message || "ເກີດຂໍ້ຜິດພາດ"}`);
        if (err.response?.status === 401 || err.response?.status === 403) {
          localStorage.removeItem("token");
          router.push("/login");
        }
      } else if (err instanceof Error) {
        setError(`Failed to fetch tasks: ${err.message}`);
        console.error('General error during fetching tasks:', err.message);
        showNotification("ຜິດພາດ", `ບໍ່ສາມາດໂຫຼດຂໍ້ມູນວຽກໄດ້: ${err.message}`);
      } else {
        setError('An unknown error occurred during data fetching.');
        console.error('Unknown error during fetching tasks:', err);
        showNotification("ຜິດພາດ", "ເກີດຂໍ້ຜິດພາດທີ່ບໍ່ຮູ້ຈັກໃນການໂຫຼດຂໍ້ມູນວຽກ.");
      }
    } finally {
      setLoading(false);
    }
  }, [showNotification, getUserRoleFromToken, router]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const resetActivityTimer = () => {
      lastActivityTime.current = Date.now();
      if (isLocked) {
        setIsLocked(false);
        router.push("/admin");
      }
    };

    window.addEventListener('mousemove', resetActivityTimer);
    window.addEventListener('keydown', resetActivityTimer);
    window.addEventListener('click', resetActivityTimer);

    lockCheckIntervalRef.current = setInterval(() => {
      const currentTime = Date.now();
      const idleTimeSeconds = (currentTime - lastActivityTime.current) / 1000;

      if (idleTimeSeconds > IDLE_TIMEOUT_SECONDS && !isLocked) {
        setIsLocked(true);
      }
    }, CHECK_INTERVAL_SECONDS * 1000);

    return () => {
      window.removeEventListener('mousemove', resetActivityTimer);
      window.removeEventListener('keydown', resetActivityTimer);
      window.removeEventListener('click', resetActivityTimer);
      if (lockCheckIntervalRef.current) {
        clearInterval(lockCheckIntervalRef.current);
      }
    };
  }, [isLocked, router]);

  const handleSignOut = () => {
    setIsSignOutModalOpen(true);
  };

  const confirmSignOut = () => {
    setIsSignOutModalOpen(false);
    localStorage.removeItem("token");
    router.push("/login");
  };

  const confirm = () => {
    console.log("Delete confirmed!");
    setShowDeleteConfirmModal(false);
    showNotification("ລຶບສຳເລັດ", "ຂໍ້ມູນຖືກລຶບອອກແລ້ວ.");
  };

  const summaryData =
    aggregatedTaskData.find((item) => item.month === selectedMonth && item.year === selectedYear) || {
      completed: 0,
      pending: 0,
      started: 0,
    };

  const chartData = aggregatedTaskData
    .filter((item) => item.year === selectedYear)
    .sort((a, b) => a.month - b.month);

  const chartDataForSelectedMonth = chartData.find(item => item.month === selectedMonth);

  const chartDataToDisplay = chartDataForSelectedMonth ? [chartDataForSelectedMonth] : [];

  const hasChartData = chartDataToDisplay.length > 0;

  return (
    <div className="relative flex h-screen overflow-hidden bg-gradient-to-br from-sky-200 via-blue-100 to-cyan-200 text-slate-800" style={{ fontFamily: 'Phetsarath OT, sans-serif' }}>
      {/* Screen Lock Overlay */}
      {isLocked && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-75 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-lg shadow-xl text-center border border-blue-300">
            <h2 className="text-2xl font-bold mb-4 text-slate-800">ໜ້າຈໍຖືກລັອກ</h2>
            <p className="mb-6 text-gray-700">ກະລຸນາປ້ອນລະຫັດຜ່ານເພື່ອເຂົ້າສູ່ລະບົບອີກຄັ້ງ</p>
            <button
              onClick={() => setIsLocked(false)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              ປົດລັອກ
            </button>
          </div>
        </div>
      )}

      {/* Sign Out Modal */}
      <Modal
        isOpen={isSignOutModalOpen}
        onClose={() => setIsSignOutModalOpen(false)}
        onConfirm={confirmSignOut}
        title="ຢືນຢັນອອກລະບົບ"
        message="ທ່ານຕ້ອງການອອກລະບົບແທ້ບໍ?"
        confirmText="ຕົກລົງ"
        cancelText="ຍົກເລີກ"
      />

      {/* Delete Confirmation Modal (if still needed) */}
      <Modal
        isOpen={showDeleteConfirmModal}
        onClose={() => setShowDeleteConfirmModal(false)}
        onConfirm={confirm}
        title="ຢືນຢັນການລຶບ"
        message="ທ່ານແນ່ໃຈບໍວ່າຕ້ອງການລຶບຕຳແໜ່ງນີ້? ການກະທຳນີ້ບໍ່ສາມາດຍົກເລືນໄດ້."
        confirmText="ລຶບ"
        cancelText="ຍົກເລີກ"
      />

      {/* Notification Modal */}
      <NotificationModal
        isOpen={showNotificationModal}
        onClose={() => setShowNotificationModal(false)}
        title={notificationTitle}
        message={notificationMessage}
      />
      {/* <div className="flex h-screen overflow-hidden"> */}

      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 z-30">
        <Sidebar isCollapsed={isSidebarCollapsed} onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />
      </div>
      {/* Main Content Area - This div handles overall content scrolling */}
      <div className="flex-1 flex flex-col pl-64">
        <div className="sticky top-0 z-20 bg-white/80 backdrop-blur shadow-md">
          <Header onSignOut={handleSignOut} />
        </div>
        {/* <div className="flex-1 overflow-y-auto p-6 "> */}
        <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-sky-200 via-blue-100 to-cyan-200">

          {/* Breadcrumb */}
          <Breadcrumb paths={[{ name: "ໜ້າຫຼັກ", href: "/admin" }, { name: "ໜ້າຫຼັກ" }]} />

          {/* Page Title Card */}
          <div className="bg-white/90 backdrop-blur-lg p-4 rounded-xl shadow-xl border border-sky-300/60 mb-6">
            <h1 className="text-xl font-bold font-saysettha text-slate-800">ໜ້າຫຼັກ</h1>
          </div>

          {/* Month and Year Filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div>
              <label className="block text-slate-700 mb-1 font-saysettha">ເລືອກເດືອນ</label>
              <select
                className="border border-sky-300/60 p-2 rounded-lg w-48 text-slate-800 bg-white/70 backdrop-blur-sm shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
              >
                {months.map((month) => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 mb-1 font-saysettha">ເລືອກປີ</label>
              <div className="flex items-center border border-sky-300/60 rounded-lg w-48 p-2 text-slate-800 bg-white/70 backdrop-blur-sm shadow-sm">
                <button onClick={() => setSelectedYear((y) => y - 1)} className="px-2 font-bold text-blue-600 hover:text-blue-800 transition-colors">
                  -
                </button>
                <input type="text" className="w-full text-center focus:outline-none bg-transparent" value={selectedYear} readOnly />
                <button onClick={() => setSelectedYear((y) => y + 1)} className="px-2 font-bold text-blue-600 hover:text-blue-800 transition-colors">
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Conditional rendering for loading, error, or content */}
          {loading ? (
            <div className="text-center p-8 bg-white/70 rounded-xl shadow-lg border border-sky-300/60 text-gray-700 font-saysettha text-xl">
              <p>ກຳລັງໂຫຼດຂໍ້ມູນ...</p>
              <div className="mt-4 animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500 mx-auto"></div>
            </div>
          ) : error ? (
            <div className="text-center p-8 bg-red-50/70 rounded-xl shadow-lg border border-red-300/60 text-red-700 font-saysettha text-xl">
              <p>ຂໍ້ຜິດພາດ: {error}</p>
              <p className="mt-2">ບໍ່ສາມາດໂຫຼດຂໍ້ມູນໄດ້. ກະລຸນາລອງໃໝ່ອີກຄັ້ງ.</p>
            </div>
          ) : (
            <>
              {/* Task Summary Cards (now 4 cards including 'Started Tasks') */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8 text-slate-800 font-saysettha">
                {/* Total Tasks Card */}
                <div className="bg-indigo-100/70 backdrop-blur-md p-4 rounded-xl text-center shadow-lg border border-indigo-200">
                  <p className="text-lg font-semibold text-indigo-800">ຈຳນວນວຽກທັງໝົດ</p>
                  <p className="text-4xl font-extrabold mt-2 text-indigo-900 drop-shadow-sm">
                    {summaryData.completed + summaryData.pending + summaryData.started}
                  </p>
                </div>
                {/* Pending Tasks Card */}
                <div className="bg-yellow-100/70 backdrop-blur-md p-4 rounded-xl text-center shadow-lg border border-yellow-200">
                  <p className="text-lg font-semibold text-yellow-800">ຈຳນວນວຽກທີ່ກຳລັງດໍາເນີນການ</p>
                  <p className="text-4xl font-extrabold mt-2 text-yellow-900 drop-shadow-sm">{summaryData.pending}</p>
                </div>
                {/* Started Tasks Card (NEW) */}
                <div className="bg-orange-100/70 backdrop-blur-md p-4 rounded-xl text-center shadow-lg border border-orange-200">
                  <p className="text-lg font-semibold text-orange-800">ຈຳນວນວຽກທີ່ເລີ່ມເຮັດ</p>
                  <p className="text-4xl font-extrabold mt-2 text-orange-900 drop-shadow-sm">{summaryData.started}</p>
                </div>
                {/* Completed Tasks Card */}
                <div className="bg-green-100/70 backdrop-blur-md p-4 rounded-xl text-center shadow-lg border border-green-200">
                  <p className="text-lg font-semibold text-green-800">ຈຳນວນວຽກທີ່ສຳເລັດແລ້ວ</p>
                  <p className="text-4xl font-extrabold mt-2 text-green-900 drop-shadow-sm">{summaryData.completed}</p>
                </div>
              </div>

              {/* Bar Chart */}
              <div className="bg-white/90 backdrop-blur-lg p-6 rounded-2xl shadow-2xl border border-sky-300/40">
                <h3 className="text-2xl font-bold mb-6 text-center text-gray-800 font-saysettha">
                  ວຽກປະຈຳປີ {selectedYear}
                </h3>
                {hasChartData ? (
                  <ResponsiveContainer width="100%" height={450}>
                    <BarChart
                      data={chartDataToDisplay.map(item => ({
                        month: months[item.month - 1]?.label || `ເດືອນ ${item.month}`,
                        'ສຳເລັດແລ້ວ': item.completed,
                        'ກຳລັງດຳເນີນການ': item.pending,
                        'ເລີ່ມວຽກ': item.started,
                      }))}
                      layout="vertical"
                      margin={{ top: 10, right: 40, left: 60, bottom: 20 }}
                      barGap={10}
                      barCategoryGap="20%"
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
                      <XAxis type="number" tick={{ fill: '#334155', fontSize: 14 }} />
                      <YAxis
                        type="category"
                        dataKey="month"
                        tick={{ fill: '#334155', fontWeight: 600, fontSize: 14 }}
                        width={100}
                      />
                      <Tooltip
                        cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                        contentStyle={{
                          backgroundColor: 'white',
                          borderRadius: '10px',
                          border: '1px solid #e2e8f0',
                          boxShadow: '0 6px 20px rgba(0, 0, 0, 0.08)',
                        }}
                        labelStyle={{ fontWeight: 'bold', color: '#1e293b' }}
                        itemStyle={{ color: '#475569' }}
                      />
                      <Legend
                        verticalAlign="top"
                        iconType="circle"
                        wrapperStyle={{ fontSize: '14px', fontFamily: 'Phetsarath OT, sans-serif' }}
                      />
                      <Bar
                        dataKey="ສຳເລັດແລ້ວ"
                        stackId="a"
                        fill="#10b981"
                        radius={[0, 10, 10, 0]}
                      />
                      <Bar
                        dataKey="ກຳລັງດຳເນີນການ"
                        stackId="a"
                        fill="#f59e0b"
                        radius={[0, 10, 10, 0]}
                      />
                      <Bar
                        dataKey="ເລີ່ມວຽກ"
                        stackId="a"
                        fill="#fb923c"
                        radius={[0, 10, 10, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center py-12 text-gray-500 font-saysettha">
                    ບໍ່ມີຂໍ້ມູນສຳລັບເດືອນທີ່ເລືອກ
                  </div>
                )}
              </div>
            </>
          )}
        </div>
        {/* </div> */}

      </div>

      {/* </div> */}
    </div>
  );
}
// Modal Component สำหรับยืนยันการออกจากระบบ (ต้องเป็นไฟล์แยกเช่น src/components/Modal.tsx)
// ผมยังคงใส่ไว้ที่นี่เพื่อความสมบูรณ์ของตัวอย่าง แต่ควรแยกไฟล์จริง ๆ




// 'use client';

// import { useState } from 'react';
// import Image from 'next/image';
// import { FaBell, FaUserShield, FaChartBar, FaGavel, FaSignOutAlt } from 'react-icons/fa';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// import Img from '/public/img/login.jpeg';
// import { useRouter } from 'next/navigation'
// import Link from 'next/link';

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

// // Example data
// const taskData = [
//   { month: 1, year: 2025, completed: 2, pending: 1, cancelled: 0 },
//   { month: 2, year: 2025, completed: 1, pending: 2, cancelled: 0 },
//   { month: 4, year: 2025, completed: 0, pending: 0, cancelled: 0 },
// ];

// export default function Dashboard() {
//   const [selectedMonth, setSelectedMonth] = useState<number>(4);
//   const [selectedYear, setSelectedYear] = useState<number>(2025);

//   const router = useRouter();
//   const handleSignUp = () => {
//     const confirmed = window.confirm("ທ່ານຕ້ອງການອອກລະບົບແທ້ບໍ?");
//     if (confirmed) {
//       router.push("/login");
//     }
//   };

//   const filteredData =
//     taskData.find((item) => item.month === selectedMonth && item.year === selectedYear) || {
//       completed: 0,
//       pending: 0,
//       cancelled: 0,
//     };

//   const chartData = taskData
//     .filter((item) => item.year === selectedYear)
//     .map((item) => ({
//       month: months[item.month - 1]?.label || '',
//       Completed: item.completed,
//       Pending: item.pending,
//       Cancelled: item.cancelled,
//     }));

//   return (
//     <div className="flex min-h-screen bg-gray-100">
//       <div className="w-64 bg-blue-900 text-white p-4 flex flex-col">
//         <div className="flex items-center space-x-2 ">
//           <Image src={Img} alt="#" className="w-[600px] h-auto rounded-lg" />
//         </div>
//         <nav className="mt-6 space-y-4 font-saysettha">
//           <Link href="/admin" className="flex items-center px-4 py-2 text-white-600 hover:scale-110 hover:text-white-800 hover:underline">
//             ໝ້າຫຼັກ
//           </Link>
//           <Link href="/manage_tasks" className="flex items-center px-4 py-2 text-white-600 hover:scale-110 hover:text-white-800 hover:underline">
//             ການມອບວຽກ
//           </Link>
//           <Link href="/department" className="flex items-center px-4 py-2 text-white-600 hover:scale-110 hover:text-white-800 hover:underline">
//             ພະແນກ
//           </Link>
//           <Link href="/Division" className="flex items-center px-4 py-2 text-white-600 hover:scale-110 hover:text-white-800 hover:underline">
//             ຂະແໝງ
//           </Link>
//           <Link href="/employee" className="flex items-center px-4 py-2 text-white-600 hover:scale-110 hover:text-white-800 hover:underline">
//             ພະນັກງານ
//           </Link>
//           <Link href="/position" className="flex items-center px-4 py-2 text-white-600 hover:scale-110 hover:text-white-800 hover:underline">
//             ຕຳແໝ່ງ
//           </Link>

//           <div>
//             <span className="flex items-center px-4 py-2 text-white-600 hover:scale-110 hover:text-white-800 hover:underline">
//               ລາພັກ
//             </span>
//             <div className="ml-4">
//               <Link href="/Leave_Type/Leave" className="flex items-center px-4 py-2 text-white-600 hover:scale-110 hover:text-white-800 hover:underline">
//                 ຂໍລາພັກ
//               </Link>
//               <Link href="/Leave_Type/Approve_leave" className="flex items-center px-4 py-2 text-white-600 hover:scale-110 hover:text-white-800 hover:underline">
//                 ອະນຸມັດລາພັກ
//               </Link>
//               <Link href="/Leave_Type/Follow_leave" className="flex items-center px-4 py-2 text-white-600 hover:scale-110 hover:text-white-800 hover:underline">
//                 ຕິດຕາມລາພັກ
//               </Link>
//             </div>
//             <Link href="/Attendance_Type/follow_attendance" className="flex items-center px-4 py-2 text-white-600 hover:scale-110 hover:text-white-800 hover:underline">
//               ຕິດຕາມການເຂົ້າອອກວຽກ
//             </Link>
//             <Link href="/Attendance_Type/attendance" className="flex items-center px-4 py-2 bg-red-600 text-white hover:scale-110 hover:text-white-800">
//               ການເຂົ້າ-ອອກວຽກ
//             </Link>
//           </div>
//         </nav>

//       </div>

//       {/* Main Content */}
//       <div className="flex-1 flex flex-col">
//         {/* Header */}
//         <header className="bg-blue-800 text-white p-4 flex justify-between items-center">
//           <h1 className="text-lg font-bold font-saysettha">ລະບົບຕິດຕາມວຽກ</h1>
//           {/*icon*/}
//           <div className="flex items-center space-x-4 mr-30">
//             <a href="/admin"><div className="inline-flex items-center gap-2 ">
//               <FaUserShield className="text-lg" />
//               <span className="text-base font-medium">admin</span>
//             </div></a>
//             {/*sign up*/}
//             <button onClick={handleSignUp} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition" >
//               Sign Up
//             </button>
//           </div>
//         </header>

//         <div className="p-6 bg-gray-100 min-h-screen">
//           <div className="bg-orange-100 p-4 rounded mb-6">
//             <h1 className="text-black font-bold font-saysettha">ໝ້າຫຼັກ</h1>
//           </div>

//           <div className="flex flex-wrap gap-4 mb-6">
//             <div>
//               <label className="block text-gray-700 mb-1">Month</label>
//               <select
//                 className="border p-2 rounded w-48 text-black"
//                 value={selectedMonth}
//                 onChange={(e) => setSelectedMonth(Number(e.target.value))}
//               >
//                 {months.map((month) => (
//                   <option key={month.value} value={month.value}>
//                     {month.label}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label className="block text-gray-700 mb-1">Year</label>
//               <div className="flex items-center border rounded w-48 p-2 text-black">
//                 <button onClick={() => setSelectedYear((y) => y - 1)} className="px-2 font-bold">
//                   -
//                 </button>
//                 <input
//                   type="text"
//                   className="w-full text-center focus:outline-none"
//                   value={selectedYear}
//                   readOnly
//                 />
//                 <button onClick={() => setSelectedYear((y) => y + 1)} className="px-2 font-bold">
//                   +
//                 </button>
//               </div>
//             </div>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 text-black font-saysettha">
//             <div className="bg-indigo-200 p-4 rounded-lg text-center">
//               <p className="text-lg font-semibold">ຈຳນວນວຽກທັງໝົດ</p>
//               <p className="text-3xl font-bold mt-2">
//                 {filteredData.completed + filteredData.pending + filteredData.cancelled}
//               </p>
//             </div>
//             <div className="bg-yellow-200 p-4 rounded-lg text-center">
//               <p className="text-lg font-semibold">ຈຳນວນວຽກທີ່ກຳລັງເຮັດ</p>
//               <p className="text-3xl font-bold mt-2">{filteredData.pending}</p>
//             </div>
//             <div className="bg-green-200 p-4 rounded-lg text-center">
//               <p className="text-lg font-semibold">ຈຳນວນວຽກທີ່ສຳເລັດແລ້ວ</p>
//               <p className="text-3xl font-bold mt-2">{filteredData.completed}</p>
//             </div>
//           </div>

//           <div className="bg-white p-6 rounded-lg shadow">
//             <ResponsiveContainer width="100%" height={400}>
//               <BarChart data={chartData}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="month" />
//                 <YAxis allowDecimals={false} />
//                 <Tooltip />
//                 <Legend />
//                 <Bar dataKey="Completed" fill="#3B82F6" />
//                 <Bar dataKey="Pending" fill="#22C55E" />
//                 <Bar dataKey="Cancelled" fill="#F59E0B" />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         {/* Footer */}
//         <footer className="bg-gray-200 p-4 text-center text-black">ກັບໄປໜ້າ admin</footer>
//       </div>
//     </div>
//   );
// }