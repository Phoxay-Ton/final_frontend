'use client';

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import axios from 'axios';
import { FaArrowLeft } from "react-icons/fa";
import Link from 'next/link';

// Import reusable components
import Modal from "@/src/components/Modal";
import NotificationModal from "@/src/components/NotificationModal";
import Sidebar from "@/src/components/Sidebar";
import Header from "@/src/components/Header";
import Breadcrumb from "@/src/components/Breadcrumb";
import AddLeaveForm from "@/src/components/AddLeaveForm";

// Import Leave-specific types and hook
import { AddLeave } from "@/src/types/leave";
import { useLeave } from "@/src/hooks/useLeave";

// Import fontLoader utility
import { fontLoader } from "@/src/utils/fontLoader";

export default function AddLeavePage() {
    const router = useRouter();
    const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    // State for Notification Modal
    const [showNotificationModal, setShowNotificationModal] = useState(false);
    const [notificationTitle, setNotificationTitle] = useState("");
    const [notificationMessage, setNotificationMessage] = useState("");

    // Function to show notification modal, memoized with useCallback
    const showNotification = useCallback((title: string, message: string) => {
        setNotificationTitle(title);
        setNotificationMessage(message);
        setShowNotificationModal(true);
    }, []);

    // State to store the current logged-in employee's ID
    const [currentEmployeeId, setCurrentEmployeeId] = useState<number>(0);
    // State to track if employee ID has been loaded
    const [isEmployeeIdLoaded, setIsEmployeeIdLoaded] = useState<boolean>(false);

    // Use the useLeave hook to fetch employees and leave types
    const { employees, leaveTypes, loading: loadingData, error: errorData } = useLeave(showNotification);

    // Effect to retrieve current employee ID from localStorage on component mount
    useEffect(() => {
        const fetchEmployeeId = () => {
            const userData = localStorage.getItem('user');
            if (userData) {
                try {
                    const user = JSON.parse(userData);
                    // Ensure 'id' exists and is a number
                    if (typeof user.id === 'number') {
                        setCurrentEmployeeId(user.id);
                    } else {
                        console.warn('User data from localStorage does not contain a valid numeric ID.');
                        showNotification("ຂໍ້ຄວນລະວັງ", "ຂໍ້ມູນຜູ້ໃຊ້ບໍ່ຖືກຕ້ອງ. ກະລຸນາເຂົ້າສູ່ລະບົບໃໝ່.");
                        setCurrentEmployeeId(0); // Reset to 0 if invalid
                    }
                } catch (err) {
                    console.error('Failed to parse user data from localStorage:', err);
                    showNotification("ຜິດພາດ", "ບໍ່ສາມາດດຶງຂໍ້ມູນຜູ້ໃຊ້ໄດ້. ກະລຸນາລອງໃໝ່.");
                    setCurrentEmployeeId(0); // Reset to 0 on parse error
                }
            } else {
                // If no user data, employeeId remains 0, and form might show 'ກຳລັງໂຫຼດ...'
                // Or you might want to redirect to login if no user is found
                // router.push("/login"); // Uncomment if you want to force login
            }
            setIsEmployeeIdLoaded(true); // Mark employee ID as loaded regardless of success/failure
        };

        fetchEmployeeId();
    }, [showNotification]); // Dependency on showNotification to ensure it's stable

    // Handle form submission from AddLeaveForm
    // In src/app/Leave_Type/Leave/add_leave/page.tsx

    // ... (existing imports and component setup)

    // Handle form submission from AddLeaveForm
    const handleAddLeaveSubmit = async (newLeaveData: AddLeave) => {
        const token = localStorage.getItem("token");
        if (!token) {
            showNotification("ຜິດພາດ", "ບໍ່ມີສິດເຂົ້າເຖິງ. ກະລຸນາເຂົ້າສູ່ລະບົບໃໝ່.");
            router.push("/login");
            return;
        }

        // Client-side validation (keep this as it is)
        if (!newLeaveData.Leave_type_ID || newLeaveData.Leave_type_ID === 0) {
            showNotification("ຜິດພາດ", "ກະລຸນາເລືອກປະເພດການພັກ.");
            return;
        }
        if (!newLeaveData.From_date || !newLeaveData.To_date) {
            showNotification("ຜິດພາດ", "ກະລຸນາໃສ່ວັນເລີ່ມພັກ ແລະ ວັນສິ້ນສຸດ.");
            return;
        }
        // Calculate leave days at the point of submission to ensure accuracy with current dates
        const from = new Date(newLeaveData.From_date);
        const to = new Date(newLeaveData.To_date);

        let calculatedLeaveDays = 0;
        if (!isNaN(from.getTime()) && !isNaN(to.getTime()) && from <= to) {
            const diffTime = Math.abs(to.getTime() - from.getTime());
            calculatedLeaveDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        }

        // Ensure leaveDays is valid before sending
        if (calculatedLeaveDays <= 0) {
            showNotification("ຜິດພາດ", "ຈຳນວນມື້ພັກຕ້ອງຫຼາຍກວ່າ 0.");
            return;
        }
        if (!newLeaveData.Description.trim()) {
            showNotification("ຜິດພາດ", "ກະລຸນາປ້ອນລາຍລະອຽດການລາພັກ.");
            return;
        }
        if (!newLeaveData.Approval_person || newLeaveData.Approval_person === 0) {
            showNotification("ຜິດພາດ", "ກະລຸນາເລືອກຜູ້ອະນຸມັດ.");
            return;
        }

        // --- START: Format data to match backend's snake_case and ISO date-time ---
        // Convert 'YYYY-MM-DD' dates to 'YYYY-MM-DDT17:00:00.000Z' format (or whatever time your backend expects)
        // Assuming backend expects 17:00:00.000Z for the start of the day in UTC for some reason,
        // or it's just an example of what it expects.
        // If your backend handles plain 'YYYY-MM-DD' strings, you can simplify these to newLeaveData.fromDate/toDate.
        // However, the example output suggests it needs the full ISO string.

        // To get 17:00:00.000Z, we need to be careful with timezones.
        // If 'From_date: "2025-06-19T17:00:00.000Z"' means 5 PM UTC on 2025-06-19,
        // and your frontend dates are local, `toISOString()` will work but might adjust the date based on timezone.
        // A safer way to ensure 17:00:00.000Z *if that's a fixed time for all dates*
        // is to construct the Date object carefully.

        // Let's assume your backend expects the *start of the day* in UTC for the given date.
        // The "T17:00:00.000Z" might be specific or a default your backend sets.
        // A robust way to get "start of day UTC" from a YYYY-MM-DD string is:
        const fromDateObj = new Date(newLeaveData.From_date + 'T00:00:00Z'); // Start of the day, forced to UTC
        const toDateObj = new Date(newLeaveData.To_date + 'T00:00:00Z');     // Start of the day, forced to UTC

        // Then convert to ISO string.
        // If your backend specifically needs 'T17:00:00.000Z', you might need more precise string manipulation or a library.
        // For now, let's stick with standard ISOString, and you can adjust if the backend is very strict about the time part.
        const fromDateISO = fromDateObj.toISOString();
        const toDateISO = toDateObj.toISOString();

        const payloadToSend = {
            // Leave_ID, Status, and leave_type object are usually generated/managed by the backend
            // and are not sent from the frontend for a new creation.
            // We only send the data required to create the record.

            // Employee_ID: newLeaveData.employeeId,
            Leave_type_ID: newLeaveData.Leave_type_ID,
            From_date: fromDateISO, // Now correctly formatted as ISO 8601
            To_date: toDateISO,     // Now correctly formatted as ISO 8601
            Leave_days: calculatedLeaveDays, // Use the dynamically calculated value
            Description: newLeaveData.Description,
            Approval_person: newLeaveData.Approval_person,
        };

        console.log("Payload being sent to backend:", payloadToSend); // Crucial for debugging!
        // --- END: Format data ---

        try {
            const response = await axios.post("http://localhost:8080/api/v1/Leave", payloadToSend, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 201) { // Assuming 201 Created for successful addition
                showNotification("ສຳເລັດ", "ສ້າງການຂໍລາພັກສຳເລັດ!");
                router.push("/Leave_Type/Leave"); // Navigate back to leave list
            } else {
                showNotification("ຜິດພາດ", `ບໍ່ສາມາດສ້າງການຂໍລາພັກໄດ້: ${response.data?.message || 'ມີບາງຢ່າງຜິດພາດ.'}`);
            }
        } catch (err: any) {
            console.error("Failed to add leave:", err);
            const errorMessage = err.response?.data?.message || err.message || 'ກະລຸນາລອງໃໝ່.';
            showNotification("ຜິດພາດ", `ບໍ່ສາມາດສ້າງການຂໍລາພັກໄດ້: ${errorMessage}`);
        }
    };

    // ... (rest of your AddLeavePage component)

    // Handle Logout
    const handleSignOut = () => {
        setIsSignOutModalOpen(true);
    };

    const confirmSignOut = () => {
        setIsSignOutModalOpen(false);
        localStorage.removeItem("token");
        localStorage.removeItem("user"); // Also remove user data
        router.push("/login");
    };

    // Load font and check authentication on component mount
    useEffect(() => {
        fontLoader();

        const token = localStorage.getItem("token");
        if (!token) {
            router.replace("/login"); // Use replace to prevent back navigation to login page
        }
    }, [router]);

    // Render nothing or a loading spinner if currentEmployeeId is not yet loaded
    if (!isEmployeeIdLoaded || loadingData) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-sky-200 via-blue-100 to-cyan-200 text-slate-800" style={{ fontFamily: 'Phetsarath OT, sans-serif' }}>
                <p className="text-xl font-medium">ກຳລັງໂຫຼດຂໍ້ມູນ...</p>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gradient-to-br from-sky-200 via-blue-100 to-cyan-200 text-slate-800" style={{ fontFamily: 'Phetsarath OT, sans-serif' }}>
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
            <div className="flex-1 flex flex-col h-screen">
                {/* Header */}
                <Header onSignOut={handleSignOut} />

                {/* Breadcrumb */}
                <Breadcrumb paths={[
                    { name: "ໜ້າຫຼັກ", href: "/admin" },
                    { name: "ຂໍລາພັກ", href: "/Leave_Type/Leave" },
                    { name: "ສ້າງການຂໍລາພັກ" }
                ]} />

                <div className="flex-1 p-4 overflow-y-auto">
                    <div className="bg-white/90 backdrop-blur-lg rounded-xl shadow-xl border border-sky-300/60 p-6">
                        <div className="flex justify-between items-center bg-sky-100/70 p-4 rounded-lg mb-4 border border-sky-200">
                            <h3 className="text-2xl font-bold text-slate-800 font-saysettha">ສ້າງການຂໍລາພັກໃໝ່</h3>
                            <Link href="/Leave_Type/Leave" className="bg-gray-300 text-slate-700 px-5 py-2 rounded-lg flex items-center space-x-2 font-saysettha hover:bg-gray-400 transition-all duration-200 shadow-md">
                                <FaArrowLeft className="text-lg" /> <span>ກັບຄືນ</span>
                            </Link>
                        </div>

                        {/* Render the AddLeaveForm component */}
                        <AddLeaveForm
                            onSubmit={handleAddLeaveSubmit}
                            onCancel={() => router.push("/Leave_Type/Leave")}
                            employees={employees}
                            leaveTypes={leaveTypes}
                            loadingData={loadingData}
                            errorData={errorData}
                            currentEmployeeId={currentEmployeeId}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};    