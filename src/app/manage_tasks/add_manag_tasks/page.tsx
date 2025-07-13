'use client';

import { useRouter } from 'next/navigation';
import { useState, useCallback, useEffect } from "react";
import Link from 'next/link';
import { FaArrowLeft } from "react-icons/fa";

// Import reusable components
import Modal from "@/src/components/Modal";
import NotificationModal from "@/src/components/NotificationModal";
import Header from "@/src/components/Header";
import Sidebar from "@/src/components/Sidebar";
import Breadcrumb from "@/src/components/Breadcrumb";
import AddManageTaskForm from "@/src/components/AddManageTaskForm";

// Import types and hook
import { useManageTask } from "@/src/hooks/useManageTask";
import { AddManageTaskPayload } from "@/src/types/manageTask";

// Import fontLoader utility
import { fontLoader } from "@/src/utils/fontLoader";

export default function AddManageTasksPage() {
  const router = useRouter();
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Notification Modal States
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [notificationTitle, setNotificationTitle] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");

  const showNotification = useCallback((title: string, message: string) => {
    setNotificationTitle(title);
    setNotificationMessage(message);
    setShowNotificationModal(true);
  }, []);

  const {
    addManageTask,
    employees,
    divisions,
    loading: loadingHook,
    error: errorHook,
    fetchEmployeesByDivision,
    fetchDivisions, // ✅ ถูกต้อง: ดึง fetchDivisions จาก useManageTask
  } = useManageTask(showNotification);

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

  const handleSaveTask = async (taskPayload: AddManageTaskPayload, file: File | null) => {
    const success = await addManageTask(taskPayload, file);
    if (success) {
      router.push("/manage_tasks");
    }
    return success;
  };

  const handleCancel = () => {
    router.push("/manage_tasks");
  };

  useEffect(() => {
    fontLoader();

    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (!token || !user) {
      console.warn("Authentication failed: No token or user data found. Redirecting to login.");
      router.replace("/login");
      return;
    }

    // try {
    //   const userData = JSON.parse(user);
    //   if (userData.role !== "Admin") {
    //     showNotification("ບໍ່ມີສິດ", "ທ່ານບໍ່ມີສິດເຂົ້າເຖິງໜ້ານີ້.");
    //     router.replace("/unauthorized");
    //   }
    // } catch (e) {
    //   console.error("Failed to parse user data from localStorage", e);
    //   showNotification("ຂໍ້ມູນຜູ້ໃຊ້ບໍ່ຖືກຕ້ອງ", "ກະລຸນາເຂົ້າສູ່ລະບົບໃໝ່.");
    //   router.replace("/login");
    // }
    // ✅ ถูกต้อง: เพิ่ม fetchDivisions ใน Dependency array เพื่อให้มั่นใจว่าฟังก์ชันนี้ถูกรวมในการพิจารณาของ useEffect
  },
    [router, showNotification, fetchDivisions]);

  // ✅ ถูกต้อง: เพิ่ม useEffect เพื่อโหลด divisions เมื่อ component mount (ถ้ายังไม่ได้โหลด)
  useEffect(() => {
    // เงื่อนไขนี้จะทำงานเมื่อ divisions ยังว่างอยู่ และไม่ได้อยู่ในสถานะ loading หรือ error
    if (!divisions.length && !loadingHook && !errorHook) {
      fetchDivisions();
    }
    // ไม่ต้อง fetchEmployeesByDivision ตรงนี้ เพราะจะถูกเรียกเมื่อ division ถูกเลือกใน AddManageTaskForm
  }, [divisions.length, loadingHook, errorHook, fetchDivisions]); // Dependency array ถูกต้อง

  if (loadingHook) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-sky-200 via-blue-100 to-cyan-200">
        <p className="text-xl text-gray-600 font-saysettha">ກຳລັງໂຫຼດຂໍ້ມູນພະນັກງານ ແລະ ຂະແໜງ...</p>
      </div>
    );
  }

  if (errorHook) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-sky-200 via-blue-100 to-cyan-200">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative font-saysettha text-lg" role="alert">
          <strong className="font-bold">ເກີດຂໍ້ຜິດພາດ!</strong>
          <span className="block sm:inline ml-2">{errorHook}</span>
          <p className="mt-2 text-base">ບໍ່ສາມາດໂຫຼດຂໍ້ມູນທີ່ຈຳເປັນໄດ້. ກະລຸນາລອງໃໝ່.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-sky-200 via-blue-100 to-cyan-200 text-slate-800" style={{ fontFamily: 'Phetsarath OT, sans-serif' }}>
      <Modal
        isOpen={isSignOutModalOpen}
        onClose={() => setIsSignOutModalOpen(false)}
        onConfirm={confirmSignOut}
        title="ຢືນຢັນອອກລະບົບ"
        message="ທ່ານຕ້ອງການອອກລະບົບແທ້ບໍ?"
        confirmText="ຕົກລົງ"
        cancelText="ຍົກເລີກ"
      />

      <NotificationModal
        isOpen={showNotificationModal}
        onClose={() => setShowNotificationModal(false)}
        title={notificationTitle}
        message={notificationMessage}
      />

      <Sidebar isCollapsed={isSidebarCollapsed} onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onSignOut={handleSignOut} />

        <Breadcrumb paths={[{ name: "ໜ້າຫຼັກ", href: "/admin" }, { name: "ມອບວຽກ", href: "/manage_tasks" }, { name: "ເພີ່ມວຽກໃຫ້ພະນັກງານ" }]} />

        <div className="p-6 flex-1 overflow-y-auto">
          <div className="bg-white/90 backdrop-blur-lg rounded-xl shadow-xl border border-sky-300/60 p-6">
            <div className="flex justify-between items-center bg-sky-100/70 p-4 rounded-lg mb-6 border border-sky-200">
              <h3 className="text-2xl font-bold text-slate-800 font-saysettha">ເພີ່ມວຽກໃຫ້ພະນັກງານ</h3>
              <Link href="/manage_tasks" className="flex items-center text-blue-600 hover:text-blue-800 transition-colors font-saysettha text-lg">
                <FaArrowLeft className="mr-2" /> ກັບຄືນ
              </Link>
            </div>

            {/* ✅ สำคัญ: เพิ่ม Key prop เพื่อช่วย React ในการรักษา State ของ AddManageTaskForm */}
            {/* ✅ ตรวจสอบว่า divisions มีข้อมูล (length > 0) ก่อน Render form */}
            {divisions.length > 0 ? ( // ใช้ divisions.length > 0 เพื่อยืนยันว่ามีข้อมูล
              <AddManageTaskForm
                key="add-manage-task-form" // ✅ Key ที่ไม่เปลี่ยน จะช่วยรักษา State ภายในของ AddManageTaskForm
                onSave={handleSaveTask}
                onCancel={handleCancel}
                showNotification={showNotification}
                employees={employees}
                divisions={divisions}
                fetchEmployeesByDivision={fetchEmployeesByDivision}
              />
            ) : (
              <div className="text-center text-gray-500 font-saysettha">
                ກຳລັງໂຫຼດຂໍ້ມູນທີ່ຈຳເປັນ...
                {/* อาจจะแสดงข้อความว่า "ไม่สามารถโหลดข้อมูลพนักงาน หรือ แผนกได้." ถ้า errorHook ไม่เป็น null */}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}