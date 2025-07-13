// src/components/forms/AddEmployeeForm.tsx
'use client';

import React from 'react';
// import { FaSave, FaArrowLeft } from 'react-icons/fa';
import { AddEmployee, Department, Division, Position, ROLE_OPTIONS } from "@/src/types/employee";

interface AddEmployeeFormProps {
    formData: AddEmployee;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    onSubmit: () => void;
    onCancel: () => void;
    departments: Department[];
    divisions: Division[];
    positions: Position[];
    isSubmitting: boolean;
    loading?: boolean;
}

const AddEmployeeForm: React.FC<AddEmployeeFormProps> = ({
    formData,
    onChange,
    onSubmit,
    onCancel,
    departments,
    divisions,
    positions,
    isSubmitting,
    loading = false
}) => {
    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="text-xl font-saysettha text-slate-800">ກຳລັງໂຫຼດຂໍ້ມູນ...</div>
            </div>
        );
    }

    return (
        <div className="bg-white/90 backdrop-blur-lg rounded-xl shadow-xl border border-sky-300/60 p-6">
            <h2 className="text-2xl font-bold text-slate-800 font-saysettha mb-6">ເພີ່ມພະນັກງານ</h2>

            <div className="space-y-6">
                {/* Name */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        ຊື່ພະນັກງານ <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={onChange}
                        className="w-full p-3 border border-gray-300 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                        placeholder="ປ້ອນຊື່ພະນັກງານ"
                        required
                        disabled={isSubmitting}
                    />
                </div>

                {/* Email */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        ອີເມວ <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={onChange}
                        className="w-full p-3 border border-gray-300 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm font-saysettha"
                        placeholder="ປ້ອນອີເມວ"
                        style={{ fontFamily: "Times New Roman, serif" }}
                        required
                        disabled={isSubmitting}
                    />
                </div>

                {/* Phone */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        ເບີໂທ <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={onChange}
                        className="w-full p-3 border border-gray-300 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                        placeholder="ປ້ອນເບີໂທ "
                        required
                        disabled={isSubmitting}
                    />
                </div>

                {/* Username */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        ຊື່ຜູ້ໃຊ້ <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={onChange}
                        className="w-full p-3 border border-gray-300 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                        placeholder="ປ້ອນຊື່ຜູ້ໃຊ້"
                        required
                        disabled={isSubmitting}
                    />
                </div>

                {/* Password */}
                {/* Username */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        ຊື່ຜູ້ໃຊ້ <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={onChange}
                        className="w-full p-3 border border-gray-300 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                        placeholder="ປ້ອນຊື່ຜູ້ໃຊ້"
                        required
                        disabled={isSubmitting}
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="off"
                        spellCheck="false"
                    />
                </div>

                {/* Password */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        ລະຫັດຜ່ານ <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={onChange}
                        className="w-full p-3 border border-gray-300 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                        placeholder="ປ້ອນລະຫັດຜ່ານ (ຢ່າງໜ້ອຍ 6 ຕົວອັກສອນ)"
                        required
                        disabled={isSubmitting}
                        autoComplete="new-password"
                        autoCorrect="off"
                        autoCapitalize="off"
                        spellCheck="false"
                    />
                </div>

                {/* Department Dropdown */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        ພະແນກ
                    </label>
                    <select
                        id="department_ID"
                        name="department_ID"
                        value={formData.department_ID || ''}
                        onChange={onChange}
                        className="w-full p-3 border border-gray-300 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                        disabled={isSubmitting}
                    >
                        <option value="">ເລືອກພະແນກ </option>
                        {departments.map((department) => (
                            <option key={department.Department_ID} value={department.Department_ID}>
                                {department.Department_Name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Division Dropdown */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        ຂະແໜງ
                    </label>
                    <select
                        id="division_ID"
                        name="division_ID"
                        value={formData.division_ID || ''}
                        onChange={onChange}
                        className="w-full p-3 border border-gray-300 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                        disabled={isSubmitting}
                    >
                        <option value="">ເລືອກຂະແໜງ </option>
                        {divisions.map((division) => (
                            <option key={division.Division_ID} value={division.Division_ID}>
                                {division.Division_Name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Position Dropdown */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        ຕຳແໝ່ງ
                    </label>
                    <select
                        id="position_ID"
                        name="position_ID"
                        value={formData.position_ID || ''}
                        onChange={onChange}
                        className="w-full p-3 border border-gray-300 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                        disabled={isSubmitting}
                    >
                        <option value="">ເລືອກຕຳແໝ່ງ </option>
                        {positions.map((position) => (
                            <option key={position.Position_ID} value={position.Position_ID}>
                                {position.Position_Name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4 mt-6">
                    <button
                        type="button"
                        onClick={onSubmit}
                        disabled={isSubmitting}
                        className={`flex-1 px-6 py-3 rounded-xl transition-colors duration-200 shadow-md font-medium text-lg ${isSubmitting
                            ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                    >
                        {/* <FaSave className="inline-block mr-2" /> */}
                        {isSubmitting ? 'ກຳລັງບັນທຶກ...' : 'ບັນທຶກ'}
                    </button>
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isSubmitting}
                        className={`flex-1 px-6 py-3 rounded-xl transition-colors duration-200 shadow-md font-medium text-lg ${isSubmitting
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-gray-300 text-slate-700 hover:bg-gray-400'
                            }`}
                    >
                        ຍົກເລີກ
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddEmployeeForm;