'use client';

import { useRouter } from 'next/navigation';
import { useState, useCallback, useEffect } from "react";
import Link from 'next/link';
import { FaPlus, FaEdit, FaTrash, FaBell, FaUserShield, FaChartBar, FaGavel, FaSignOutAlt, FaEye } from "react-icons/fa";

import Modal from "@/src/components/Modal";
import NotificationModal from "@/src/components/NotificationModal";
import ManageTaskEditModal from "@/src/components/ManageTaskEditModal";
import ViewTaskModal from "@/src/components/ViewTaskModal";
import Header from "@/src/components/Header";
import Sidebar from "@/src/components/Sidebar";
import Breadcrumb from "@/src/components/Breadcrumb";

import { ManageTask } from "@/src/types/manageTask";
import { useManageTask } from "@/src/hooks/useManageTask";
import { fontLoader } from "@/src/utils/fontLoader";

export default function ManageTasksPage() {
  const router = useRouter();
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<ManageTask | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [userRole, setUserRole] = useState<string>('');
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [notificationTitle, setNotificationTitle] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [taskToDeleteId, setTaskToDeleteId] = useState<number | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [taskToView, setTaskToView] = useState<ManageTask | null>(null);
  const [localTasks, setLocalTasks] = useState<ManageTask[]>([]);

  const showNotification = useCallback((title: string, message: string) => {
    setNotificationTitle(title);
    setNotificationMessage(message);
    setShowNotificationModal(true);
  }, []);

  const { manageTasks, loading, error, updateManageTask, deleteManageTask, fetchManageTasks } = useManageTask(showNotification);

  useEffect(() => {
    setLocalTasks(manageTasks);
  }, [manageTasks]);

  const handleSignOut = () => {
    setIsSignOutModalOpen(true);
  };

  const confirmSignOut = () => {
    setIsSignOutModalOpen(false);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  const openEditModal = (task: ManageTask) => {
    setCurrentTask(task);
    setIsEditModalOpen(true);
  };

  const handleUpdateTask = async (updatedTask: ManageTask) => {
    const success = await updateManageTask(updatedTask);
    if (success) {
      setIsEditModalOpen(false);
    }
    return success;
  };

  const handleDeleteClick = (taskId: number) => {
    setTaskToDeleteId(taskId);
    setShowDeleteConfirmModal(true);
  };

  const confirmDeleteTask = async () => {
    if (taskToDeleteId === null) return;

    const success = await deleteManageTask(taskToDeleteId);
    if (success) {
      setShowDeleteConfirmModal(false);
    }
    setTaskToDeleteId(null);
  };

  const handleViewClick = (task: ManageTask) => {
    setTaskToView(task);
    setShowViewModal(true);
  };

  const handleTaskUpdate = useCallback((updatedTask: ManageTask) => {
    setLocalTasks(prevTasks =>
      prevTasks.map(task =>
        task.Task_ID === updatedTask.Task_ID ? updatedTask : task
      )
    );
    showNotification("ສຳເລັດ", "ອັບເດດສະຖານະສຳເລັດແລ້ວ");
  }, [showNotification]);

  useEffect(() => {
    fontLoader();

    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (!token) {
      router.replace("/login");
      return;
    }

    try {
      if (user) {
        const userData = JSON.parse(user);
        setUserRole(userData.role || 'user');
      }
    } catch (e) {
      console.error("Failed to parse user data from localStorage", e);
      setUserRole('user');
    }

    fetchManageTasks();
  }, [router, showNotification, fetchManageTasks]);

  const getStatusColorClass = (status: string) => {
    switch (status) {
      case 'ສຳເລັດແລ້ວ':
        return 'bg-green-100 text-green-700';
      case 'ກຳລັງດຳເນີນການ':
        return 'bg-blue-100 text-blue-700';
      case 'ເລີ່ມວຽກ':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

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

      <Modal
        isOpen={showDeleteConfirmModal}
        onClose={() => setShowDeleteConfirmModal(false)}
        onConfirm={confirmDeleteTask}
        title="ຢືນຢັນການລຶບ"
        message="ທ່ານແນ່ໃຈບໍວ່າຕ້ອງການລຶບວຽກນີ້? ການກະທຳນີ້ບໍ່ສາມາດຍົກເລີກໄດ້."
        confirmText="ລຶບ"
        cancelText="ຍົກເລີກ"
      />

      {isEditModalOpen && currentTask && (
        <ManageTaskEditModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          initialData={currentTask}
          onSave={handleUpdateTask}
        />
      )}

      <ViewTaskModal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        task={taskToView}
        userRole={userRole}
        onTaskUpdate={handleTaskUpdate}
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
        <Breadcrumb paths={[{ name: "ໜ້າຫຼັກ", href: "/admin" }, { name: "ມອບວຽກ" }]} />

        <div className="p-6 flex-1 overflow-y-auto">
          <div className="bg-white/90 backdrop-blur-lg rounded-xl shadow-xl border border-sky-300/60 p-6">
            <div className="flex justify-between items-center bg-sky-100/70 p-4 rounded-lg mb-6 border border-sky-200">
              <h3 className="text-2xl font-bold text-slate-800 font-saysettha">ມອບວຽກ</h3>
              <Link href="/manage_tasks/add_manag_tasks" className="bg-blue-600 text-white px-5 py-2 rounded-lg flex items-center space-x-2 font-saysettha hover:bg-blue-700 transition-all duration-200 shadow-md">
                <FaPlus className="text-lg" /> <span>ເພີ່ມວຽກໃຫ້ພະນັກງານ</span>
              </Link>
            </div>

            <div className="mt-6 max-h-[600px] overflow-y-auto overflow-x-auto rounded-lg shadow-md border border-sky-200 relative">
              <table className="w-full border-collapse">
                <thead className="bg-sky-200 text-slate-800 font-saysettha text-lg sticky top-0">
                  <tr>
                    <th className="p-4 text-left">ລຳດັບ</th>
                    <th className="p-4 text-left">ຊື່ວຽກ</th>
                    <th className="p-4 text-left">ພະນັກງານ</th>
                    <th className="p-4 text-left">ຂະແໜງ</th>
                    <th className="p-4 text-left ">ວັນທີເລີ່ມ</th>
                    <th className="p-4 text-left">ວັນທີສິ້ນສຸດ</th>
                    <th className="p-4 text-left">ສະຖານະ</th>
                    <th className="p-4 text-left">ແກ້ໄຂ</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={8} className="text-center p-4 text-gray-500 font-saysettha text-md">
                        ກຳລັງໂຫຼດຂໍ້ມູນ...
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan={8} className="text-center p-4 text-red-500 font-saysettha text-md">
                        Error: {error}
                      </td>
                    </tr>
                  ) : localTasks.length > 0 ? (
                    localTasks.map((task, index) => (
                      <tr
                        key={task.Task_ID}
                        className="border-t border-sky-200 text-slate-700 hover:bg-sky-50/50 transition-colors"
                      >
                        <td className="p-4">{index + 1}</td>
                        <td className="p-4 font-medium">{task.Task_name}</td>
                        <td className="p-4">{task.employee?.Name || 'N/A'}</td>
                        <td className="p-4">{task.division?.Division_Name || 'ບໍ່ມີຂໍ້ມູນ'}</td>
                        <td className="p-4 font-times text-lg">
                          {task.manage_tasks_details[0]?.Start_Date
                            ? new Date(task.manage_tasks_details[0].Start_Date).toLocaleDateString('lo-LA')
                            : 'N/A'}
                        </td>
                        <td className="p-4 font-times text-lg">
                          {task.manage_tasks_details[0]?.End_date
                            ? new Date(task.manage_tasks_details[0].End_date).toLocaleDateString('lo-LA')
                            : 'N/A'}
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColorClass(task.manage_tasks_details[0]?.Status || '')}`}
                          >
                            {task.manage_tasks_details[0]?.Status || 'ບໍ່ມີສະຖານະ'}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex space-x-3 items-center">
                            <button
                              onClick={() => handleViewClick(task)}
                              className="text-blue-500 hover:text-blue-600 transition-colors p-1 rounded hover:bg-blue-50"
                              title="ເບິ່ງລາຍລະອຽດ"
                            >
                              <FaEye className="text-lg" />
                            </button>

                            <button
                              onClick={() => openEditModal(task)}
                              className="text-yellow-500 hover:text-yellow-600 transition-colors p-1 rounded hover:bg-yellow-50"
                              title="ແກ້ໄຂ"
                            >
                              <FaEdit className="text-lg" />
                            </button>

                            <button
                              onClick={() => handleDeleteClick(task.Task_ID)}
                              className="text-red-500 hover:text-red-600 transition-colors p-1 rounded hover:bg-red-50"
                              title="ລຶບ"
                            >
                              <FaTrash className="text-lg" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="text-center p-4 text-gray-500 font-saysettha text-md">
                        ບໍ່ພົບຂໍ້ມູນວຽກ
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