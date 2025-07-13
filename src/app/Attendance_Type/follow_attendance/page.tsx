// src/app/Attendance_Type/follow_attendance/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaUserShield, FaPlus, FaEdit, FaTrash, FaFilePdf } from 'react-icons/fa';
import axios from 'axios';

// Import reusable components
import Modal from "@/src/components/Modal";
import NotificationModal from "@/src/components/NotificationModal";
import Header from "@/src/components/Header";
import Sidebar from "@/src/components/Sidebar";
import Breadcrumb from "@/src/components/Breadcrumb";

// Import types and hook
import { useAttendanceTracking } from "@/src/hooks/useAttendanceTracking";
import { AdminAttendanceRecord, Employee } from "@/src/types/attendanceTracking";
import { useEmployee } from "@/src/hooks/useEmployeeData";
// Import fontLoader utility
import { fontLoader } from "@/src/utils/fontLoader";

// Import image directly
import Img from "/public/img/login.jpeg";

export default function FollowAttendancePage() {
  const router = useRouter();
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Notification Modal States
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [notificationTitle, setNotificationTitle] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");
  const [employees, setEmployees] = useState<Employee[]>([]);


  // State for the search term and selected month
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMonth, setSelectedMonth] = useState<string>(
    (new Date().getMonth() + 1).toString().padStart(2, '0')
  );

  // PDF related states
  const [isPDFDownloading, setIsPDFDownloading] = useState(false);
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<number[]>([]);
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');
  const [showPDFModal, setShowPDFModal] = useState(false);

  // Function to show notification modal
  const showNotification = useCallback((title: string, message: string) => {
    setNotificationTitle(title);
    setNotificationMessage(message);
    setShowNotificationModal(true);
  }, []);

  // Use the custom hook for admin attendance tracking
  const { attendanceRecords, loading, error, fetchAttendanceRecords } = useAttendanceTracking(showNotification);

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

  // Handle PDF Download
  const handleDownloadPDF = async () => {
    setIsPDFDownloading(true);
    try {
      const token = localStorage.getItem("token");

      const payload = {
        employeeIds: selectedEmployeeIds,
        fromDate,
        toDate,
      };

      const response = await axios.post("http://localhost:8080/api/v1/Attendance/report", payload, {
        responseType: 'blob', // ถ้า backend ส่ง PDF เป็นไฟล์
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      // ✅ สร้างลิงก์ดาวน์โหลด PDF
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "attendance_report.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();

      showNotification("ສຳເລັດ", "ດາວໂຫຼດ PDF ສຳເລັດແລ້ວ");
    } catch (error: any) {
      console.error("Download error:", error);
      showNotification("ຜິດພາດ", "ດາວໂຫຼດ PDF ລົ້ມເຫຼວ");
    } finally {
      setIsPDFDownloading(false);
      setShowPDFModal(false);
    }
  };


  // Load font and check authentication on component mount
  useEffect(() => {
    fontLoader();

    const token = localStorage.getItem("token");
    const userString = localStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : null;
    const allowedRoles = ["Admin", "Super_Admin"]; // ✅ เพิ่ม role ที่อนุญาต

    if (!token || !allowedRoles.includes(user?.role)) {
      router.replace("/login");
    }
  }, [router]);


  // Fetch employees for PDF modal
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:8080/api/v1/Employee", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = response.data?.data;
        if (Array.isArray(data)) {
          setEmployees(data); // ✅ อัปเดต state
        } else {
          console.error("Invalid employee data:", data);
        }
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    fetchEmployees();
  }, []);


  // Filtered attendance records based on search term and selected month
  const filteredAttendanceRecords = attendanceRecords.filter((record) => {
    const matchesSearchTerm = record.employee?.Name?.toLowerCase().includes(searchTerm.toLowerCase());

    const recordDate = new Date(record.Date);
    const recordMonth = (recordDate.getMonth() + 1).toString().padStart(2, '0');
    const recordYear = recordDate.getFullYear().toString();
    const currentYear = new Date().getFullYear().toString();

    const matchesMonth = selectedMonth === "" || (recordMonth === selectedMonth && recordYear === currentYear);

    return matchesSearchTerm && matchesMonth;
  });

  // Array of months for the dropdown
  const months = [
    { value: "", label: "ທັງໝົດ" },
    { value: "01", label: "ມັງກອນ" },
    { value: "02", label: "ກຸມພາ" },
    { value: "03", label: "ມີນາ" },
    { value: "04", label: "ເມສາ" },
    { value: "05", label: "ພຶດສະພາ" },
    { value: "06", label: "ມິຖຸນາ" },
    { value: "07", label: "ກໍລະກົດ" },
    { value: "08", label: "ສິງຫາ" },
    { value: "09", label: "ກັນຍາ" },
    { value: "10", label: "ຕຸລາ" },
    { value: "11", label: "ພະຈິກ" },
    { value: "12", label: "ທັນວາ" },
  ];

  const getStatusColorClass = (status: string) => {
    const baseClass = "inline-block min-w-[100px] text-center px-3 py-1 rounded-full text-sm font-semibold";

    switch (status) {
      case "ເຂົ້າວຽກ":
        return `${baseClass} bg-green-100 text-green-700`;
      case "ມາຊ້າ":
        return `${baseClass} bg-yellow-100 text-yellow-800`;
      case "ເລີກວຽກ":
        return `${baseClass} bg-blue-100 text-blue-800`;
      default:
        return `${baseClass} bg-gray-200 text-gray-700`;
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-sky-200 via-blue-100 to-cyan-200 text-slate-800" style={{ fontFamily: 'Phetsarath OT, sans-serif' }}>
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

      {/* PDF Filter Modal */}
      {showPDFModal && (
        <Modal
          isOpen={showPDFModal}
          onClose={() => setShowPDFModal(false)}
          onConfirm={handleDownloadPDF}
          title="ດາວໂຫຼດ PDF"
          message="ກະລຸນາເລືອກພະນັກງານ ແລະ ວັນທີ ທີ່ຕ້ອງການ"
          confirmText="ດາວໂຫຼດ"
          cancelText="ຍົກເລີກ"

        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 font-saysettha">
                ພະນັກງານ:
              </label>
              <select
                value={selectedEmployeeIds.length > 0 ? String(selectedEmployeeIds[0]) : ""}
                onChange={(e) => {
                  const selectedId = Number(e.target.value);
                  setSelectedEmployeeIds([selectedId]);
                }}
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value=""> ເລືອກພະນັກງານ </option>
                {employees.map(emp => (
                  <option key={emp.Employee_ID} value={emp.Employee_ID}>
                    {emp.Name}
                  </option>
                ))}
              </select>
            </div>


            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 font-saysettha">
                ຈາກວັນທີ:
              </label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 font-saysettha">
                ຫາວັນທີ:
              </label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              {/* <button
                onClick={handleDownloadPDF}
                disabled={isPDFDownloading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded transition-colors font-saysettha"
              >
                {isPDFDownloading ? "ກຳລັງດາວໂຫຼດ..." : "ດາວໂຫຼດ"}
              </button>
              <button
                onClick={() => setShowPDFModal(false)}
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded transition-colors font-saysettha"
              >
                ປິດ
              </button> */}
            </div>
          </div>
        </Modal>
      )}

      {/* Sidebar */}
      <Sidebar isCollapsed={isSidebarCollapsed} onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header onSignOut={handleSignOut} />

        {/* Breadcrumb */}
        <Breadcrumb paths={[{ name: "ໜ້າຫຼັກ", href: "/admin" }, { name: "ຕິດຕາມການເຂົ້າ-ອອກວຽກ" }]} />

        <div className="p-6 flex-1 overflow-y-auto">
          <div className="bg-white/90 backdrop-blur-lg rounded-xl shadow-xl border border-sky-300/60 p-6">
            <div className="flex justify-between items-center bg-sky-100/70 p-4 rounded-lg mb-6 border border-sky-200">
              <h3 className="text-2xl font-bold text-slate-800 font-saysettha">ຕິດຕາມການເຂົ້າ-ອອກວຽກ</h3>
              <button
                onClick={() => setShowPDFModal(true)}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors font-saysettha"
              >
                <FaFilePdf />
                ດາວໂຫຼດ PDF
              </button>
            </div>

            {/* Search Input Field and Month Filter */}
            <div className="flex justify-end items-center gap-4 mb-4">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ຄົ້ນຫາຊື່ພະນັກງານ..."
                className="p-2 border border-sky-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-400 font-saysettha"
              />
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="p-2 border border-sky-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-400 font-saysettha"
              >
                {months.map((month) => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Attendance Table */}
            <div className="mt-6 max-h-[400px] overflow-y-auto overflow-x-auto rounded-lg shadow-md border border-sky-200 relative">
              <table className="w-full border-collapse">
                <thead className="bg-sky-200 text-slate-800 font-saysettha text-lg">
                  <tr>
                    <th className="sticky top-0 z-10 p-4 text-left bg-sky-200">ລຳດັບ</th>
                    <th className="sticky top-0 z-10 p-4 text-left bg-sky-200">ຊື່ພະນັກງານ</th>
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
                      <td colSpan={7} className="text-center p-4 text-gray-500 font-saysettha text-md">
                        ກຳລັງໂຫຼດຂໍ້ມູນ...
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan={7} className="text-center p-4 text-red-500 font-saysettha text-md">
                        Error: {error}
                      </td>
                    </tr>
                  ) : filteredAttendanceRecords.length > 0 ? (
                    filteredAttendanceRecords.map((record, index) => {
                      const employeeName = record.employee?.Name || 'N/A';

                      return (
                        <tr
                          key={record.Attendance_ID}
                          className="border-t border-sky-200 text-slate-700 hover:bg-sky-50/50 transition-colors"
                        >
                          <td className="p-4 font-saysettha">{index + 1}</td>
                          <td className="p-4 font-saysettha">{employeeName}</td>
                          <td className="p-4 font-saysettha">
                            {new Date(record.Date).toLocaleDateString('lo-LA')}
                          </td>
                          <td className="p-4 font-saysettha">
                            {new Date(record.Time_in).toLocaleTimeString('lo-LA')}
                          </td>
                          <td className="p-4 font-saysettha">
                            {record.Time_out
                              ? new Date(record.Time_out).toLocaleTimeString('lo-LA')
                              : '-'}
                          </td>
                          <td className="p-4">
                            <span className={getStatusColorClass(record.Status)}>
                              {record.Status}
                            </span>
                          </td>
                          <td className="p-4 font-saysettha">{record.Notes || '-'}</td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={7} className="text-center p-4 text-gray-500 font-saysettha text-md">
                        ບໍ່ພົບຂໍ້ມູນການຕິດຕາມການເຂົ້າ-ອອກວຽກ
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div >
  );
}