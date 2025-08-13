'use client';

import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaPlus, FaEdit, FaTrash, FaEye, FaFilePdf } from "react-icons/fa";

// Import reusable components
import Modal from "@/src/components/Modal";
import NotificationModal from "@/src/components/NotificationModal";
import Sidebar from "@/src/components/Sidebar";
import Header from "@/src/components/Header";
import Breadcrumb from "@/src/components/Breadcrumb";

// Import fontLoader utility
import { fontLoader } from "@/src/utils/fontLoader";

interface Employee {
    Employee_ID: number;
    Name: string;
    Department_ID: number;
}

interface LeaveRecord {
    Leave_ID: number;
    Employee_ID: number;
    Leave_type_ID: number;
    From_date: string;
    To_date: string;
    Leave_days: number;
    Description: string;
    Approval_person: number;
    approver?: {
        Employee_ID: number;
        Name: string;
    }
    Remark: string | null;
    Status: string | null;
    employee: {
        Name: string;
        Department_ID: number;
    };
    leave_type: {
        name: string;
    };
}

export default function LeaveTrackingPage() {
    const router = useRouter();
    const [leaves, setLeaves] = useState<LeaveRecord[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    // State for Notification Modal
    const [showNotificationModal, setShowNotificationModal] = useState(false);
    const [notificationTitle, setNotificationTitle] = useState("");
    const [notificationMessage, setNotificationMessage] = useState("");

    // PDF related states
    const [isPDFDownloading, setIsPDFDownloading] = useState(false);
    const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<number[]>([]);
    const [fromDate, setFromDate] = useState<string>('');
    const [toDate, setToDate] = useState<string>('');
    const [selectedStatus, setSelectedStatus] = useState<string>('');
    const [showPDFModal, setShowPDFModal] = useState(false);

    // Search and filter states
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("");

    // Function to show notification modal
    const showNotification = useCallback((title: string, message: string) => {
        setNotificationTitle(title);
        setNotificationMessage(message);
        setShowNotificationModal(true);
    }, []);

    // Function to fetch leave records
    const fetchLeaves = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const userString = localStorage.getItem("user");
            const token = localStorage.getItem("token");

            if (!userString || !token) {
                router.replace("/login");
                return;
            }

            const user = JSON.parse(userString);
            const employeeId = user.id;

            if (!employeeId) {
                showNotification("ຜິດພາດ", "ບໍ່ພົບຂໍ້ມູນຜູ້ໃຊ້. ກະລຸນາເຂົ້າສູ່ລະບົບໃໝ່.");
                router.replace("/login");
                return;
            }

            const response = await axios.get(
                `http://localhost:8080/api/v1/Leave/all-admin`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setLeaves(response.data.data);
        } catch (err) {
            console.error("Error fetching leave records:", err);
            if (axios.isAxiosError(err)) {
                if (err.response) {
                    const errorMessage = err.response.data?.message || err.response.statusText;
                    setError(`Error: ${errorMessage}`);
                    showNotification("ຜິດພາດ", `ບໍ່ສາມາດໂຫຼດຂໍ້ມູນການລາພັກໄດ້: ${errorMessage}`);
                } else if (err.request) {
                    setError("ບໍ່ມີການຕອບກັບຈາກເຊີບເວີ. ກວດສອບການເຊື່ອມຕໍ່ຂອງທ່ານ.");
                    showNotification("ຜິດພາດ", "ບໍ່ມີການຕອບກັບຈາກເຊີບເວີ.");
                } else {
                    setError("ເກີດຂໍ້ຜິດພາດໃນການຕັ້ງຄ່າຄຳຮ້ອງຂໍ.");
                    showNotification("ຜິດພາດ", "ເກີດຂໍ້ຜິດພາດໃນການຕັ້ງຄ່າຄຳຮ້ອງຂໍ.");
                }
            } else {
                setError("ບໍ່ສາມາດໂຫຼດຂໍ້ມູນການລາພັກໄດ້. ກະລຸນາລອງໃໝ່ພາຍຫຼັງ.");
                showNotification("ຜິດພາດ", "ບໍ່ສາມາດໂຫຼດຂໍ້ມູນການລາພັກໄດ້.");
            }
        } finally {
            setLoading(false);
        }
    }, [router, showNotification]);

    // Fetch employees for PDF modal
    const fetchEmployees = useCallback(async () => {
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
                setEmployees(data);
            } else {
                console.error("Invalid employee data:", data);
            }
        } catch (error) {
            console.error("Error fetching employees:", error);
        }
    }, []);

    // Handle PDF Download
    const handleDownloadPDF = async () => {
        setIsPDFDownloading(true);
        try {
            const token = localStorage.getItem("token");

            const payload = {
                employeeIds: selectedEmployeeIds.length > 0 ? selectedEmployeeIds : undefined,
                fromDate: fromDate || undefined,
                toDate: toDate || undefined,
                status: selectedStatus || undefined,
            };

            // Remove undefined values
            // Object.keys(payload).forEach(key =>
            //     payload[key] === undefined && delete payload[key]
            // );

            const response = await axios.post("http://localhost:8080/api/v1/Leave/report", payload, {
                responseType: 'blob',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            // สร้างลิงก์ดาวน์โหลด PDF
            const blob = new Blob([response.data], { type: "application/pdf" });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "leave_report.pdf");
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
        const allowedRoles = ["Admin", "Super_Admin"];

        if (!token || !allowedRoles.includes(user?.role)) {
            router.replace("/login");
        } else {
            fetchLeaves();
            fetchEmployees();
        }
    }, [router, fetchLeaves, fetchEmployees]);

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

    // Function to format date for display
    const formatDate = (dateString: string): string => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('lo-LA');
        } catch (e) {
            console.error("Invalid date string:", dateString, e);
            return 'Invalid Date';
        }
    };

    // Filter leaves based on search term and status
    const filteredLeaves = leaves.filter((leave) => {
        const matchesSearchTerm = leave.employee?.Name?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "" || leave.Status === statusFilter;
        return matchesSearchTerm && matchesStatus;
    });

    // Pagination: leaves for current page
    const paginatedLeaves = filteredLeaves.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Status options for filter
    const statusOptions = [
        { value: "", label: "ທັງໝົດ" },
        { value: "pending", label: "ລໍຖ້າອະນຸມັດ" },
        { value: "approved", label: "ອະນຸມັດແລ້ວ" },
        { value: "rejected", label: "ຖືກປະຕິເສດ" },
    ];

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

            {/* PDF Filter Modal */}
            {showPDFModal && (
                <Modal
                    isOpen={showPDFModal}
                    onClose={() => setShowPDFModal(false)}
                    onConfirm={handleDownloadPDF}
                    title="ດາວໂຫຼດ PDF ລາຍງານການລາພັກ"
                    message="ກະລຸນາເລືອກເງື່ອນໄຂສຳລັບລາຍງານ"
                    confirmText="ດາວໂຫຼດ"
                    cancelText="ຍົກເລີກ"
                >
                    <div className="space-y-4 mt-6">
                        <div>
                            {/* <label className="block text-sm font-medium text-gray-700 mb-1 font-saysettha">
                                ພະນັກງານ (ຫວ່າງເປົ່າ = ທັງໝົດ):
                            </label> */}
                            <select
                                value={selectedEmployeeIds.length > 0 ? String(selectedEmployeeIds[0]) : ""}
                                onChange={(e) => {
                                    const selectedId = Number(e.target.value);
                                    setSelectedEmployeeIds(selectedId ? [selectedId] : []);
                                }}
                                className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">ພະນັກງານທັງໝົດ</option>
                                {employees.map(emp => (
                                    <option key={emp.Employee_ID} value={emp.Employee_ID}>
                                        {emp.Name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            {/* <label className="block text-sm font-medium text-gray-700 mb-1 font-saysettha">
                                ສະຖານະ:
                            </label> */}
                            {/* <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">ສະຖານະທັງໝົດ</option>
                                <option value="pending">ລໍຖ້າອະນຸມັດ</option>
                                <option value="approved">ອະນຸມັດແລ້ວ</option>
                                <option value="rejected">ຖືກປະຕິເສດ</option>
                            </select> */}
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
                <Breadcrumb paths={[{ name: "ໜ້າຫຼັກ", href: "/admin" }, { name: "ຕິດຕາມການລາພັກ" }]} />

                <div className="p-6 flex-1 overflow-y-auto">
                    <div className="bg-white/90 backdrop-blur-lg rounded-xl shadow-xl border border-sky-300/60 p-6">
                        <div className="flex justify-between items-center bg-sky-100/70 p-4 rounded-lg mb-6 border border-sky-200">
                            <h3 className="text-2xl font-bold text-slate-800 font-saysettha">ຂໍ້ມູນການຕິດຕາມການລາພັກ</h3>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowPDFModal(true)}
                                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors font-saysettha"
                                >
                                    <FaFilePdf />
                                    ດາວໂຫຼດ PDF
                                </button>
                                {/* <Link href="/Leave_Type/Leave/add_leave" className="bg-blue-600 text-white px-5 py-2 rounded-lg flex items-center space-x-2 font-saysettha hover:bg-blue-700 transition-all duration-200 shadow-md">
                                    <FaPlus className="text-lg" /> <span>ສ້າງການຂໍລາພັກ</span>
                                </Link> */}
                            </div>
                        </div>

                        {/* Search and Filter Controls */}
                        <div className="flex justify-end items-center gap-4 mb-4">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="ຄົ້ນຫາຊື່ພະນັກງານ..."
                                className="p-2 border border-sky-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-400 font-saysettha"
                            />
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="p-2 border border-sky-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-400 font-saysettha"
                            >
                                {statusOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Leave Tracking Table */}
                        <div className="mt-6 max-h-[500px] overflow-y-auto overflow-x-auto rounded-lg shadow-md border border-sky-200 relative">
                            <table className="w-full border-collapse">
                                <thead className="bg-sky-200 text-slate-800 font-saysettha text-lg">
                                    <tr>
                                        <th className="sticky top-0 z-10 p-4 text-left bg-sky-200">ລຳດັບ</th>
                                        <th className="sticky top-0 z-10 p-4 text-left bg-sky-200">ຊື່ພະນັກງານ</th>
                                        <th className="sticky top-0 z-10 p-4 text-left bg-sky-200">ປະເພດການພັກ</th>
                                        <th className="sticky top-0 z-10 p-4 text-left bg-sky-200">ວັນທີເລີ່ມ</th>
                                        <th className="sticky top-0 z-10 p-4 text-left bg-sky-200">ວັນທີສິ້ນສຸດ</th>
                                        <th className="sticky top-0 z-10 p-4 text-left bg-sky-200">ຈຳນວນມື້ພັກ</th>
                                        <th className="sticky top-0 z-10 p-4 text-left bg-sky-200">ຜູ້ອະນຸມັດ</th>
                                        <th className="sticky top-0 z-10 p-4 text-left bg-sky-200">ລາຍລະອຽດ</th>
                                        <th className="sticky top-0 z-10 p-4 text-left bg-sky-200">ສະຖານະ</th>
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
                                    ) : paginatedLeaves.length > 0 ? (
                                        paginatedLeaves.map((leave, index) => (
                                            <tr
                                                key={leave.Leave_ID}
                                                className="border-t border-sky-200 text-slate-700 hover:bg-sky-50/50 transition-colors"
                                            >
                                                <td className="p-4 font-times">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                                <td className="p-4">{leave.employee?.Name ?? "-"}</td>
                                                <td className="p-4">{leave.leave_type?.name ?? "-"}</td>
                                                <td className="p-4 font-times text-lg">{formatDate(leave.From_date)}</td>
                                                <td className="p-4 font-times text-lg">{formatDate(leave.To_date)}</td>
                                                <td className="p-4 font-sysettha font-times text-lg">{leave.Leave_days} ມື້</td>
                                                <td className="p-4">{leave.approver?.Name ?? "-"}</td>
                                                <td className="p-4 max-w-xs overflow-hidden text-ellipsis whitespace-nowrap">{leave.Description || 'N/A'}</td>
                                                <td className="p-4">
                                                    <span className={`px-3 py-1 rounded-full text-sm font-semibold
                                                        ${leave.Status === 'approved' ? 'bg-green-100 text-green-700' :
                                                            leave.Status === 'rejected' ? 'bg-red-100 text-red-700' :
                                                                'bg-yellow-100 text-yellow-700'}`}>
                                                        {leave.Status === "approved" ? "ອະນຸມັດແລ້ວ" :
                                                            leave.Status === "rejected" ? "ຖືກປະຕິເສດ" : "ລໍຖ້າອະນຸມັດ"}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan={9}
                                                className="text-center p-4 text-gray-500 font-saysettha text-md"
                                            >
                                                ບໍ່ພົບຂໍ້ມູນການຕິດຕາມການລາພັກ
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        {/* Pagination Controls */}
                        <div className="flex justify-center items-center gap-2 mt-4">
                            <button
                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="px-3 py-1 rounded bg-sky-300 text-white disabled:bg-gray-300"
                            >
                                ຫນ້າກ່ອນ
                            </button>
                            <span className="font-saysettha">
                                ຫນ້າ {currentPage} / {Math.ceil(filteredLeaves.length / itemsPerPage)}
                            </span>
                            <button
                                onClick={() => setCurrentPage((prev) => prev + 1)}
                                disabled={currentPage >= Math.ceil(filteredLeaves.length / itemsPerPage)}
                                className="px-3 py-1 rounded bg-sky-300 text-white disabled:bg-gray-300"
                            >
                                ຫນ້າຕໍ່ໄປ
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}