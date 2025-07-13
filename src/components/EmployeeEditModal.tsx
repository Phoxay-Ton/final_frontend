// src/components/EmployeeEditModal.tsx
'use client';

import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { Employee, Department, Division, Position, ROLE_OPTIONS } from "@/src/types/employee";
// import { FaEdit, FaTimes } from "react-icons/fa";

interface EmployeeEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData: Employee | null;
    onSave: (updatedEmployee: Employee) => void;
    departments: Department[];
    divisions: Division[];
    positions: Position[];
}

export default function EmployeeEditModal({
    isOpen,
    onClose,
    initialData,
    onSave,
    departments,
    divisions,
    positions,
}: EmployeeEditModalProps) {
    // Initialize with proper default structure
    const [editedEmployee, setEditedEmployee] = useState<Employee>({
        Employee_ID: 0,
        Name: '',
        Email: '',
        Phone: '',
        Username: '',
        Role: 'user', // Add default role
        Department_ID: 0,
        Division_ID: 0,
        Position_ID: 0,
        Contact_Person: '',
        department: undefined,
        // division: undefined,
        // position: undefined,
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Update form when initialData changes
    useEffect(() => {
        if (initialData) {
            setEditedEmployee({
                ...initialData,
                // Ensure all required fields have values
                Role: initialData.Role || 'user',
                Contact_Person: initialData.Contact_Person || '',
            });
            setErrors({}); // Clear errors when new data is loaded
        }
    }, [initialData]);

    // Close modal with Escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    // Validation function
    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!editedEmployee.Name.trim()) {
            newErrors.Name = 'ກະລຸນາປ້ອນຊື່ພະນັກງານ';
        }

        if (!editedEmployee.Email.trim()) {
            newErrors.Email = 'ກະລຸນາປ້ອນອີເມວ';
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(editedEmployee.Email)) {
                newErrors.Email = 'ຮູບແບບອີເມວບໍ່ຖືກຕ້ອງ';
            }
        }

        if (!editedEmployee.Phone.trim()) {
            newErrors.Phone = 'ກະລຸນາປ້ອນເບີໂທ';
        } else {
            const phoneRegex = /^[0-9]{8,12}$/;
            if (!phoneRegex.test(editedEmployee.Phone.replace(/\s/g, ''))) {
                newErrors.Phone = 'ເບີໂທຕ້ອງເປັນຕົວເລກ 8-12 ຫຼັກ';
            }
        }

        if (!editedEmployee.Username.trim()) {
            newErrors.Username = 'ກະລຸນາປ້ອນຊື່ຜູ້ໃຊ້';
        }

        if (!editedEmployee.Role) {
            newErrors.Role = 'ກະລຸນາເລືອກສິດທິ';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form input changes
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        setEditedEmployee(prev => ({
            ...prev,
            [name]: name.includes('_ID') ? (value === '' ? 0 : Number(value)) : value,
        }));

        // Clear specific field error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: '',
            }));
        }
    };

    // Handle form submission
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            await onSave(editedEmployee);
            // Modal will be closed by parent component after successful save
        } catch (error) {
            console.error('Error saving employee:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle cancel/close
    const handleCancel = () => {
        setErrors({});
        onClose();
    };

    return (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={handleCancel}
            style={{ fontFamily: 'Phetsarath OT, sans-serif' }}
        >
            <div
                className="bg-gradient-to-br from-white to-gray-50 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Modal Header */}
                <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-t-2xl">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            {/* <FaEdit className="text-xl" /> */}
                            <h2 className="text-xl font-bold">ແກ້ໄຂຂໍ້ມູນພະນັກງານ</h2>
                        </div>
                        <button
                            onClick={handleCancel}
                            className="text-white hover:text-gray-200 transition-colors p-1"
                            type="button"
                        >
                            {/* <FaTimes className="text-xl" /> */}
                        </button>
                    </div>
                </div>

                {/* Modal Body */}
                <div className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Row 1: Name and Email */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="Name" className="block text-sm font-medium text-gray-700 mb-2">
                                    ຊື່ພະນັກງານ <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="Name"
                                    name="Name"
                                    value={editedEmployee.Name}
                                    onChange={handleChange}
                                    className={`w-full p-3 border rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${errors.Name ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="ຊື່ພະນັກງານ"
                                />
                                {errors.Name && <p className="text-red-500 text-sm mt-1">{errors.Name}</p>}
                            </div>

                            <div>
                                <label htmlFor="Email" className="block text-sm font-medium text-gray-700 mb-2">
                                    ອີເມວ <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    id="Email"
                                    name="Email"
                                    value={editedEmployee.Email}
                                    onChange={handleChange}
                                    className={`w-full p-3 border rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${errors.Email ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="example@email.com"
                                    style={{ fontFamily: "Times New Roman, serif" }}
                                />
                                {errors.Email && <p className="text-red-500 text-sm mt-1">{errors.Email}</p>}
                            </div>
                        </div>

                        {/* Row 2: Phone and Username */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="Phone" className="block text-sm font-medium text-gray-700 mb-2">
                                    ເບີໂທ <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="Phone"
                                    name="Phone"
                                    value={editedEmployee.Phone}
                                    onChange={handleChange}
                                    className={`w-full p-3 border rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${errors.Phone ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="20xxxxxxxx"
                                    style={{ fontFamily: "Times New Roman, serif" }}

                                />
                                {errors.Phone && <p className="text-red-500 text-sm mt-1">{errors.Phone}</p>}
                            </div>

                            <div>
                                <label htmlFor="Username" className="block text-sm font-medium text-gray-700 mb-2">
                                    ຊື່ຜູ້ໃຊ້ <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="Username"
                                    name="Username"
                                    value={editedEmployee.Username}
                                    onChange={handleChange}
                                    className={`w-full p-3 border rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${errors.Username ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="username"
                                    style={{ fontFamily: "Times New Roman, serif" }}

                                />
                                {errors.Username && <p className="text-red-500 text-sm mt-1">{errors.Username}</p>}
                            </div>
                        </div>

                        {/* Row 3: Role */}
                        <div>
                            <label htmlFor="Role" className="block text-sm font-medium text-gray-700 mb-2">
                                ສິດທິ <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="Role"
                                name="Role"
                                value={editedEmployee.Role}
                                onChange={handleChange}
                                className={`w-full p-3 border rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white transition-colors ${errors.Role ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                style={{ fontFamily: "Times New Roman, serif" }}

                            >
                                <option value="">ເລືອກສິດທິ</option>
                                {ROLE_OPTIONS.map((role) => (
                                    <option key={role.value} value={role.value}>
                                        {role.label}
                                    </option>
                                ))}
                            </select>
                            {errors.Role && <p className="text-red-500 text-sm mt-1">{errors.Role}</p>}
                        </div>

                        {/* Row 4: Department, Division, Position */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label htmlFor="Department_ID" className="block text-sm font-medium text-gray-700 mb-2">
                                    ພະແນກ
                                </label>
                                <select
                                    id="Department_ID"
                                    name="Department_ID"
                                    value={editedEmployee.Department_ID || ''}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white transition-colors"
                                >
                                    <option value="">ເລືອກພະແນກ</option>
                                    {departments?.map(dept => (
                                        <option key={dept.Department_ID} value={dept.Department_ID}>
                                            {dept.Department_Name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label htmlFor="Division_ID" className="block text-sm font-medium text-gray-700 mb-2">
                                    ຂະແໜງ
                                </label>
                                <select
                                    id="Division_ID"
                                    name="Division_ID"
                                    value={editedEmployee.Division_ID || ''}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white transition-colors"
                                >
                                    <option value="">ເລືອກຂະແໜງ</option>
                                    {divisions?.map(div => (
                                        <option key={div.Division_ID} value={div.Division_ID}>
                                            {div.Division_Name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label htmlFor="Position_ID" className="block text-sm font-medium text-gray-700 mb-2">
                                    ຕຳແໜ່ງ
                                </label>
                                <select
                                    id="Position_ID"
                                    name="Position_ID"
                                    value={editedEmployee.Position_ID || ''}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white transition-colors"
                                >
                                    <option value="">ເລືອກຕຳແໜ່ງ</option>
                                    {positions?.map(pos => (
                                        <option key={pos.Position_ID} value={pos.Position_ID}>
                                            {pos.Position_Name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Row 5: Contact Person */}
                        {/* <div>
                            <label htmlFor="Contact_Person" className="block text-sm font-medium text-gray-700 mb-2">
                                ຜູ້ຕິດຕໍ່
                            </label>
                            <input
                                type="text"
                                id="Contact_Person"
                                name="Contact_Person"
                                value={editedEmployee.Contact_Person || ''}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                                placeholder="ຜູ້ຕິດຕໍ່ (ບໍ່ຈຳເປັນ)"
                            />
                        </div> */}

                        {/* Action Buttons */}
                        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={handleCancel}
                                disabled={isSubmitting}
                                className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors shadow-md font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                ຍົກເລີກ
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-md font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        ກຳລັງບັນທຶກ...
                                    </>
                                ) : (
                                    'ບັນທຶກ'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}