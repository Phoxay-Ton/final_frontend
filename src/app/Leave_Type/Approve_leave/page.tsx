'use client';

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from 'next/link';
import { FaArrowLeft } from "react-icons/fa";

// Import reusable components
import Sidebar from "@/src/components/Sidebar";
import Header from "@/src/components/Header"; // Assuming Header is in components
import Breadcrumb from "@/src/components/Breadcrumb";
import ApprovalForm from "@/src/components/ApprovalForm";
import Modal from "@/src/components/Modal";
import NotificationModal from "@/src/components/NotificationModal";

// Import Leave-specific components and types
import { useLeaveApprovals } from "@/src/hooks/useLeaveApprovals";
import { LeaveApproval, UpdateLeaveApprovalPayload } from "@/src/types/leave";

// Import fontLoader utility (assuming it's a global utility)
import { fontLoader } from "@/src/utils/fontLoader";

export default function LeaveApprovalPage() {
    const router = useRouter();
    const [currentEmployeeId, setCurrentEmployeeId] = useState<number | null>(null);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [notificationTitle, setNotificationTitle] = useState("");
    const [notificationMessage, setNotificationMessage] = useState("");
    const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
    const [confirmationTitle, setConfirmationTitle] = useState("");
    const [confirmationMessage, setConfirmationMessage] = useState("");
    const [confirmAction, setConfirmAction] = useState<(() => void) | null>(null);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [leaveToActOn, setLeaveToActOn] = useState<LeaveApproval | null>(null);
    const [actionType, setActionType] = useState<"approve" | "reject" | null>(null);

    // Function to show notification modal, memoized with useCallback
    const showNotification = useCallback((title: string, message: string) => {
        setNotificationTitle(title);
        setNotificationMessage(message);
        setIsNotificationOpen(true);
    }, []);

    // Use the custom hook for leave approval data and operations
    const {
        pendingApprovals,
        loadingApprovals,
        errorApprovals,
        fetchPendingApprovals,
        handleApproveReject,
        employees,
        leaveTypes,
        loadingData,
        errorData,
    } = useLeaveApprovals(showNotification);

    // Load font and check authentication on component mount
    useEffect(() => {
        fontLoader();

        const userString = localStorage.getItem("user");
        if (userString) {
            try {
                const user = JSON.parse(userString);
                // ✅ ตรวจสอบว่า user เป็น Admin หรือ Super_Admin
                console.log("Current user:", user); // Debug log

                // ใช้ user.id หรือ user.employee_id ตามโครงสร้างข้อมูลจริง
                const employeeId = user.employee_id || user.id;
                setCurrentEmployeeId(employeeId);

                console.log("Employee ID set to:", employeeId); // Debug log
            } catch (e) {
                console.error("Failed to parse user data from localStorage:", e);
                localStorage.removeItem("user");
                localStorage.removeItem("token");
                router.push("/login");
            }
        } else {
            router.push("/login");
        }
    }, [router]);

    // Fetch pending approvals when currentEmployeeId changes
    useEffect(() => {
        const token = localStorage.getItem("token");

        if (currentEmployeeId !== null && token) {
            fetchPendingApprovals(currentEmployeeId);
        } else if (!token) {
            showNotification("ຜິດພາດ", "ບໍ່ພົບ Token ກະລຸນາເຂົ້າລະບົບໃໝ່.");
            router.push("/login");
        }
    }, [currentEmployeeId, fetchPendingApprovals, router, showNotification]);


    // Handle opening confirmation modal for approve/reject actions
    const handleActionClick = (payload: UpdateLeaveApprovalPayload, type: "approve" | "reject") => {
        const leave = pendingApprovals.find(app => app.Leave_ID === payload.leave_id);
        if (leave) {
            setLeaveToActOn(leave);
            setActionType(type);
            const title = type === "approve" ? "ຢືນຢັນການອະນຸມັດ" : "ຢືນຢັນການປະຕິເສດ";
            const message = type === "approve"
                ? `ທ່ານຕ້ອງການອະນຸມັດການລາພັກຂອງ ${leave.employee.Name} ປະເພດ ${leave.leave_type.name} ນີ້ບໍ?`
                : `ທ່ານຕ້ອງການປະຕິເສດການລາພັກຂອງ ${leave.employee.Name} ປະເພດ ${leave.leave_type.name} ນີ້ບໍ? ການກະທຳນີ້ບໍ່ສາມາດຍົກເລີກໄດ້.`;

            setConfirmationTitle(title);
            setConfirmationMessage(message);
            setConfirmAction(() => async () => {
                const success = await handleApproveReject(payload);
                if (success) {
                    setIsConfirmationModalOpen(false);
                    setLeaveToActOn(null);
                    setActionType(null);
                    // Re-fetch pending approvals after successful action
                    fetchPendingApprovals(currentEmployeeId!);
                }
            });
            setIsConfirmationModalOpen(true);
        }
    };

    const handleApproveClick = (payload: UpdateLeaveApprovalPayload) => handleActionClick(payload, "approve");
    const handleRejectClick = (payload: UpdateLeaveApprovalPayload) => handleActionClick(payload, "reject");

    // Handle Logout
    const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);
    const handleSignOut = () => {
        setIsSignOutModalOpen(true);
    };

    const confirmSignOut = () => {
        setIsSignOutModalOpen(false);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
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
                isOpen={isNotificationOpen}
                onClose={() => setIsNotificationOpen(false)}
                title={notificationTitle}
                message={notificationMessage}
            />

            {/* Confirmation Modal for Approve/Reject */}
            <Modal
                isOpen={isConfirmationModalOpen}
                onClose={() => {
                    setIsConfirmationModalOpen(false);
                    setLeaveToActOn(null);
                    setActionType(null);
                }}
                onConfirm={() => {
                    if (confirmAction) confirmAction();
                }}
                title={confirmationTitle}
                message={confirmationMessage}
                confirmText="ຢືນຢັນ"
                cancelText="ຍົກເລີກ"
            />

            {/* Sidebar */}
            <Sidebar isCollapsed={isSidebarCollapsed} onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <Header onSignOut={handleSignOut} />

                {/* Breadcrumb */}
                <Breadcrumb paths={[{ name: "ໜ້າຫຼັກ", href: "/admin" }, { name: "ອະນຸມັດການລາພັກ" }]} />

                <div className="p-6 flex-1 overflow-y-auto">
                    <div className="bg-white/90 backdrop-blur-lg rounded-xl shadow-xl border border-sky-300/60 p-6">
                        <div className="flex justify-between items-center bg-sky-100/70 p-4 rounded-lg mb-6 border border-sky-200">
                            <h3 className="text-2xl font-bold text-slate-800 font-saysettha">ລາຍການລໍຖ້າການອະນຸມັດ</h3>
                            <Link href="/admin" className="flex items-center text-blue-600 hover:text-blue-800 transition-colors font-saysettha text-lg">
                                <FaArrowLeft className="mr-2" /> ກັບຄືນໜ້າຫຼັກ
                            </Link>
                        </div>

                        {loadingApprovals || loadingData ? (
                            <div className="flex justify-center items-center h-48">
                                <p className="text-xl text-gray-600 font-saysettha">ກຳລັງໂຫຼດຂໍ້ມູນ...</p>
                            </div>
                        ) : errorApprovals || errorData ? (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative font-saysettha text-lg" role="alert">
                                <strong className="font-bold">ເກີດຂໍ້ຜິດພາດ!</strong>
                                <span className="block sm:inline ml-2">{errorApprovals || errorData}</span>
                                <p className="mt-2 text-base">ບໍ່ສາມາດໂຫຼດຂໍ້ມູນໄດ້. ກະລຸນາລອງໃໝ່.</p>
                            </div>
                        ) : pendingApprovals.length === 0 ? (
                            <div className="bg-sky-50 p-6 rounded-lg shadow-md text-center text-gray-600 font-saysettha border border-sky-200 text-xl">
                                <p>ບໍ່ມີລາຍການລາພັກທີ່ລໍຖ້າການອະນຸມັດ.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                                {pendingApprovals.map((approval) => (

                                    <ApprovalForm
                                        key={approval.Leave_ID}
                                        approval={approval}
                                        onApprove={handleApproveClick}
                                        onReject={handleRejectClick}
                                        employees={employees}
                                        leaveTypes={leaveTypes}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}