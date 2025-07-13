// src/app/employee/add_employee/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useState, useCallback, useEffect } from 'react';

// Import reusable components
import Modal from "@/src/components/Modal";
import NotificationModal from "@/src/components/NotificationModal";
import Sidebar from "@/src/components/Sidebar";
import Header from "@/src/components/Header";
import Breadcrumb from "@/src/components/Breadcrumb";
import AddEmployeeForm from "@/src/components/AddEmployeeForm";

// Import types and hooks
import { AddEmployee, AddEmployeeRequest } from "@/src/types/employee";
import { useEmployee } from '@/src/hooks/useEmployeeData';
import { fontLoader } from "@/src/utils/fontLoader";

export default function AddEmployeePage() {
  const router = useRouter();
  const [newEmployee, setNewEmployee] = useState<AddEmployee>({
    name: '',
    email: '',
    phone: '',
    username: '',
    role: '',
    department_ID: '',
    division_ID: '',
    position_ID: '',
    password: '',
  });

  // Modal states
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Notification Modal state
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [notificationTitle, setNotificationTitle] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");
  const [isSuccessNotification, setIsSuccessNotification] = useState(false);

  // Loading state
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Use the custom hook for employee operations
  const showNotification = useCallback((title: string, message: string, isSuccess: boolean = false) => {
    setNotificationTitle(title);
    setNotificationMessage(message);
    setIsSuccessNotification(isSuccess);
    setShowNotificationModal(true);
  }, []);

  const {
    departments,
    divisions,
    positions,
    loading,
    addEmployee
  } = useEmployee(showNotification);

  // Load font on component mount
  useEffect(() => {
    fontLoader();
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

    // Convert ID fields to numbers or empty string
    if (name.includes('_ID')) {
      setNewEmployee(prev => ({
        ...prev,
        [name]: value === '' ? '' : Number(value)
      }));
    } else {
      setNewEmployee(prev => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = () => {
    if (!newEmployee.name.trim()) {
      showNotification("ຜິດພາດ", "ກະລຸນາປ້ອນຊື່ພະນັກງານ");
      return false;
    }
    if (!newEmployee.email.trim()) {
      showNotification("ຜິດພາດ", "ກະລຸນາປ້ອນອີເມວ");
      return false;
    }
    if (!newEmployee.phone.trim()) {
      showNotification("ຜິດພາດ", "ກະລຸນາປ້ອນເບີໂທ");
      return false;
    }
    if (!newEmployee.username.trim()) {
      showNotification("ຜິດພາດ", "ກະລຸນາປ້ອນຊື່ຜູ້ໃຊ້");
      return false;
    }
    if (!newEmployee.password.trim()) {
      showNotification("ຜິດພາດ", "ກະລຸນາປ້ອນລະຫັດຜ່ານ");
      return false;
    }
    if (newEmployee.password.length < 6) {
      showNotification("ຜິດພາດ", "ລະຫັດຜ່ານຕ້ອງມີຢ່າງໜ້ອຍ 6 ຕົວອັກສອນ");
      return false;
    }
    if (!newEmployee.role) {
      showNotification("ຜິດພາດ", "ກະລຸນາເລືອກສິດທິ");
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmployee.email)) {
      showNotification("ຜິດພາດ", "ຮູບແບບອີເມວບໍ່ຖືກຕ້ອງ");
      return false;
    }

    // Phone validation
    const phoneRegex = /^[0-9]{8,12}$/;
    if (!phoneRegex.test(newEmployee.phone.replace(/\s/g, ''))) {
      showNotification("ຜິດພາດ", "ເບີໂທຕ້ອງເປັນຕົວເລກ 8-12 ຫຼັກ");
      return false;
    }

    return true;
  };

  const handleAddEmployee = async () => {
    if (!validateForm() || isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      // เตรียมข้อมูลให้ตรงกับโครงสร้างที่ backend ต้องการ
      const employeeData: AddEmployeeRequest = {
        Name: newEmployee.name.trim(),
        Email: newEmployee.email.trim(),
        Phone: newEmployee.phone.trim(),
        Username: newEmployee.username.trim(),
        Role: newEmployee.role,
        Department_ID: newEmployee.department_ID === '' ? null : newEmployee.department_ID as number,
        Division_ID: newEmployee.division_ID === '' ? null : newEmployee.division_ID as number,
        Position_ID: newEmployee.position_ID === '' ? null : newEmployee.position_ID as number,
        Password: newEmployee.password
      };

      console.log('Sending employee data:', employeeData); // Debug log

      const success = await addEmployee(employeeData);

      if (success) {
        // แสดงข้อความสำเร็จ
        showNotification("ສຳເລັດ", "ເພີ່ມພະນັກງານໃໝ່ສຳເລັດ!", true);

        // Clear the form fields
        setNewEmployee({
          name: '',
          email: '',
          phone: '',
          username: '',
          role: '',
          department_ID: '',
          division_ID: '',
          position_ID: '',
          password: '',
        });
      }
    } catch (error: any) {
      console.error("Failed to add employee:", error);

      // แสดงข้อความผิดพลาดที่ชัดเจนขึ้น
      let errorMessage = 'ກະລຸນາລອງໃໝ່.';

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 409) {
        errorMessage = 'ຊື່ຜູ້ໃຊ້ຫຼືອີເມວນີ້ໄດ້ຖືກໃຊ້ແລ້ວ';
      } else if (error.response?.status === 400) {
        errorMessage = 'ຂໍ້ມູນທີ່ສົ່ງມາບໍ່ຖືກຕ້ອງ';
      } else if (error.message) {
        errorMessage = error.message;
      }

      showNotification("ຜິດພາດ", `ບໍ່ສາມາດເພີ່ມພະນັກງານໄດ້: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push('/employee');
  };

  const handleNotificationClose = () => {
    setShowNotificationModal(false);
    if (isSuccessNotification) {
      router.push('/employee');
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
        <Breadcrumb paths={[
          { name: "ໜ້າຫຼັກ", href: "/admin" },
          { name: "ພະນັກງານ", href: "/employee" },
          { name: "ເພີ່ມພະນັກງານ" }
        ]} />

        <div className="p-6 flex-1 overflow-y-auto">
          <AddEmployeeForm
            formData={newEmployee}
            onChange={handleChange}
            onSubmit={handleAddEmployee}
            onCancel={handleCancel}
            departments={departments}
            divisions={divisions}
            positions={positions}
            isSubmitting={isSubmitting}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}