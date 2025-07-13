// src/components/LeaveEditModal.tsx
import { useState, useEffect } from "react";
import { Leave, Employee, LeaveType } from "@/src/types/leave"; // Adjust import paths

interface LeaveEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData: Leave | null;
    onSave: (updatedLeave: Leave) => void;
    // Optional: Pass lists for dropdowns
    employees?: Employee[];
    leaveTypes?: LeaveType[];
}

export default function LeaveEditModal({
    isOpen,
    onClose,
    initialData,
    onSave,
    employees = [], // Default to empty array if not provided
    leaveTypes = [], // Default to empty array if not provided
}: LeaveEditModalProps) {
    const [editedLeave, setEditedLeave] = useState<Leave>(
        initialData || {
            Leave_ID: 0,
            Employee_ID: 0,
            Leave_type_ID: 0,
            From_date: "",
            To_date: "",
            Leave_days: 0,
            Description: "",
            Approval_person: 0,
            Status: null,
        }
    );

    // Update form data when initialData changes (e.g., when a new leave is selected for editing)
    useEffect(() => {
        if (initialData) {
            // Format dates for input type="date"
            const fromDate = initialData.From_date ? new Date(initialData.From_date).toISOString().split('T')[0] : '';
            const toDate = initialData.To_date ? new Date(initialData.To_date).toISOString().split('T')[0] : '';

            setEditedLeave({
                ...initialData,
                From_date: fromDate,
                To_date: toDate,
            });
        }
    }, [initialData]);

    // Auto-calculate leave days when dates change
    useEffect(() => {
        if (editedLeave.From_date && editedLeave.To_date) {
            const from = new Date(editedLeave.From_date);
            const to = new Date(editedLeave.To_date);

            if (!isNaN(from.getTime()) && !isNaN(to.getTime()) && from <= to) {
                const diffTime = Math.abs(to.getTime() - from.getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                setEditedLeave(prev => ({
                    ...prev,
                    Leave_days: diffDays + 1
                }));
            } else {
                setEditedLeave(prev => ({
                    ...prev,
                    Leave_days: 0
                }));
            }
        }
    }, [editedLeave.From_date, editedLeave.To_date]);

    if (!isOpen) return null;

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
    ) => {
        const { name, value } = e.target;
        setEditedLeave((prev) => {
            let updatedValue: string | number = value;

            // Convert to number for specific numeric fields
            if (
                name === "Employee_ID" ||
                name === "Leave_type_ID" ||
                name === "Leave_days" ||
                name === "Approval_person"
            ) {
                updatedValue = parseInt(value, 10) || 0;
            }

            return { ...prev, [name]: updatedValue };
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(editedLeave);
    };

    return (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn"
            style={{ fontFamily: "Phetsarath OT, sans-serif" }}
        >
            <div
                className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100 transform animate-scaleIn"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">
                    ແກ້ໄຂຂໍ້ມູນລາພັກ
                </h2>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    {/* Employee Selection */}
                    {/* <div>
                        <label className="block text-md font-medium text-gray-700 mb-1">
                            ຊື່ພະນັກງານ
                        </label>
                        <select
                            name="Employee_ID"
                            value={editedLeave.Employee_ID}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        >
                            <option value={0}>ເລືອກພະນັກງານ</option>
                            {employees.map((emp) => (
                                <option key={emp.Employee_ID} value={emp.Employee_ID}>
                                    {emp.Name}
                                </option>
                            ))}
                        </select>
                    </div> */}

                    {/* Leave Type Selection */}
                    <div>
                        <label className="block text-md font-medium text-gray-700 mb-1">
                            ປະເພດການພັກ
                        </label>
                        <select
                            name="Leave_type_ID"
                            value={editedLeave.Leave_type_ID}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        >
                            <option value={0}>ເລືອກປະເພດການພັກ</option>
                            {leaveTypes.map((lt) => (
                                <option key={lt.id} value={lt.id}>
                                    {lt.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Date Inputs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-md font-medium text-gray-700 mb-1">
                                ວັນເລີ່ມພັກ
                            </label>
                            <input
                                type="date"
                                name="From_date"
                                value={editedLeave.From_date}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-md font-medium text-gray-700 mb-1">
                                ວັນສິ້ນສຸດ
                            </label>
                            <input
                                type="date"
                                name="To_date"
                                value={editedLeave.To_date}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                    </div>

                    {/* Leave Days (Auto-calculated) */}
                    <div>
                        <label className="block text-md font-medium text-gray-700 mb-1">
                            ຈຳນວນມື້ພັກ
                        </label>
                        <input
                            type="number"
                            name="Leave_days"
                            value={editedLeave.Leave_days}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-xl text-slate-800 bg-gray-100 cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500"
                            readOnly
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-md font-medium text-gray-700 mb-1">
                            ລາຍລະອຽດ
                        </label>
                        <textarea
                            name="Description"
                            value={editedLeave.Description}
                            onChange={handleChange}
                            rows={3}
                            className="w-full p-3 border border-gray-300 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="ລາຍລະອຽດການລາພັກ"
                        ></textarea>
                    </div>

                    {/* Approval Person */}
                    <div>
                        <label className="block text-md font-medium text-gray-700 mb-1">
                            ຜູ້ອະນຸມັດ
                        </label>
                        <select
                            name="Approval_person"
                            value={editedLeave.Approval_person}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        >
                            <option value={0}>ເລືອກຜູ້ອະນຸມັດ</option>
                            {employees
                                .filter(emp => emp.Employee_ID !== editedLeave.Employee_ID) // Filter out the current employee
                                .map((emp) => (
                                    <option key={emp.Employee_ID} value={emp.Employee_ID}>
                                        {emp.Name}
                                    </option>
                                ))}
                        </select>
                    </div>

                    {/* Status */}
                    {/* <div>
                        <label className="block text-md font-medium text-gray-700 mb-1">
                            ສະຖານະ
                        </label>
                        <select
                            name="Status"
                            value={editedLeave.Status || ''} // Handle null status
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        >
                            <option value="">ເລືອກສະຖານະ</option>
                            <option value="pending">ລໍຖ້າອະນຸມັດ</option>
                            <option value="approved">ອະນຸມັດແລ້ວ</option>
                            <option value="rejected">ຖືກປະຕິເສດ</option>
                        </select>
                    </div> */}

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-3 mt-6">
                        <button
                            type="button"
                            className="px-6 py-3 bg-gray-300 text-slate-700 rounded-xl hover:bg-gray-400 transition-colors shadow-md font-medium"
                            onClick={onClose}
                        >
                            ຍົກເລີກ
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-md font-medium"
                        >
                            ບັນທຶກ
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}