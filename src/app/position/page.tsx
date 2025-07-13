// src/app/position/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from "react";
import Link from 'next/link';
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

// Import components
import Modal from "@/src/components/Modal";
import NotificationModal from "@/src/components/NotificationModal";
import PositionEditModal from "@/src/components/PositionEditModal";
import Sidebar from "@/src/components/Sidebar";
import Header from "@/src/components/Header";
import Breadcrumb from "@/src/components/Breadcrumb";
import { fontLoader } from "@/src/utils/fontLoader";

// Import types and hooks
import { Position } from "@/src/types/position";
import { usePosition } from "@/src/hooks/usePosition";

export default function PositionPage() {
  const router = useRouter();
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentPosition, setCurrentPosition] = useState<Position | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // State for Notification Modal
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [notificationTitle, setNotificationTitle] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");

  // State for Delete Confirmation Modal
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [positionToDeleteId, setPositionToDeleteId] = useState<number | null>(null);

  // Load font on component mount
  useEffect(() => {
    fontLoader();
  }, []);

  // Function to show notification modal
  const showNotification = (title: string, message: string) => {
    setNotificationTitle(title);
    setNotificationMessage(message);
    setShowNotificationModal(true);
  };

  // Use the custom hook for position data and operations
  const { positions, loading, error, fetchPositions, updatePosition, deletePosition } = usePosition(showNotification);

  // Handle Logout
  const handleSignOut = () => {
    setIsSignOutModalOpen(true);
  };

  const confirmSignOut = () => {
    setIsSignOutModalOpen(false);
    localStorage.removeItem("token");
    router.push("/login");
  };

  // Open Edit Modal with position data
  const openEditModal = (position: Position) => {
    setCurrentPosition(position);
    setIsEditModalOpen(true);
  };

  // Handle updating position data
  const handleUpdatePosition = async (updatedPosition: Position) => {
    const success = await updatePosition(updatedPosition);
    if (success) {
      setIsEditModalOpen(false);
    }
  };

  // Handle opening delete confirmation modal
  const handleDeleteClick = (positionId: number) => {
    setPositionToDeleteId(positionId);
    setShowDeleteConfirmModal(true);
  };

  // Handle deleting position data after confirmation
  const confirmDeletePosition = async () => {
    if (positionToDeleteId === null) return;

    const success = await deletePosition(positionToDeleteId);
    if (success) {
      setShowDeleteConfirmModal(false);
    }
    setPositionToDeleteId(null); // Clear the ID after operation
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

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteConfirmModal}
        onClose={() => setShowDeleteConfirmModal(false)}
        onConfirm={confirmDeletePosition}
        title="ຢືນຢັນການລຶບ"
        message="ທ່ານແນ່ໃຈບໍວ່າຕ້ອງການລຶບຕຳແໜ່ງນີ້? ການກະທຳນີ້ບໍ່ສາມາດຍົກເລີກໄດ້."
        confirmText="ລຶບ"
        cancelText="ຍົກເລີກ"
      />

      {/* Edit Position Modal */}
      {isEditModalOpen && currentPosition && (
        <PositionEditModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          initialData={currentPosition}
          onSave={handleUpdatePosition}
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
        <Breadcrumb paths={[{ name: "ໜ້າຫຼັກ", href: "/admin" }, { name: "ຕຳແໜ່ງ" }]} />

        <div className="p-6 flex-1 overflow-y-auto">
          <div className="bg-white/90 backdrop-blur-lg rounded-xl shadow-xl border border-sky-300/60 p-6">
            <div className="flex justify-between items-center bg-sky-100/70 p-4 rounded-lg mb-6 border border-sky-200">
              <h3 className="text-2xl font-bold text-slate-800 font-saysettha">ຕຳແໜ່ງ</h3>
              <Link href="/position/add_position" className="bg-blue-600 text-white px-5 py-2 rounded-lg flex items-center space-x-2 font-saysettha hover:bg-blue-700 transition-all duration-200 shadow-md">
                <FaPlus className="text-lg" /> <span>ເພີ່ມຕຳແໜ່ງ</span>
              </Link>
            </div>

            {/* Position Table */}
            <div className="mt-6 max-h-[400px] overflow-y-auto overflow-x-auto rounded-lg shadow-md border border-sky-200 relative">
              <table className="w-full border-collapse">
                <thead className="bg-sky-200 text-slate-800 font-saysettha text-lg">
                  <tr>
                    <th className="sticky top-0 z-10 p-4 text-left bg-sky-200">ລຳດັບ</th>
                    <th className="sticky top-0 z-10 p-4 text-left bg-sky-200">ຊື່ຕຳແໜ່ງ</th>
                    <th className="sticky top-0 z-10 p-4 text-left bg-sky-200">ລຶບຕຳແໜ່ງ</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={2} className="text-center p-4 text-gray-500 font-saysettha text-md">
                        ກຳລັງໂຫຼດຂໍ້ມູນ...
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan={2} className="text-center p-4 text-red-500 font-saysettha text-md">
                        Error: {error}
                      </td>
                    </tr>
                  ) : positions.length > 0 ? (
                    positions.map((position, index) => (
                      <tr key={position.Position_ID} className="border-t border-sky-200 text-slate-700 hover:bg-sky-50/50 transition-colors">
                        <td className="p-4">{index + 1}</td>
                        <td className="p-4">{position.Position_Name}</td>
                        <td className="p-4 flex space-x-3 items-center">
                          {/* <FaEdit className="text-yellow-500 text-xl cursor-pointer hover:text-yellow-600 transition-colors" onClick={() => openEditModal(position)} /> */}
                          <FaTrash className="text-red-500 text-xl cursor-pointer hover:text-red-600 transition-colors" onClick={() => handleDeleteClick(position.Position_ID)} />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={2} className="text-center p-4 text-gray-500 font-saysettha text-md">
                        ບໍ່ພົບຂໍ້ມູນຕຳແໜ່ງ
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