'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, ChangeEvent, useEffect } from 'react';
import { FaBell, FaUserShield, FaGavel, FaSignOutAlt, FaChartBar, FaAngleLeft, FaBars } from 'react-icons/fa';
import Img from '/public/img/login.jpeg';
import Link from 'next/link';
import axios from 'axios';

// Re-usable Modal component for sign-out or confirmation (copied from PositionPage)
function Modal({ isOpen, onClose, onConfirm, title, message, confirmText, cancelText }: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 w-96 shadow-2xl border border-gray-100 transform animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
        style={{ fontFamily: 'Phetsarath OT, sans-serif' }}
      >
        <div className="flex items-center justify-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-300 to-sky-400 rounded-full flex items-center justify-center shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
          {title}
        </h2>
        <p className="mb-8 text-center text-gray-600 leading-relaxed">
          {message}
        </p>

        <div className="flex gap-4">
          <button
            className="flex-1 px-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-all duration-200 hover:scale-105 active:scale-95 border border-gray-200"
            onClick={onClose}
          >
            {cancelText}
          </button>
          <button
            className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-400 to-sky-500 text-white font-medium hover:from-blue-500 hover:to-sky-600 transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

// Re-usable Notification Modal Component (copied from PositionPage)
function NotificationModal({ isOpen, onClose, title, message }: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 w-96 shadow-2xl border border-gray-100 transform animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
        style={{ fontFamily: 'Phetsarath OT, sans-serif' }}
      >
        <div className="flex items-center justify-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-green-300 to-emerald-400 rounded-full flex items-center justify-center shadow-lg">
            {/* Icon for success/info */}
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
          {title}
        </h2>
        <p className="mb-8 text-center text-gray-600 leading-relaxed">
          {message}
        </p>

        <div className="flex justify-center">
          <button
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-400 to-sky-500 text-white font-medium hover:from-blue-500 hover:to-sky-600 transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
            onClick={onClose}
          >
            ຕົກລົງ
          </button>
        </div>
      </div>
    </div>
  );
}


interface AddPosition {
  position_name: string; // Changed from employeeName to Position_Name
}

