// src/app/Attendance_Type/attendance/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaUserShield } from 'react-icons/fa';

// Import reusable components
import Modal from "@/src/components/Modal";
import NotificationModal from "@/src/components/NotificationModal";
import Header from "@/src/components/Header";
import Sidebar from "@/src/components/Sidebar";
import Breadcrumb from "@/src/components/Breadcrumb";

// Import types and hook
import { useAttendance } from "@/src/hooks/useAttendance";
import { Attendance, ClockActionPayload } from "@/src/types/attendance";

// Import fontLoader utility
import { fontLoader } from "@/src/utils/fontLoader";

// Import image directly
import Img from "/public/img/login.jpeg";

export default function AttendancePage() {
  const router = useRouter();
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Notification Modal States
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [notificationTitle, setNotificationTitle] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");

  // Changed `notes` from dropdown value to a text input string
  const [notesInput, setNotesInput] = useState<string>('');

  // Function to show notification modal, now memoized with useCallback
  const showNotification = useCallback((title: string, message: string) => {
    setNotificationTitle(title);
    setNotificationMessage(message);
    setShowNotificationModal(true);
  }, []);

  // Use the custom hook for attendance data and operations
  const { attendances, loading, error, clockIn, clockOut } = useAttendance(showNotification);

  // Helper function to decode JWT token
  const getEmployeeIdFromToken = (): string | null => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
      // Decode JWT token (แบบง่าย - สำหรับการอ่านข้อมูลเท่านั้น)
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      const decoded = JSON.parse(jsonPayload);
      console.log("Decoded token:", decoded);

      // ลองหา ID ในรูปแบบต่างๆ
      return decoded.id?.toString() || decoded.Employee_ID?.toString() || decoded.employee_id?.toString() || null;
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };

  // Helper function to get Employee ID from localStorage (fallback)
  const getEmployeeIdFromLocalStorage = (): string | null => {
    const userString = localStorage.getItem("user");
    if (!userString) return null;

    try {
      const user = JSON.parse(userString);
      console.log("User from localStorage:", user);

      // ลองหา Employee ID ในชื่อ field ต่างๆ
      return user?.Employee_ID?.toString() ||
        user?.employee_id?.toString() ||
        user?.employeeId?.toString() ||
        user?.id?.toString() ||
        user?.user_id?.toString() ||
        null;
    } catch (error) {
      console.error("Error parsing user data:", error);
      return null;
    }
  };

  // Combined function to get Employee ID
  const getEmployeeId = (): string | null => {
    // ลองดึงจาก token ก่อน
    let employeeId = getEmployeeIdFromToken();

    // ถ้าไม่มี ลองดึงจาก localStorage
    if (!employeeId) {
      employeeId = getEmployeeIdFromLocalStorage();
    }

    console.log("Final Employee ID:", employeeId);
    return employeeId;
  };

  // Handle Logout
  const handleSignOut = () => {
    setIsSignOutModalOpen(true);
  };

  const confirmSignOut = () => {
    setIsSignOutModalOpen(false);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  // Handle Clock-in - Fixed
  const handleClockIn = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      showNotification("ຜິດພາດ", "ທ່ານບໍ່ໄດ້ເຂົ້າສູ່ລະບົບ.");
      router.replace("/login");
      return;
    }

    const employeeId = getEmployeeId();
    if (!employeeId) {
      console.error("Cannot find Employee ID");
      console.log("Token:", token);
      console.log("User data:", localStorage.getItem("user"));

      showNotification("ຜິດພາດ", "ບໍ່ພົບຂໍ້ມູນພະນັກງານ. ກະລຸນາເຂົ້າສູ່ລະບົບໃໝ່.");

      // ลบข้อมูลเก่าและไปหน้า login
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      router.replace("/login");
      return;
    }

    const now = new Date();
    const date = now.toISOString().split('T')[0];
    const time = now.toTimeString().split(' ')[0];

    const payload: ClockActionPayload = {
      Employee_ID: Number(employeeId),
      Date: date,
      Time: time,
      Status: "ເຂົ້າວຽກ", // Default status for clock-in
      Notes: notesInput.trim() === '' ? null : notesInput.trim() // Send null if empty
    };

    console.log("Clock-in payload:", payload);

    const success = await clockIn(payload);
    if (success) {
      setNotesInput(''); // Clear notes after successful clock-in
    }
  };

  // Handle Clock-out - Fixed
  const handleClockOut = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      showNotification("ຜິດພາດ", "ທ່ານບໍ່ໄດ້ເຂົ້າສູ່ລະບົບ.");
      router.replace("/login");
      return;
    }

    const employeeId = getEmployeeId();
    if (!employeeId) {
      console.error("Cannot find Employee ID");
      console.log("Token:", token);
      console.log("User data:", localStorage.getItem("user"));

      showNotification("ຜິດພາດ", "ບໍ່ພົບຂໍ້ມູນພະນັກງານ. ກະລຸນາເຂົ້າສູ່ລະບົບໃໝ່.");

      // ลบข้อมูลเก่าและไปหน้า login
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      router.replace("/login");
      return;
    }

    const now = new Date();
    const date = now.toISOString().split('T')[0];
    const time = now.toTimeString().split(' ')[0];

    const payload: ClockActionPayload = {
      Employee_ID: Number(employeeId),
      Date: date,
      Time: time,
      Status: "ເລີກວຽກ", // Default status for clock-out
      Notes: notesInput.trim() === '' ? null : notesInput.trim() // Send null if empty
    };

    console.log("Clock-out payload:", payload);

    const success = await clockOut(payload);
    if (success) {
      setNotesInput(''); // Clear notes after successful clock-out
    }
  };

  // Load font and check authentication on component mount
  useEffect(() => {
    fontLoader();

    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
    }
  }, [router]);

  // Debug useEffect - เพิ่มเพื่อตรวจสอบข้อมูล
  useEffect(() => {
    console.log("=== Debug Employee Data ===");
    console.log("Token:", localStorage.getItem("token"));
    console.log("User:", localStorage.getItem("user"));

    const employeeId = getEmployeeId();
    console.log("Resolved Employee ID:", employeeId);

    // ตรวจสอบว่าสามารถ decode token ได้หรือไม่
    const tokenEmployeeId = getEmployeeIdFromToken();
    console.log("Employee ID from token:", tokenEmployeeId);

    const localStorageEmployeeId = getEmployeeIdFromLocalStorage();
    console.log("Employee ID from localStorage:", localStorageEmployeeId);
  }, []);

  const getStatusColorClass = (status: string) => {
    const baseClass = "inline-block min-w-[100px] text-center px-3 py-1 rounded-full text-sm font-semibold border";
    switch (status) {
      case "ເຂົ້າວຽກ":
        return `${baseClass} bg-green-100 text-green-800 border-green-300`;
      case "ມາຊ້າ":
        return `${baseClass} bg-yellow-100 text-yellow-800 border-yellow-300`;
      case "ເລີກວຽກ":
        return `${baseClass} bg-blue-100 text-blue-800 border-blue-300`;
      default:
        return `${baseClass} bg-gray-200 text-gray-700 border-gray-300`;
    }
  };


  return (
    <div className="flex min-h-screen bg-gradient-to-br from-sky-200 via-blue-100 to-cyan-200 text-slate-800" style={{ fontFamily: 'Phetsarath OT, sans-serif,' }}>
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

      {/* Notification Modal */}
      <NotificationModal
        isOpen={showNotificationModal}
        onClose={() => setShowNotificationModal(false)}
        title={notificationTitle}
        message={notificationMessage}
      />

      {/* Sidebar */}
      <Sidebar isCollapsed={isSidebarCollapsed} onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header onSignOut={handleSignOut} />

        {/* Breadcrumb */}
        <Breadcrumb paths={[{ name: "ໜ້າຫຼັກ", href: "/admin" }, { name: "ການເຂົ້າ-ອອກວຽກ" }]} />

        <div className="p-6 flex-1 overflow-y-auto">
          <div className="bg-white/90 backdrop-blur-lg rounded-xl shadow-xl border border-sky-300/60 p-6">
            <div className="flex justify-between items-center bg-sky-100/70 p-4 rounded-lg mb-6 border border-sky-200">
              <h3 className="text-2xl font-bold text-slate-800 font-saysettha">ການເຂົ້າ-ອອກວຽກ</h3>
            </div>

            {/* Attendance Table */}
            <div className="mt-6 max-h-[400px] overflow-y-auto overflow-x-auto rounded-lg shadow-md border border-sky-200 relative">
              <table className="w-full border-collapse">
                <thead className="bg-sky-200 text-slate-800 font-saysettha text-lg">
                  <tr>
                    <th className="sticky top-0 z-10 p-4 text-left bg-sky-200">ລຳດັບ</th>
                    <th className="sticky top-0 z-10 p-4 text-left bg-sky-200">ວັນທີ</th>
                    <th className="sticky top-0 z-10 p-4 text-left bg-sky-200">ເວລາເຂົ້າ</th>
                    <th className="sticky top-0 z-10 p-4 text-left bg-sky-200">ເວລາອອກ</th>
                    <th className="sticky top-0 z-10 p-4 text-left bg-sky-200">ສະຖານະ</th>
                    <th className="sticky top-0 z-10 p-4 text-left bg-sky-200">ເຫດຜົນ</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="text-center p-4 text-gray-500 font-saysettha text-md">
                        ກຳລັງໂຫຼດຂໍ້ມູນ...
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan={5} className="text-center p-4 text-red-500 font-saysettha text-md">
                        Error: {error}
                      </td>
                    </tr>
                  ) : attendances.length > 0 ? (
                    attendances.map((record, index) => (
                      <tr key={record.Attendance_ID} className="border-t border-sky-200 text-slate-700 hover:bg-sky-50/50 transition-colors">
                        <td className="p-4 font-times text-lg">{index + 1}</td>

                        <td className="p-4 font-times text-lg">{new Date(record.Date).toLocaleDateString('lo-LA')}</td>
                        <td className="p-4 font-times text-lg">{new Date(record.Time_in).toLocaleTimeString('lo-LA')}</td>
                        <td className="p-4 font-times text-lg">{record.Time_out ? new Date(record.Time_out).toLocaleTimeString('lo-LA') : '-'}</td>
                        <td className="p-4 font-saysettha">
                          <span className={getStatusColorClass(record.Status)}>
                            {record.Status}
                          </span>
                        </td>
                        <td className="p-4">{record.Notes || '-'}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="text-center p-4 text-gray-500 font-saysettha text-md">
                        ບໍ່ພົບຂໍ້ມູນການເຂົ້າ-ອອກວຽກ
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Text input for Notes */}
            <div className="mb-4 mt-6">
              <label htmlFor="notes-input" className="block text-slate-700 text-lg font-bold mb-2 font-saysettha">
                ເຫດຜົນ
              </label>
              <input
                id="notes-input"
                type="text"
                className="block w-full md:w-1/2 p-3 border border-sky-300 rounded-lg text-slate-700 focus:ring-blue-500 focus:border-blue-500 transition-colors font-saysettha"
                placeholder="ພິມໝາຍເຫດຂອງທ່ານ..."
                value={notesInput}
                onChange={(e) => setNotesInput(e.target.value)}
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-4 mt-6">
              <button
                onClick={handleClockIn}
                className="bg-green-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 font-saysettha hover:bg-green-700 transition-all duration-200 shadow-md"
              >
                ກົດເຂົ້າວຽກ
              </button>
              <button
                onClick={handleClockOut}
                className="bg-red-500 text-white px-6 py-3 rounded-lg flex items-center space-x-2 font-saysettha hover:bg-red-600 transition-all duration-200 shadow-md"
              >
                ກົດອອກວຽກ
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}