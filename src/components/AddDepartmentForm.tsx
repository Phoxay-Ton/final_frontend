// src/components/AddDepartmentForm.tsx
import React, { useState } from 'react';
import { AddDepartment } from '@/src/types/department';

interface AddDepartmentFormProps {
    onSave: (newDepartment: AddDepartment) => void;
    onCancel: () => void;
}

const AddDepartmentForm: React.FC<AddDepartmentFormProps> = ({ onSave, onCancel }) => {
    const [newDepartment, setNewDepartment] = useState<AddDepartment>({
        Department_Name: '',
        Phone: '',
        Address: '',
        Email: '',
        Contact_Person: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewDepartment(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(newDepartment);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label htmlFor="Department_Name" className="block text-lg font-medium text-gray-700 mb-2">
                    ຊື່ພະແນກ
                </label>
                <input
                    type="text"
                    id="Department_Name"
                    name="Department_Name"
                    value={newDepartment.Department_Name}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                    placeholder="ປ້ອນຊື່ພະແນກ"
                    required
                />
            </div>
            <div>
                <label htmlFor="Email" className="block text-lg font-medium text-gray-700 mb-2">
                    ອີເມວ
                </label>
                <input
                    type="email"
                    id="Email"
                    name="Email"
                    value={newDepartment.Email}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                    placeholder="ປ້ອນອີເມວ"
                    required
                />
            </div>
            <div>
                <label htmlFor="Phone" className="block text-lg font-medium text-gray-700 mb-2">
                    ເບີໂທ
                </label>
                <input
                    type="text"
                    id="Phone"
                    name="Phone"
                    value={newDepartment.Phone}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                    placeholder="ປ້ອນເບີໂທ"
                    required
                />
            </div>
            <div>
                <label htmlFor="Address" className="block text-lg font-medium text-gray-700 mb-2">
                    ທີ່ຢູ່
                </label>
                <textarea
                    id="Address"
                    name="Address"
                    value={newDepartment.Address}
                    onChange={handleChange}
                    rows={3}
                    className="w-full p-3 border border-gray-300 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                    placeholder="ປ້ອນທີ່ຢູ່"
                    required
                ></textarea>
            </div>
            <div>
                <label htmlFor="Contact_Person" className="block text-lg font-medium text-gray-700 mb-2">
                    ຜູ້ຕິດຕໍ່
                </label>
                <input
                    type="text"
                    id="Contact_Person"
                    name="Contact_Person"
                    value={newDepartment.Contact_Person}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                    placeholder="ປ້ອນຊື່ຜູ້ຕິດຕໍ່"
                />
            </div>
            <div className="flex space-x-4 mt-6">
                <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors duration-200 shadow-md font-medium text-lg"
                >
                    ບັນທຶກ
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 bg-gray-300 text-slate-700 px-6 py-3 rounded-xl hover:bg-gray-400 transition-colors duration-200 shadow-md font-medium text-lg"
                >
                    ຍົກເລີກ
                </button>
            </div>
        </form>
    );
};

export default AddDepartmentForm;