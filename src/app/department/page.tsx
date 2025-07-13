// src/app/department/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useState, useCallback, useEffect } from "react"; // Added useEffect for fontLoader
import Link from 'next/link';
import Image from "next/image";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

// Import reusable components
import Modal from "@/src/components/Modal";
import NotificationModal from "@/src/components/NotificationModal";
import DepartmentEditModal from "@/src/components/DepartmentEditModal";
import Header from "@/src/components/Header";
import Sidebar from "@/src/components/Sidebar";
import Breadcrumb from "@/src/components/Breadcrumb";

// Import types and hook
import { Department } from "@/src/types/department";
import { useDepartment } from "@/src/hooks/useDepartment";

// Import fontLoader utility with correct path
import { fontLoader } from "@/src/utils/fontLoader"; // Corrected import path

// Import image directly (assuming it's in public or similar)
// Note: If Header/Sidebar also import this, consider moving it to a shared asset location
import Img from "/public/img/login.jpeg";


export default function DepartmentPage() {
  const router = useRouter();
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentDepartment, setCurrentDepartment] = useState<Department | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false); // State for sidebar collapse

  // Notification Modal States
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [notificationTitle, setNotificationTitle] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");

  // Delete Confirmation Modal States
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [departmentToDeleteId, setDepartmentToDeleteId] = useState<number | null>(null);

  // Function to show notification modal, now memoized with useCallback
  const showNotification = useCallback((title: string, message: string) => {
    setNotificationTitle(title);
    setNotificationMessage(message);
    setShowNotificationModal(true);
  }, [setNotificationTitle, setNotificationMessage, setShowNotificationModal]); // Dependencies are the state setters

  // Use the custom hook for department data and operations
  const { departments, loading, error, updateDepartment, deleteDepartment } = useDepartment(showNotification);

  // Handle Logout
  const handleSignOut = () => {
    setIsSignOutModalOpen(true);
  };

  const confirmSignOut = () => {
    setIsSignOutModalOpen(false);
    localStorage.removeItem("token");
    router.push("/login");
  };

  // Open Edit Modal with department data
  const openEditModal = (department: Department) => {
    setCurrentDepartment(department);
    setIsEditModalOpen(true);
  };

  // Handle updating department data
  const handleUpdateDepartment = async (updatedDepartment: Department) => {
    const success = await updateDepartment(updatedDepartment);
    if (success) {
      setIsEditModalOpen(false);
    }
  };

  // Handle opening delete confirmation modal
  const handleDeleteClick = (departmentId: number) => {
    setDepartmentToDeleteId(departmentId);
    setShowDeleteConfirmModal(true);
  };

  // Handle deleting department data after confirmation
  const confirmDeleteDepartment = async () => {
    if (departmentToDeleteId === null) return;

    const success = await deleteDepartment(departmentToDeleteId);
    if (success) {
      setShowDeleteConfirmModal(false);
    }
    setDepartmentToDeleteId(null); // Clear the ID after operation
  };

  // Load font on component mount 
  // ກຳນົດພາດທີ່ບໍ່ໄດ້ login
  useEffect(() => {
    fontLoader();

    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
    }
  }, [router]);

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
      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteConfirmModal}
        onClose={() => setShowDeleteConfirmModal(false)}
        onConfirm={confirmDeleteDepartment}
        title="ຢືນຢັນການລຶບ"
        message="ທ່ານແນ່ໃຈບໍວ່າຕ້ອງການລຶບພະແນກນີ້? ການກະທຳນີ້ບໍ່ສາມາດຍົກເລີກໄດ້."
        confirmText="ລຶບ"
        cancelText="ຍົກເລີກ"
      />

      {/* Edit Department Modal */}
      {isEditModalOpen && currentDepartment && (
        <DepartmentEditModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          initialData={currentDepartment}
          onSave={handleUpdateDepartment}
        />
      )}

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
        <Breadcrumb paths={[{ name: "ໜ້າຫຼັກ", href: "/admin" }, { name: "ພະແນກ" }]} />

        <div className="p-6 flex-1 overflow-y-auto">
          <div className="bg-white/90 backdrop-blur-lg rounded-xl shadow-xl border border-sky-300/60 p-6">
            <div className="flex justify-between items-center bg-sky-100/70 p-4 rounded-lg mb-6 border border-sky-200">
              <h3 className="text-2xl font-bold text-slate-800 font-saysettha">ພະແນກ</h3>
              <Link href="/department/add_deparment" className="bg-blue-600 text-white px-5 py-2 rounded-lg flex items-center space-x-2 font-saysettha hover:bg-blue-700 transition-all duration-200 shadow-md">
                <FaPlus className="text-lg" /> <span>ເພີ່ມພະແນກ</span>
              </Link>
            </div>

            {/* Department Table */}
            <div className="mt-6 max-h-[400px] overflow-y-auto overflow-x-auto rounded-lg shadow-md border border-sky-200 relative">
              <table className="w-full border-collapse">
                <thead className="bg-sky-200 text-slate-800 font-saysettha text-lg">
                  <tr>
                    <th className="sticky top-0 z-10 p-4 text-left bg-sky-200 w-[80px]">ລຳດັບ</th>
                    <th className="sticky top-0 z-10 p-4 text-left bg-sky-200">ຊື່ພະແນກ</th>
                    <th className="sticky top-0 z-10 p-4 text-left bg-sky-200">ອີເມວ</th>
                    <th className="sticky top-0 z-10 p-4 text-left bg-sky-200">ເບີໂທ</th>
                    <th className="sticky top-0 z-10 p-4 text-left bg-sky-200">ທີ່ຢູ່</th>
                    <th className="sticky top-0 z-10 p-4 text-left bg-sky-200">ແກ້ໄຂ</th>
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
                  ) : departments.length > 0 ? (
                    departments.map((department, index) => (
                      <tr key={department.Department_ID} className="border-t border-sky-200 text-slate-700 hover:bg-sky-50/50 transition-colors">
                        <td className="p-4">{index + 1}</td>
                        <td className="p-4 font-saysettha text-lg ">{department.Department_Name}</td>
                        <td className="p-4 font-times text-lg">{department.Email}</td>
                        <td className="p-4 font-times text-lg ">{department.Phone}</td>
                        <td className="p-4 font-saysettha text-lg">{department.Address}</td>
                        <td className="p-4 flex space-x-3 items-center">
                          <FaEdit className="text-yellow-500 text-xl cursor-pointer hover:text-yellow-600 transition-colors" onClick={() => openEditModal(department)} />
                          <FaTrash className="text-red-500 text-xl cursor-pointer hover:text-red-600 transition-colors" onClick={() => handleDeleteClick(department.Department_ID)} />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="text-center p-4 text-gray-500 font-saysettha text-md">
                        ບໍ່ພົບຂໍ້ມູນພະແນກ
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
