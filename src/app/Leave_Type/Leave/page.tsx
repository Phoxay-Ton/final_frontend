// src/app/leave_type/leave/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useState, useCallback, useEffect } from "react";
import Link from 'next/link';
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

// Import reusable components
import Modal from "@/src/components/Modal"; // Assuming Modal is in components
import NotificationModal from "@/src/components/NotificationModal"; // Assuming NotificationModal is in components
import Sidebar from "@/src/components/Sidebar"; // Assuming Sidebar is in components
import Header from "@/src/components/Header"; // Assuming Header is in components
import Breadcrumb from "@/src/components/Breadcrumb"; // Assuming Breadcrumb is in components

// Import Leave-specific components and types
import LeaveEditModal from "@/src/components/LeaveEditModal"; // You'll create this component
import { Leave } from "@/src/types/leave";
import { useLeave } from "@/src/hooks/useLeave";

// Import fontLoader utility (assuming it's a global utility)
import { fontLoader } from "@/src/utils/fontLoader";


export default function LeaveRequestPage() {
    const router = useRouter();
    const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentLeave, setCurrentLeave] = useState<Leave | null>(null);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    // State for Notification Modal
    const [showNotificationModal, setShowNotificationModal] = useState(false);
    const [notificationTitle, setNotificationTitle] = useState("");
    const [notificationMessage, setNotificationMessage] = useState("");

    // State for Delete Confirmation Modal
    const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
    const [leaveToDeleteId, setLeaveToDeleteId] = useState<number | null>(null);

    // Function to show notification modal, memoized with useCallback
    const showNotification = useCallback((title: string, message: string) => {
        setNotificationTitle(title);
        setNotificationMessage(message);
        setShowNotificationModal(true);
    }, []);

    // Use the custom hook for leave data and operations
    // Note: employees and leaveTypes are exposed from the hook but not used directly in this page's table
    // They would typically be used in the LeaveEditModal or a LeaveAddModal
    const { leaves, employees, leaveTypes, loading, error, updateLeave, deleteLeave } = useLeave(showNotification);

    // Handle Logout
    const handleSignOut = () => {
        setIsSignOutModalOpen(true);
    };

    const confirmSignOut = () => {
        setIsSignOutModalOpen(false);
        localStorage.removeItem("token");
        router.push("/login");
    };

    // Open Edit Modal with leave data
    const openEditModal = (leave: Leave) => {
        setCurrentLeave(leave);
        setIsEditModalOpen(true);
    };

    // Handle updating leave data
    const handleUpdateLeave = async (updatedLeave: Leave) => {
        const success = await updateLeave(updatedLeave);
        if (success) {
            setIsEditModalOpen(false);
        }
    };

    // Handle opening delete confirmation modal
    const handleDeleteClick = (leaveId: number) => {
        setLeaveToDeleteId(leaveId);
        setShowDeleteConfirmModal(true);
    };

    // Handle deleting leave data after confirmation
    const confirmDeleteLeave = async () => {
        if (leaveToDeleteId === null) return;

        const success = await deleteLeave(leaveToDeleteId);
        if (success) {
            setShowDeleteConfirmModal(false);
        }
        setLeaveToDeleteId(null); // Clear the ID after operation
    };

    // Load font and check authentication on component mount
    useEffect(() => {
        fontLoader();

        const token = localStorage.getItem("token");
        if (!token) {
            router.replace("/login");
        }
    }, [router]);

    return (
        <div className="flex h-screen bg-gradient-to-br from-sky-200 via-blue-100 to-cyan-200 text-slate-800" style={{ fontFamily: 'Phetsarath OT, sans-serif' }}>
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
                onConfirm={confirmDeleteLeave}
                title="ຢືນຢັນການລຶບ"
                message="ທ່ານແນ່ໃຈບໍວ່າຕ້ອງການລຶບການລາພັກນີ້? ການກະທຳນີ້ບໍ່ສາມາດຍົກເລີກໄດ້."
                confirmText="ລຶບ"
                cancelText="ຍົກເລີກ"
            />

            {/* Edit Leave Modal */}
            {isEditModalOpen && currentLeave && (
                <LeaveEditModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    initialData={currentLeave}
                    onSave={handleUpdateLeave}
                // You might need to pass employees, leaveTypes, and approvers to the modal
                // For example: employees={employees} leaveTypes={leaveTypes}
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
                <Breadcrumb paths={[{ name: "ໜ້າຫຼັກ", href: "/admin" }, { name: "ຂໍລາພັກ" }]} />

                <div className="p-6 flex-1 overflow-y-auto">
                    <div className="bg-white/90 backdrop-blur-lg rounded-xl shadow-xl border border-sky-300/60 p-6">
                        <div className="flex justify-between items-center bg-sky-100/70 p-4 rounded-lg mb-6 border border-sky-200">
                            <h3 className="text-2xl font-bold text-slate-800 font-saysettha">ຂໍ້ມູນການຂໍລາພັກ</h3>
                            <Link href="/Leave_Type/Leave/add_leave" className="bg-blue-600 text-white px-5 py-2 rounded-lg flex items-center space-x-2 font-saysettha hover:bg-blue-700 transition-all duration-200 shadow-md">
                                <FaPlus className="text-lg" /> <span>ຂໍລາພັກ</span>
                            </Link>
                        </div>

                        {/* Leave Request Table */}
                        <div className="mt-6 max-h-[500px] overflow-y-auto overflow-x-auto rounded-lg shadow-md border border-sky-200 relative">
                            <table className="w-full border-collapse">
                                <thead className="bg-sky-200 text-slate-800 font-saysettha text-lg">
                                    <tr>
                                        <th className="sticky top-0 z-10 p-4 text-left bg-sky-200">ລຳດັບ</th>
                                        {/* <th className="sticky top-0 z-10 p-4 text-left bg-sky-200">ຊື່ພະນັກງານ</th> */}
                                        <th className="sticky top-0 z-10 p-4 text-left bg-sky-200">ປະເພດການພັກ</th>
                                        <th className="sticky top-0 z-10 p-4 text-left bg-sky-200">ວັນເລີ່ມພັກ</th>
                                        <th className="sticky top-0 z-10 p-4 text-left bg-sky-200">ວັນສິ້ນສຸດ</th>
                                        <th className="sticky top-0 z-10 p-4 text-left bg-sky-200">ຈຳນວນມື້ພັກ</th>
                                        <th className="sticky top-0 z-10 p-4 text-left bg-sky-200">ລາຍລະອຽດ</th>
                                        <th className="sticky top-0 z-10 p-4 text-left bg-sky-200">ຜູ້ອະນຸມັດ</th>
                                        <th className="sticky top-0 z-10 p-4 pl-10 text-left bg-sky-200">ສະຖານະ</th>                                        <th className="sticky top-0 z-10 p-4 text-left bg-sky-200">ແກ້ໄຂ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td colSpan={9} className="text-center p-4 text-gray-500 font-saysettha text-md">
                                                ກຳລັງໂຫຼດຂໍ້ມູນ...
                                            </td>
                                        </tr>
                                    ) : error ? (
                                        <tr>
                                            <td colSpan={9} className="text-center p-4 text-red-500 font-saysettha text-md">
                                                Error: {error}
                                            </td>
                                        </tr>
                                    ) : leaves.length > 0 ? (
                                        leaves.map((leave, index) => {
                                            const employee = employees.find(
                                                (emp) => emp.Employee_ID === leave.Employee_ID
                                            );
                                            // const employeeName = employee ? employee.Name : 'N/A';
                                            const leaveType = leaveTypes.find(
                                                (lt) => lt.id === leave.Leave_type_ID
                                            );
                                            const leaveTypeName = leaveType ? leaveType.name : 'N/A';
                                            const approvalPerson = employees.find(
                                                (emp) => emp.Employee_ID === leave.Approval_person
                                            );
                                            const approvalPersonName = approvalPerson ? approvalPerson.Name : 'N/A';
                                            return (
                                                <tr
                                                    key={leave.Leave_ID}
                                                    className="border-t border-sky-200 text-slate-700 hover:bg-sky-50/50 transition-colors"
                                                >
                                                    <td className="p-4 font-times text-lg">{index + 1}</td>
                                                    {/* <td className="p-4">{employeeName}</td> */}
                                                    <td className="p-4">{leaveTypeName}</td>
                                                    <td className="p-4 font-times text-lg">{leave.From_date ? new Date(leave.From_date).toLocaleDateString('lo-LA') : 'N/A'}</td>
                                                    <td className="p-4 font-times text-lg">{leave.To_date ? new Date(leave.To_date).toLocaleDateString('lo-LA') : 'N/A'}</td>
                                                    <td className="p-4 font-times text-lg">{leave.Leave_days}</td>
                                                    <td className="p-4">{leave.Description}</td>
                                                    <td className="p-4">{approvalPersonName}</td>
                                                    <td className="p-4">
                                                        <td className="p-4">
                                                            <span className={`px-3 py-1 rounded-full text-sm font-semibold
                                                        ${leave.Status === 'approved' ? 'bg-green-100 text-green-700' :
                                                                    leave.Status === 'rejected' ? 'bg-red-100 text-red-700' :
                                                                        'bg-yellow-100 text-yellow-700'}`}>
                                                                {leave.Status === "approved" ? "ອະນຸມັດແລ້ວ" :
                                                                    leave.Status === "rejected" ? "ຖືກປະຕິເສດ" : "ລໍຖ້າອະນຸມັດ"}
                                                            </span>
                                                        </td>
                                                        {/* <span className={`px-3 py-1 rounded-full text-sm font-semibold
                              ${leave.Status === 'Approved' ? 'bg-green-100 text-green-700' :
                                                                leave.Status === 'Rejected' ? 'bg-red-100 text-red-700' :
                                                                    'bg-yellow-100 text-yellow-700'}`}>
                                                            {leave.Status || 'Pending'}
                                                        </span> */}
                                                    </td>
                                                    <td className="p-4 flex space-x-3 items-center">
                                                        <FaEdit
                                                            className="text-yellow-500 text-xl cursor-pointer hover:text-yellow-600 transition-colors"
                                                            onClick={() => openEditModal(leave)}
                                                        />
                                                        <FaTrash
                                                            className="text-red-500 text-xl cursor-pointer hover:text-red-600 transition-colors"
                                                            onClick={() => handleDeleteClick(leave.Leave_ID)}
                                                        />
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan={9}
                                                className="text-center p-4 text-gray-500 font-saysettha text-md"
                                            >
                                                ບໍ່ພົບຂໍ້ມູນການລາພັກ
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

