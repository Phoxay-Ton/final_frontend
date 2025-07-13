// src/app/AddManageDivision/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useState, useCallback, useEffect } from 'react';
// import { FaSave, FaArrowLeft } from 'react-icons/fa';

// Import reusable components
import Modal from "@/src/components/Modal";
import NotificationModal from "@/src/components/NotificationModal";
import Sidebar from "@/src/components/Sidebar";
import Header from "@/src/components/Header";
import Breadcrumb from "@/src/components/Breadcrumb";

// Import types and services
import { AddDivisionPayload, Department } from '@/src/types/division';

// Import fontLoader utility
import { fontLoader } from "@/src/utils/fontLoader";

export default function AddManageDivisionPage() {
    const router = useRouter();
    const [newDivision, setNewDivision] = useState<AddDivisionPayload>({
        Division_Name: '',
        Phone: '',
        Email: '',
        Department_ID: 0,
        Contact_Person: '',
    });

    // ✅ Fix: Ensure departments is always an array with proper initialization
    const [departments, setDepartments] = useState<Department[]>([]);
    const [loadingDepartments, setLoadingDepartments] = useState(true);
    const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    // Notification Modal state
    const [showNotificationModal, setShowNotificationModal] = useState(false);
    const [notificationTitle, setNotificationTitle] = useState("");
    const [notificationMessage, setNotificationMessage] = useState("");
    const [isSuccessNotification, setIsSuccessNotification] = useState(false);

    // Load font and fetch departments on component mount
    useEffect(() => {
        fontLoader();

        const token = localStorage.getItem("token");
        if (!token) {
            router.replace("/login");
            return;
        }

        fetchDepartments();
    }, [router]);

    const fetchDepartments = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                router.replace("/login");
                return;
            }

            const response = await fetch('http://localhost:8080/api/v1/department', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch departments');
            }

            const data = await response.json();

            // ✅ Fix: Handle different response structures
            let departmentData;
            if (data.data && Array.isArray(data.data)) {
                // If response has nested data property (like in useDivision hook)
                departmentData = data.data;
            } else if (Array.isArray(data)) {
                // If response is directly an array
                departmentData = data;
            } else {
                // Fallback to empty array if structure is unexpected
                console.warn('Unexpected department data structure:', data);
                departmentData = [];
            }

            // console.log("=======Fetched departments:", departmentData);
            setDepartments(departmentData);

        } catch (error: any) {
            console.error("Failed to fetch departments:", error);
            // ✅ Fix: Ensure departments stays as empty array on error
            setDepartments([]);
            showNotification("ຜິດພາດ", "ບໍ່ສາມາດໂຫຼດລາຍຊື່ພະແນກໄດ້. ກະລຸນາລອງໃໝ່.");
        } finally {
            setLoadingDepartments(false);
        }
    };

    const showNotification = useCallback((title: string, message: string, isSuccess: boolean = false) => {
        setNotificationTitle(title);
        setNotificationMessage(message);
        setIsSuccessNotification(isSuccess);
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewDivision(prev => ({
            ...prev,
            [name]: name === "Department_ID" ? Number(value) : value
        }));
    };

    const handleAddDivision = async () => {
        // Basic validation
        if (!newDivision.Division_Name.trim()) {
            showNotification("ຜິດພາດ", "ກະລຸນາປ້ອນຊື່ຂະແໜງ.");
            return;
        }
        if (!newDivision.Email.trim()) {
            showNotification("ຜິດພາດ", "ກະລຸນາປ້ອນອີເມວ.");
            return;
        }
        if (!newDivision.Phone.trim()) {
            showNotification("ຜິດພາດ", "ກະລຸນາປ້ອນເບີໂທ.");
            return;
        }
        if (newDivision.Department_ID === 0) {
            showNotification("ຜິດພາດ", "ກະລຸນາເລືອກພະແນກ.");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                showNotification("ຜິດພາດ", "ບໍ່ມີການກວດສອບສິດ. ກະລຸນາເຂົ້າສູ່ລະບົບໃໝ່.");
                router.replace("/login");
                return;
            }

            const response = await fetch('http://localhost:8080/api/v1/Division', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(newDivision),
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Division created successfully:', result);
                showNotification("ສຳເລັດ", "ເພີ່ມຂະແໜງໃໝ່ສຳເລັດ!", true);

                // Clear the form fields
                setNewDivision({
                    Division_Name: '',
                    Phone: '',
                    Email: '',
                    Department_ID: 0,
                    Contact_Person: '',
                });
            } else {
                const errorData = await response.json();
                showNotification("ຜິດພາດ", `ບໍ່ສາມາດເພີ່ມຂະແໜງໄດ້: ${errorData.message || 'ກະລຸນາລອງໃໝ່.'}`);
            }
        } catch (error: any) {
            console.error("Failed to add division:", error);
            showNotification("ຜິດພາດ", "ບໍ່ສາມາດເຊື່ອມຕໍ່ກັບເຊີເວີໄດ້. ກະລຸນາລອງໃໝ່.");
        }
    };

    // Function to handle closing the notification modal
    const handleNotificationClose = () => {
        setShowNotificationModal(false);
        // If it was a success notification, then navigate
        if (isSuccessNotification) {
            router.push('/Division');
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

            {/* Notification Modal */}
            <NotificationModal
                isOpen={showNotificationModal}
                onClose={handleNotificationClose}
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
                <Breadcrumb paths={[{ name: "ໜ້າຫຼັກ", href: "/admin" }, { name: "ຂະແໜງ", href: "/Division" }, { name: "ເພີ່ມຂະແໜງ" }]} />

                <div className="p-6 flex-1 overflow-y-auto">
                    <div className="bg-white/90 backdrop-blur-lg rounded-xl shadow-xl border border-sky-300/60 p-6">
                        <h2 className="text-2xl font-bold text-slate-800 font-saysettha mb-6">ເພີ່ມຂະແໜງ</h2>
                        <div className="space-y-6">
                            <div>
                                <input
                                    type="text"
                                    id="Division_Name"
                                    name="Division_Name"
                                    value={newDivision.Division_Name}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-300 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                                    placeholder="ປ້ອນຊື່ຂະແໜງ"
                                    required
                                />
                            </div>
                            <div>
                                <input
                                    type="email"
                                    id="Email"
                                    name="Email"
                                    value={newDivision.Email}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-300 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                                    placeholder="ປ້ອນອີເມວ"
                                    required
                                />
                            </div>
                            <div>
                                <input
                                    type="text"
                                    id="Phone"
                                    name="Phone"
                                    value={newDivision.Phone}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-300 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                                    placeholder="ປ້ອນເບີໂທ"
                                    required
                                />
                            </div>
                            <div>
                                {loadingDepartments ? (
                                    <div className="w-full p-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-500">
                                        ກຳລັງໂຫຼດພະແນກ...
                                    </div>
                                ) : (
                                    <select
                                        id="Department_ID"
                                        name="Department_ID"
                                        value={newDivision.Department_ID}
                                        onChange={handleChange}
                                        className="w-full p-3 border border-gray-300 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                                        required
                                    >
                                        <option value={0} disabled>ເລືອກພະແນກ</option>
                                        {/* ✅ Fix: Add safety check for departments array */}
                                        {Array.isArray(departments) && departments.length > 0 ? (
                                            departments.map(dep => (
                                                <option key={dep.Department_ID} value={dep.Department_ID}>
                                                    {dep.Department_Name}
                                                </option>
                                            ))
                                        ) : (
                                            <option value={0} disabled>ບໍ່ມີພະແນກ</option>
                                        )}
                                    </select>
                                )}
                            </div>

                            {/* <div>
                                <input
                                    type="text"
                                    id="Contact_Person"
                                    name="Contact_Person"
                                    value={newDivision.Contact_Person}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-300 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                                    placeholder="ປ້ອນຜູ້ຕິດຕໍ່"
                                />
                            </div> */}

                            <div className="flex space-x-4 mt-6">
                                <button
                                    type="button"
                                    onClick={handleAddDivision}
                                    className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors duration-200 shadow-md font-medium text-lg"
                                    disabled={loadingDepartments}
                                >
                                    ບັນທຶກ
                                </button>
                                <button
                                    type="button"
                                    onClick={() => router.push('/Division')}
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