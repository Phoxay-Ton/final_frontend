// src/app/AddManageTasksPage.tsx
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
import AddManageTaskForm from "@/src/components/AddManageTaskForm"; // Ensure this path is correct

// ✅ Updated interface to match the form component
interface AddManageTaskPayload {
  task_name: string;
  description: string;
  attachment: string;
  employee_id: number;
  division_id: number;
  start_date: string;
  end_date: string;
  status: string;
}

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

  const handleSaveTask = async (formData: FormData): Promise<boolean> => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showNotification("ຜິດພາດ", "ບໍ່ມີການກວດສອບສິດ. ກະລຸນາເຂົ້າສູ່ລະບົບໃໝ່.");
        router.replace("/login");
        return false;
      }

      const response = await fetch('http://localhost:8080/api/v1/task', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        showNotification("ສຳເລັດ", "ເພີ່ມວຽກສຳເລັດແລ້ວ");
        setTimeout(() => {
          router.push("/manage_tasks");
        }, 1500);
        return true;
      } else {
        const errorData = await response.json();
        let errorMessage = "ບໍ່ສາມາດເພີ່ມວຽກໄດ້";
        if (errorData.errors && Array.isArray(errorData.errors)) {
          const errorDetails = errorData.errors.map((err: any) => {
            return `${err.path?.join('.')}` + ' - ' + err.message;
          }).join('\n');
          errorMessage = `ຂໍ້ມູນບໍ່ຖືກຕ້ອງ:\n${errorDetails}`;
        } else if (errorData.message) {
          errorMessage = errorData.message;
        }
        showNotification("ຜິດພາດ", errorMessage);
        return false;
      }
    } catch (error: any) {
      console.error("Failed to add task:", error);
      showNotification("ຜິດພາດ", "ບໍ່ສາມາດເຊື່ອມຕໍ່ກັບເຊີເວີໄດ້. ກະລຸນາລອງໃໝ່.");
      return false;
    }
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
  }, [router, showNotification]);

  const handleNotificationClose = () => {
    setShowNotificationModal(false);
  };

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
        onClose={handleNotificationClose}
        title={notificationTitle}
        message={notificationMessage}
      />

      {/* Sidebar: Fixed width, not scrollable. */}
      <Sidebar isCollapsed={isSidebarCollapsed} onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />

      {/* Main content wrapper: This is the flex column for Header, Breadcrumb, and Scrollable Content */}
      <div className="flex-1 flex flex-col h-screen"> {/* Added h-screen to make this flex container take full height */}

        {/* Header: Fixed at the top. */}
        <Header onSignOut={handleSignOut} />

        {/* Breadcrumb: Fixed below the header. */}
        <Breadcrumb paths={[
          { name: "ໜ້າຫຼັກ", href: "/admin" },
          { name: "ມອບວຽກ", href: "/manage_tasks" },
          { name: "ເພີ່ມວຽກໃຫ້ພະນັກງານ" }
        ]} />

        {/* Scrollable Content Area: This div takes the remaining height and will scroll. */}
        <div className="flex-1 overflow-y-auto p-6"> {/* flex-1 ensures it fills remaining vertical space */}
          <div className="bg-white/90 backdrop-blur-lg rounded-xl shadow-xl border border-sky-300/60 p-6">
            <div className="flex justify-between items-center bg-sky-100/70 p-4 rounded-lg mb-6 border border-sky-200">
              <h3 className="text-2xl font-bold text-slate-800 font-saysettha">ເພີ່ມວຽກໃຫ້ພະນັກງານ</h3>
              <Link href="/manage_tasks" className="flex items-center text-blue-600 hover:text-blue-800 transition-colors font-saysettha text-lg">
                <FaArrowLeft className="mr-2" /> ກັບຄືນ
              </Link>
            </div>

            {/* AddManageTaskForm: No internal scrolling or sticky elements here. */}
            <AddManageTaskForm
              onSave={handleSaveTask}
              onCancel={handleCancel}
              showNotification={showNotification}
            />

          </div>
        </div>
      </div>
    </div>
  );
}