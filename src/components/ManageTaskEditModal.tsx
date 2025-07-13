// src/components/ManageTaskEditModal.tsx
'use client';

import { useState, useEffect } from "react";
import { ManageTask, ManageTaskEditModalProps } from "@/src/types/manageTask";

export default function ManageTaskEditModal({ isOpen, onClose, initialData, onSave }: ManageTaskEditModalProps) {
    const [formData, setFormData] = useState<ManageTask | null>(initialData);

    useEffect(() => {
        setFormData(initialData);
    }, [initialData]);

    if (!isOpen || !formData) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => prev ? { ...prev, [name]: value } : null);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData) {
            const success = await onSave(formData);
            if (success) {
                onClose(); // Close only on successful save
            }
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md font-saysettha text-slate-800 animate-scaleIn">
                <h2 className="text-xl font-bold mb-4 text-center">ແກ້ໄຂຂໍ້ມູນວຽກ</h2>
                <form onSubmit={handleSave} className="space-y-4">
                    <div>
                        <label htmlFor="taskName" className="block text-sm font-medium text-gray-700">ຊື່ວຽກ</label>
                        <input
                            type="text"
                            id="taskName"
                            name="Task_name"
                            value={formData.Task_name}
                            onChange={handleChange}
                            className="w-full mt-1 p-2 border border-gray-300 rounded-lg text-slate-800 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="ຊື່ວຽກ"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">ລາຍລະອຽດ</label>
                        <textarea
                            id="description"
                            name="Description"
                            value={formData.Description}
                            onChange={handleChange}
                            rows={3}
                            className="w-full mt-1 p-2 border border-gray-300 rounded-lg text-slate-800 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="ລາຍລະອຽດ"
                            required
                        ></textarea>
                    </div>
                    {/* Assuming Employee_ID and Division_ID might be dropdowns in a real app,
                        for simplicity, keeping them as text inputs for now.
                        You'd likely fetch lists of employees and divisions here. */}
                    <div>
                        <label htmlFor="employeeId" className="block text-sm font-medium text-gray-700">ລະຫັດພະນັກງານ</label>
                        <input
                            type="number"
                            id="employeeId"
                            name="Employee_ID"
                            value={formData.Employee_ID}
                            onChange={handleChange}
                            className="w-full mt-1 p-2 border border-gray-300 rounded-lg text-slate-800 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="ລະຫັດພະນັກງານ"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="divisionId" className="block text-sm font-medium text-gray-700">ລະຫັດຂະແໜງ</label>
                        <input
                            type="number"
                            id="divisionId"
                            name="Division_ID"
                            value={formData.Division_ID}
                            onChange={handleChange}
                            className="w-full mt-1 p-2 border border-gray-300 rounded-lg text-slate-800 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="ລະຫັດຂະແໜງ"
                            required
                        />
                    </div>
                    {/* Handle manage_tasks_details - typically edited in a sub-form or separate component */}
                    {/* For simplicity, let's just show the first detail's status for now, or assume this modal only updates the main task fields */}
                    {formData.manage_tasks_details && formData.manage_tasks_details.length > 0 && (
                        <div>
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700">ສະຖານະວຽກ (ລາຍລະອຽດທຳອິດ)</label>
                            <input
                                type="text" // Or select if fixed options
                                id="status"
                                name="Status" // Note: This updates the Task object, not the nested detail directly via this input
                                value={formData.manage_tasks_details[0]?.Status || ''}
                                onChange={(e) => {
                                    const newDetails = [...formData.manage_tasks_details];
                                    if (newDetails[0]) newDetails[0].Status = e.target.value;
                                    setFormData(prev => prev ? { ...prev, manage_tasks_details: newDetails } : null);
                                }}
                                className="w-full mt-1 p-2 border border-gray-300 rounded-lg text-slate-800 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="ສະຖານະ"
                            />
                        </div>
                    )}

                    <div className="flex justify-end space-x-2 mt-6">
                        <button
                            type="button"
                            className="px-4 py-2 bg-gray-300 text-slate-700 rounded-lg hover:bg-gray-400 transition-colors"
                            onClick={onClose}
                        >
                            ຍົກເລີກ
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            ບັນທຶກ
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}