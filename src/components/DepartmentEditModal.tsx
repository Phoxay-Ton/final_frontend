// src/components/DepartmentEditModal.tsx
import React, { useState, useEffect } from "react";
import { Department, DepartmentEditModalProps } from "@/src/types/department";

function DepartmentEditModal({ isOpen, onClose, initialData, onSave }: DepartmentEditModalProps) {
    const [editedDepartment, setEditedDepartment] = useState<Department>(initialData || {
        Department_ID: 0,
        Department_Name: '',
        Address: '',
        Phone: '',
        Email: '',
        Contact_Person: '',
    });

    useEffect(() => {
        if (initialData) {
            setEditedDepartment(initialData);
        }
    }, [initialData]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditedDepartment(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(editedDepartment);
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
                <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">ແກ້ໄຂຂໍ້ມູນພະແນກ</h2>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-md font-medium text-gray-700 mb-1">ຊື່ພະແນກ</label>
                        <input
                            type="text"
                            name="Department_Name"
                            value={editedDepartment.Department_Name}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="ຊື່ພະແນກ"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-md font-medium text-gray-700 mb-1">ອີເມວ</label>
                        <input
                            type="email"
                            name="Email"
                            value={editedDepartment.Email}
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
                            value={editedDepartment.Phone}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="ເບີໂທ"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-md font-medium text-gray-700 mb-1">ລາຍລະອຽດ</label>
                        <input
                            type="text"
                            name="Address"
                            value={editedDepartment.Address}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="ລາຍລະອຽດ"
                            required
                        />
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

export default DepartmentEditModal;