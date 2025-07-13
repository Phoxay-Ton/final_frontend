// src/app/employee/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect, useCallback } from "react";
import Link from 'next/link';
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

// Import reusable components
import Modal from "@/src/components/Modal";
import NotificationModal from "@/src/components/NotificationModal";
import EmployeeEditModal from "@/src/components/EmployeeEditModal";
import Sidebar from "@/src/components/Sidebar";
import Header from "@/src/components/Header";
import Breadcrumb from "@/src/components/Breadcrumb";

// Import fontLoader utility
import { fontLoader } from "@/src/utils/fontLoader";

// Import Employee-specific types and hook
import { Employee } from "@/src/types/employee";
import { useEmployee } from "@/src/hooks/useEmployeeData";

export default function EmployeePage() {
  const router = useRouter();

  // Consolidated Notification state: use a single object for title and message
  const [notification, setNotification] = useState<{ title: string; message: string } | null>(null);

  // Memoize showNotification to prevent it from changing on every render.
  // This is crucial for the `useEmployee` hook's dependency array.
  const showNotification = useCallback((title: string, message: string) => {
    setNotification({ title, message });
    // Automatically hide the notification after 3 seconds
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  }, []); // Empty dependency array ensures this function reference is stable

  // Function to clear notification immediately (e.g., when clicking "X" on modal)
  const clearNotification = () => {
    setNotification(null);
  };

  // Use the custom hook for employee data and operations, passing the stable showNotification
  const {
    employees,
    departments,
    divisions,
    positions,
    loading,
    error,
    updateEmployee,
    deleteEmployee,
  } = useEmployee(showNotification); // `showNotification` is now stable

  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [employeeToDeleteId, setEmployeeToDeleteId] = useState<number | null>(null);

  // Load custom font on component mount
  useEffect(() => {
    fontLoader();
  }, [employees]);

  // --- Modal and Action Handlers ---

  const handleSignOut = () => {
    setIsSignOutModalOpen(true);
  };

  const confirmSignOut = () => {
    setIsSignOutModalOpen(false);
    localStorage.removeItem("token");
    router.push("/login");
  };

  const openEditModal = (employee: Employee) => {
    setCurrentEmployee(employee);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setCurrentEmployee(null);
  };

  const handleUpdateEmployee = async (updatedEmployee: Employee) => {
    // The `updateEmployee` function from the hook will handle showing notifications
    const success = await updateEmployee(updatedEmployee);
    if (success) {
      setIsEditModalOpen(false);
      setCurrentEmployee(null);
    }
  };

  const handleDeleteClick = (employeeId: number) => {
    setEmployeeToDeleteId(employeeId);
    setShowDeleteConfirmModal(true);
  };

  const confirmDeleteEmployee = async () => {
    if (employeeToDeleteId === null) return;
    // The `deleteEmployee` function from the hook will handle showing notifications
    const success = await deleteEmployee(employeeToDeleteId);
    if (success) {
      setShowDeleteConfirmModal(false);
    }
    setEmployeeToDeleteId(null); // Clear the ID after operation
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-sky-200 via-blue-100 to-cyan-200 text-slate-800 overflow-hidden" style={{ fontFamily: 'Phetsarath OT, sans-serif' }}>
      {/* Notification Modal: Render only if 'notification' state has data */}
      {notification && (
        <NotificationModal
          isOpen={!!notification} // Will be true if notification is not null
          onClose={clearNotification} // Allows manual closing
          title={notification.title}
          message={notification.message}
        />
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

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteConfirmModal}
        onClose={() => setShowDeleteConfirmModal(false)}
        onConfirm={confirmDeleteEmployee}
        title="ຢືນຢັນການລຶບ"
        message="ທ່ານແນ່ໃຈບໍວ່າຕ້ອງການລຶບພະນັກງານນີ້? ການກະທຳນີ້ບໍ່ສາມາດຍົກເລີກໄດ້."
        confirmText="ລຶບ"
        cancelText="ຍົກເລີກ"
      />

      {/* Employee Edit Modal */}
      {isEditModalOpen && currentEmployee && (
        <EmployeeEditModal
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          initialData={currentEmployee}
          onSave={handleUpdateEmployee}
          departments={departments}
          divisions={divisions}
          positions={positions}
        />
      )}

      {/* Sidebar and Header */}
      <Sidebar isCollapsed={isSidebarCollapsed} onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onSignOut={handleSignOut} />
        <Breadcrumb paths={[{ name: "ໜ້າຫຼັກ", href: "/admin" }, { name: "ພະນັກງານ" }]} />

        <div className="p-6 flex-1 overflow-y-auto">
          <div className="bg-white/90 backdrop-blur-lg rounded-xl shadow-xl border border-sky-300/60 p-6">
            <div className="flex justify-between items-center bg-sky-100/70 p-4 rounded-lg mb-6 border border-sky-200">
              <h3 className="text-2xl font-bold text-slate-800 font-saysettha">ພະນັກງານ</h3>
              <Link href="/employee/add_employee" className="bg-blue-600 text-white px-5 py-2 rounded-lg flex items-center space-x-2 font-saysettha hover:bg-blue-700 transition-all duration-200 shadow-md">
                <FaPlus className="text-lg" /> <span>ເພີ່ມພະນັກງານ</span>
              </Link>
            </div>

            {/* Employee Table */}
            <div className="mt-6 max-h-[500px] overflow-y-auto overflow-x-auto rounded-lg shadow-md border border-sky-200 relative">
              <table className="w-full border-collapse">
                <thead className="bg-sky-200 text-slate-800 font-saysettha text-lg">
                  <tr>
                    <th className="sticky top-0 z-10 p-4 text-left bg-sky-200">ລຳດັບ</th>
                    <th className="sticky top-0 z-10 p-4 text-left bg-sky-200">ຊື່ພະນັກງານ</th>
                    <th className="sticky top-0 z-10 p-4 text-left bg-sky-200">ອີເມວ</th>
                    <th className="sticky top-0 z-10 p-4 text-left bg-sky-200">ເບີໂທ</th>
                    <th className="sticky top-0 z-10 p-4 text-left bg-sky-200">ຊື່ຜູ້ໃຊ້</th>
                    <th className="sticky top-0 z-10 p-4 text-left bg-sky-200">ສິດທິ</th>
                    <th className="sticky top-0 z-10 p-4 text-left bg-sky-200">ພະແນກ</th>
                    <th className="sticky top-0 z-10 p-4 text-left bg-sky-200">ຂະແໜງ</th>
                    <th className="sticky top-0 z-10 p-4 text-left bg-sky-200">ຕຳແໝ່ງ</th>
                    <th className="sticky top-0 z-10 p-4 text-left bg-sky-200">ແກ້ໄຂ</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={10} className="text-center p-4 text-gray-500 font-saysettha text-md">
                        ກຳລັງໂຫຼດຂໍ້ມູນ...
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan={10} className="text-center p-4 text-red-500 font-saysettha text-md">
                        Error: {error}
                      </td>
                    </tr>
                  ) : Array.isArray(employees) && employees.length > 0 ? (
                    employees.map((employee, index) => {
                      const employeeDepartmentId = Number(employee.Department_ID);
                      const employeeDivisionId = Number(employee.Division_ID);
                      const employeePositionId = Number(employee.Position_ID);

                      const divisionName =
                        divisions.find(div => Number(div.Division_ID) === employeeDivisionId)?.Division_Name || "ບໍ່ພົບຂະແໜງ";
                      const positionName =
                        positions.find(pos => Number(pos.Position_ID) === employeePositionId)?.Position_Name || "ບໍ່ພົບຕຳແໝ່ງ";

                      return (
                        <tr key={employee.Employee_ID} className="even:bg-white odd:bg-sky-50 font-saysettha text-md">
                          <td className="p-4 font-times text-lg">{index + 1}</td>
                          <td className="p-4">{employee.Name}</td>
                          <td className="p-4" style={{ fontFamily: "Times New Roman, serif" }}>
                            {employee.Email}
                          </td>
                          <td className="p-4 font-times text-lg">{employee.Phone}</td>
                          <td className="p-4 font-times text-lg">{employee.Username}</td>
                          <td className="p-4 font-times text-lg">{employee.Role}</td>
                          <td className="p-4">{employee.department?.Department_Name || "ບໍ່ພົບພະແນກ"}</td>
                          <td className="p-4">{divisionName}</td>
                          <td className="p-4">{positionName}</td>
                          <td className="p-4 flex items-center space-x-2">
                            <button
                              onClick={() => openEditModal(employee)}
                              className="text-yellow-500 text-xl cursor-pointer hover:text-yellow-600 transition-colors"
                              title="ແກ້ໄຂ"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(employee.Employee_ID)}
                              className="text-red-600 hover:text-red-700 transition-colors"
                              title="ລຶບ"
                            >
                              <FaTrash />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={10} className="text-center p-4 text-gray-500 font-saysettha text-md">
                        ບໍ່ມີຂໍ້ມູນພະນັກງານ
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