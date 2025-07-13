import React, { useState, useEffect } from 'react';
import { ManageTask } from "@/src/types/manageTask";

interface ViewTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    task: ManageTask | null;
    userRole?: string;
    onTaskUpdate?: (updatedTask: ManageTask) => void;
}

const ViewTaskModal: React.FC<ViewTaskModalProps> = ({
    isOpen,
    onClose,
    task,
    userRole,
    onTaskUpdate
}) => {
    const [isUpdating, setIsUpdating] = useState(false);
    const [updateError, setUpdateError] = useState<string | null>(null);
    const [currentTaskData, setCurrentTaskData] = useState<ManageTask | null>(task);

    useEffect(() => {
        setCurrentTaskData(task);
    }, [task]);

    if (!isOpen || !currentTaskData) return null;

    const statusOptions = [
        { value: "ເລີ່ມວຽກ", label: "ເລີ່ມວຽກ", color: "bg-yellow-100 text-yellow-700" },
        { value: "ກຳລັງດຳເນີນການ", label: "ກຳລັງດຳເນີນການ", color: "bg-blue-100 text-blue-700" },
        { value: "ສຳເລັດແລ້ວ", label: "ສຳເລັດແລ້ວ", color: "bg-green-100 text-green-700" }
    ];

    const currentStatus = currentTaskData.manage_tasks_details[0]?.Status || '';

    const updateTaskStatus = async (newStatus: string) => {
        setIsUpdating(true);
        setUpdateError(null);

        const detailId = currentTaskData.manage_tasks_details[0]?.Detail_ID;
        console.log("Detail_ID:", detailId);

        if (!detailId) {
            setUpdateError("ບໍ່ມີ Detail_ID");
            setIsUpdating(false);
            return;
        }

        try {
            const token = localStorage.getItem('token');

            const response = await fetch(
                `http://localhost:8080/api/v1/Task/task-detail/${detailId}/status`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ status: newStatus })
                }
            );

            console.log("API response status:", response.status);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'ບໍ່ສາມາດອັບເດດສະຖານະໄດ້');
            }

            // สร้าง task ที่อัปเดตแล้ว
            const updatedTask: ManageTask = {
                ...currentTaskData,
                manage_tasks_details: [
                    {
                        ...currentTaskData.manage_tasks_details[0],
                        Status: newStatus
                    }
                ]
            };

            setCurrentTaskData(updatedTask);

            // เรียก callback และส่ง task ที่อัปเดตแล้วกลับไป
            if (onTaskUpdate) {
                onTaskUpdate(updatedTask);
            }

        } catch (error) {
            console.error("Error updating status:", error);
            setUpdateError(error instanceof Error ? error.message : 'ເກີດຂໍ້ຜິດພາດ');
        } finally {
            setIsUpdating(false);
        }
    };
    // userRole === 'Admin' || userRole === 'manager' || userRole === 'employee' ||
    const canUpdateStatus = userRole === 'User';

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white/90 backdrop-blur-lg rounded-xl shadow-xl border border-sky-300/60 w-full max-w-3xl p-8 relative transform transition-all">
                <h3 className="text-3xl font-bold text-slate-800 mb-6 border-b pb-3 font-saysettha">ລາຍລະອຽດວຽກ</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-slate-700 font-saysettha text-lg">
                    <p><strong>ຊື່ວຽກ:</strong> {currentTaskData.Task_name}</p>
                    <p className="md:col-span-2"><strong>ລາຍລະອຽດ:</strong> {currentTaskData.Description}</p>
                    <p><strong>ພະນັກງານ:</strong> {currentTaskData.employee?.Name || 'N/A'}</p>
                    <p><strong>ຂະແໜງ:</strong> {currentTaskData.division?.Division_Name || 'ບໍ່ມີຂໍ້ມູນ'}</p>
                    <p>
                        <strong>ວັນທີເລີ່ມ:</strong>{" "}
                        {currentTaskData.manage_tasks_details[0]?.Start_Date
                            ? new Date(currentTaskData.manage_tasks_details[0].Start_Date).toLocaleDateString('lo-LA')
                            : 'N/A'}
                    </p>
                    <p>
                        <strong>ວັນທີສິ້ນສຸດ:</strong>{" "}
                        {currentTaskData.manage_tasks_details[0]?.End_date
                            ? new Date(currentTaskData.manage_tasks_details[0].End_date).toLocaleDateString('lo-LA')
                            : 'N/A'}
                    </p>
                    <p className="md:col-span-2">
                        <strong>ສະຖານະ:</strong>{" "}
                        <span
                            className={`px-4 py-2 rounded-full text-base font-semibold
                                ${currentTaskData.manage_tasks_details[0]?.Status === 'ສຳເລັດແລ້ວ'
                                    ? 'bg-green-100 text-green-700'
                                    : currentTaskData.manage_tasks_details[0]?.Status === 'ກຳລັງດຳເນີນການ'
                                        ? 'bg-blue-100 text-blue-700'
                                        : currentTaskData.manage_tasks_details[0]?.Status === 'ເລີ່ມວຽກ'
                                            ? 'bg-yellow-100 text-yellow-700'
                                            : 'bg-gray-100 text-gray-700'
                                }`}
                        >
                            {currentTaskData.manage_tasks_details[0]?.Status || 'ບໍ່ມີສະຖານະ'}
                        </span>
                    </p>

                    {currentTaskData.Attachment && (
                        <p className="md:col-span-2">
                            <strong>ໄຟລ໌ແນບ:</strong>{" "}
                            <a
                                href={currentTaskData.Attachment}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                            >
                                ເປີດໄຟລ໌
                            </a>
                        </p>
                    )}
                </div>

                {canUpdateStatus && (
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
                        <h4 className="text-lg font-semibold text-slate-700 mb-3 font-saysettha">ອັບເດດສະຖານະ</h4>

                        {updateError && (
                            <div className="mb-3 p-2 bg-red-100 text-red-700 rounded text-sm">
                                {updateError}
                            </div>
                        )}

                        <div className="flex flex-wrap gap-2">
                            {statusOptions.map((status) => (
                                <button
                                    key={status.value}
                                    onClick={() => updateTaskStatus(status.value)}
                                    disabled={isUpdating || currentStatus === status.value}
                                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-all font-saysettha
                                        ${currentStatus === status.value
                                            ? `${status.color} ring-2 ring-blue-400 ring-offset-1`
                                            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                        }
                                        ${isUpdating ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md cursor-pointer'}
                                    `}
                                >
                                    {status.label}
                                    {currentStatus === status.value && ' ✓'}
                                </button>
                            ))}
                        </div>

                        {isUpdating && (
                            <div className="mt-2 text-sm text-blue-600 font-saysettha">
                                ກຳລັງອັບເດດ...
                            </div>
                        )}
                    </div>
                )}

                <div className="mt-8 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-8 py-3 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors font-saysettha text-lg shadow-md"
                    >
                        ປິດ
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ViewTaskModal;


