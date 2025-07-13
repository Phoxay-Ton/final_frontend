// src/components/ApprovalForm.tsx
'use client';

import { useState, useEffect, useCallback } from "react";
import { FaCheck, FaTimes, FaCalendarAlt, FaUser, FaClock, FaTag } from "react-icons/fa"; // Added FaTag for leave type
import { LeaveApproval, UpdateLeaveApprovalPayload, Employee, LeaveType } from "@/src/types/leave";

interface ApprovalFormProps {
    approval: LeaveApproval;
    onApprove: (payload: UpdateLeaveApprovalPayload) => void;
    onReject: (payload: UpdateLeaveApprovalPayload) => void;
    employees: Employee[]; // Not directly used in this component's display, but good for context if needed later
    leaveTypes: LeaveType[]; // Not directly used in this component's display, but good for context if needed later
}

export default function ApprovalForm({ approval, onApprove, onReject, employees, leaveTypes }: ApprovalFormProps) {
    const [approveRemark, setApproveRemark] = useState<string>("ອະນຸມັດແລ້ວ");
    const [rejectRemark, setRejectRemark] = useState<string>("ປະຕິເສດ");
    const [showApproveForm, setShowApproveForm] = useState<boolean>(false);
    const [showRejectForm, setShowRejectForm] = useState<boolean>(false);

    // Format date for display
    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleDateString('lo-LA', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    };

    // Calculate leave duration
    const calculateDuration = (): string => {
        const fromDate = new Date(approval.From_date);
        const toDate = new Date(approval.To_date);

        if (fromDate.toDateString() === toDate.toDateString()) {
            return "1 ມື້";
        }

        const diffTime = Math.abs(toDate.getTime() - fromDate.getTime());
        // Add 1 to include both start and end day in the count
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        return `${diffDays} ມື້`;
    };

    // No need for useEffect here as data fetching is handled by the parent component (useLeaveApprovals hook)
    // and passed down via props. The commented out code was causing a console warning.

    const handleApprove = () => {
        if (!approveRemark.trim()) {
            alert("ກະລຸນາໃສ່ຫມາຍເຫດການອະນຸມັດ");
            return;
        }

        const payload: UpdateLeaveApprovalPayload = {
            leave_id: approval.Leave_ID,
            status: "approved",
            remark: approveRemark.trim()
        };

        onApprove(payload);
        setShowApproveForm(false);
        setApproveRemark("ອະນຸມັດແລ້ວ"); // Reset remark after action
    };

    const handleReject = () => {
        if (!rejectRemark.trim()) {
            alert("ກະລຸນາໃສ່ຫມາຍເຫດການປະຕິເສດ");
            return;
        }

        const payload: UpdateLeaveApprovalPayload = {
            leave_id: approval.Leave_ID,
            status: "rejected",
            remark: rejectRemark.trim()
        };

        onReject(payload);
        setShowRejectForm(false);
        setRejectRemark("ປະຕິເສດ"); // Reset remark after action
    };

    return (
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow duration-300">
            {/* Header */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 font-saysettha flex items-center">
                    <FaUser className="mr-2 text-blue-600" />
                    {approval.employee.Name}
                </h3>
                <span className="text-sm bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full font-saysettha">
                    ລໍຖ້າອະນຸມັດ
                </span>
            </div>

            {/* Leave Details - Two Column Layout */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-3 mb-6 max-h-48 overflow-y-auto pr-2"> {/* Added max-h and overflow-y */}
                <div className="flex items-center text-gray-700 col-span-2"> {/* Span full width for leave type */}
                    <FaTag className="mr-3 text-gray-500 w-4 h-4" />
                    <span className="font-saysettha text-base">
                        <strong>ປະເພດການລາພັກ:</strong> {approval.leave_type.name}
                    </span>
                </div>

                <div className="flex items-center text-gray-700">
                    <FaCalendarAlt className="mr-3 text-gray-500 w-4 h-4" />
                    <span className="font-saysettha text-sm">
                        <strong>ວັນທີເລີ່ມ:</strong> {formatDate(approval.From_date)}
                    </span>
                </div>

                <div className="flex items-center text-gray-700">
                    <FaCalendarAlt className="mr-3 text-gray-500 w-4 h-4" />
                    <span className="font-saysettha text-sm">
                        <strong>ວັນທີສິ້ນສຸດ:</strong> {formatDate(approval.To_date)}
                    </span>
                </div>

                <div className="flex items-center text-gray-700">
                    <FaClock className="mr-3 text-gray-500 w-4 h-4" />
                    <span className="font-saysettha text-sm">
                        <strong>ໄລຍະເວລາ:</strong> {calculateDuration()}
                    </span>
                </div>

                {approval.Description && (
                    <div className="col-span-2 bg-gray-50 p-3 rounded-md border border-gray-100">
                        <p className="text-sm text-gray-700 font-saysettha">
                            <strong>ເຫດຜົນ:</strong> {approval.Description}
                        </p>
                    </div>
                )}
            </div>

            {/* Action Buttons */}
            {!showApproveForm && !showRejectForm && (
                <div className="flex gap-3 mt-4">
                    <button
                        onClick={() => setShowApproveForm(true)}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 font-saysettha text-base transition-colors duration-200 shadow-md"
                    >
                        <FaCheck className="w-4 h-4" />
                        ອະນຸມັດ
                    </button>
                    <button
                        onClick={() => setShowRejectForm(true)}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 font-saysettha text-base transition-colors duration-200 shadow-md"
                    >
                        <FaTimes className="w-4 h-4" />
                        ປະຕິເສດ
                    </button>
                </div>
            )}

            {/* Approve Form */}
            {showApproveForm && (
                <div className="border-t border-gray-200 pt-4 mt-4">
                    <label htmlFor={`approve-remark-${approval.Leave_ID}`} className="block text-sm font-medium text-gray-700 mb-2 font-saysettha">
                        ຫມາຍເຫດການອະນຸມັດ:
                    </label>
                    <textarea
                        id={`approve-remark-${approval.Leave_ID}`}
                        value={approveRemark}
                        onChange={(e) => setApproveRemark(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 font-saysettha text-base"
                        rows={3}
                        placeholder="ໃສ່ຫມາຍເຫດການອະນຸມັດ..."
                    />
                    <div className="flex gap-2 mt-3">
                        <button
                            onClick={handleApprove}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-saysettha text-base shadow-md"
                        >
                            ຢືນຢັນອະນຸມັດ
                        </button>
                        <button
                            onClick={() => {
                                setShowApproveForm(false);
                                setApproveRemark("ອະນຸມັດແລ້ວ");
                            }}
                            className="flex-1 bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg font-saysettha text-base shadow-md"
                        >
                            ຍົກເລີກ
                        </button>
                    </div>
                </div>
            )}

            {/* Reject Form */}
            {showRejectForm && (
                <div className="border-t border-gray-200 pt-4 mt-4">
                    <label htmlFor={`reject-remark-${approval.Leave_ID}`} className="block text-sm font-medium text-gray-700 mb-2 font-saysettha">
                        ຫມາຍເຫດການປະຕິເສດ:
                    </label>
                    <textarea
                        id={`reject-remark-${approval.Leave_ID}`}
                        value={rejectRemark}
                        onChange={(e) => setRejectRemark(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 font-saysettha text-base"
                        rows={3}
                        placeholder="ໃສ່ເຫດຜົນການປະຕິເສດ..."
                    />
                    <div className="flex gap-2 mt-3">
                        <button
                            onClick={handleReject}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-saysettha text-base shadow-md"
                        >
                            ຢືນຢັນປະຕິເສດ
                        </button>
                        <button
                            onClick={() => {
                                setShowRejectForm(false);
                                setRejectRemark("ປະຕິເສດ");
                            }}
                            className="flex-1 bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg font-saysettha text-base shadow-md"
                        >
                            ຍົກເລີກ
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}