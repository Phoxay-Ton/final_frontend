// src/app/division/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useState, useCallback, useEffect } from "react"; // Added useEffect for fontLoader
import Link from 'next/link';
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

// Import reusable components
import Modal from "@/src/components/Modal";
import NotificationModal from "@/src/components/NotificationModal";
import Sidebar from "@/src/components/Sidebar";
import Header from "@/src/components/Header";
import Breadcrumb from "@/src/components/Breadcrumb";

// Import Division-specific components and types
import DivisionEditModal from "@/src/components/DivisionEditModal";
import { Division } from "@/src/types/division";
import { useDivision } from "@/src/hooks/useDivision";

// Import fontLoader utility with correct path
import { fontLoader } from "@/src/utils/fontLoader"; // Corrected import path


export default function DivisionPage() {
  const router = useRouter();
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentDivision, setCurrentDivision] = useState<Division | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // State for Notification Modal
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [notificationTitle, setNotificationTitle] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");

  // State for Delete Confirmation Modal
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [divisionToDeleteId, setDivisionToDeleteId] = useState<number | null>(null);

  // Function to show notification modal, memoized with useCallback
  const showNotification = useCallback((title: string, message: string) => {
    setNotificationTitle(title);
    setNotificationMessage(message);
    setShowNotificationModal(true);
  }, []); // Dependencies are the state setters, which are stable

  // Use the custom hook for division data and operations
  const { divisions, departments, loading, error, updateDivision, deleteDivision } = useDivision(showNotification);

  // Handle Logout
  const handleSignOut = () => {
    setIsSignOutModalOpen(true);
  };

  const confirmSignOut = () => {
    setIsSignOutModalOpen(false);
    localStorage.removeItem("token");
    router.push("/login");
  };

  // Open Edit Modal with division data
  const openEditModal = (division: Division) => {
    setCurrentDivision(division);
    setIsEditModalOpen(true);
  };

  // Handle updating division data
  const handleUpdateDivision = async (updatedDivision: Division) => {
    const success = await updateDivision(updatedDivision);
    if (success) {
      setIsEditModalOpen(false);
    }
  };

  // Handle opening delete confirmation modal
  const handleDeleteClick = (divisionId: number) => {
    setDivisionToDeleteId(divisionId);
    setShowDeleteConfirmModal(true);
  };

  // Handle deleting division data after confirmation
  const confirmDeleteDivision = async () => {
    if (divisionToDeleteId === null) return;

    const success = await deleteDivision(divisionToDeleteId);
    if (success) {
      setShowDeleteConfirmModal(false);
    }
    setDivisionToDeleteId(null); // Clear the ID after operation
  };

  // Load font on component mount
  useEffect(() => {
    fontLoader();

    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
    }
  }, [router]);

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

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteConfirmModal}
        onClose={() => setShowDeleteConfirmModal(false)}
        onConfirm={confirmDeleteDivision}
        title="ຢືນຢັນການລຶບ"
        message="ທ່ານແນ່ໃຈບໍວ່າຕ້ອງການລຶບຂະແໜງນີ້? ການກະທຳນີ້ບໍ່ສາມາດຍົກເລີກໄດ້."
        confirmText="ລຶບ"
        cancelText="ຍົກເລີກ"
      />

      {/* Edit Division Modal */}
      {isEditModalOpen && currentDivision && (
        <DivisionEditModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          initialData={currentDivision}
          onSave={handleUpdateDivision}
          departments={departments} // Pass departments from hook
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
        <Breadcrumb paths={[{ name: "ໜ້າຫຼັກ", href: "/admin" }, { name: "ຂະແໜງ" }]} />

        <div className="p-6 flex-1 overflow-y-auto">
          <div className="bg-white/90 backdrop-blur-lg rounded-xl shadow-xl border border-sky-300/60 p-6">
            <div className="flex justify-between items-center bg-sky-100/70 p-4 rounded-lg mb-6 border border-sky-200">
              <h3 className="text-2xl font-bold text-slate-800 font-saysettha">ຂະແໜງ</h3>
              <Link href="/Division/add_division" className="bg-blue-600 text-white px-5 py-2 rounded-lg flex items-center space-x-2 font-saysettha hover:bg-blue-700 transition-all duration-200 shadow-md">
                <FaPlus className="text-lg" /> <span>ເພີ່ມຂະແໜງ</span>
              </Link>
            </div>

            {/* Division Table */}
            <div className="mt-6 max-h-[400px] overflow-y-auto overflow-x-auto rounded-lg shadow-md border border-sky-200 relative">
              <table className="w-full border-collapse">
                <thead className="bg-sky-200 text-slate-800 font-saysettha text-lg">
                  <tr>
                    <th className="sticky top-0 z-10 p-4 text-left bg-sky-200">ລຳດັບ</th>
                    <th className="sticky top-0 z-10 p-4 text-left bg-sky-200">ຊື່ຂະແໜງ</th>
                    <th className="sticky top-0 z-10 p-4 text-left bg-sky-200">ອີເມວ</th>
                    <th className="sticky top-0 z-10 p-4 text-left bg-sky-200">ເບີໂທ</th>
                    <th className="sticky top-0 z-10 p-4 text-left bg-sky-200">ພະແນກ</th>
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
                  ) : divisions.length > 0 ? (
                    divisions.map((division, index) => {
                      const department = departments.find(
                        (dep) => dep.Department_ID === division.Department_ID
                      );
                      return (
                        <tr
                          key={division.Division_ID}
                          className="border-t border-sky-200 text-slate-700 hover:bg-sky-50/50 transition-colors"
                        >
                          <td className="p-4 font-times text-lg">{index + 1}</td>
                          <td className="p-4">{division.Division_Name}</td>
                          <td className="p-4 font-times text-lg">{division.Email}</td>
                          <td className="p-4 font-times text-lg">{division.Phone}</td>
                          <td className="p-4">{division.department?.Department_Name}</td>
                          {/* <td className="p-4">
                            {department ? department.department?.Department_Name : "ບໍ່ພົບພະແນກ"}
                          </td> */}
                          <td className="p-4 flex space-x-3 items-center">
                            <FaEdit
                              className="text-yellow-500 text-xl cursor-pointer hover:text-yellow-600 transition-colors"
                              onClick={() => openEditModal(division)}
                            />
                            <FaTrash
                              className="text-red-500 text-xl cursor-pointer hover:text-red-600 transition-colors"
                              onClick={() => handleDeleteClick(division.Division_ID)} // Use handleDeleteClick for confirmation modal
                            />
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan={5} // Adjusted colspan to 5
                        className="text-center p-4 text-gray-500 font-saysettha text-md"
                      >
                        ບໍ່ພົບຂໍ້ມູນຂະແໜງ
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {/* Footer */}
            {/* <Link href="/admin" className="mt-auto">
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
