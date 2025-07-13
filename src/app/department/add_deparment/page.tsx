// src/app/department/add_department/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
// import { MdSave, MdArrowBack } from 'react-icons/md'; // Icons for buttons
// Import reusable components
import Modal from "@/src/components/Modal";
import NotificationModal from "@/src/components/NotificationModal";
import Sidebar from "@/src/components/Sidebar";
import Header from "@/src/components/Header";
import Breadcrumb from "@/src/components/Breadcrumb";

// Import types and services
import { AddDepartment } from "@/src/types/department";
import { departmentService } from '@/src/services/departmentService'; // Ensure this service exists and has createDepartment method

// Import fontLoader utility
import { fontLoader } from "@/src/utils/fontLoader";


export default function AddManageDepartment() {
  const router = useRouter();
  const [newDepartment, setNewDepartment] = useState<AddDepartment>({
    Department_Name: '',
    Phone: '',
    Address: '',
    Email: '',
    Contact_Person: '',
  });
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Notification Modal state
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [notificationTitle, setNotificationTitle] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");
  // New state to manage success/error for navigation logic
  const [isSuccessNotification, setIsSuccessNotification] = useState(false);


  // Load font on component mount
  fontLoader();

  const showNotification = useCallback((title: string, message: string, isSuccess: boolean = false) => {
    setNotificationTitle(title);
    setNotificationMessage(message);
    setIsSuccessNotification(isSuccess); // Set if it's a success notification
    setShowNotificationModal(true);
  }, []);

  const handleSignOut = () => {
    setIsSignOutModalOpen(true);
  };

  const confirmSignOut = () => {
    setIsSignOutModalOpen(false);
    localStorage.removeItem("token");
    router.push("/login");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewDepartment(prev => ({ ...prev, [name]: value }));
  };

  const handleAddDepartment = async () => {
    // Basic validation
    if (!newDepartment.Department_Name.trim()) {
      showNotification("ຜິດພາດ", "ກະລຸນາປ້ອນຊື່ພະແນກ.");
      return;
    }
    if (!newDepartment.Email.trim()) {
      showNotification("ຜິດພາດ", "ກະລຸນາປ້ອນອີເມວ.");
      return;
    }
    if (!newDepartment.Phone.trim()) {
      showNotification("ຜິດພາດ", "ກະລຸນາປ້ອນເບີໂທ.");
      return;
    }
    if (!newDepartment.Address.trim()) {
      showNotification("ຜິດພາດ", "ກະລຸນາປ້ອນທີ່ຢູ່.");
      return;
    }

    try {
      await departmentService.createDepartment(newDepartment);
      // Pass true for success notification
      showNotification("ສຳເລັດ", "ເພີ່ມພະແນກໃໝ່ສຳເລັດ!", true);

      // Clear the form fields
      setNewDepartment({
        Department_Name: '',
        Phone: '',
        Address: '',
        Email: '',
        Contact_Person: '',
      });
      // Do NOT navigate here immediately
    } catch (error: any) {
      console.error("Failed to add department:", error);
      showNotification("ຜິດພາດ", `ບໍ່ສາມາດເພີ່ມຕຳແໜ່ງໄດ້: ${error.response?.data?.message || error.message || 'ກະລຸນາລອງໃໝ່.'}`);
    }
  };

  // Function to handle closing the notification modal
  const handleNotificationClose = () => {
    setShowNotificationModal(false);
    // If it was a success notification, then navigate
    if (isSuccessNotification) {
      router.push('/department');
    }
  };


  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-sky-200 via-blue-100 to-cyan-200 text-slate-800" style={{ fontFamily: 'Phetsarath OT, sans-serif' }}>
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

      {/* Notification Modal - now uses the new handleNotificationClose */}
      <NotificationModal
        isOpen={showNotificationModal}
        onClose={handleNotificationClose} // Use the new handler here
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
        <Breadcrumb paths={[{ name: "ໜ້າຫຼັກ", href: "/admin" }, { name: "ພະແນກ", href: "/department" }, { name: "ເພີ່ມພະແນກ" }]} />

        <div className="p-6 flex-1 overflow-y-auto">
          <div className="bg-white/90 backdrop-blur-lg rounded-xl shadow-xl border border-sky-300/60 p-6">
            <h2 className="text-2xl font-bold text-slate-800 font-saysettha mb-6">ເພີ່ມພະແນກ</h2>
            <div className="space-y-6">
              <div>
                {/* <label htmlFor="Department_Name" className="block text-lg font-medium text-gray-700 mb-2">ຊື່ພະແນກ</label> */}
                <input
                  type="text"
                  id="Department_Name"
                  name="Department_Name"
                  value={newDepartment.Department_Name}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                  placeholder="ປ້ອນຊື່ພະແນກ"
                  required
                />
              </div>
              <div>
                {/* <label htmlFor="Email" className="block text-lg font-medium text-gray-700 mb-2">ອີເມວ</label> */}
                <input
                  type="email"
                  id="Email"
                  name="Email"
                  value={newDepartment.Email}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                  placeholder="ປ້ອນອີເມວ"
                  required
                />
              </div>
              <div>
                {/* <label htmlFor="Phone" className="block text-lg font-medium text-gray-700 mb-2 ">ເບີໂທ</label> */}
                <input
                  type="text"
                  id="Phone"
                  name="Phone"
                  value={newDepartment.Phone}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                  placeholder="ປ້ອນເບີໂທ"
                  required
                />
              </div>
              <div>
                {/* <label htmlFor="Address" className="block text-lg font-medium text-gray-700 mb-2">ລາຍລະອຽດ</label> */}
                <textarea
                  id="Address"
                  name="Address"
                  value={newDepartment.Address}
                  onChange={handleChange}
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                  placeholder="ທີ່ຢູ່"
                  required
                ></textarea>
              </div>

              <div className="flex space-x-4 mt-6">
                <button
                  type="button"
                  onClick={handleAddDepartment}
                  className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors duration-200 shadow-md font-medium text-lg"
                >
                  ບັນທຶກ
                </button>
                <button
                  type="button"
                  onClick={() => router.push('/department')}
                  className="flex-1 bg-gray-300 text-slate-700 px-6 py-3 rounded-xl hover:bg-gray-400 transition-colors duration-200 shadow-md font-medium text-lg"
                >
                  ຍົກເລີກ
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}