export default function AddPositionPage() {
  const router = useRouter();
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // State for adding a new position
  const [newPosition, setNewPosition] = useState<AddPosition>({
    position_name: '',
  });

  // State for Notification Modal
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [notificationTitle, setNotificationTitle] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");

  // Function to show notification modal
  const showNotification = (title: string, message: string) => {
    setNotificationTitle(title);
    setNotificationMessage(message);
    setShowNotificationModal(true);
  };

  // Handle input changes
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewPosition({ ...newPosition, [e.target.name]: e.target.value });
  };

  // Handle add position submission
  const handleAddPosition = async () => {
    if (!newPosition.position_name.trim()) {
      showNotification("ຜິດພາດ", "ກະລຸນາປ້ອນຊື່ຕຳແໜ່ງ.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8080/api/v1/Position", newPosition, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 201 || response.status === 200) { // Assuming 201 Created or 200 OK for successful creation
        showNotification("ສຳເລັດ", "ເພີ່ມຕຳແໜ່ງໃໝ່ສຳເລັດແລ້ວ!");
        setNewPosition({ position_name: '' }); // Clear the input field
        router.push('/position'); // Redirect to position list after successful addition
      } else {
        showNotification("ຜິດພາດ", `ບໍ່ສາມາດເພີ່ມຕຳແໜ່ງໄດ້: ${response.data?.message || 'ມີບາງຢ່າງຜິດພາດ.'}`);
      }
    } catch (error: any) {
      console.error("Error adding position:", error);
      showNotification("ຜິດພາດ", `ເກີດຂໍ້ຜິດພາດໃນການເພີ່ມຕຳແໜ່ງ: ${error.response?.data?.message || error.message || 'ກະລຸນາລອງໃໝ່.'}`);
    }
  };

  // Handle Logout
  const handleSignOut = () => {
    setIsSignOutModalOpen(true);
  };

  const confirmSignOut = () => {
    setIsSignOutModalOpen(false);
    localStorage.removeItem("token");
    router.push("/login");
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

      {/* Sidebar */}
      <div className={`bg-white/70 backdrop-blur-lg border-r border-sky-300/60 text-slate-800 p-4 flex flex-col shadow-xl transition-all duration-300 ${isSidebarCollapsed ? 'w-20 items-center' : 'w-64'}`}>
        <button
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="p-2 rounded-full bg-blue-600 text-white self-end mb-4 hover:bg-blue-700 transition-colors hidden md:block"
        >
          {isSidebarCollapsed ? <FaBars className="text-lg" /> : <FaAngleLeft className="text-lg" />}
        </button>

        <div className={`flex items-center justify-center mb-6 ${isSidebarCollapsed ? 'mt-8' : ''}`}>
          <Image src={Img} alt="Logo" width={300} height={300} className={`h-auto rounded-lg shadow-md border border-gray-300 ${isSidebarCollapsed ? 'w-12 h-12' : 'w-full'}`} />
        </div>
        <nav className={`mt-6 space-y-3 text-lg ${isSidebarCollapsed ? 'hidden' : ''}`}>
          <Link href="/admin" className="flex items-center px-4 py-2 rounded-lg transition-all duration-200 hover:bg-sky-200 hover:scale-105">
            <FaBell className="mr-3" /> ໝ້າຫຼັກ
          </Link>
          <Link href="/manage_tasks" className="flex items-center px-4 py-2 rounded-lg transition-all duration-200 hover:bg-sky-200 hover:scale-105">
            <FaChartBar className="mr-3" /> ການມອບວຽກ
          </Link>
          <Link href="/department" className="flex items-center px-4 py-2 rounded-lg transition-all duration-200 hover:bg-sky-200 hover:scale-105">
            <FaGavel className="mr-3" /> ພະແນກ
          </Link>
          <Link href="/Division" className="flex items-center px-4 py-2 rounded-lg transition-all duration-200 hover:bg-sky-200 hover:scale-105">
            <FaGavel className="mr-3" /> ຂະແໝງ
          </Link>
          <Link href="/employee" className="flex items-center px-4 py-2 rounded-lg transition-all duration-200 hover:bg-sky-200 hover:scale-105">
            <FaGavel className="mr-3" /> ພະນັກງານ
          </Link>
          <Link href="/position" className="flex items-center px-4 py-2 bg-sky-300 rounded-lg transition-all duration-200 hover:bg-sky-200 hover:scale-105">
            <FaGavel className="mr-3" /> ຕຳແໜ່ງ
          </Link>

          <div>
            <span className="flex items-center px-4 py-2 font-semibold text-blue-700">
              <FaGavel className="mr-3" /> ລາພັກ
            </span>
            <div className="ml-6 space-y-2 text-sm">
              <Link href="/Leave_Type/Leave" className="flex items-center px-4 py-2 rounded-lg transition-all duration-200 hover:bg-sky-200 hover:scale-105">
                ຂໍລາພັກ
              </Link>
              <Link href="/Leave_Type/Approve_leave" className="flex items-center px-4 py-2 rounded-lg transition-all duration-200 hover:bg-sky-200 hover:scale-105">
                ອະນຸມັດລາພັກ
              </Link>
              <Link href="/Leave_Type/Follow_leave" className="flex items-center px-4 py-2 rounded-lg transition-all duration-200 hover:bg-sky-200 hover:scale-105">
                ຕິດຕາມລາພັກ
              </Link>
            </div>
            <Link href="/Attendance_Type/follow_attendance" className="flex items-center px-4 py-2 rounded-lg transition-all duration-200 hover:bg-sky-200 hover:scale-105 mt-2">
              <FaGavel className="mr-3" /> ຕິດຕາມການເຂົ້າອອກວຽກ
            </Link>
            <Link href="/Attendance_Type/attendance" className="flex items-center px-4 py-2 rounded-lg transition-all duration-200 hover:bg-sky-200 hover:scale-105">
              <FaGavel className="mr-3" /> ການເຂົ້າ-ອອກວຽກ
            </Link>
          </div>
        </nav>
        {/* Collapsed sidebar icons/text */}
        {isSidebarCollapsed && (
          <nav className="mt-6 space-y-4 flex flex-col items-center">
            <Link href="/admin" className="p-2 rounded-lg hover:bg-sky-200">
              <FaBell className="text-xl" />
            </Link>
            <Link href="/manage_tasks" className="p-2 rounded-lg hover:bg-sky-200">
              <FaChartBar className="text-xl" />
            </Link>
            <Link href="/department" className="p-2 rounded-lg hover:bg-sky-200">
              <FaGavel className="text-xl" />
            </Link>
            <Link href="/Division" className="p-2 rounded-lg hover:bg-sky-200">
              <FaGavel className="text-xl" />
            </Link>
            <Link href="/employee" className="p-2 rounded-lg hover:bg-sky-200">
              <FaGavel className="text-xl" />
            </Link>
            <Link href="/position" className="p-2 rounded-lg bg-sky-300 hover:bg-sky-200">
              <FaGavel className="text-xl" />
            </Link>
            <span className="p-2 rounded-lg hover:bg-sky-200 text-blue-700">
              <FaGavel className="text-xl" />
            </span>
            <Link href="/Attendance_Type/attendance" className="p-2 rounded-lg hover:bg-sky-200">
              <FaGavel className="text-xl" />
            </Link>
          </nav>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-gradient-to-r from-sky-600 to-blue-700 text-white p-4 flex justify-between items-center shadow-lg">
          <h1 className="text-xl font-bold font-saysettha">ລະບົບຕິດຕາມວຽກ</h1>
          <div className="flex items-center space-x-4">
            <Link href="/admin">
              <div className="inline-flex items-center gap-2 cursor-pointer hover:text-sky-300 transition-colors">
                <FaUserShield className="text-xl" />
                <span className="text-base font-medium">admin</span>
              </div>
            </Link>
            <button
              onClick={handleSignOut}
              className="bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700 transition-colors shadow-md flex items-center gap-2"
            >
              <FaSignOutAlt /> ອອກລະບົບ
            </button>
          </div>
        </header>

        {/* Breadcrumb */}
        <div className="bg-white/70 backdrop-blur-sm p-4 text-sm text-slate-700 font-saysettha border-b border-sky-300">
          ໜ້າຫຼັກ / <Link href="/position" className="hover:underline">ຕຳແໜ່ງ</Link> /
          <span className="text-blue-800 font-semibold"> ເພີ່ມຕຳແໜ່ງ</span>
        </div>

        {/* Form */}
        <div className="p-6 flex-1">
          <div className="bg-white/90 backdrop-blur-lg rounded-xl shadow-xl border border-sky-300/60 p-6">
            <h2 className="text-2xl font-bold text-slate-800 font-saysettha mb-6">ເພີ່ມຕຳແໜ່ງ</h2>
            <div className="space-y-6">
              <div>
                <label htmlFor="position_name" className="block text-lg font-medium text-gray-700 mb-2">ຊື່ຕຳແໜ່ງ</label>
                <input
                  type="text"
                  id="position_name"
                  name="position_name"
                  value={newPosition.position_name}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                  placeholder="ປ້ອນຊື່ຕຳແໜ່ງ"
                  required
                />
              </div>
              <div className="flex space-x-4 mt-6">
                <button
                  onClick={handleAddPosition}
                  className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors duration-200 shadow-md font-medium text-lg"
                >
                  ບັນທຶກ
                </button>
                <button
                  onClick={() => router.push('/position')}
                  className="flex-1 bg-gray-300 text-slate-700 px-6 py-3 rounded-xl hover:bg-gray-400 transition-colors duration-200 shadow-md font-medium text-lg"
                >
                  ຍົກເລີກ
                </button>
              </div>
            </div>

            {/* Footer
            <Link href="/admin">
              <footer className="bg-sky-100/70 p-4 text-center text-slate-800 mt-10 rounded-lg font-saysettha text-md shadow-inner border border-sky-200 hover:bg-sky-200/70 transition-colors">
                ກັບໄປໜ້າ admin
              </footer>
            </Link> */}
          </div>
        </div>
      </div>
    </div>
  );
}