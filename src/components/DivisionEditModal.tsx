// src/components/DivisionEditModal.tsx
import React, { useState, useEffect } from "react";
import { Division, Department, DivisionEditModalProps } from "@/src/types/division"; // Adjust import path if Department is in a different file

function DivisionEditModal({ isOpen, onClose, initialData, onSave, departments }: DivisionEditModalProps) {
    const [editedDivision, setEditedDivision] = useState<Division>(initialData || {
        Division_ID: 0,
        Division_Name: '',
        Phone: '',
        Email: '',
        Department_ID: 0,
        department: undefined,
        Contact_Person: '',
    });

    useEffect(() => {
        if (initialData) {
            setEditedDivision({
                ...initialData,
                Department_ID: initialData.Department_ID || 0
            });
        }
    }, [initialData]);


    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setEditedDivision(prev => ({
            ...prev,
            [name]: name === "Department_ID" ? Number(value) : value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const { department, ...divisionWithoutDepartment } = editedDivision;

        onSave(divisionWithoutDepartment);
    };



    return (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn"
            style={{ fontFamily: 'Phetsarath OT, sans-serif' }}
        >
            <div
                className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 w-full max-w-md shadow-2xl border border-gray-100 transform animate-scaleIn"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">ແກ້ໄຂຂໍ້ມູນຂະແໜງ</h2>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-md font-medium text-gray-700 mb-1">ຊື່ຂະແໜງ</label>
                        <input
                            type="text"
                            name="Division_Name"
                            value={editedDivision.Division_Name}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="ຊື່ຂະແໜງ"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-md font-medium text-gray-700 mb-1">ອີເມວ</label>
                        <input
                            type="email"
                            name="Email"
                            value={editedDivision.Email}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="ອີເມວ"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-md font-medium text-gray-700 mb-1">ເບີໂທ</label>
                        <input
                            type="text"
                            name="Phone"
                            value={editedDivision.Phone}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="ເບີໂທ"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-md font-medium text-gray-700 mb-1">ພະແນກ</label>
                        <select
                            name="Department_ID"
                            value={editedDivision.Department_ID}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        >
                            <option value={0} disabled>ເລືອກພະແນກ</option>
                            {departments.map(dep => (
                                <option key={dep.Department_ID} value={dep.Department_ID}>
                                    {dep.Department_Name}
                                </option>
                            ))}
                        </select>
                    </div>
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

export default DivisionEditModal;